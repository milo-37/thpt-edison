import { ReactNode } from 'react'

interface PageBannerProps {
  label?: string
  title: string
  description?: string
  children?: ReactNode
}

export default function PageBanner({ label, title, description, children }: PageBannerProps) {
  return (
    <section className="page-banner">
      <style>{`
        .page-banner {
          position: relative;
          overflow: hidden;
          padding: var(--space-20) 0 var(--space-16) 0;
          text-align: center;
          background: linear-gradient(160deg, #f0f4ff 0%, #e8eeff 25%, #ede9fe 50%, #e0e7ff 75%, #f5f3ff 100%);
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
        }
        [data-theme="dark"] .page-banner {
          background: linear-gradient(160deg, #020617 0%, #0a1628 25%, #0f172a 50%, #0c1e3d 75%, #020617 100%);
          border-bottom-color: rgba(99, 102, 241, 0.08);
        }

        /* Animated dot grid */
        .page-banner__grid {
          position: absolute;
          inset: 0;
          opacity: 0.35;
          pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(99,102,241,0.1) 1px, transparent 0);
          background-size: 28px 28px;
        }
        [data-theme="dark"] .page-banner__grid {
          opacity: 0.2;
          background-image: radial-gradient(circle at 1px 1px, rgba(99,102,241,0.2) 1px, transparent 0);
        }

        /* Floating orbs */
        .page-banner__orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
        }
        .page-banner__orb--1 {
          top: -30%;
          left: 5%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          animation: pb-float 15s ease-in-out infinite alternate;
        }
        .page-banner__orb--2 {
          bottom: -40%;
          right: 5%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
          animation: pb-float 18s ease-in-out infinite alternate-reverse;
        }
        .page-banner__orb--3 {
          top: 20%;
          right: 25%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
          animation: pb-float 12s ease-in-out infinite alternate;
        }
        [data-theme="dark"] .page-banner__orb--1 {
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
        }
        [data-theme="dark"] .page-banner__orb--2 {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
        }
        [data-theme="dark"] .page-banner__orb--3 {
          background: radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%);
        }

        @keyframes pb-float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -10px) scale(1.05); }
          100% { transform: translate(-10px, 8px) scale(0.98); }
        }

        /* Horizontal glow line at bottom */
        .page-banner__glow-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(99, 102, 241, 0.3) 20%,
            rgba(168, 85, 247, 0.5) 50%,
            rgba(99, 102, 241, 0.3) 80%,
            transparent 100%
          );
        }

        /* Content */
        .page-banner__content {
          position: relative;
          z-index: 2;
        }

        .page-banner__label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.06) 100%);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #4f46e5;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: var(--space-4);
          animation: fadeInUp 0.5s ease;
        }
        [data-theme="dark"] .page-banner__label {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
          border-color: rgba(59, 130, 246, 0.25);
          color: #7dd3fc;
        }

        .page-banner__title {
          font-size: clamp(2rem, 4.5vw, var(--font-size-4xl));
          font-weight: 900;
          margin: 0 auto;
          max-width: 700px;
          background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 40%, #7c3aed 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: var(--font-title);
          line-height: 1.15;
          letter-spacing: -0.03em;
          animation: fadeInUp 0.6s ease 0.1s backwards;
        }
        [data-theme="dark"] .page-banner__title {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 40%, #818cf8 70%, #38bdf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-banner__desc {
          color: var(--color-gray-600);
          font-size: var(--font-size-base);
          margin: var(--space-4) auto 0 auto;
          max-width: 560px;
          font-weight: 500;
          line-height: 1.6;
          animation: fadeInUp 0.7s ease 0.2s backwards;
        }
        [data-theme="dark"] .page-banner__desc {
          color: var(--color-gray-400);
        }

        .page-banner__extra {
          margin-top: var(--space-6);
          animation: fadeInUp 0.8s ease 0.3s backwards;
        }
      `}</style>

      {/* Background layers */}
      <div className="page-banner__grid" />
      <div className="page-banner__orb page-banner__orb--1" />
      <div className="page-banner__orb page-banner__orb--2" />
      <div className="page-banner__orb page-banner__orb--3" />
      <div className="page-banner__glow-line" />

      {/* Content */}
      <div className="container page-banner__content">
        {label && (
          <span className="page-banner__label">
            <span style={{ position: 'relative', display: 'flex', height: '6px', width: '6px' }}>
              <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'currentColor', opacity: 0.6, animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '6px', width: '6px', backgroundColor: 'currentColor' }} />
            </span>
            {label}
          </span>
        )}
        <h1 className="page-banner__title">{title}</h1>
        {description && <p className="page-banner__desc">{description}</p>}
        {children && <div className="page-banner__extra">{children}</div>}
      </div>
    </section>
  )
}
