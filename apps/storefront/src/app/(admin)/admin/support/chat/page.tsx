'use client';

import React, { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
};

type Conversation = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'open' | 'closed';
  lastMessageTime: string;
  unread: number;
  messages: Message[];
  avatar: string;
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    customerName: 'Alice Freeman',
    customerEmail: 'alice@example.com',
    status: 'open',
    lastMessageTime: '2m ago',
    unread: 2,
    avatar: 'https://i.pravatar.cc/150?u=a',
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi, I need help with order #9823.', timestamp: '10:00 AM' },
      { id: 'm2', sender: 'agent', text: 'Hello Alice, I can help with that. What seems to be the issue?', timestamp: '10:02 AM' },
      { id: 'm3', sender: 'user', text: 'The tracking link says delivered but I haven\'t received it.', timestamp: '10:04 AM' },
      { id: 'm4', sender: 'user', text: 'Can you please check?', timestamp: '10:04 AM' },
    ]
  },
  {
    id: 'c2',
    customerName: 'Mark Johnson',
    customerEmail: 'mark.j@example.com',
    status: 'open',
    lastMessageTime: '15m ago',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?u=m',
    messages: [
      { id: 'm1', sender: 'user', text: 'Do you ship to Canada?', timestamp: '09:40 AM' },
      { id: 'm2', sender: 'agent', text: 'Yes, we do! Shipping to Canada takes about 5-7 business days.', timestamp: '09:45 AM' },
    ]
  },
  {
    id: 'c3',
    customerName: 'Sophie Williams',
    customerEmail: 'swills@example.com',
    status: 'closed',
    lastMessageTime: '1d ago',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?u=s',
    messages: [
      { id: 'm1', sender: 'user', text: 'Thanks for the quick refund.', timestamp: 'Yesterday' },
      { id: 'm2', sender: 'agent', text: 'You\'re welcome, Sophie! Let us know if you need anything else.', timestamp: 'Yesterday' },
    ]
  }
];

export default function HelpdeskChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'open' | 'closed'>('open');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find(c => c.id === activeId);
  const filteredList = conversations.filter(c => c.status === filter);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Clear unread on select
    if (activeChat && activeChat.unread > 0) {
      setConversations(prev => prev.map(c => 
        c.id === activeId ? { ...c, unread: 0 } : c
      ));
    }
  }, [activeId, activeChat?.messages.length]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Math.random().toString(36),
      sender: 'agent',
      text: inputText,
      timestamp: 'Just now'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessageTime: 'Just now'
        };
      }
      return c;
    }));
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const closeConversation = () => {
    setConversations(prev => prev.map(c => 
      c.id === activeId ? { ...c, status: 'closed' } : c
    ));
    setFilter('closed');
  };

  return (
    <div className="card h-100 overflow-hidden" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="row g-0 h-100">
        
        {/* Left Pane - List */}
        <div className="col-lg-4 border-end h-100 d-flex flex-column bg-white">
          <div className="p-3 border-bottom bg-light-subtle">
            <h4 className="card-title mb-3">Messages</h4>
            <div className="d-flex gap-2">
              <button 
                className={`btn btn-sm flex-1 ${filter === 'open' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter('open')}
              >
                Open
              </button>
              <button 
                className={`btn btn-sm flex-1 ${filter === 'closed' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter('closed')}
              >
                Closed
              </button>
            </div>
            <div className="mt-3 position-relative">
              <input type="text" className="form-control form-control-sm" placeholder="Search chats..." style={{ paddingLeft: '30px' }} />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto" style={{ height: '0', flexGrow: 1 }}>
            {filteredList.length === 0 ? (
              <div className="p-4 text-center text-muted">No {filter} conversations.</div>
            ) : (
              <ul className="list-unstyled mb-0">
                {filteredList.map(c => (
                  <li 
                    key={c.id} 
                    className={`p-3 border-bottom cursor-pointer transition-all ${activeId === c.id ? 'bg-primary-subtle' : 'hover-bg-light'}`}
                    onClick={() => setActiveId(c.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative">
                        <img src={c.avatar} className="rounded-circle" style={{ width: '42px', height: '42px', objectFit: 'cover' }} alt="Avatar" />
                        {c.unread > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex justify-content-between align-items-baseline mb-1">
                          <h6 className={`mb-0 text-truncate ${c.unread > 0 ? 'fw-bold' : ''}`}>{c.customerName}</h6>
                          <small className="text-muted fs-11 ms-2">{c.lastMessageTime}</small>
                        </div>
                        <p className={`mb-0 text-truncate fs-13 ${c.unread > 0 ? 'text-dark fw-medium' : 'text-muted'}`}>
                          {c.messages[c.messages.length - 1].sender === 'agent' ? 'You: ' : ''}
                          {c.messages[c.messages.length - 1].text}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Pane - Chat */}
        <div className="col-lg-8 h-100 d-flex flex-column bg-light-subtle">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center flex-shrink-0">
                <div className="d-flex align-items-center gap-3">
                  <img src={activeChat.avatar} className="rounded-circle" style={{ width: '40px', height: '40px' }} alt="" />
                  <div>
                    <h5 className="mb-0">{activeChat.customerName}</h5>
                    <span className="text-muted fs-13 d-flex align-items-center gap-1">
                      <iconify-icon icon="solar:letter-linear"></iconify-icon> {activeChat.customerEmail}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-soft-secondary btn-sm d-flex align-items-center gap-2">
                    <iconify-icon icon="solar:user-id-linear"></iconify-icon> View Profile
                  </button>
                  {activeChat.status === 'open' && (
                    <button className="btn btn-soft-success btn-sm d-flex align-items-center gap-2" onClick={closeConversation}>
                      <iconify-icon icon="solar:check-circle-bold-duotone"></iconify-icon> Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 flex-grow-1 overflow-auto d-flex flex-column gap-3" style={{ height: '0' }}>
                <div className="text-center text-muted fs-12 mb-3">
                  <span className="bg-light px-2 py-1 rounded">Conversation started</span>
                </div>
                
                {activeChat.messages.map(msg => (
                  <div key={msg.id} className={`d-flex ${msg.sender === 'agent' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className="d-flex flex-column" style={{ maxWidth: '75%' }}>
                      <div 
                        className={`p-3 rounded-4 ${msg.sender === 'agent' ? 'bg-primary text-white rounded-bottom-end-0' : 'bg-white border rounded-bottom-start-0 shadow-sm'}`}
                        style={{ fontSize: '14.5px', lineHeight: '1.5' }}
                      >
                        {msg.text}
                      </div>
                      <span className={`text-muted fs-11 mt-1 ${msg.sender === 'agent' ? 'text-end' : 'text-start'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              {activeChat.status === 'open' ? (
                <div className="p-3 border-top bg-white flex-shrink-0">
                  <div className="position-relative">
                    <textarea 
                      className="form-control pe-5" 
                      rows={2} 
                      placeholder="Type a message..." 
                      style={{ resize: 'none', borderRadius: '12px', background: '#f8fafc' }}
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button 
                      className="btn btn-primary position-absolute bottom-0 end-0 m-2 rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '36px', height: '36px' }}
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                    >
                      <iconify-icon icon="solar:plain-2-bold" className="fs-18"></iconify-icon>
                    </button>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-link text-muted p-0 fs-20"><iconify-icon icon="solar:paperclip-linear"></iconify-icon></button>
                    <button className="btn btn-link text-muted p-0 fs-20"><iconify-icon icon="solar:smile-circle-linear"></iconify-icon></button>
                  </div>
                </div>
              ) : (
                <div className="p-3 border-top bg-light text-center text-muted fs-14">
                  This conversation has been resolved and closed.
                </div>
              )}
            </>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
              <iconify-icon icon="solar:chat-round-line-bold-duotone" style={{ fontSize: '64px', opacity: 0.2 }}></iconify-icon>
              <h5 className="mt-3 text-secondary">Select a conversation</h5>
              <p className="fs-14">Choose a chat from the left to start messaging.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
