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
      {/* Calendar Grid Container */}
      <div 
        style={{ 
          background: 'var(--color-white)', 
          padding: 'var(--space-6)', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--color-gray-200)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', textTransform: 'capitalize', margin: 0 }}>
            {monthYearLabel}
          </h3>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={handlePrevMonth} className="btn btn-ghost btn-icon btn-sm"><ChevronLeft size={18} /></button>
            <button onClick={handleNextMonth} className="btn btn-ghost btn-icon btn-sm"><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: '8px' }}>
          {dayNames.map((name, idx) => (
            <span key={idx} style={{ fontSize: '11px', fontWeight: 700, color: idx === 0 ? 'var(--color-danger)' : 'var(--color-gray-400)' }}>
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
                style={{
                  aspectRatio: '1',
                  background: isToday ? 'rgba(15, 92, 183, 0.08)' : 'transparent',
                  border: isToday ? '1.5px solid var(--color-primary)' : 'none',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  color: cell.isCurrentMonth ? 'var(--color-navy)' : 'var(--color-gray-300)',
                  fontWeight: cell.isCurrentMonth ? 700 : 500,
                  fontSize: 'var(--font-size-sm)',
                  transition: 'background 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  if (!isToday) e.currentTarget.style.background = 'var(--color-gray-50)'
                }}
                onMouseLeave={(e) => {
                  if (!isToday) e.currentTarget.style.background = 'transparent'
                }}
              >
                <span>{cell.day}</span>
                {/* Event Indicator dot */}
                {hasEvents && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      background: 'var(--color-gold)',
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
      <div 
        style={{ 
          background: 'var(--color-white)', 
          padding: 'var(--space-6)', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--color-gray-200)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {selectedDateEvents ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>Danh sách sự kiện</span>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: '2px 0 0 0' }}>
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
                    background: 'var(--color-gray-50)', 
                    borderRadius: 'var(--radius-lg)', 
                    borderLeft: '4px solid var(--color-gold)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                    {event.title}
                  </h5>
                  {event.description && (
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.4 }}>
                      {event.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                      <Clock size={12} style={{ color: 'var(--color-primary)' }} />
                      <span>{new Date(event.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {event.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                        <MapPin size={12} style={{ color: 'var(--color-primary)' }} />
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
            <CalendarIcon size={40} style={{ color: 'var(--color-gray-300)', marginBottom: 'var(--space-2)' }} />
            <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>Click chọn một ngày có dấu chấm vàng trên lịch để xem các hoạt động, sự kiện diễn ra.</p>
          </div>
        )}
      </div>
    </div>
  )
}
