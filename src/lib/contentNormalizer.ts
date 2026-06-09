import { sanitizeHtml, createSlug, stripHtml, truncateText } from './validation'

interface NormalizationResult {
  title: string
  excerpt: string
  slug: string
  contentHtml: string
}

/**
 * Clean HTML raw text locally by removing inline style attributes, class names,
 * and font properties while keeping basic semantic tags and security constraints.
 */
export function cleanHtmlLocally(html: string): string {
  if (!html) return ''

  // 1. Remove style attributes (e.g., style="font-family: ...; color: ...")
  let clean = html.replace(/style\s*=\s*["']([^"']*)["']/gi, '')

  // 2. Remove font attributes (e.g., face, size, color)
  clean = clean.replace(/\s*(face|size|color)\s*=\s*["']([^"']*)["']/gi, '')

  // 3. Remove class attributes except safe tiptap/iframe/table classes
  clean = clean.replace(/class\s*=\s*["']([^"']*)["']/gi, (match, classVal) => {
    const isSafe = ['editor-', 'iframe-', 'table-', 'ProseMirror'].some(term => classVal.includes(term))
    return isSafe ? match : ''
  })

  // 4. Run existing sanitation to strip scripts, event handlers, and unsafe iframes
  clean = sanitizeHtml(clean)

  // 5. Smart formatting heuristics for structural hierarchy
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
  const matches = Array.from(clean.matchAll(pRegex))
  
  if (matches.length > 0) {
    const formattedParagraphs: string[] = []
    let inList = false
    const listItems: string[] = []

    for (let i = 0; i < matches.length; i++) {
      const innerHtml = matches[i][1]
      const pContent = stripHtml(innerHtml).trim()
      if (!pContent) continue

      // Heuristics
      const isAllUppercase = pContent === pContent.toUpperCase() && pContent.length > 10 && pContent.length < 100
      const isListHeader = pContent.endsWith(':') && pContent.length < 50

      const prevParagraphText = i > 0 ? stripHtml(matches[i-1][1]).trim() : ''
      const isPrevListHeader = prevParagraphText.endsWith(':') && 
        (prevParagraphText.toLowerCase().includes('đối tượng') || 
         prevParagraphText.toLowerCase().includes('nội dung') ||
         prevParagraphText.toLowerCase().includes('danh sách') ||
         prevParagraphText.toLowerCase().includes('gồm') ||
         prevParagraphText.toLowerCase().includes('link') ||
         prevParagraphText.toLowerCase().includes('liên hệ'))

      const startsWithMarker = pContent.startsWith('-') || pContent.startsWith('+') || pContent.startsWith('•') || pContent.startsWith('*') || /^\d+\.\s*/.test(pContent)
      const isListItem = startsWithMarker || (inList && pContent.length < 90 && !pContent.endsWith(':') && !isAllUppercase) || (isPrevListHeader && pContent.length < 90 && !pContent.endsWith(':') && !isAllUppercase)

      if (isListItem) {
        if (!inList) {
          inList = true
        }
        let cleanedItem = pContent.replace(/^[-+•*]\s*/, '').replace(/^\d+\.\s*/, '').trim()
        
        const childPrefixMatch = cleanedItem.match(/^([a-zA-Z0-9\s]+:)\s*(.*)$/i)
        if (childPrefixMatch && childPrefixMatch[1] && childPrefixMatch[1].length < 20) {
          cleanedItem = `<strong>${childPrefixMatch[1]}</strong> ${childPrefixMatch[2]}`
        }
        
        listItems.push(`<li>${cleanedItem}</li>`)
      } else {
        if (inList) {
          formattedParagraphs.push(`<ul>\n${listItems.map(item => `  ${item}`).join('\n')}\n</ul>`)
          listItems.length = 0
          inList = false
        }

        const prefixMatch = pContent.match(/^([a-zA-ZÀ-ỹ\s]{2,25}:)\s*(.*)$/i)

        if (isAllUppercase) {
          if (formattedParagraphs.length === 0) {
            formattedParagraphs.push(`<h2>${pContent}</h2>`)
          } else {
            formattedParagraphs.push(`<h3>${pContent}</h3>`)
          }
        } else if (isListHeader) {
          formattedParagraphs.push(`<h3>${pContent}</h3>`)
        } else if (prefixMatch && prefixMatch[1]) {
          const prefix = prefixMatch[1]
          const rest = prefixMatch[2]
          formattedParagraphs.push(`<p><strong>${prefix}</strong> ${rest}</p>`)
        } else {
          formattedParagraphs.push(`<p>${pContent}</p>`)
        }
      }
    }

    if (inList) {
      formattedParagraphs.push(`<ul>\n${listItems.map(item => `  ${item}`).join('\n')}\n</ul>`)
    }

    clean = formattedParagraphs.join('\n')
  }

  if (!clean.includes('<p>') && !clean.includes('<h2>') && !clean.includes('<h3>') && !clean.includes('<ul>')) {
    clean = `<p>${clean}</p>`
  }

  return clean
}

/**
 * Clean up markdown blocks from raw JSON response text returned by AI
 */
function cleanJsonResponseText(rawText: string): string {
  let clean = rawText.trim()
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(json)?/i, '')
    clean = clean.replace(/```$/, '')
  }
  return clean.trim()
}

/**
 * Auto-generate title from HTML content
 */
function extractTitleFromHtml(html: string): string {
  // Try to find first h1, h2, or h3
  const headingMatch = html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i)
  if (headingMatch && headingMatch[1]) {
    const text = stripHtml(headingMatch[1]).trim()
    if (text) return truncateText(text, 80)
  }

  // Try to find first non-empty paragraph
  const pMatches = html.matchAll(/<p[^>]*>(.*?)<\/p>/gi)
  for (const match of pMatches) {
    if (match[1]) {
      const text = stripHtml(match[1]).trim()
      if (text) return truncateText(text, 60)
    }
  }

  // Fallback to text snippet
  const textContent = stripHtml(html).trim()
  if (textContent) {
    return truncateText(textContent, 60)
  }

  return 'Bài viết mới'
}

/**
 * Main helper service to normalize article content
 */
export async function normalizeContent(
  contentHtml: string,
  title?: string,
  excerpt?: string
): Promise<NormalizationResult> {
  const apiKey = process.env.GEMINI_API_KEY

  if (apiKey) {
    try {
      const prompt = `
Bạn là một trợ lý AI biên tập nội dung chuyên nghiệp cho cổng thông tin điện tử của trường THPT Edison. 
Nhiệm vụ của bạn là chuẩn hóa, làm sạch và định dạng nội dung bài viết/thông báo theo quy chuẩn và phong cách tin tức chính thức của trường.

THÔNG TIN ĐẦU VÀO:
- Tiêu đề hiện tại: "${title || ''}"
- Mô tả ngắn hiện tại: "${excerpt || ''}"
- Nội dung HTML thô: 
\"\"\"
${contentHtml}
\"\"\"

HƯỚNG DẪN XỬ LÝ CHI TIẾT:
1. Tạo phân cấp nội dung (Hierarchy) rõ ràng và thụt lề:
   - Các dòng tiêu đề chính (tên thông báo viết hoa hoặc dòng mở đầu) bắt buộc phải chuyển thành thẻ tiêu đề ngữ nghĩa \`<h2>\`.
   - Các tiêu đề phụ của từng mục (như "Đối tượng thực hiện:", "Nội dung thực hiện:", "Link tải ứng dụng:") bắt buộc phải chuyển thành thẻ tiêu đề ngữ nghĩa \`<h3>\`.
   - Các danh sách liệt kê thông tin (như các đối tượng, các bước thực hiện, các dòng link tải ứng dụng cho iOS/Android) bắt buộc phải chuyển thành cấu trúc danh sách HTML chuẩn \`<ul>\` hoặc \`<ol>\` và các thẻ \`<li>\`. Không để phẳng thành thẻ \`<p>\`.
   - Các đoạn văn thông thường rõ ràng bằng thẻ \`<p>\`.

2. Làm sạch định dạng HTML (contentHtml):
   - Xóa toàn bộ inline style rác (style="..."), các thuộc tính font-family, font-size, color, background-color, face, size không cần thiết từ bất kỳ thẻ nào. Hãy đưa phông chữ, cỡ chữ và màu sắc về mặc định của hệ thống website (vanilla styles).
   - Xóa toàn bộ các class rác khi copy từ Word, Facebook, Google Docs. CHỈ giữ lại các class phục vụ hiển thị cần thiết (như "editor-youtube", "editor-image", "iframe-wrapper", v.v.).
   - Loại bỏ các thẻ độc hại có nguy cơ XSS: <script>, <style>, <link>, <meta>, <object>, <embed>, <form>, <base> và các event handler như onclick, onerror, onload, v.v.
   - Tự động bôi đậm (thẻ \`<strong>\`) các nhãn thông tin quan trọng ở đầu câu, ví dụ: "Kính gửi:", "Thời gian triển khai:", "iOS:", "Android:", "Lưu ý:".
   - Chuẩn hóa các đường dẫn liên kết thành thẻ \`<a>\` an toàn (thêm target="_blank" và rel="noreferrer" nếu cần).
   - GIỮ LẠI toàn bộ các hình ảnh (<img>), bảng dữ liệu (<table>, <tr>, <td>, <th>), video nhúng (<iframe> đáng tin cậy) có sẵn trong bài viết.
   - Đảm bảo khoảng cách giữa các đoạn văn cách nhau rõ ràng, bố cục dễ đọc trên cả máy tính và điện thoại.

3. Không bịa đặt thông tin:
   - TUYỆT ĐỐI không tự bịa thêm thông tin, sự kiện, thời gian, nhân vật hoặc nội dung không có trong văn bản gốc. Chỉ được sắp xếp lại, làm sạch và định dạng lại dựa trên nội dung gốc.

4. Sinh metadata (nếu thiếu):
   - Nếu "Tiêu đề hiện tại" đang trống hoặc quá ngắn, hãy tự động trích xuất hoặc tạo ra một tiêu đề chuyên nghiệp, thu hút, đúng phong cách trường học dựa trên nội dung bài viết và điền vào trường "title".
   - Nếu "Mô tả ngắn hiện tại" đang trống hoặc quá ngắn, hãy viết một đoạn mô tả tóm tắt ngắn gọn (khoảng 1-3 câu) khái quát nội dung chính của bài viết và điền vào trường "excerpt".
   - Luôn sinh ra một chuỗi slug SEO từ tiêu đề (dạng không dấu, nối với nhau bằng dấu gạch ngang, ví dụ: "thong-bao-tuyen-sinh-nam-hoc-2026-2027") và điền vào trường "slug".

VÍ DỤ CHUẨN HÓA:
Nội dung thô đầu vào:
\"\"\"
THÔNG BÁO VỀ VIỆC TRIỂN KHAI CÀI ĐẶT ỨNG DỤNG VNEDU CONNECT
Kính gửi: Giáo viên chủ nhiệm các lớp, học sinh và cha mẹ học sinh toàn trường.
Thời gian triển khai: Từ ngày 10/06/2026 đến ngày 20/06/2026
Đối tượng thực hiện:
Giáo viên chủ nhiệm các lớp
Học sinh toàn trường
Cha mẹ học sinh
\"\"\"

Nội dung sau chuẩn hóa mong muốn (contentHtml):
\"\"\"
<h2>THÔNG BÁO VỀ VIỆC TRIỂN KHAI CÀI ĐẶT ỨNG DỤNG VNEDU CONNECT</h2>
<p><strong>Kính gửi:</strong> Giáo viên chủ nhiệm các lớp, học sinh và cha mẹ học sinh toàn trường.</p>
<p><strong>Thời gian triển khai:</strong> Từ ngày 10/06/2026 đến ngày 20/06/2026</p>
<h3>Đối tượng thực hiện:</h3>
<ul>
  <li>Giáo viên chủ nhiệm các lớp</li>
  <li>Học sinh toàn trường</li>
  <li>Cha mẹ học sinh</li>
</ul>
\"\"\"

ĐỊNH DẠNG ĐẦU RA:
Bạn PHẢI trả về duy nhất một chuỗi JSON hợp lệ với cấu trúc sau:
{
  "title": "Tiêu đề bài viết sau chuẩn hóa/tạo mới",
  "excerpt": "Mô tả ngắn sau chuẩn hóa/tạo mới",
  "slug": "Slug SEO tạo từ tiêu đề",
  "contentHtml": "Nội dung HTML sạch và được định dạng chuẩn"
}
`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`)
      }

      const resJson = await response.json()
      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text

      if (!rawText) {
        throw new Error('Gemini API returned an empty response')
      }

      const cleanJsonStr = cleanJsonResponseText(rawText)
      const parsed = JSON.parse(cleanJsonStr) as NormalizationResult

      if (parsed && typeof parsed === 'object' && parsed.contentHtml) {
        return {
          title: parsed.title || title || 'Bài viết mới',
          excerpt: parsed.excerpt || excerpt || '',
          slug: parsed.slug || createSlug(parsed.title || title || 'new-post'),
          contentHtml: parsed.contentHtml,
        }
      }
    } catch (apiError) {
      console.warn('Gemini normalization failed, falling back to local normalizer:', apiError)
      // Fall through to local normalization
    }
  }

  // Local normalization fallback
  const cleanHtml = cleanHtmlLocally(contentHtml)
  
  const finalTitle = title && title.trim() !== '' ? title : extractTitleFromHtml(cleanHtml)
  const finalExcerpt = excerpt && excerpt.trim() !== '' ? excerpt : truncateText(stripHtml(cleanHtml), 160)
  const finalSlug = createSlug(finalTitle)

  return {
    title: finalTitle,
    excerpt: finalExcerpt,
    slug: finalSlug,
    contentHtml: cleanHtml,
  }
}
