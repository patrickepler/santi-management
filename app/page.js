'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, signIn, signUp, signOut, getCurrentUser } from '../lib/supabase';

// ============ ICONS ============
const Icon = ({ name, size = 20 }) => {
  const icons = {
    leaf: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    kanban: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="8" rx="1"/></svg>,
    repeat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
    link: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  };
  return icons[name] || null;
};

// ============ UTILITIES ============
const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

const getStatusStyle = (status) => {
  const styles = {
    'Done': { bg: 'rgba(107,114,128,0.1)', color: '#4b5563', dot: '#6b7280' },
    'Supply Chain Pending Order': { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', dot: '#dc2626' },
    'Supply Chain Pending Arrival': { bg: 'rgba(245,158,11,0.1)', color: '#d97706', dot: '#f59e0b' },
    'Ready to start (Supply Chain confirmed on-site)': { bg: 'rgba(59,130,246,0.1)', color: '#2563eb', dot: '#3b82f6' },
    'In Progress': { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed', dot: '#8b5cf6' },
  };
  return styles[status] || { bg: 'rgba(107,114,128,0.06)', color: '#9ca3af', dot: '#9ca3af' };
};

const getReadiness = (task, categoryTasks, index) => {
  const status = task.status || '';
  if (status === 'Done') return { type: 'done', label: 'Done', color: '#6b7280', bg: '#f3f4f6', icon: '✓' };
  if (status === 'In Progress') return { type: 'in-progress', label: 'In Progress', color: '#7c3aed', bg: '#f3e8ff', icon: '◐' };
  if (status.includes('Supply Chain Pending')) return { type: 'blocked-supply', label: 'Supply Chain', color: '#dc2626', bg: '#fef2f2', icon: '!' };
  if (index > 0) {
    const pred = categoryTasks[index - 1];
    if (pred?.status === 'Done') return { type: 'ready', label: 'Ready Now', color: '#16a34a', bg: '#f0fdf4', icon: '●' };
    if (pred?.status === 'In Progress') return { type: 'unlocking', label: 'Unlocking Soon', color: '#d97706', bg: '#fffbeb', icon: '◔' };
  }
  if (status === 'Ready to start (Supply Chain confirmed on-site)') return { type: 'ready', label: 'Ready Now', color: '#16a34a', bg: '#f0fdf4', icon: '●' };
  return { type: 'sequenced', label: '', color: '#9ca3af', bg: 'transparent', icon: '' };
};

const calculateDeadlineOnSite = (earliestStart) => {
  if (!earliestStart) return null;
  const d = new Date(earliestStart);
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
};

// ============ LOGIN SCREEN ============
const LoginScreen = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot', 'resetSent'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (mode === 'register') {
        if (!username.trim() || !email.trim() || !password.trim()) {
          setError('All fields required');
          setLoading(false);
          return;
        }
        const { data, error } = await signUp(email, password, username);
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setError('Please enter your email');
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMode('resetSent');
      } else {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        if (data.user) onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
    setLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '48px', width: '380px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #065f46, #10b981)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff' }}><Icon name="leaf" /></div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Santi Management</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Sustainable Development</p>
        </div>

        {mode === 'resetSent' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#059669' }}>
              <Icon name="check" size={24} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Check your email</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <button type="button" onClick={() => switchMode('login')} style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {mode === 'register' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '14px', border: '1px solid #e5e7eb', borderRadius: '10px', boxSizing: 'border-box' }} />
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '14px', border: '1px solid #e5e7eb', borderRadius: '10px', boxSizing: 'border-box' }} />
            </div>
            {mode !== 'forgot' && (
              <div style={{ marginBottom: mode === 'login' ? '12px' : '24px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: '14px', border: '1px solid #e5e7eb', borderRadius: '10px', boxSizing: 'border-box' }} />
              </div>
            )}
            
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <button type="button" onClick={() => switchMode('forgot')} style={{ background: 'none', border: 'none', color: '#059669', fontSize: '13px', cursor: 'pointer' }}>
                  Forgot password?
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px', textAlign: 'center' }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
            )}
            
            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
            
            <button type="button" onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600', background: loading ? '#9ca3af' : '#059669', color: '#fff', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
              {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In'}
            </button>
            
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
              {mode === 'login' && (
                <>No account? <button type="button" onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: '500', cursor: 'pointer' }}>Register</button></>
              )}
              {mode === 'register' && (
                <>Have an account? <button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: '500', cursor: 'pointer' }}>Sign In</button></>
              )}
              {mode === 'forgot' && (
                <>Remember your password? <button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: '500', cursor: 'pointer' }}>Sign In</button></>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ============ KANBAN COLUMN ============
const KanbanColumn = ({ id, title, tasks, onDrop, onDragOver, users, onTaskClick, onDragStart, dragOverColumn, onReorder, dragOverTaskId, setDragOverTaskId }) => {
  const isOver = dragOverColumn === id;
  
  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); onDragOver(id); }}
      onDrop={(e) => onDrop(e, id)}
      style={{ 
        flex: '1', minWidth: '250px', maxWidth: '300px',
        background: isOver ? '#f0fdf4' : '#f9fafb', 
        borderRadius: '12px', padding: '12px',
        border: isOver ? '2px dashed #059669' : '1px solid #e5e7eb',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '12px', color: '#9ca3af', background: '#fff', padding: '2px 8px', borderRadius: '10px' }}>{tasks.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '100px' }}>
        {tasks.map(task => {
          const assignee = users.find(u => u.id === task.assigned_to);
          const overdue = isOverdue(task.due_date) && task.column !== 'done';
          const isTaskDragOver = dragOverTaskId === task.id;
          return (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task)}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTaskId(task.id); }}
              onDragLeave={() => setDragOverTaskId(null)}
              onDrop={(e) => { e.stopPropagation(); onReorder(e, task.id, id); }}
              onClick={() => onTaskClick(task)}
              style={{
                background: '#fff', borderRadius: '8px', padding: '12px',
                border: isTaskDragOver ? '2px dashed #059669' : overdue ? '1px solid #fca5a5' : '1px solid #e5e7eb',
                cursor: 'grab', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#1f2937' }}>{task.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {assignee && <img src={assignee.avatar_url} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />}
                  {task.type === 'sc' && <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>SC</span>}
                </div>
                {task.due_date && (
                  <span style={{ fontSize: '11px', color: overdue ? '#dc2626' : '#6b7280', fontWeight: overdue ? '600' : '400' }}>
                    {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ TASK MODAL ============
const TaskModal = ({ task, onClose, onSave, onDelete, users }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || '');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [column, setColumn] = useState(task?.column || 'later');

  const handleSave = () => {
    onSave({ ...task, title, assigned_to: assignedTo, due_date: dueDate, column });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={onClose}>
      <div style={{ width: '500px', background: '#fff', borderRadius: '16px', padding: '24px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{task?.id ? 'Edit Task' : 'New Task'}</h2>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="x" size={20} /></button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Assigned To</label>
            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <option value="">Select...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Column</label>
          <select value={column} onChange={e => setColumn(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="waiting">Waiting/Follow Up</option>
            <option value="review">Ready to Review</option>
            <option value="later">Later</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {task?.id && <button type="button" onClick={() => { onDelete(task.id); onClose(); }} style={{ padding: '10px 20px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Delete</button>}
          <button type="button" onClick={onClose} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={handleSave} style={{ padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
};

// ============ STATUS DROPDOWN ============
const StatusDropdown = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const style = getStatusStyle(value);
  
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  
  const short = s => s === 'Ready to start (Supply Chain confirmed on-site)' ? 'Ready' : (s || 'Set status').replace('Supply Chain Pending', 'SC');
  
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: '500', background: style.bg, border: 'none', borderRadius: '6px', color: style.color, cursor: 'pointer' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }} />{short(value)}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, minWidth: '220px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100 }}>
          {options.map((o, i) => {
            const s = getStatusStyle(o);
            return (
              <div key={i} onClick={() => { onChange(o); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.dot }} />{o}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============ MAIN APP ============
export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [buildingTasks, setBuildingTasks] = useState([]);
  const [kanbanTasks, setKanbanTasks] = useState([]);
  const [activeNav, setActiveNav] = useState('taskBoard');
  const [expandedNav, setExpandedNav] = useState(['sequence']);
  const [selectedTaskUser, setSelectedTaskUser] = useState(null);
  const [taskModal, setTaskModal] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const statusOptions = ['Done', 'In Progress', 'Ready to start (Supply Chain confirmed on-site)', 'Supply Chain Pending Order', 'Supply Chain Pending Arrival', 'Blocked', 'On Hold'];

  // Check auth on load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const profile = await getCurrentUser();
        if (profile) {
          setCurrentUser(profile);
        }
      } catch (err) {
        console.error('Auth error:', err);
      }
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await getCurrentUser();
          setCurrentUser(profile);
        } catch (err) {
          console.error('Profile fetch error:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setDataLoaded(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        // Load users
        const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*');
        if (profilesError) console.error('Profiles error:', profilesError);
        if (profilesData) setUsers(profilesData);

        // Load building tasks
        const { data: buildingData, error: buildingError } = await supabase.from('building_tasks').select('*').order('order');
        if (buildingError) console.error('Building tasks error:', buildingError);
        if (buildingData) setBuildingTasks(buildingData);

        // Load kanban tasks
        const { data: kanbanData, error: kanbanError } = await supabase.from('kanban_tasks').select('*').order('order');
        if (kanbanError) console.error('Kanban tasks error:', kanbanError);
        if (kanbanData) setKanbanTasks(kanbanData);
      } catch (err) {
        console.error('Data load error:', err);
      }
      setDataLoaded(true);
    };

    loadData();
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={() => window.location.reload()} />;
  }

  if (!dataLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading data...</p>
      </div>
    );
  }

  const isManager = currentUser.role === 'manager';
  
  const getVisibleTasks = () => {
    let tasks = kanbanTasks;
    if (selectedTaskUser === 'all' || (isManager && selectedTaskUser === null)) {
      // Show all
    } else if (selectedTaskUser) {
      tasks = tasks.filter(t => t.assigned_to === selectedTaskUser);
    } else {
      tasks = tasks.filter(t => t.assigned_to === currentUser.id);
    }
    return tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const visibleTasks = getVisibleTasks();

  const columns = [
    { id: 'today', title: 'Today' },
    { id: 'thisWeek', title: 'This Week' },
    { id: 'waiting', title: 'Waiting/Follow Up' },
    { id: 'review', title: 'Ready to Review' },
    { id: 'later', title: 'Later' },
    { id: 'done', title: 'Done' },
  ];

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (!draggedTask) return;
    
    await supabase.from('kanban_tasks').update({ column: columnId }).eq('id', draggedTask.id);
    setKanbanTasks(prev => prev.map(t => t.id === draggedTask.id ? { ...t, column: columnId } : t));
    
    setDraggedTask(null);
    setDragOverColumn(null);
    setDragOverTaskId(null);
  };

  const handleReorder = async (e, targetTaskId, columnId) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.id === targetTaskId) {
      setDraggedTask(null);
      setDragOverTaskId(null);
      return;
    }

    const columnTasks = kanbanTasks.filter(t => t.column === columnId).sort((a, b) => (a.order || 0) - (b.order || 0));
    const targetIndex = columnTasks.findIndex(t => t.id === targetTaskId);
    
    // Update in database
    await supabase.from('kanban_tasks').update({ column: columnId, order: targetIndex }).eq('id', draggedTask.id);
    
    setKanbanTasks(prev => prev.map(t => t.id === draggedTask.id ? { ...t, column: columnId, order: targetIndex } : t));
    setDraggedTask(null);
    setDragOverColumn(null);
    setDragOverTaskId(null);
  };

  const handleTaskSave = async (task) => {
    if (task.id && !task.id.startsWith('new')) {
      await supabase.from('kanban_tasks').update(task).eq('id', task.id);
      setKanbanTasks(prev => prev.map(t => t.id === task.id ? task : t));
    } else {
      const newTask = { ...task, id: undefined, type: 'manual' };
      const { data } = await supabase.from('kanban_tasks').insert(newTask).select().single();
      if (data) setKanbanTasks(prev => [...prev, data]);
    }
  };

  const handleTaskDelete = async (id) => {
    await supabase.from('kanban_tasks').delete().eq('id', id);
    setKanbanTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleBuildingStatusChange = async (taskId, newStatus) => {
    await supabase.from('building_tasks').update({ status: newStatus }).eq('id', taskId);
    setBuildingTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    // Auto-create SC task if status is Supply Chain Pending Order
    if (newStatus === 'Supply Chain Pending Order') {
      const task = buildingTasks.find(t => t.id === taskId);
      const existingSC = kanbanTasks.find(kt => kt.building_task_id === taskId);
      
      if (task && !existingSC) {
        const procurementUser = users.find(u => u.role === 'procurement');
        const scTask = {
          title: `SC for ${task.step} - ${task.task} - ${task.sub_category} - ${task.villa}`,
          assigned_to: procurementUser?.id,
          column: 'thisWeek',
          type: 'sc',
          sc_status: 'research',
          building_task_id: taskId,
          deadline_on_site: calculateDeadlineOnSite(task.earliest_start),
          due_date: calculateDeadlineOnSite(task.earliest_start),
        };
        
        const { data } = await supabase.from('kanban_tasks').insert(scTask).select().single();
        if (data) setKanbanTasks(prev => [...prev, data]);
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
  };

  const navItems = [
    { id: 'taskBoard', label: 'Task Board', icon: 'kanban' },
    { id: 'recurring', label: 'Recurring Tasks', icon: 'repeat' },
    { id: 'sequence', label: 'Building Sequence', icon: 'list', subItems: [
      { id: 'sequence-villa1', label: 'Villa 1' },
      { id: 'sequence-villa2', label: 'Villa 2' },
      { id: 'sequence-villa3', label: 'Villa 3' },
      { id: 'sequence-landscaping', label: 'Landscaping' },
    ]},
    { id: 'schedule', label: 'Schedule', icon: 'calendar' },
    { id: 'workers', label: 'Workforce', icon: 'users' },
  ];

  const currentVilla = activeNav === 'sequence-villa1' ? 'Villa 1' : activeNav === 'sequence-villa2' ? 'Villa 2' : activeNav === 'sequence-villa3' ? 'Villa 3' : 'Landscaping';
  const filteredBuildingTasks = buildingTasks.filter(t => t.villa === currentVilla);
  const grouped = {};
  filteredBuildingTasks.forEach(t => { (grouped[t.sub_category] = grouped[t.sub_category] || []).push(t); });
  Object.keys(grouped).forEach(k => grouped[k].sort((a, b) => (a.order || 0) - (b.order || 0)));

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex' }}>
      {/* Sidebar */}
      <nav style={{ width: '260px', height: '100vh', background: '#fafafa', borderRight: '1px solid #e5e7eb', padding: '20px 12px', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #065f46, #10b981)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name="leaf" /></div>
          <div><div style={{ fontSize: '15px', fontWeight: '700', color: '#065f46' }}>Santi Management</div><div style={{ fontSize: '11px', color: '#6b7280' }}>Sustainable Development</div></div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
          <img src={currentUser.avatar_url} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>{currentUser.username}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'capitalize' }}>{currentUser.role}</div>
          </div>
          <button type="button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icon name="logout" size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {navItems.map(item => (
            <div key={item.id}>
              <button type="button" onClick={() => { 
                if (item.subItems) setExpandedNav(p => p.includes(item.id) ? p.filter(x => x !== item.id) : [...p, item.id]); 
                else setActiveNav(item.id); 
              }} style={{ 
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '10px 14px', fontSize: '14px', fontWeight: '500', 
                background: (activeNav === item.id || item.subItems?.some(s => s.id === activeNav)) ? '#fff' : 'transparent', 
                border: (activeNav === item.id || item.subItems?.some(s => s.id === activeNav)) ? '1px solid #e5e7eb' : '1px solid transparent', 
                borderRadius: '10px', color: (activeNav === item.id || item.subItems?.some(s => s.id === activeNav)) ? '#059669' : '#4b5563', 
                cursor: 'pointer', marginBottom: '2px' 
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icon name={item.icon} />{item.label}</span>
                {item.subItems && <span style={{ transform: expandedNav.includes(item.id) ? 'rotate(90deg)' : '', transition: '0.2s' }}><Icon name="chevronRight" size={14} /></span>}
              </button>
              {item.subItems && expandedNav.includes(item.id) && (
                <div style={{ marginLeft: '20px', marginBottom: '8px' }}>
                  {item.subItems.map(sub => (
                    <button key={sub.id} type="button" onClick={() => setActiveNav(sub.id)} style={{ 
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', fontSize: '13px', 
                      background: activeNav === sub.id ? 'rgba(5,150,105,0.08)' : 'transparent', 
                      border: 'none', borderRadius: '8px', color: activeNav === sub.id ? '#059669' : '#6b7280', 
                      cursor: 'pointer', marginBottom: '2px' 
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeNav === sub.id ? '#059669' : '#d1d5db' }} />
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '24px 32px' }}>
        {/* Task Board */}
        {activeNav === 'taskBoard' && (
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* User Selection Sidebar */}
            <div style={{ width: '200px', flexShrink: 0 }}>
              <div style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>View Tasks</h3>
                
                {isManager && (
                  <button type="button" onClick={() => setSelectedTaskUser('all')} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '8px',
                    background: (selectedTaskUser === 'all' || (isManager && selectedTaskUser === null)) ? '#ecfdf5' : '#fff',
                    border: (selectedTaskUser === 'all' || (isManager && selectedTaskUser === null)) ? '2px solid #059669' : '1px solid #e5e7eb',
                    borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '600' }}>All</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>All Tasks</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{kanbanTasks.length} tasks</div>
                    </div>
                  </button>
                )}

                {users.map(u => {
                  const userTaskCount = kanbanTasks.filter(t => t.assigned_to === u.id).length;
                  const isSelected = selectedTaskUser === u.id || (!isManager && selectedTaskUser === null && u.id === currentUser.id);
                  return (
                    <button key={u.id} type="button" onClick={() => setSelectedTaskUser(u.id)} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '6px',
                      background: isSelected ? '#ecfdf5' : '#fff',
                      border: isSelected ? '2px solid #059669' : '1px solid #e5e7eb',
                      borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                    }}>
                      <img src={u.avatar_url} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {u.username?.split(' ')[0]}
                          {u.id === currentUser.id && <span style={{ fontSize: '10px', color: '#059669' }}>(me)</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>{userTaskCount} tasks</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kanban Columns */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Task Board</h1>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                    {selectedTaskUser === 'all' || (isManager && !selectedTaskUser) ? 'All Tasks' : 'My Tasks'}
                  </p>
                </div>
                <button type="button" onClick={() => setTaskModal({ id: 'new', title: '', assigned_to: currentUser.id, column: 'later' })} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '600', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  <Icon name="plus" size={16} />Add Task
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                {columns.map(col => (
                  <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    tasks={visibleTasks.filter(t => t.column === col.id)}
                    users={users}
                    onTaskClick={setTaskModal}
                    onDragStart={(e, task) => setDraggedTask(task)}
                    onDragOver={setDragOverColumn}
                    onDrop={handleDrop}
                    onReorder={handleReorder}
                    dragOverColumn={dragOverColumn}
                    dragOverTaskId={dragOverTaskId}
                    setDragOverTaskId={setDragOverTaskId}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Building Sequence */}
        {activeNav.startsWith('sequence-') && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{currentVilla} Building Sequence</h1>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{filteredBuildingTasks.length} steps</p>
            </div>

            {Object.entries(grouped).map(([subCat, catTasks]) => (
              <div key={subCat} style={{ marginBottom: '32px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{subCat}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ background: '#fafafa' }}>
                        {['Readiness', 'Status', 'Task', 'Step', 'Earliest Start'].map((h, i) => (
                          <th key={i} style={{ padding: '12px 8px', fontSize: '11px', fontWeight: '600', color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {catTasks.map((t, i) => {
                        const r = getReadiness(t, catTasks, i);
                        const hasSC = kanbanTasks.some(kt => kt.building_task_id === t.id);
                        return (
                          <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '8px' }}>
                              {r.type !== 'sequenced' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '600', background: r.bg, color: r.color, borderRadius: '4px' }}>
                                  {r.icon} {r.label}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <StatusDropdown value={t.status} options={statusOptions} onChange={v => handleBuildingStatusChange(t.id, v)} />
                                {hasSC && <span title="Has SC Task" style={{ color: '#2563eb' }}><Icon name="link" size={14} /></span>}
                              </div>
                            </td>
                            <td style={{ padding: '8px', fontSize: '13px' }}>{t.task}</td>
                            <td style={{ padding: '8px', fontSize: '13px' }}>{t.step}</td>
                            <td style={{ padding: '8px', fontSize: '13px' }}>{t.earliest_start}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Placeholder pages */}
        {['recurring', 'schedule', 'workers'].includes(activeNav) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#9ca3af' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#6b7280' }}>{navItems.find(n => n.id === activeNav)?.label}</h2>
            <p>Coming soon</p>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {taskModal && (
        <TaskModal
          task={taskModal}
          onClose={() => setTaskModal(null)}
          onSave={handleTaskSave}
          onDelete={handleTaskDelete}
          users={users}
        />
      )}
    </div>
  );
}
