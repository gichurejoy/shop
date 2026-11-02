'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

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

export default function HelpdeskChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'open' | 'closed'>('open');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.supportChat.get();
      const list = res.conversations || [];
      setConversations(list);
      if (list.length > 0 && (!activeId || !list.find(c => c.id === activeId))) {
        setActiveId(list[0].id);
      }
    } catch (err: any) {
      toast.error('Failed to load support conversations: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeChat = conversations.find((c) => c.id === activeId);
  const filteredList = conversations.filter((c) => c.status === filter);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages.length]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      sender: 'agent',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, optimisticMsg],
              lastMessageTime: 'Just now',
              unread: 0,
            }
          : c
      )
    );

    try {
      const res = await apiClient.supportChat.sendMessage(activeId, text);
      setConversations(res.conversations);
    } catch (err: any) {
      toast.error('Failed to save message: ' + (err.message || 'Error'));
    } finally {
      setSending(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!activeChat) return;
    const nextStatus = activeChat.status === 'open' ? 'closed' : 'open';
    try {
      const res = await apiClient.supportChat.updateStatus(activeId, nextStatus);
      setConversations(res.conversations);
      toast.success(`Conversation marked as ${nextStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error('Failed to update status: ' + (err.message || 'Error'));
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Connecting to concierge chat registry...</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0" style={{ height: 'calc(100vh - 180px)', minHeight: '560px' }}>
      <div className="row g-0 h-100">
        {/* Left Side: Conversations List */}
        <div className="col-md-4 col-xl-3 border-end h-100 d-flex flex-column">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Customer Inquiries</h5>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${filter === 'open' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter('open')}
              >
                Open ({conversations.filter((c) => c.status === 'open').length})
              </button>
              <button
                type="button"
                className={`btn ${filter === 'closed' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter('closed')}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="overflow-auto flex-grow-1">
            {filteredList.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="fs-13 mb-0">No {filter} inquiries.</p>
              </div>
            ) : (
              filteredList.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`p-3 border-bottom d-flex align-items-center gap-3 ${activeId === c.id ? 'bg-light' : 'hover-bg-light'}`}
                  style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                >
                  <img
                    src={c.avatar}
                    alt={c.customerName}
                    className="rounded-circle"
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-baseline mb-1">
                      <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: '140px' }}>
                        {c.customerName}
                      </span>
                      <small className="text-muted fs-11">{c.lastMessageTime}</small>
                    </div>
                    <p className="text-muted fs-12 mb-0 text-truncate">
                      {c.messages[c.messages.length - 1]?.text || 'No messages'}
                    </p>
                  </div>
                  {c.unread > 0 && (
                    <span className="badge rounded-pill bg-primary fs-11">{c.unread}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Active Conversation */}
        <div className="col-md-8 col-xl-9 h-100 d-flex flex-column">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.customerName}
                    className="rounded-circle"
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-0 fw-bold">{activeChat.customerName}</h6>
                    <small className="text-muted">{activeChat.customerEmail}</small>
                  </div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <button
                    type="button"
                    className={`btn btn-sm ${activeChat.status === 'open' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                    onClick={handleToggleStatus}
                  >
                    {activeChat.status === 'open' ? 'Close Inquiry' : 'Re-open Inquiry'}
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="p-4 overflow-auto flex-grow-1 bg-light bg-opacity-50 d-flex flex-column gap-3">
                {activeChat.messages.map((m) => {
                  const isAgent = m.sender === 'agent';
                  return (
                    <div
                      key={m.id}
                      className={`d-flex flex-column ${isAgent ? 'align-items-end' : 'align-items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-3 shadow-sm ${isAgent ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                        style={{ maxWidth: '75%', lineHeight: '1.5' }}
                      >
                        <p className="mb-0 fs-14">{m.text}</p>
                      </div>
                      <small className="text-muted mt-1 px-1 fs-11">{m.timestamp}</small>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-top bg-white">
                <form onSubmit={handleSend} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type concierge reply..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={sending}
                  />
                  <button type="submit" className="btn btn-primary d-flex align-items-center gap-1" disabled={sending || !inputText.trim()}>
                    <iconify-icon icon="solar:plain-bold"></iconify-icon> Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              <p>Select a customer inquiry from the left to start responding.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
