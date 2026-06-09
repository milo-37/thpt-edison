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

  let clean = html

  // 1. Remove style attributes (e.g., style="font-family: ...; color: ...")
  clean = clean.replace(/style\s*=\s*["']([^"']*)["']/gi, '')

  // 2. Remove font attributes (e.g., face, size, color)
  clean = clean.replace(/\s*(face|size|color)\s*=\s*["']([^"']*)["']/gi, '')

  // 3. Remove class attributes except safe tiptap/iframe/table classes
  clean = clean.replace(/class\s*=\s*["']([^"']*)["']/gi, (match, classVal) => {
    const isSafe = ['editor-', 'iframe-', 'table-', 'ProseMirror'].some(term => classVal.includes(term))
    return isSafe ? match : ''
  })

  // 4. Run existing sanitation to strip scripts, event handlers, and unsafe iframes
  clean = sanitizeHtml(clean)

  // 5. Clean up redundant empty tags and normalize spacing
  clean = clean.replace(/<p><\/p>/g, '')
  clean = clean.trim()

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
1. Chuẩn hóa và làm sạch định dạng HTML (contentHtml):
   - Xóa toàn bộ inline style rác (style="..."), các thuộc tính font-family, font-size, color, background-color, face, size không cần thiết từ bất kỳ thẻ nào. Hãy đưa phông chữ, cỡ chữ và màu sắc về mặc định của hệ thống website (vanilla styles).
   - Xóa toàn bộ các class rác khi copy từ Word, Facebook, Google Docs. CHỈ giữ lại các class phục vụ hiển thị cần thiết (như "editor-youtube", "editor-image", "iframe-wrapper", v.v.).
   - Loại bỏ các thẻ độc hại có nguy cơ XSS: <script>, <style>, <link>, <meta>, <object>, <embed>, <form>, <base> và các event handler như onclick, onerror, onload, v.v.
   - Nhận diện các dòng/đoạn trông giống như tiêu đề phụ (ví dụ dòng ngắn được bôi đậm) và chuyển chúng thành thẻ tiêu đề ngữ nghĩa <h2> hoặc <h3>.
   - Định dạng các đoạn văn thông thường rõ ràng bằng thẻ <p>.
   - Chuẩn hóa các danh sách được gõ tự do (như bắt đầu bằng dấu "+", "-", "•", hoặc số thứ tự thủ công "1.", "2.") thành cấu trúc danh sách HTML chuẩn <ul>, <ol>, và <li>.
   - Tự động bôi đậm (thẻ <strong>) các thông tin quan trọng như: thời gian, địa điểm tổ chức, đối tượng tham gia, thời hạn đăng ký hoặc các nội dung cốt lõi của thông báo.
   - Chuẩn hóa các đường dẫn liên kết thành thẻ <a> an toàn (thêm target="_blank" và rel="noreferrer" nếu cần).
   - GIỮ LẠI toàn bộ các hình ảnh (<img>), bảng dữ liệu (<table>, <tr>, <td>, <th>), video nhúng (<iframe> đáng tin cậy) có sẵn trong bài viết.
   - Đảm bảo khoảng cách giữa các đoạn văn cách nhau rõ ràng, bố cục dễ đọc trên cả máy tính và điện thoại.

2. Không bịa đặt thông tin:
   - TUYỆT ĐỐI không tự bịa thêm thông tin, sự kiện, thời gian, nhân vật hoặc nội dung không có trong văn bản gốc. Chỉ được sắp xếp lại, làm sạch và định dạng lại dựa trên nội dung gốc.

3. Sinh metadata (nếu thiếu):
   - Nếu "Tiêu đề hiện tại" đang trống hoặc quá ngắn, hãy tự động trích xuất hoặc tạo ra một tiêu đề chuyên nghiệp, thu hút, đúng phong cách trường học dựa trên nội dung bài viết và điền vào trường "title".
   - Nếu "Mô tả ngắn hiện tại" đang trống hoặc quá ngắn, hãy viết một đoạn mô tả tóm tắt ngắn gọn (khoảng 1-3 câu) khái quát nội dung chính của bài viết và điền vào trường "excerpt".
   - Luôn sinh ra một chuỗi slug SEO từ tiêu đề (dạng không dấu, nối với nhau bằng dấu gạch ngang, ví dụ: "thong-bao-tuyen-sinh-nam-hoc-2026-2027") và điền vào trường "slug".

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
