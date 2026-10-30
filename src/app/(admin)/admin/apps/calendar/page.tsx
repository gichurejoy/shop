'use client';

import { useState } from 'react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string; pill: string; pillText: string }> = {
  'bg-primary':   { bg: '#3b82f6', text: '#fff', dot: '#3b82f6', pill: '#dbeafe', pillText: '#1d4ed8' },
  'bg-info':      { bg: '#06b6d4', text: '#fff', dot: '#06b6d4', pill: '#cffafe', pillText: '#0e7490' },
  'bg-success':   { bg: '#22c55e', text: '#fff', dot: '#22c55e', pill: '#dcfce7', pillText: '#15803d' },
  'bg-danger':    { bg: '#ef4444', text: '#fff', dot: '#ef4444', pill: '#fee2e2', pillText: '#b91c1c' },
  'bg-warning':   { bg: '#f59e0b', text: '#fff', dot: '#f59e0b', pill: '#fef3c7', pillText: '#b45309' },
  'bg-secondary': { bg: '#64748b', text: '#fff', dot: '#64748b', pill: '#f1f5f9', pillText: '#475569' },
  'bg-dark':      { bg: '#1e293b', text: '#fff', dot: '#1e293b', pill: '#e2e8f0', pillText: '#334155' },
};

const SIDEBAR_EVENTS = [
  { title: 'Team Building Retreat Meeting', category: 'bg-danger' },
  { title: 'Product Launch Strategy Meeting', category: 'bg-info' },
  { title: 'Monthly Sales Review', category: 'bg-success' },
  { title: 'Team Lunch Celebration', category: 'bg-danger' },
  { title: 'Marketing Campaign Kickoff', category: 'bg-warning' },
];

interface CalEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "3:18p"
  category: string;
}

const TODAY = new Date();
const YM = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
const FMT = (d: Date) => `${YM(d)}-${String(d.getDate()).padStart(2,'0')}`;

const INITIAL_EVENTS: CalEvent[] = [
  { id: 1, title: 'Interview - Backend Dev', date: `${YM(TODAY)}-20`, time: '3:18p', category: 'bg-warning' },
  { id: 2, title: 'Meeting with Client', date: `${YM(TODAY)}-20`, time: '7:18p', category: 'bg-warning' },
  { id: 3, title: 'Interview - Frontend Engineer', date: `${YM(TODAY)}-21`, time: '8:29a', category: 'bg-dark' },
  { id: 4, title: 'Phone Screen', date: `${YM(TODAY)}-22`, time: '2:20p', category: 'bg-success' },
  { id: 5, title: 'Meeting with Manager', date: `${YM(TODAY)}-24`, time: '5:13a', category: 'bg-info' },
  { id: 6, title: 'Buy Design Assets', date: `${YM(TODAY)}-24`, time: '11:20a', category: 'bg-danger' },
  { id: 7, title: 'Setup Github Repository', date: `${YM(TODAY)}-31`, time: '7:18a', category: 'bg-danger' },
];

interface ModalState {
  open: boolean;
  eventId: number | null;
  date: string;
  title: string;
  category: string;
}

const DEFAULT_MODAL: ModalState = {
  open: false, eventId: null, date: '', title: '', category: 'bg-primary',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);
  const [modal, setModal] = useState<ModalState>(DEFAULT_MODAL);
  const [view, setView] = useState<'Month' | 'Week' | 'Day' | 'List'>('Month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));

  const todayStr = FMT(TODAY);
  const getDateStr = (day: number) => `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const getEventsForDay = (day: number) => events.filter(e => e.date === getDateStr(day));

  const openNewModal = (date: string) => setModal({ open: true, eventId: null, date, title: '', category: 'bg-primary' });
  const openEditModal = (ev: CalEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setModal({ open: true, eventId: ev.id, date: ev.date, title: ev.title, category: ev.category });
  };
  const closeModal = () => setModal(DEFAULT_MODAL);

  const saveEvent = () => {
    if (!modal.title.trim()) return;
    if (modal.eventId) {
      setEvents(events.map(e => e.id === modal.eventId ? { ...e, title: modal.title, category: modal.category } : e));
    } else {
      setEvents([...events, { id: Date.now(), title: modal.title, date: modal.date, time: '9:00a', category: modal.category }]);
    }
    closeModal();
  };

  const deleteEvent = () => {
    if (modal.eventId) setEvents(events.filter(e => e.id !== modal.eventId));
    closeModal();
  };

  const catList = [
    { value: 'bg-primary', label: 'Blue' },
    { value: 'bg-secondary', label: 'Gray Dark' },
    { value: 'bg-success', label: 'Green' },
    { value: 'bg-info', label: 'Cyan' },
    { value: 'bg-warning', label: 'Yellow' },
    { value: 'bg-danger', label: 'Red' },
    { value: 'bg-dark', label: 'Dark' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Modal Overlay */}
      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '440px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h5 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Event</h5>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Event Name</label>
              <input
                type="text" placeholder="Insert Event Name"
                value={modal.title} onChange={e => setModal({ ...modal, title: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Category</label>
              <select
                value={modal.category} onChange={e => setModal({ ...modal, category: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'auto' }}
              >
                {catList.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={deleteEvent} style={{ padding: '9px 20px', borderRadius: '8px', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600, visibility: modal.eventId ? 'visible' : 'hidden' }}>Delete</button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={closeModal} style={{ padding: '9px 20px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Close</button>
                <button onClick={saveEvent} style={{ padding: '9px 20px', borderRadius: '8px', background: '#ff6c2f', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Sidebar */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <button
            onClick={() => openNewModal(FMT(TODAY))}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#ff6c2f', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}
          >
            <span style={{ fontSize: '18px' }}>+</span> Add New Schedule
          </button>

          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>Drag and drop your event or click in the calendar</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SIDEBAR_EVENTS.map((ev, i) => {
              const c = CATEGORY_COLORS[ev.category];
              return (
                <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', background: c.pill, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'grab' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: c.pillText }}>{ev.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Area */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Calendar header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={prevMonth} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>‹</button>
              <button onClick={goToday} style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#334155' }}>Today</button>
              <button onClick={nextMonth} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>›</button>
            </div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>{monthName}</h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['Month', 'Week', 'Day', 'List'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid ' + (view === v ? '#ff6c2f' : '#e2e8f0'), background: view === v ? '#ff6c2f' : '#fff', color: view === v ? '#fff' : '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{v}</button>
              ))}
            </div>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #f1f5f9' }}>
            {DAYS_OF_WEEK.map(d => (
              <div key={d} style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {cells.map((day, idx) => {
              const dateStr = day ? getDateStr(day) : '';
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday = dateStr === todayStr;
              const isWeekend = idx % 7 === 0 || idx % 7 === 6;

              return (
                <div
                  key={idx}
                  onClick={() => day && openNewModal(dateStr)}
                  style={{
                    minHeight: '110px', padding: '8px', borderRight: '1px solid #f1f5f9',
                    borderBottom: '1px solid #f1f5f9', cursor: day ? 'pointer' : 'default',
                    background: isToday ? '#fff8f5' : isWeekend && day ? '#fafafa' : '#fff',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (day && !isToday) (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'; }}
                  onMouseLeave={e => { if (day) (e.currentTarget as HTMLDivElement).style.background = isToday ? '#fff8f5' : isWeekend ? '#fafafa' : '#fff'; }}
                >
                  {day && (
                    <>
                      <div style={{
                        textAlign: 'right', fontSize: '13px', fontWeight: isToday ? 700 : 500,
                        color: isToday ? '#fff' : '#64748b',
                        width: isToday ? '26px' : 'auto', height: isToday ? '26px' : 'auto',
                        borderRadius: isToday ? '50%' : 0,
                        background: isToday ? '#ff6c2f' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginLeft: 'auto', marginBottom: '4px',
                      }}>
                        {day}
                      </div>
                      {dayEvents.map(ev => {
                        const c = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS['bg-primary'];
                        return (
                          <div
                            key={ev.id}
                            onClick={e => openEditModal(ev, e)}
                            style={{
                              padding: '2px 6px', borderRadius: '4px', marginBottom: '2px',
                              background: c.bg, color: c.text,
                              fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              display: 'flex', alignItems: 'center', gap: '4px',
                            }}
                          >
                            <span style={{ fontSize: '8px' }}>●</span>
                            <span>{ev.time} {ev.title}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
