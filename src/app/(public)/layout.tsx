import React from 'react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import Breadcrumb from '@/components/public/Breadcrumb'
import ChatWidget from '@/components/public/ChatWidget'
import GlobalAnimatedBackground from '@/components/public/GlobalAnimatedBackground'
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
  address: '937 Dương Tự Minh, Phan Đình Phùng, Thái Nguyên',
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/#organization`,
        name: settings.schoolName,
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${settings.logoUrl}`,
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: settings.phone,
            email: settings.email,
            contactType: 'customer support',
            availableLanguage: 'Vietnamese',
          }
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressCountry: 'VN',
        },
        description: 'Trường THPT Edison - Môi trường giáo dục khai phóng, hiện đại và toàn diện tại Minh Đức, Mỹ Hào, Hưng Yên.',
        sameAs: [
          'https://facebook.com',
          'https://youtube.com',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/#website`,
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        name: settings.schoolName,
        publisher: {
          '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tin-tuc?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'vi-VN',
      },
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Global Canvas Particle Animation */}
      <GlobalAnimatedBackground />

      {/* Dynamic Futuristic Glow Background Blobs */}
      <div aria-hidden="true" role="presentation" className="futuristic-glow-container">
        <div className="glow-blob glow-blob-1"></div>
        <div className="glow-blob glow-blob-2"></div>
        <div className="glow-blob glow-blob-3"></div>
      </div>

      <Header settings={settings} />
      <main style={{ flex: 1, marginTop: 'var(--header-height)' }}>
        <Breadcrumb />
        {children}
      </main>
      <Footer settings={settings} />
      <ChatWidget />
    </>
  )
}

