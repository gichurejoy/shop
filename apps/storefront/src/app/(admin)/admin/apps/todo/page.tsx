'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  done: boolean;
  priority: 'High' | 'Medium' | 'Low';
  tag: string;
  date: string;
  assignee: string;
  avatar: string;
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, title: 'Review latest user research findings', done: false, priority: 'High', tag: 'Research', date: 'Today, 09:00 AM', assignee: 'Anna M.', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg' },
  { id: 2, title: 'Create presentation for board meeting', done: false, priority: 'High', tag: 'Meeting', date: 'Today, 11:30 AM', assignee: 'Peter S.', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-3.jpg' },
  { id: 3, title: 'Update the design system documentation', done: true,  priority: 'Medium', tag: 'Design', date: 'Yesterday', assignee: 'Mary L.', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-4.jpg' },
  { id: 4, title: 'Implement new checkout flow', done: false, priority: 'High', tag: 'Dev', date: 'Tomorrow', assignee: 'Robert D.', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-5.jpg' },
  { id: 5, title: 'Fix payment gateway integration bug', done: false, priority: 'High', tag: 'Bug', date: 'Today, 02:00 PM', assignee: 'Linda W.', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-6.jpg' },
  { id: 6, title: 'Write weekly team update email', done: true,  priority: 'Low', tag: 'Email', date: 'Yesterday', assignee: 'James M.', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-7.jpg' },
  { id: 7, title: 'Code review for authentication module', done: false, priority: 'Medium', tag: 'Dev', date: 'Tomorrow', assignee: 'Patricia B.', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-8.jpg' },
  { id: 8, title: 'Schedule Q2 product roadmap meeting', done: false, priority: 'Low', tag: 'Planning', date: 'Next Week', assignee: 'Anna M.', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-2.jpg' },
];

const PRIORITY_BADGE: Record<string, string> = {
  High: 'badge bg-danger-subtle text-danger',
  Medium: 'badge bg-warning-subtle text-warning',
  Low: 'badge bg-success-subtle text-success',
};

const FILTERS = ['All', 'Pending', 'Completed', 'High', 'Medium', 'Low'];

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [newTask, setNewTask] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const toggle = (id: number) =>
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: number) =>
    setTodos(todos.filter(t => t.id !== id));
  const addTask = () => {
    if (!newTask.trim()) return;
    setTodos([...todos, {
      id: Date.now(), title: newTask.trim(), done: false,
      priority: 'Medium', tag: 'Task', date: 'Today',
      assignee: 'You', avatar: 'https://techzaa.in/larkon/admin/assets/images/users/avatar-1.jpg'
    }]);
    setNewTask('');
    setShowAdd(false);
  };

  const filtered = todos.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchSearch;
    if (filter === 'Pending') return !t.done && matchSearch;
    if (filter === 'Completed') return t.done && matchSearch;
    return t.priority === filter && matchSearch;
  });

  const stats = {
    total: todos.length,
    pending: todos.filter(t => !t.done).length,
    completed: todos.filter(t => t.done).length,
    high: todos.filter(t => t.priority === 'High').length,
  };

  return (
    <div>
      {/* Stats row */}
      <div className="row mb-3">
        {[
          { label: 'Total Tasks', value: stats.total, icon: 'solar:checklist-minimalistic-bold-duotone', color: 'primary' },
          { label: 'Pending', value: stats.pending, icon: 'solar:clock-circle-bold-duotone', color: 'warning' },
          { label: 'Completed', value: stats.completed, icon: 'solar:check-circle-bold-duotone', color: 'success' },
          { label: 'High Priority', value: stats.high, icon: 'solar:danger-bold-duotone', color: 'danger' },
        ].map(s => (
          <div key={s.label} className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className={`avatar-md bg-${s.color} bg-opacity-10 rounded`}>
                    <iconify-icon className={`fs-32 text-${s.color} avatar-title`} icon={s.icon}></iconify-icon>
                  </div>
                  <div><h4 className="mb-0">{s.label}</h4></div>
                </div>
                <p className={`text-${s.color} fw-bold fs-22 mb-0`}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main todo card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="card-title mb-0">Task List</h4>
          <div className="d-flex gap-2 align-items-center">
            <div className="position-relative">
              <input
                type="search" className="form-control form-control-sm"
                placeholder="Search tasks..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '30px', minWidth: '200px' }}
              />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></iconify-icon>
            </div>
            <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={() => setShowAdd(!showAdd)}>
              <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Task
            </button>
          </div>
        </div>

        {/* Add task form */}
        {showAdd && (
          <div className="px-3 py-2 border-bottom bg-light-subtle">
            <div className="d-flex gap-2">
              <input type="text" className="form-control form-control-sm" placeholder="Type task name and press Enter..." value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} autoFocus />
              <button className="btn btn-sm btn-success" onClick={addTask}>Add</button>
              <button className="btn btn-sm btn-light" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="d-flex border-bottom px-3" style={{ overflowX: 'auto' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn btn-link text-decoration-none px-3 py-2" style={{ borderBottom: filter === f ? '2px solid #ff6c2f' : '2px solid transparent', color: filter === f ? '#ff6c2f' : '#64748b', fontWeight: filter === f ? 600 : 400, borderRadius: 0, whiteSpace: 'nowrap', fontSize: '13px' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Tag</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4 text-muted">No tasks found</td></tr>
              ) : filtered.map(t => (
                <tr key={t.id} style={{ opacity: t.done ? 0.65 : 1 }}>
                  <td>
                    <div className="form-check mb-0">
                      <input
                        className="form-check-input" type="checkbox"
                        checked={t.done} onChange={() => toggle(t.id)}
                        id={`todo-${t.id}`}
                      />
                      <label className="form-check-label" htmlFor={`todo-${t.id}`}></label>
                    </div>
                  </td>
                  <td>
                    <span style={{ textDecoration: t.done ? 'line-through' : 'none', fontWeight: 500, color: t.done ? '#94a3b8' : '#1e293b' }}>
                      {t.title}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={t.avatar} alt={t.assignee} className="avatar-sm rounded-circle" />
                      <span className="text-muted" style={{ fontSize: '13px' }}>{t.assignee}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted" style={{ fontSize: '13px' }}>
                      <iconify-icon icon="solar:calendar-linear" className="me-1"></iconify-icon>
                      {t.date}
                    </span>
                  </td>
                  <td><span className={PRIORITY_BADGE[t.priority]}>{t.priority}</span></td>
                  <td><span className="badge bg-light text-dark border">{t.tag}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-soft-primary btn-sm"><iconify-icon className="align-middle fs-18" icon="solar:pen-2-broken"></iconify-icon></button>
                      <button className="btn btn-soft-danger btn-sm" onClick={() => remove(t.id)}><iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-top d-flex justify-content-between align-items-center text-muted" style={{ fontSize: '13px' }}>
          <span>Showing {filtered.length} of {todos.length} tasks</span>
          <span>{stats.completed} completed · {stats.pending} pending</span>
        </div>
      </div>
    </div>
  );
}
