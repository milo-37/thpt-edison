import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Trường THPT Edison - Khát vọng & Sáng tạo",
    template: "%s | THPT Edison",
  },
  description: "Website chính thức của Trường THPT Edison. Môi trường giáo dục khai phóng, hiện đại và toàn diện.",
  keywords: ['THPT Edison', 'trường trung học phổ thông', 'tuyển sinh lớp 10', 'giáo dục', 'Edison School'],
  authors: [{ name: 'Trường THPT Edison' }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Trường THPT Edison',
    title: 'Trường THPT Edison - Khát vọng & Sáng tạo',
    description: 'Website chính thức của Trường THPT Edison. Môi trường giáo dục khai phóng, hiện đại và toàn diện.',
    images: [
      {
        url: '/school-logo.jpg',
        width: 512,
        height: 512,
        alt: 'Logo Trường THPT Edison',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#09162e" />
        <link rel="apple-touch-icon" href="/school-logo.jpg" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <Script
          id="service-worker-registration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                const isLocal = window.location.hostname === 'localhost' || 
                                window.location.hostname === '127.0.0.1' || 
                                window.location.hostname.startsWith('192.168.');
                
                if (isLocal) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    if (registrations.length > 0) {
                      if (!sessionStorage.getItem('sw_cleared_reload')) {
                        sessionStorage.setItem('sw_cleared_reload', 'true');
                        Promise.all(registrations.map(function(r) {
                          return r.unregister();
                        })).then(function() {
                          console.log('Cleared active Service Worker for local development');
                          window.location.reload();
                        });
                      }
                    }
                  });
                } else {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(reg) {
                      console.log('SW registered:', reg.scope);
                    }).catch(function(err) {
                      console.log('SW registration failed:', err);
                    });
                  });
                }
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}

