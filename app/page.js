'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============ SUPABASE SETUP (inline - no separate file needed) ============
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

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
    if (!supabase) {
      setError('Database not configured');
      return;
    }
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onLogin();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError('Database not configured');
      return;
    }
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          username: username,
          role: 'worker',
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0D9488&color=fff`
        });
      }
      setMessage('Check your email to confirm your account, then log in.');
      setMode('login');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError('Database not configured');
      return;
    }
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the password reset link.');
      setMode('login');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '12px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0d9488',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d9488' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#0d9488', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px' }}>🌿</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Santi Management</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Sustainable Development</p>
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
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
              No account? <button type="button" onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontWeight: '600' }}>Register</button>
            </p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Please wait...' : 'Create Account'}</button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
              Have an account? <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontWeight: '600' }}>Sign In</button>
            </p>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Please wait...' : 'Send Reset Link'}</button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
              <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#0d9488', cursor: 'pointer', fontWeight: '600' }}>Back to Sign In</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

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

  const statusOptions = ['Done', 'In Progress', 'Ready to start (Supply Chain confirmed on-site)', 'Supply Chain Pending Order', 'Supply Chain Pending Arrival', 'Blocked', 'On Hold'];

  // Check auth on load
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profile) {
            setCurrentUser(profile);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (profile) setCurrentUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (!currentUser || !supabase) return;

    const loadData = async () => {
      try {
        const { data: profilesData } = await supabase.from('profiles').select('*');
        if (profilesData) setUsers(profilesData);

        const { data: buildingData } = await supabase.from('building_tasks').select('*').order('order');
        if (buildingData) setBuildingTasks(buildingData);

        const { data: kanbanData } = await supabase.from('kanban_tasks').select('*').order('order');
        if (kanbanData) setKanbanTasks(kanbanData);
      } catch (err) {
        console.error('Data load error:', err);
      }
    };

    loadData();
  }, [currentUser]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setCurrentUser(null);
      window.location.reload();
    }
  };

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
    if (!draggedTask || !supabase) return;

    const tasksInColumn = visibleTasks.filter(t => t.column === columnId);
    let newOrder = 0;
    
    if (dragOverTaskId) {
      const overTask = tasksInColumn.find(t => t.id === dragOverTaskId);
      if (overTask) {
        newOrder = overTask.order;
      }
    } else {
      newOrder = tasksInColumn.length > 0 ? Math.max(...tasksInColumn.map(t => t.order || 0)) + 1 : 0;
    }

    const updatedTask = { ...draggedTask, column: columnId, order: newOrder };
    
    setKanbanTasks(prev => prev.map(t => t.id === draggedTask.id ? updatedTask : t));
    
    await supabase
      .from('kanban_tasks')
      .update({ column: columnId, order: newOrder })
      .eq('id', draggedTask.id);

    setDraggedTask(null);
    setDragOverColumn(null);
    setDragOverTaskId(null);
  };

  const handleCreateTask = async () => {
    if (!supabase) return;
    
    const newTask = {
      title: 'New Task',
      description: '',
      column: 'today',
      assigned_to: currentUser.id,
      priority: 'medium',
      order: kanbanTasks.length,
      created_by: currentUser.id
    };

    const { data, error } = await supabase.from('kanban_tasks').insert(newTask).select().single();
    if (data) {
      setKanbanTasks(prev => [...prev, data]);
      setTaskModal(data);
    }
  };

  const handleUpdateTask = async (task) => {
    if (!supabase) return;
    
    setKanbanTasks(prev => prev.map(t => t.id === task.id ? task : t));
    await supabase.from('kanban_tasks').update(task).eq('id', task.id);
    setTaskModal(null);
  };

  const handleDeleteTask = async (taskId) => {
    if (!supabase) return;
    
    setKanbanTasks(prev => prev.filter(t => t.id !== taskId));
    await supabase.from('kanban_tasks').delete().eq('id', taskId);
    setTaskModal(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getAssignedUser = (userId) => users.find(u => u.id === userId);

  // ============ RENDER BUILDING SEQUENCE ============
  const renderBuildingSequence = () => {
    return (
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Building Sequence</h2>
        <p style={{ color: '#6b7280' }}>Building sequence tasks will appear here. Add tasks from the database.</p>
        {buildingTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '8px', marginTop: '16px' }}>
            <p style={{ color: '#9ca3af' }}>No building tasks yet</p>
          </div>
        ) : (
          <div style={{ marginTop: '16px' }}>
            {buildingTasks.map(task => (
              <div key={task.id} style={{ padding: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '8px' }}>
                <h3 style={{ fontWeight: '600' }}>{task.building_name}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Step {task.step_number}: {task.task_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============ RENDER KANBAN BOARD ============
  const renderKanbanBoard = () => {
    return (
      <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Task Board</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {isManager && (
              <select
                value={selectedTaskUser || 'all'}
                onChange={(e) => setSelectedTaskUser(e.target.value === 'all' ? null : e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="all">All Users</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            )}
            <button
              onClick={handleCreateTask}
              style={{ padding: '8px 16px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              + New Task
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', flex: 1, overflow: 'auto' }}>
          {columns.map(column => {
            const columnTasks = visibleTasks.filter(t => t.column === column.id);
            return (
              <div
                key={column.id}
                onDragOver={(e) => { e.preventDefault(); setDragOverColumn(column.id); }}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={(e) => handleDrop(e, column.id)}
                style={{
                  backgroundColor: dragOverColumn === column.id ? '#d1fae5' : '#f3f4f6',
                  borderRadius: '8px',
                  padding: '12px',
                  minHeight: '200px',
                  border: dragOverColumn === column.id ? '2px dashed #0d9488' : '2px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{column.title}</h3>
                  <span style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '10px' }}>
                    {columnTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {columnTasks.map(task => {
                    const assignedUser = getAssignedUser(task.assigned_to);
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTask(task)}
                        onDragEnd={() => { setDraggedTask(null); setDragOverColumn(null); setDragOverTaskId(null); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTaskId(task.id); }}
                        onClick={() => setTaskModal(task)}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          padding: '12px',
                          cursor: 'grab',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                          opacity: draggedTask?.id === task.id ? 0.5 : 1,
                          transform: dragOverTaskId === task.id ? 'translateY(4px)' : 'none',
                          transition: 'transform 0.1s'
                        }}
                      >
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>{task.title}</p>
                        {task.description && (
                          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{task.description.substring(0, 50)}...</p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: '#f3f4f6', borderRadius: '4px', color: '#6b7280' }}>
                            {task.priority}
                          </span>
                          {assignedUser && (
                            <img
                              src={assignedUser.avatar_url}
                              alt={assignedUser.username}
                              style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ============ TASK MODAL ============
  const renderTaskModal = () => {
    if (!taskModal) return null;

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Edit Task</h2>
            <button onClick={() => setTaskModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Title</label>
            <input
              type="text"
              value={taskModal.title || ''}
              onChange={(e) => setTaskModal({ ...taskModal, title: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Description</label>
            <textarea
              value={taskModal.description || ''}
              onChange={(e) => setTaskModal({ ...taskModal, description: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Priority</label>
            <select
              value={taskModal.priority || 'medium'}
              onChange={(e) => setTaskModal({ ...taskModal, priority: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Assigned To</label>
            <select
              value={taskModal.assigned_to || ''}
              onChange={(e) => setTaskModal({ ...taskModal, assigned_to: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Column</label>
            <select
              value={taskModal.column || 'today'}
              onChange={(e) => setTaskModal({ ...taskModal, column: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              {columns.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
            <button
              onClick={() => handleDeleteTask(taskModal.id)}
              style={{ padding: '10px 20px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              Delete
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setTaskModal(null)}
                style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateTask(taskModal)}
                style={{ padding: '10px 20px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{ width: '256px', backgroundColor: '#0f172a', color: 'white', padding: '16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#0d9488', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px' }}>🌿</span>
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '600' }}>Santi</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Management</p>
          </div>
        </div>

        <nav>
          <button
            onClick={() => setActiveNav('taskBoard')}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: activeNav === 'taskBoard' ? '#1e293b' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
              marginBottom: '4px',
              fontSize: '14px'
            }}
          >
            📋 Task Board
          </button>

          <div>
            <button
              onClick={() => setExpandedNav(prev => prev.includes('sequence') ? prev.filter(n => n !== 'sequence') : [...prev, 'sequence'])}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
              }}
            >
              <span>🏗️ Building Sequence</span>
              <span>{expandedNav.includes('sequence') ? '▼' : '▶'}</span>
            </button>

            {expandedNav.includes('sequence') && (
              <button
                onClick={() => setActiveNav('buildingSequence')}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  backgroundColor: activeNav === 'buildingSequence' ? '#1e293b' : 'transparent',
                  color: '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  fontSize: '13px'
                }}
              >
                Overview
              </button>
            )}
          </div>
        </nav>

        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <img
              src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${currentUser.username}`}
              alt={currentUser.username}
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '500' }}>{currentUser.username}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>{currentUser.role}</p>
            </div>
            <button
              onClick={handleSignOut}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
              title="Sign out"
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeNav === 'taskBoard' && renderKanbanBoard()}
        {activeNav === 'buildingSequence' && renderBuildingSequence()}
      </div>

      {renderTaskModal()}
    </div>
  );
}
