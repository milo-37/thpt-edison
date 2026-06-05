'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, HelpCircle, User, MessageSquare, Clock, ShieldAlert } from 'lucide-react'

interface Faq {
  id: string
  question: string
  answer: string
  category: string
}

interface Message {
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Xin chào! Mình là Trợ lý Ảo Edison. Mình có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date()
    }
  ])
  const [showContactForm, setShowContactForm] = useState(false)
  
  // Contact Form State
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMsg, setContactMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Fetch FAQ suggestions on mount
  useEffect(() => {
    fetch('/api/faqs?limit=4')
      .then(res => res.json())
      .then(data => {
        if (data.faqs) setFaqs(data.faqs)
      })
      .catch(err => console.error('Error fetching FAQs for chatbot:', err))
  }, [])

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showContactForm])

  const handleSelectFaq = (faq: Faq) => {
    // Add user question
    const userMsg: Message = {
      sender: 'user',
      text: faq.question,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMsg])

    // Simulate bot typing delay
    setTimeout(() => {
      const botMsg: Message = {
        sender: 'bot',
        text: faq.answer,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
    }, 600)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName || !contactEmail || !contactMsg) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          subject: 'Liên hệ nhanh qua Chatbot',
          message: contactMsg
        })
      })

      if (!res.ok) {
        throw new Error('Gửi liên hệ thất bại. Vui lòng thử lại sau.')
      }

      setSubmitSuccess(true)
      setContactName('')
      setContactEmail('')
      setContactPhone('')
      setContactMsg('')
      
      // Simulate bot message confirming the contact request
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: 'Cảm ơn thông tin liên hệ của bạn! Nhà trường đã ghi nhận và bộ phận tuyển sinh/hỗ trợ sẽ phản hồi lại bạn qua email trong thời gian sớm nhất.',
            timestamp: new Date()
          }
        ])
        setShowContactForm(false)
        setSubmitSuccess(false)
      }, 1500)

    } catch (err: any) {
      setSubmitError(err.message || 'Lỗi hệ thống')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--color-navy)',
            color: 'var(--color-white)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xl)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s',
            outline: 'none',
            position: 'relative'
          }}
          className="chat-bubble-btn animate-float"
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)' }}
          aria-label="Open support chat"
        >
          <MessageCircle size={28} />
          {/* Notification Badge */}
          <span 
            style={{ 
              position: 'absolute', 
              top: '0', 
              right: '0', 
              width: '12px', 
              height: '12px', 
              background: 'var(--color-gold)', 
              borderRadius: '50%', 
              border: '2px solid var(--color-navy)' 
            }} 
          />
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          style={{
            width: '360px',
            height: '480px',
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-2xl)',
            border: '1px solid var(--color-gray-200)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'var(--color-navy)',
              color: 'var(--color-white)',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid var(--color-gold)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'var(--color-gold)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-navy-dark)'
                }}
              >
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>Trợ Lý Edison</h4>
                <span style={{ fontSize: '10px', color: 'var(--color-gold-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }} /> Online hỗ trợ
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages / Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--color-gray-50)' }}>
            
            {messages.map((msg, idx) => {
              const isBot = msg.sender === 'bot'
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    flexDirection: isBot ? 'row' : 'row-reverse'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isBot ? 'var(--color-navy)' : 'var(--color-gold)',
                      color: isBot ? 'var(--color-white)' : 'var(--color-navy-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {isBot ? 'ED' : <User size={12} />}
                  </div>
                  <div
                    style={{
                      background: isBot ? 'var(--color-white)' : 'var(--color-primary)',
                      color: isBot ? 'var(--color-navy)' : 'var(--color-white)',
                      padding: '10px 14px',
                      borderRadius: isBot ? '0 var(--radius-lg) var(--radius-lg) var(--radius-lg)' : 'var(--radius-lg) 0 var(--radius-lg) var(--radius-lg)',
                      fontSize: 'var(--font-size-xs)',
                      lineHeight: 1.5,
                      boxShadow: 'var(--shadow-sm)',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            })}

            {/* Quick contact form option */}
            {showContactForm && (
              <div 
                style={{ 
                  background: 'var(--color-white)', 
                  border: '1px solid var(--color-gray-200)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '14px', 
                  marginTop: '6px',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)' }}>Gửi câu hỏi hỗ trợ trực tiếp</span>
                  <button onClick={() => setShowContactForm(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer' }}><X size={14} /></button>
                </div>
                {submitSuccess ? (
                  <div style={{ fontSize: '11px', color: 'var(--color-success)', textAlign: 'center', padding: '10px' }}>
                    Đã gửi thông tin! Chúng tôi sẽ liên hệ lại qua Email.
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Họ và tên *" 
                      required 
                      value={contactName} 
                      onChange={e => setContactName(e.target.value)} 
                      style={{ padding: '6px 8px', fontSize: '11px', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                    />
                    <input 
                      type="email" 
                      placeholder="Email liên hệ *" 
                      required 
                      value={contactEmail} 
                      onChange={e => setContactEmail(e.target.value)} 
                      style={{ padding: '6px 8px', fontSize: '11px', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                    />
                    <input 
                      type="tel" 
                      placeholder="Số điện thoại" 
                      value={contactPhone} 
                      onChange={e => setContactPhone(e.target.value)} 
                      style={{ padding: '6px 8px', fontSize: '11px', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                    />
                    <textarea 
                      placeholder="Nội dung cần hỗ trợ... *" 
                      required 
                      rows={2} 
                      value={contactMsg} 
                      onChange={e => setContactMsg(e.target.value)} 
                      style={{ padding: '6px 8px', fontSize: '11px', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-sm)', outline: 'none', resize: 'vertical' }}
                    />
                    {submitError && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{submitError}</span>}
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="btn btn-primary btn-sm" 
                      style={{ fontSize: '10px', height: '28px', gap: '4px' }}
                    >
                      {submitting ? 'Đang gửi...' : 'Gửi liên hệ'}
                      <Send size={10} />
                    </button>
                  </form>
                )}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* FAQ Suggestions / Quick Actions Footer */}
          <div 
            style={{ 
              padding: '12px', 
              borderTop: '1px solid var(--color-gray-200)', 
              background: 'var(--color-white)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            {/* Suggested FAQ Questions */}
            {faqs.length > 0 && !showContactForm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <HelpCircle size={10} /> Câu hỏi thường gặp:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
                  {faqs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => handleSelectFaq(faq)}
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        background: 'var(--color-gray-50)',
                        border: '1px solid var(--color-gray-200)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '11px',
                        color: 'var(--color-navy-light)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'background 0.2s',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 109, 0, 0.08)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-gray-50)' }}
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Contact Button */}
            {!showContactForm && (
              <button
                onClick={() => setShowContactForm(true)}
                style={{
                  background: 'var(--color-gold)',
                  color: 'var(--color-navy-dark)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gold-light)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-gold)'}
              >
                <Clock size={12} />
                Gửi câu hỏi hỗ trợ trực tiếp
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
