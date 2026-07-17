'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar as CalendarIcon, X } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string | null
  startDate: string | Date
  endDate: string | Date | null
  location: string | null
}

interface CalendarViewProps {
  events: Event[]
}

const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[] | null>(null)
  const [selectedDayLabel, setSelectedDayLabel] = useState<string>('')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of the month and number of days in the month
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

  // Get previous month total days for padding
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDateEvents(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDateEvents(null)
  }

  // Create grid arrays
  const blanks = Array(firstDayOfMonth).fill(null).map((_, i) => {
    const dayVal = totalDaysInPrevMonth - firstDayOfMonth + i + 1
    return { day: dayVal, isCurrentMonth: false, date: new Date(year, month - 1, dayVal) }
  })

  const days = Array(totalDaysInMonth).fill(null).map((_, i) => {
    const dayVal = i + 1
    return { day: dayVal, isCurrentMonth: true, date: new Date(year, month, dayVal) }
  })

  // Fill in remaining blanks for standard 6-week grid (42 cells)
  const totalCells = blanks.length + days.length
  const nextMonthBlanksCount = totalCells > 35 ? 42 - totalCells : 35 - totalCells
  const nextMonthBlanks = Array(nextMonthBlanksCount).fill(null).map((_, i) => {
    const dayVal = i + 1
    return { day: dayVal, isCurrentMonth: false, date: new Date(year, month + 1, dayVal) }
  })

  const gridCells = [...blanks, ...days, ...nextMonthBlanks]

  // Find events on a specific day
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const handleDayClick = (cellDate: Date, cellEvents: Event[], isCurrentMonth: boolean) => {
    if (!isCurrentMonth) {
      setCurrentDate(cellDate)
    }
    if (cellEvents.length > 0) {
      setSelectedDateEvents(cellEvents)
      setSelectedDayLabel(cellDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    } else {
      setSelectedDateEvents(null)
    }
  }

  const monthYearLabel = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
      <style>{`
        .calendar-cell {
          aspect-ratio: 1;
          background: transparent;
          border: none;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          padding: 0;
        }
        .calendar-cell:hover {
          background: rgba(99, 102, 241, 0.08) !important;
          transform: scale(1.05);
        }
        .calendar-container {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: var(--space-6);
          border-radius: 24px;
          border: 1px solid rgba(99, 102, 241, 0.12);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.01);
        }
        .events-panel {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: var(--space-6);
          border-radius: 24px;
          border: 1px solid rgba(99, 102, 241, 0.12);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.01);
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/* Calendar Grid Container */}
      <div className="calendar-container">
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', textTransform: 'capitalize', margin: 0 }}>
            {monthYearLabel}
          </h3>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={handlePrevMonth} className="btn btn-ghost btn-icon btn-sm" style={{ color: '#6366f1' }}><ChevronLeft size={18} /></button>
            <button onClick={handleNextMonth} className="btn btn-ghost btn-icon btn-sm" style={{ color: '#6366f1' }}><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(99, 102, 241, 0.08)', paddingBottom: '8px' }}>
          {dayNames.map((name, idx) => (
            <span key={idx} style={{ fontSize: '11px', fontWeight: 700, color: idx === 0 ? '#ef4444' : 'var(--color-gray-400)' }}>
              {name}
            </span>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {gridCells.map((cell, idx) => {
            const dayEvents = getEventsForDate(cell.date)
            const hasEvents = dayEvents.length > 0
            const isToday = new Date().toDateString() === cell.date.toDateString()

            return (
              <button
                key={idx}
                onClick={() => handleDayClick(cell.date, dayEvents, cell.isCurrentMonth)}
                className="calendar-cell"
                style={{
                  background: isToday ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  border: isToday ? '1.5px solid #6366f1' : 'none',
                  color: cell.isCurrentMonth ? 'var(--color-navy)' : 'var(--color-gray-300)',
                  fontWeight: cell.isCurrentMonth ? 700 : 500,
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <span>{cell.day}</span>
                {/* Event Indicator dot */}
                {hasEvents && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                      borderRadius: '50%',
                      position: 'absolute',
                      bottom: '4px'
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Events Details panel */}
      <div className="events-panel">
        {selectedDateEvents ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(99, 102, 241, 0.1)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase' }}>Danh sách sự kiện</span>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 800, color: 'var(--color-navy)', margin: '2px 0 0 0' }}>
                  {selectedDayLabel}
                </h4>
              </div>
              <button onClick={() => setSelectedDateEvents(null)} style={{ background: 'transparent', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer', padding: 0 }}><X size={16} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto', flex: 1 }}>
              {selectedDateEvents.map(event => (
                <div 
                  key={event.id} 
                  style={{ 
                    padding: 'var(--space-4)', 
                    background: 'rgba(99, 102, 241, 0.04)', 
                    borderRadius: '16px', 
                    borderLeft: '4px solid #6366f1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    border: '1px solid rgba(99, 102, 241, 0.08)',
                    borderLeftWidth: '4px'
                  }}
                >
                  <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                    {event.title}
                  </h5>
                  {event.description && (
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.4 }}>
                      {event.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                      <Clock size={12} style={{ color: '#6366f1' }} />
                      <span>{new Date(event.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {event.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                        <MapPin size={12} style={{ color: '#6366f1' }} />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--color-gray-400)', textAlign: 'center', padding: 'var(--space-6)' }}>
            <CalendarIcon size={40} style={{ color: '#6366f1', opacity: 0.5, marginBottom: 'var(--space-2)' }} />
            <p style={{ fontSize: 'var(--font-size-sm)', margin: 0, lineHeight: 1.5 }}>Click chọn một ngày có dấu chấm trên lịch để xem các hoạt động, sự kiện diễn ra.</p>
          </div>
        )}
      </div>
    </div>
  )
}
