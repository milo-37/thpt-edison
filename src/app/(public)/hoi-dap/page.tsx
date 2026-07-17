import prisma from '@/lib/prisma'
import FaqsList from '@/components/public/FaqsList'

export const revalidate = 60

export const metadata = {
  title: 'Hỏi Đáp Thường Gặp (FAQ) - Trường THPT Edison',
  description: 'Giải đáp các câu hỏi thường gặp về tuyển sinh, chương trình học, học phí và các hoạt động tại Trường THPT Edison.',
}

export default async function FaqsPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Banner - Light Futuristic */}
      <section
        style={{
          background: 'transparent',
          color: '#0f172a',
          padding: 'var(--space-16) 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(99, 102, 241, 0.15)'
        }}
      >
        {/* Animated grid overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.08) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label">Giải đáp thắc mắc</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, margin: '12px 0 0 0', background: 'linear-gradient(135deg, #3b82f6, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-title)' }}>
            Hỏi đáp thường gặp (FAQ)
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-base)', marginTop: 'var(--space-3)', maxWidth: '600px', margin: 'var(--space-3) auto 0 auto', fontWeight: 500 }}>
            Giải đáp nhanh các thắc mắc phổ biến về tuyển sinh, đào tạo, học phí và đời sống học sinh.
          </p>
        </div>
      </section>

      {/* FAQs List Section */}
      <section className="section" >
        <div className="container" style={{ maxWidth: '800px' }}>
          <FaqsList initialFaqs={faqs} />
        </div>
      </section>
    </div>
  )
}
