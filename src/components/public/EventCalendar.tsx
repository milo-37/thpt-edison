import { Calendar, MapPin, Clock, Zap } from 'lucide-react'

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
      return { label: 'Sắp diễn ra', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)', dotColor: '#6366f1' }
    } else if (now >= start && now <= end) {
      return { label: 'Đang diễn ra', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)', dotColor: '#a855f7' }
    } else {
      return { label: 'Đã kết thúc', color: 'var(--color-gray-400)', bg: 'rgba(148, 163, 184, 0.08)', dotColor: 'var(--color-gray-400)' }
    }
  };

  const formatFullDate = (dateStr: string | Date) => {
    const d = new Date(dateStr)
    const weekdays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
    return `${weekdays[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  };

  if (events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-gray-400)', borderRadius: '24px', background: 'rgba(99, 102, 241, 0.03)', border: '1px dashed rgba(99, 102, 241, 0.15)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-3) auto' }}>
          <Calendar size={24} style={{ color: '#6366f1', opacity: 0.6 }} />
        </div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)' }}>Hiện không có sự kiện nào sắp diễn ra.</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-gray-500)' }}>Các sự kiện mới sẽ được cập nhật tại đây.</p>
      </div>
    )
  }

  return (
    <div className="event-timeline">
      {events.map((event, index) => {
        const { day, month } = getDayAndMonth(event.startDate)
        const status = getEventStatus(event.startDate, event.endDate)

        return (
          <div
            key={event.id}
            className="event-timeline-item"
          >
            <div className="event-timeline-card" style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.12)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.01)' }}>
              {/* Compact Calendar Badge */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '64px',
                  minHeight: '72px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.04)',
                  backgroundColor: 'var(--color-white)',
                  flexShrink: 0,
                  border: '1px solid rgba(99, 102, 241, 0.12)',
                }}
              >
                {/* Month strip */}
                <div
                  style={{
                    height: '22px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}
                >
                  {month}
                </div>
                {/* Day */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: 'var(--color-navy)',
                    fontFamily: 'var(--font-title)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {day}
                </div>
              </div>

              {/* Event Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center', minWidth: 0 }}>
                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h4 style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 800,
                    color: 'var(--color-navy)',
                    margin: 0,
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em'
                  }}>
                    {event.title}
                  </h4>
                  {/* Status Badge */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      color: status.color,
                      background: status.bg,
                      border: `1px solid ${status.color}15`,
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {status.label === 'Đang diễn ra' && <Zap size={9} />}
                    {status.label}
                  </span>
                </div>

                {/* Description */}
                {event.description && (
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-gray-500)',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5
                  }}>
                    {event.description}
                  </p>
                )}

                {/* Meta info row */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-gray-400)' }}>
                    <Clock size={12} style={{ color: '#6366f1', opacity: 0.7 }} />
                    <span>{formatTime(event.startDate)}</span>
                  </div>
                  {event.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-gray-400)' }}>
                      <MapPin size={12} style={{ color: '#6366f1', opacity: 0.7 }} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
