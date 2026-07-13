<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:semantic-html5-rules -->
# Quy tắc Semantic HTML5 & SEO bắt buộc (THPT Edison)

Đây là dự án trường học với chuẩn SEO cao. TUYỆT ĐỐI tuân thủ các quy tắc sau đây khi viết hoặc sửa bất kỳ component JSX/TSX nào.

## 1. KHÔNG lạm dụng `<div>` — Dùng đúng thẻ semantic

| Nội dung | Dùng thẻ này |
|---|---|
| Bài viết / Card độc lập | `<article>` |
| Ảnh + caption | `<figure>` + `<figcaption>` |
| Trích dẫn / Testimonial | `<figure>` + `<blockquote>` + `<figcaption>` |
| Danh sách thứ tự | `<ol>` + `<li>` |
| Danh sách không thứ tự | `<ul>` + `<li>` |
| Thông tin liên hệ (phone/email/địa chỉ) | `<address>` |
| Copyright / phụ chú | `<small>` |
| Ngày tháng | `<time dateTime="ISO8601">` |
| Tác giả bài viết | `<address rel="author">` |
| Tìm kiếm | `<search>` (HTML5 native) |
| Header trang | `<header>` |
| Footer trang | `<footer>` |
| Điều hướng | `<nav aria-label="...">` |
| Nội dung chính | `<main>` |
| Section riêng biệt | `<section>` với heading riêng |
| Social links | `<nav aria-label="Mạng xã hội">` |

## 2. Quy tắc ARIA bắt buộc

- **Decorative elements** (blob, orb, dot grid, gradient bg): LUÔN thêm `aria-hidden="true" role="presentation"`
- **Icon-only buttons**: LUÔN thêm `aria-label` rõ ràng tiếng Việt
- **Icon bên trong button có text**: thêm `aria-hidden="true"` cho icon
- **Accordion**: button mở/đóng phải có `aria-expanded` + `aria-controls`
- **Breadcrumb**: dùng `<ol>` + `<li>` + `aria-current="page"` cho item cuối
- **Điều hướng di động**: `id` + `aria-controls` tương ứng, `aria-expanded` đồng bộ
- **Filter tabs**: `role="group" aria-label="..."`, button có `aria-pressed`
- **Slideshow dots**: `role="tablist"`, mỗi dot `role="tab" aria-selected`
- **Rating stars**: wrap trong `div role="img" aria-label="Đánh giá X sao"`
- **Avatar decorative**: `aria-hidden="true"` và `alt=""` cho img

## 3. Quy tắc Heading (QUAN TRỌ NGĂT)

- Mỗi **trang** chỉ được có **1 `<h1>` duy nhất** (nằm trong PageBanner)
- **Logo header** dùng `<span className="logo-title">` — KHÔNG dùng `<h1>`
- **Footer brand** dùng `<p>` — KHÔNG dùng `<h2>`
- Phân cấp: h1 → h2 → h3, KHÔNG nhảy cấp
- Section có thể dùng `<h2>` cho tiêu đề chính

## 4. Schema.org JSON-LD (AI Search)

- `EducationalOrganization` + `WebSite` + `SearchAction`: đã có trong `(public)/layout.tsx`
- Khi tạo trang tin tức mới: thêm `Article` schema với `datePublished`, `author`, `publisher`
- Khi tạo trang FAQ: thêm `FAQPage` schema
- Khi tạo trang sự kiện: thêm `Event` schema
- KHÔNG tạo `<script type="application/ld+json">` trong client components — chỉ server components

## 5. Mặc định cho link đều hướng có icon

```tsx
// Đúng
<Link href="/album" aria-label="Xem album Chào xuân 2026">
  <ArrowUpRight size={16} aria-hidden="true" />
</Link>

// Sai
<Link href="/album">
  <ArrowUpRight size={16} />
</Link>
```

## 6. Pattern `<time>` cho ngày

```tsx
const isoDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined
// ...
<time dateTime={isoDate}>{formatDateVi(post.publishedAt)}</time>
```
<!-- END:semantic-html5-rules -->
