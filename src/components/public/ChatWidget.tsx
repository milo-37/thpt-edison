'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, HelpCircle, User, MessageSquare, Clock } from 'lucide-react'

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
      <style>{`
        .chat-bubble-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          outline: none;
          position: relative;
        }
        .chat-bubble-btn:hover {
          transform: scale(1.1) translateY(-4px);
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
        }
        .close-chat-btn {
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .close-chat-btn:hover {
          opacity: 1;
        }
        .faq-suggestion-btn {
          text-align: left;
          padding: 8px 12px;
          background: rgba(99, 102, 241, 0.04);
          border: 1px solid rgba(99, 102, 241, 0.08);
          border-radius: 8px;
          font-size: 11px;
          color: var(--color-navy);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .faq-suggestion-btn:hover {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.15);
          transform: translateX(2px);
        }
        .direct-msg-btn {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 4px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
        }
        .direct-msg-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(99, 102, 241, 0.25);
        }
        .chat-input-field {
          padding: 6px 8px;
          font-size: 11px;
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 6px;
          outline: none;
          background: white;
          color: var(--color-navy);
          transition: all 0.2s;
        }
        .chat-input-field:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .chat-submit-btn {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          padding: 6px 12px;
        }
        .chat-submit-btn:hover {
          opacity: 0.95;
        }

        /* --- Chat Body & Messages --- */
        .chat-body-container {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(244, 246, 255, 0.5);
        }
        [data-theme="dark"] .chat-body-container {
          background: rgba(15, 23, 42, 0.5);
        }

        .chat-bot-avatar {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
        }
        .chat-user-avatar {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }
        [data-theme="dark"] .chat-user-avatar {
          background: rgba(99, 102, 241, 0.2);
          color: #818cf8;
        }

        .chat-msg-bubble-bot {
          background: white;
          color: var(--color-navy);
          border: 1px solid rgba(99, 102, 241, 0.08);
          padding: 10px 14px;
          border-radius: 0 14px 14px 14px;
          font-size: var(--font-size-xs);
          line-height: 1.5;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.03);
          white-space: pre-line;
        }
        [data-theme="dark"] .chat-msg-bubble-bot {
          background: rgba(30, 41, 59, 0.8);
          color: #f1f5f9;
          border-color: rgba(148, 163, 184, 0.2);
        }

        .chat-msg-bubble-user {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 14px 0 14px 14px;
          font-size: var(--font-size-xs);
          line-height: 1.5;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.03);
          white-space: pre-line;
        }

        /* --- Dark mode for inputs & quick actions --- */
        [data-theme="dark"] .faq-suggestion-btn {
          background: rgba(148, 163, 184, 0.05);
          border-color: rgba(148, 163, 184, 0.1);
          color: #cbd5e1;
        }
        [data-theme="dark"] .faq-suggestion-btn:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
          color: #e0e7ff;
        }
        [data-theme="dark"] .chat-input-field {
          background: rgba(15, 23, 42, 0.6);
          color: #f8fafc;
          border-color: rgba(148, 163, 184, 0.2);
        }
      `}</style>

      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-bubble-btn"
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
              background: '#a855f7', 
              borderRadius: '50%', 
              border: '2px solid white' 
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
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: 'white',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'var(--glass-bg)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>Trợ Lý Edison</h4>
                <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }} /> Online hỗ trợ
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="close-chat-btn"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages / Body */}
          <div className="chat-body-container">
            
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
                    className={isBot ? "chat-bot-avatar" : "chat-user-avatar"}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
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
                    className={isBot ? "chat-msg-bubble-bot" : "chat-msg-bubble-user"}
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
                  background: 'transparent', 
                  border: '1px solid rgba(99, 102, 241, 0.15)', 
                  borderRadius: '16px', 
                  padding: '14px', 
                  marginTop: '6px',
                  boxShadow: '0 10px 25px rgba(99, 102, 241, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(99, 102, 241, 0.1)', paddingBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)' }}>Gửi câu hỏi hỗ trợ trực tiếp</span>
                  <button onClick={() => setShowContactForm(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer' }}><X size={14} /></button>
                </div>
                {submitSuccess ? (
                  <div style={{ fontSize: '11px', color: '#10b981', textAlign: 'center', padding: '10px' }}>
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
                      className="chat-input-field"
                    />
                    <input 
                      type="email" 
                      placeholder="Email liên hệ *" 
                      required 
                      value={contactEmail} 
                      onChange={e => setContactEmail(e.target.value)} 
                      className="chat-input-field"
                    />
                    <input 
                      type="tel" 
                      placeholder="Số điện thoại" 
                      value={contactPhone} 
                      onChange={e => setContactPhone(e.target.value)} 
                      className="chat-input-field"
                    />
                    <textarea 
                      placeholder="Nội dung cần hỗ trợ... *" 
                      required 
                      rows={2} 
                      value={contactMsg} 
                      onChange={e => setContactMsg(e.target.value)} 
                      className="chat-input-field"
                      style={{ resize: 'vertical' }}
                    />
                    {submitError && <span style={{ fontSize: '10px', color: '#ef4444' }}>{submitError}</span>}
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="chat-submit-btn" 
                      style={{ fontSize: '10px', height: '28px', gap: '4px' }}
                    >
                      {submitting ? 'Đang gửi...' : 'Gửi liên hệ'}
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
              borderTop: '1px solid rgba(99, 102, 241, 0.1)', 
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            {/* Suggested FAQ Questions */}
            {faqs.length > 0 && !showContactForm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <HelpCircle size={10} style={{ color: '#6366f1' }} /> Câu hỏi thường gặp:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px', scrollbarWidth: 'thin' }}>
                  {faqs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => handleSelectFaq(faq)}
                      className="faq-suggestion-btn"
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
                className="direct-msg-btn"
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
