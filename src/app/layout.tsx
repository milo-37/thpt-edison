import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trường THPT Edison - Khát vọng & Sáng tạo",
  description: "Hệ thống website chính thức của Trường Trung Học Phổ Thông Edison",
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

