import { Calendar, MapPin, Clock } from 'lucide-react'

interface EventProps {
  id: string
  title: string
  description: string | null
  startDate: string | Date
  endDate: string | Date | null
  location: string | null
}

interface EventListProps {
  events: EventProps[]
}

export default function EventCalendar({ events }: EventListProps) {
  const getDayAndMonth = (dateStr: string | Date) => {
    const d = new Date(dateStr)
    const day = d.getDate().toString().padStart(2, '0')
    const month = `Thg ${d.getMonth() + 1}`
    return { day, month }
  }

  const formatTime = (dateStr: string | Date) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  if (events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-500)', border: '1px dashed var(--color-gray-300)', borderRadius: 'var(--radius-lg)' }}>
        <Calendar size={32} style={{ margin: '0 auto var(--space-2) auto', opacity: 0.5 }} />
        <p>Hiện không có sự kiện nào sắp diễn ra.</p>
      </div>
    )
  }

  return (
    <div className="event-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {events.map((event) => {
        const { day, month } = getDayAndMonth(event.startDate)
        return (
          <div
            key={event.id}
            className="event-card"
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              background: 'var(--color-white)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-gray-100)',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Khối Ngày Tháng */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '74px',
                background: 'linear-gradient(135deg, var(--color-navy), var(--color-navy-dark))',
                color: 'var(--color-white)',
                borderRadius: 'var(--radius-md)',
                flexShrink: 0
              }}
            >
              <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-gold)', lineHeight: 1 }}>
                {day}
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500, opacity: 0.9 }}>
                {month}
              </span>
            </div>

            {/* Khối Chi Tiết Sự Kiện */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', justifyContent: 'center' }}>
              <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: 0, lineHeight: 1.3 }}>
                {event.title}
              </h4>
              {event.description && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {event.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>
                  <Clock size={12} />
                  <span>{formatTime(event.startDate)}</span>
                </div>
                {event.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>
                    <MapPin size={12} />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
