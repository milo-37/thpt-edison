import React from 'react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import Breadcrumb from '@/components/public/Breadcrumb'
import ChatWidget from '@/components/public/ChatWidget'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'Trường THPT Edison - Khát vọng & Sáng tạo',
  description: 'Website chính thức của Trường THPT Edison. Môi trường giáo dục khai phóng, hiện đại và toàn diện.',
}

const DEFAULT_SETTINGS = {
  schoolName: 'EDISON SCHOOL MINH DUC',
  logoUrl: '/school-logo.jpg',
  phone: '024 1234 5678',
  email: 'contact@edison.edu.vn',
  address: 'Minh Đức, Mỹ Hào, Hưng Yên',
}

async function getSettings() {
  try {
    const settingsList = await (prisma as any).setting.findMany()
    const settings = { ...DEFAULT_SETTINGS }
    settingsList.forEach((s: any) => {
      if (s.key && s.value) {
        settings[s.key as keyof typeof DEFAULT_SETTINGS] = s.value
      }
    })
    return settings
  } catch (error) {
    console.error('Failed to load settings in layout:', error)
    return DEFAULT_SETTINGS
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header settings={settings} />
      <main style={{ flex: 1, marginTop: 'var(--header-height)' }}>
        <Breadcrumb />
        {children}
      </main>
      <Footer settings={settings} />
      <ChatWidget />
    </div>
  )
}

