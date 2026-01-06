'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============ SUPABASE SETUP ============
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ============ ICONS ============
const Icon = ({ name, size = 20 }) => {
  const icons = {
    leaf: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    kanban: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="8" rx="1"/></svg>,
    list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
    chevronDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  };
  return icons[name] || null;
};

// ============ STATUS STYLES ============
const getStatusStyle = (status) => {
  const styles = {
    'Done': { bg: 'rgba(107,114,128,0.1)', color: '#4b5563', dot: '#6b7280' },
    'Supply Chain Pending Order': { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', dot: '#dc2626' },
    'Supply Chain Pending Arrival': { bg: 'rgba(245,158,11,0.1)', color: '#d97706', dot: '#f59e0b' },
    'Ready to start (Supply Chain confirmed on-site)': { bg: 'rgba(59,130,246,0.1)', color: '#2563eb', dot: '#3b82f6' },
    'In Progress': { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed', dot: '#8b5cf6' },
    'Blocked': { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', dot: '#ef4444' },
    'On Hold': { bg: 'rgba(107,114,128,0.1)', color: '#4b5563', dot: '#6b7280' },
  };
  return styles[status] || { bg: 'rgba(107,114,128,0.06)', color: '#9ca3af', dot: '#9ca3af' };
};

// ============ LOGIN SCREEN ============
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Database not configured'); return; }
    setLoading(true);
    setError('');
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout - please check your connection')), 30000)
      );
      
      const authPromise = supabase.auth.signInWithPassword({ email, password });
      const { data, error } = await Promise.race([authPromise, timeoutPromise]);
      
      if (error) { 
        setError(error.message); 
        setLoading(false); 
      } else if (data?.user) {
        // Verify user exists before reload
        onLogin();
      } else {
        setError('Login failed - please try again');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Database not configured'); return; }
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
    if (error) { setError(error.message); setLoading(false); }
    else {
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id, email, username, role: 'worker',
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0D9488&color=fff`
        });
      }
      setMessage('Account created! You can now sign in.');
      setMode('login');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Database not configured'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) { setError(error.message); } else { setMessage('Check your email for reset link.'); setMode('login'); }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d9488' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#0d9488', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icon name="leaf" size={28} /></div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Santi Management</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Sustainable Development</p>
        </div>
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {message && <div style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}
        
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <button type="button" onClick={() => setMode('forgot')} style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontSize: '14px' }}>Forgot password?</button>
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Please wait...' : 'Sign In'}</button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>No account? <button type="button" onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontWeight: '600' }}>Register</button></p>
          </form>
        )}
        
        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Please wait...' : 'Create Account'}</button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>Have an account? <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontWeight: '600' }}>Sign In</button></p>
          </form>
        )}
        
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Please wait...' : 'Send Reset Link'}</button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}><button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontWeight: '600' }}>Back to Sign In</button></p>
          </form>
        )}
      </div>
    </div>
  );
}

// ============ KANBAN COLUMN ============
function KanbanColumn({ id, title, tasks, onDrop, users, onTaskClick, onDragStart, dragOverColumn, setDragOverColumn }) {
  const isOver = dragOverColumn === id;
  
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOverColumn(id); }}
      onDragLeave={() => setDragOverColumn(null)}
      onDrop={(e) => onDrop(e, id)}
      style={{
        flex: '1', minWidth: '200px', maxWidth: '280px',
        background: isOver ? '#f0fdf4' : '#f9fafb',
        borderRadius: '12px', padding: '12px',
        border: isOver ? '2px dashed #059669' : '1px solid #e5e7eb',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '12px', color: '#9ca3af', background: '#fff', padding: '2px 8px', borderRadius: '10px' }}>{tasks.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '100px' }}>
        {tasks.map((task) => {
          const assignee = users.find(u => u.id === task.assigned_to);
          return (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task)}
              onClick={() => onTaskClick(task)}
              style={{
                background: '#fff', borderRadius: '8px', padding: '12px',
                border: '1px solid #e5e7eb', cursor: 'grab',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#1f2937' }}>{task.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {assignee && <img src={assignee.avatar_url} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />}
                {task.priority && (
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600',
                    background: task.priority === 'high' ? '#fef2f2' : task.priority === 'medium' ? '#fffbeb' : '#f0fdf4',
                    color: task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : '#16a34a'
                  }}>{task.priority}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ TASK MODAL ============
function TaskModal({ task, onClose, onSave, onDelete, users, columns }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || '');
  const [column, setColumn] = useState(task?.column || 'today');
  const [priority, setPriority] = useState(task?.priority || 'medium');

  const handleSave = () => {
    onSave({ ...task, title, description, assigned_to: assignedTo, column, priority });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{task?.id ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><Icon name="x" /></button>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Assigned To</label>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Column</label>
            <select value={column} onChange={(e) => setColumn(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
              {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          {task?.id && <button onClick={() => onDelete(task.id)} style={{ padding: '10px 20px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>}
          <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ BUILDING SEQUENCE ============
function BuildingSequence({ tasks, onTaskUpdate, statusOptions }) {
  const grouped = tasks.reduce((acc, t) => {
    const key = t.sub_category || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Building Sequence</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{tasks.length} steps</p>
      </div>
      
      {Object.entries(grouped).map(([subCat, catTasks]) => (
        <div key={subCat} style={{ marginBottom: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{subCat}</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['#', 'Status', 'Task', 'Step', 'Notes', 'Earliest Start'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 8px', fontSize: '11px', fontWeight: '600', color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catTasks.sort((a,b) => (a.order||0) - (b.order||0)).map((t) => {
                  const statusStyle = getStatusStyle(t.status);
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: '#6b7280' }}>{t.order}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <select 
                          value={t.status || ''} 
                          onChange={(e) => onTaskUpdate(t.id, { status: e.target.value })}
                          style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', background: statusStyle.bg, color: statusStyle.color }}
                        >
                          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: '13px' }}>{t.task}</td>
                      <td style={{ padding: '12px 8px', fontSize: '13px' }}>{t.step}</td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: '#6b7280' }}>{t.notes}</td>
                      <td style={{ padding: '12px 8px', fontSize: '13px' }}>{t.earliest_start}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      
      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
          <p>No building tasks found</p>
        </div>
      )}
    </div>
  );
}

// ============ MAIN APP ============
export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [kanbanTasks, setKanbanTasks] = useState([]);
  const [buildingTasks, setBuildingTasks] = useState([]);
  const [activeNav, setActiveNav] = useState('taskBoard');
  const [expandedNav, setExpandedNav] = useState(['sequence']);
  const [selectedTaskUser, setSelectedTaskUser] = useState(null);
  const [taskModal, setTaskModal] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const statusOptions = ['Done', 'In Progress', 'Ready to start (Supply Chain confirmed on-site)', 'Supply Chain Pending Order', 'Supply Chain Pending Arrival', 'Blocked', 'On Hold'];
  
  const columns = [
    { id: 'today', title: 'Today' },
    { id: 'thisWeek', title: 'This Week' },
    { id: 'waiting', title: 'Waiting/Follow Up' },
    { id: 'review', title: 'Ready to Review' },
    { id: 'later', title: 'Later' },
    { id: 'done', title: 'Done' },
  ];

useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    
const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log('User found:', user.email);
          const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
          if (profileError) console.error('Profile error:', profileError);
          if (profile) {
            console.log('Profile loaded:', profile.username);
            setCurrentUser(profile);
          } else {
            console.warn('No profile found, creating one...');
            // Auto-create profile if missing
            const newProfile = {
              id: user.id,
              email: user.email,
              username: user.email.split('@')[0],
              role: 'worker',
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email.split('@')[0])}&background=0D9488&color=fff`
            };
            const { data: created } = await supabase.from('profiles').insert(newProfile).select().single();
            if (created) setCurrentUser(created);
          }
        } else {
          console.log('No authenticated user');
        }
      } catch (err) { 
        console.error('Auth error:', err);
      }
      setLoading(false);
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
          if (error) console.error('Profile fetch error:', error);
          if (profile) setCurrentUser(profile);
          else console.warn('No profile found for user:', session.user.id);
        } catch (err) {
          console.error('Profile fetch failed:', err);
        }
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !supabase) return;
    
    const loadData = async () => {
      const { data: profilesData } = await supabase.from('profiles').select('*');
      if (profilesData) setUsers(profilesData);
      
      const { data: kanbanData } = await supabase.from('kanban_tasks').select('*').order('order');
      if (kanbanData) setKanbanTasks(kanbanData);
      
      const { data: buildingData } = await supabase.from('building_tasks').select('*').order('order');
      if (buildingData) setBuildingTasks(buildingData);
    };
    
    loadData();
  }, [currentUser]);

  const handleSignOut = async () => {
    if (supabase) { await supabase.auth.signOut(); setCurrentUser(null); }
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (!draggedTask || !supabase) return;
    
    const updated = { ...draggedTask, column: columnId };
    setKanbanTasks(prev => prev.map(t => t.id === draggedTask.id ? updated : t));
    await supabase.from('kanban_tasks').update({ column: columnId }).eq('id', draggedTask.id);
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleNewTask = () => {
    setTaskModal({ title: '', description: '', assigned_to: currentUser?.id, column: 'today', priority: 'medium' });
  };

  const handleSaveTask = async (task) => {
    if (!supabase) return;
    
    if (task.id) {
      setKanbanTasks(prev => prev.map(t => t.id === task.id ? task : t));
      await supabase.from('kanban_tasks').update(task).eq('id', task.id);
    } else {
      const newTask = { ...task, created_by: currentUser?.id, order: kanbanTasks.length };
      const { data } = await supabase.from('kanban_tasks').insert(newTask).select().single();
      if (data) setKanbanTasks(prev => [...prev, data]);
    }
    setTaskModal(null);
  };

  const handleDeleteTask = async (taskId) => {
    if (!supabase) return;
    setKanbanTasks(prev => prev.filter(t => t.id !== taskId));
    await supabase.from('kanban_tasks').delete().eq('id', taskId);
    setTaskModal(null);
  };

  const handleBuildingTaskUpdate = async (taskId, updates) => {
    if (!supabase) return;
    setBuildingTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    await supabase.from('building_tasks').update(updates).eq('id', taskId);
  };

  const isManager = currentUser?.role === 'manager';
  
  const getVisibleTasks = () => {
    let tasks = kanbanTasks;
    if (selectedTaskUser === 'all' || (isManager && selectedTaskUser === null)) return tasks;
    if (selectedTaskUser) return tasks.filter(t => t.assigned_to === selectedTaskUser);
    return tasks.filter(t => t.assigned_to === currentUser?.id);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>;
  if (!currentUser) return <LoginScreen onLogin={() => window.location.reload()} />;

  const visibleTasks = getVisibleTasks();
  const villas = [...new Set(buildingTasks.map(t => t.villa))].filter(Boolean).sort();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ width: '260px', backgroundColor: '#0f172a', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#0d9488', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="leaf" size={22} /></div>
          <div><h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Santi</h1><p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Management</p></div>
        </div>

        <nav style={{ flex: 1 }}>
          <button onClick={() => setActiveNav('taskBoard')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: activeNav === 'taskBoard' ? '#1e293b' : 'transparent', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', fontSize: '14px', textAlign: 'left' }}>
            <Icon name="kanban" size={18} /> Task Board
          </button>
          
          <div>
            <button onClick={() => setExpandedNav(prev => prev.includes('sequence') ? prev.filter(n => n !== 'sequence') : [...prev, 'sequence'])} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'transparent', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icon name="list" size={18} /> Building Sequence</span>
              <Icon name={expandedNav.includes('sequence') ? 'chevronDown' : 'chevronRight'} size={16} />
            </button>
            
            {expandedNav.includes('sequence') && villas.map(villa => (
              <button key={villa} onClick={() => setActiveNav(`sequence-${villa}`)} style={{ width: '100%', padding: '10px 12px 10px 44px', background: activeNav === `sequence-${villa}` ? '#1e293b' : 'transparent', color: activeNav === `sequence-${villa}` ? 'white' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '2px', fontSize: '13px', textAlign: 'left' }}>
                {villa}
              </button>
            ))}
          </div>
        </nav>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#1e293b', borderRadius: '10px' }}>
            <img src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${currentUser.username}`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.username}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{currentUser.role}</p>
            </div>
            <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }} title="Sign out"><Icon name="logout" size={18} /></button>
          </div>
        </div>
      </div>

      <main style={{ flex: 1, backgroundColor: '#f8fafc', overflow: 'auto' }}>
        {activeNav === 'taskBoard' && (
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Task Board</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  {selectedTaskUser === 'all' ? 'All Tasks' : selectedTaskUser ? users.find(u => u.id === selectedTaskUser)?.username + "'s Tasks" : 'My Tasks'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {isManager && (
                  <select value={selectedTaskUser || ''} onChange={(e) => setSelectedTaskUser(e.target.value === '' ? null : e.target.value === 'all' ? 'all' : e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
                    <option value="">My Tasks</option>
                    <option value="all">All Tasks</option>
                    {users.filter(u => u.id !== currentUser.id).map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                  </select>
                )}
                <button onClick={handleNewTask} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '600', background: '#0d9488', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  <Icon name="plus" size={16} /> Add Task
                </button>
              </div>
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
                  onDrop={handleDrop}
                  dragOverColumn={dragOverColumn}
                  setDragOverColumn={setDragOverColumn}
                />
              ))}
            </div>
          </div>
        )}

        {activeNav.startsWith('sequence-') && (
          <BuildingSequence
            tasks={buildingTasks.filter(t => t.villa === activeNav.replace('sequence-', ''))}
            onTaskUpdate={handleBuildingTaskUpdate}
            statusOptions={statusOptions}
          />
        )}
      </main>

      {taskModal && (
        <TaskModal
          task={taskModal}
          onClose={() => setTaskModal(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          users={users}
          columns={columns}
        />
      )}
    </div>
  );
}
