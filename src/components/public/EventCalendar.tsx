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
  };

  const formatTime = (dateStr: string | Date) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };

  const getEventStatus = (startDateStr: string | Date, endDateStr: string | Date | null) => {
    const now = new Date()
    const start = new Date(startDateStr)
    const end = endDateStr ? new Date(endDateStr) : new Date(start.getTime() + 2 * 60 * 60 * 1000)

    if (now < start) {
      return { label: 'Sắp diễn ra', color: 'var(--color-primary)', bg: 'rgba(10, 75, 175, 0.08)' }
    } else if (now >= start && now <= end) {
      return { label: 'Đang diễn ra', color: 'var(--color-gold)', bg: 'rgba(255, 109, 0, 0.08)' }
    } else {
      return { label: 'Đã kết thúc', color: 'var(--color-gray-500)', bg: 'var(--color-gray-100)' }
    }
  };

  if (events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-500)', border: '1px dashed var(--color-gray-300)', borderRadius: 'var(--radius-xl)', background: 'var(--color-gray-50)' }}>
        <Calendar size={32} style={{ margin: '0 auto var(--space-2) auto', opacity: 0.5, color: 'var(--color-primary)' }} />
        <p style={{ margin: 0, fontWeight: 500 }}>Hiện không có sự kiện nào sắp diễn ra.</p>
      </div>
    )
  }

  return (
    <div className="events-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {events.map((event) => {
        const { day, month } = getDayAndMonth(event.startDate)
        const status = getEventStatus(event.startDate, event.endDate)

        return (
          <div
            key={event.id}
            className="event-card"
            style={{
              display: 'flex',
              gap: 'var(--space-5)',
              background: 'var(--color-white)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-gray-100)',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Apple-style Calendar Icon Tear-off Badge */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '68px',
                height: '78px',
                border: '1px solid var(--color-gray-200)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                backgroundColor: 'var(--color-white)',
                flexShrink: 0
              }}
            >
              {/* Top Red-Orange Bar */}
              <div
                style={{
                  height: '20px',
                  background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                  color: 'var(--color-white)',
                  fontSize: '9px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1
                }}
              >
                {month}
              </div>
              {/* Day number */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'var(--color-gray-800)',
                  fontFamily: 'var(--font-title)',
                  lineHeight: 1
                }}
              >
                {day}
              </div>
            </div>

            {/* Event Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: 0, lineHeight: 1.3 }}>
                  {event.title}
                </h4>
                {/* Status Badge */}
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    color: status.color,
                    background: status.bg,
                    border: `1px solid ${status.color}20`,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {status.label}
                </span>
              </div>
              
              {event.description && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                  {event.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-gray-400)' }}>
                  <Clock size={12} style={{ color: 'var(--color-primary)' }} />
                  <span>{formatTime(event.startDate)}</span>
                </div>
                {event.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-gray-400)' }}>
                    <MapPin size={12} style={{ color: 'var(--color-primary)' }} />
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

