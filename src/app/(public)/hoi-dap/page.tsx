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
      {/* Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-dark), var(--color-navy))',
          color: 'var(--color-white)',
          padding: 'var(--space-12) 0',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, margin: 0, color: 'var(--color-gold)' }}>
            Hỏi đáp thường gặp (FAQ)
          </h1>
          <p style={{ opacity: 0.8, fontSize: 'var(--font-size-base)', marginTop: 'var(--space-2)', maxWidth: '600px', margin: 'var(--space-2) auto 0 auto' }}>
            Giải đáp nhanh các thắc mắc phổ biến về tuyển sinh, đào tạo, học phí và đời sống học sinh.
          </p>
        </div>
      </section>

      {/* FAQs List Section */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <FaqsList initialFaqs={faqs} />
        </div>
      </section>
    </div>
  )
}
