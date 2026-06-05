import React from 'react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import Breadcrumb from '@/components/public/Breadcrumb'
import ChatWidget from '@/components/public/ChatWidget'

export const metadata = {
  title: 'Trường THPT Edison - Khát vọng & Sáng tạo',
  description: 'Website chính thức của Trường THPT Edison. Môi trường giáo dục khai phóng, hiện đại và toàn diện.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, marginTop: 'var(--header-height)' }}>
        <Breadcrumb />
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
