import type { NextConfig } from "next";

// ==================== SECURITY HEADERS ====================
// Cấu hình headers bảo mật cho website trường THPT Edison
const securityHeaders = [
  {
    // Bật DNS prefetch để tăng tốc độ tải trang
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    // Buộc trình duyệt chỉ truy cập qua HTTPS trong 2 năm
    // Lưu ý: Chỉ bật khi đã có SSL certificate
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Chống clickjacking — không cho embed website trong iframe bên ngoài
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    // Chống MIME type sniffing — trình duyệt phải tôn trọng Content-Type
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Kiểm soát thông tin referrer gửi đi khi click link
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Vô hiệu hóa các API trình duyệt không cần thiết
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // Content Security Policy — chống XSS bằng cách kiểm soát nguồn tải tài nguyên
    // Lưu ý: TipTap editor cần 'unsafe-inline' cho style, Next.js cần 'unsafe-inline' cho script
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.unsplash.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://drive.google.com https://docs.google.com https://www.google.com",
      "connect-src 'self' https://generativelanguage.googleapis.com wss: ws:",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // Cho phép ngrok và các tunnel khác truy cập dev server
  // Next.js 16 mặc định chặn cross-origin requests trong dev mode
  allowedDevOrigins: [
    '*.ngrok-free.dev',
    '*.ngrok.io',
    '*.ngrok.app',
    '*.loca.lt',
    '*.serveo.net',
  ],

  // Ẩn header X-Powered-By để không lộ công nghệ
  poweredByHeader: false,

  // Không public source map trong production
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        // Áp dụng security headers cho tất cả các trang
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Cache-Control cho trang admin — không cache dữ liệu nhạy cảm
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
        ],
      },
      {
        // Cache-Control cho API — không cache response admin
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
