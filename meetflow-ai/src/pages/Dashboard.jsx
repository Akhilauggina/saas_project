import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const INITIAL_MEETINGS = [
  {
    id: 1,
    title: 'Sprint Planning — Q3 Week 2',
    date: 'Jun 12, 2025',
    duration: '45 min',
    taskCount: 6,
    status: 'done',
    icon: '📋',
    summary:
      'The team discussed sprint goals for Q3 Week 2. Rahul was assigned frontend work, Priya owns testing, and the deployment plan targets Monday after review.',
    transcript:
      "Rahul: Alright everyone, let's get started with sprint planning. We need to finalize the goals for this week.\n\nPriya: Sure. I think Rahul should finish the frontend implementation by Friday. That's the biggest blocker right now.\n\nRahul: Agreed. I'll get that done. Priya, can you handle the testing setup?\n\nPriya: Yes, I'll have the testing environment ready by Sunday.\n\nRahul: Perfect. Let's plan to deploy on Monday after a final code review. Everyone okay with that?\n\nPriya: Works for me. I'll also write the documentation by end of week.\n\nRahul: Great. Let's make sure the design review is done by Wednesday as well.",
  },
  {
    id: 2,
    title: 'Design Review — Landing Page',
    date: 'Jun 10, 2025',
    duration: '30 min',
    taskCount: 4,
    status: 'done',
    icon: '🎨',
    summary: 'A review of the landing page design, focusing on responsiveness, typography, and conversion flow before scheduling dev handoff.',
    transcript: 'Priya: This landing page needs clearer CTAs. Rahul: Agree, we should simplify the hero copy and add trust badges.\n\nTeam: Let’s update the mobile layout and prepare assets for the next sprint.',
  },
  {
    id: 3,
    title: 'Investor Pitch Prep',
    date: 'Jun 9, 2025',
    duration: '60 min',
    taskCount: 8,
    status: 'done',
    icon: '💼',
    summary: 'Pitch deck was polished, audience questions were reviewed, and follow-up actions were assigned to finalize the investor package.',
    transcript: 'Rahul: We need stronger momentum in slide three. Priya: I will tighten the metrics and add the roadmap.\n\nTeam: Prepare answers for projected growth and next milestones.',
  },
  {
    id: 4,
    title: 'Backend Architecture Discussion',
    date: 'Jun 7, 2025',
    duration: '90 min',
    taskCount: 5,
    status: 'done',
    icon: '⚙️',
    summary: 'The architecture was aligned around modular APIs and a new deployment strategy for better performance and reliability.',
    transcript: 'Rahul: We should break the backend into services. Priya: The database indexing needs to be improved.\n\nTeam: Agree on a phased rollout plan and performance checkpoints.',
  },
  {
    id: 5,
    title: 'Marketing Strategy Q3',
    date: 'Jun 5, 2025',
    duration: '40 min',
    taskCount: 7,
    status: 'processing',
    icon: '📢',
    summary: 'Initial marketing campaigns were mapped out with growth targets and follow-up experiments for the next quarter.',
    transcript: 'Rahul: Let’s launch the first campaign with the current creative. Priya: We should A/B test the headline.\n\nTeam: Plan weekly performance reviews and channel adjustments.',
  },
];

const INITIAL_TASKS = [
  { id: 1, meetingId: 1, title: 'Finish frontend implementation', assignee: 'Rahul', deadline: 'Friday, Jun 14', priority: 'high', done: false },
  { id: 2, meetingId: 1, title: 'Set up testing environment', assignee: 'Priya', deadline: 'Sunday, Jun 16', priority: 'medium', done: false },
  { id: 3, meetingId: 1, title: 'Deploy to production server', assignee: 'Rahul', deadline: 'Monday, Jun 17', priority: 'high', done: false },
  { id: 4, meetingId: 1, title: 'Write documentation', assignee: 'Priya', deadline: 'End of week', priority: 'low', done: true },
  { id: 5, meetingId: 1, title: 'Complete design review', assignee: 'Unassigned', deadline: 'Wednesday, Jun 12', priority: 'medium', done: true },
  { id: 6, meetingId: 1, title: 'Final code review before deploy', assignee: 'Rahul', deadline: 'Monday, Jun 17', priority: 'medium', done: false },
  { id: 7, meetingId: 2, title: 'Update hero section colors', assignee: 'Priya', deadline: 'Jun 11', priority: 'high', done: true },
  { id: 8, meetingId: 2, title: 'Add mobile responsiveness', assignee: 'Rahul', deadline: 'Jun 13', priority: 'medium', done: false },
  { id: 9, meetingId: 2, title: 'Review typography choices', assignee: 'Unassigned', deadline: 'No deadline', priority: 'low', done: true },
  { id: 10, meetingId: 3, title: 'Prepare pitch deck slides', assignee: 'Rahul', deadline: 'Jun 15', priority: 'high', done: false },
  { id: 11, meetingId: 3, title: 'Research competitor landscape', assignee: 'Priya', deadline: 'Jun 12', priority: 'medium', done: true },
  { id: 12, meetingId: 3, title: 'Practice pitch delivery', assignee: 'Rahul', deadline: 'Jun 14', priority: 'high', done: false },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  upload: 'Upload Meeting',
  meetings: 'All Meetings',
  tasks: 'All Tasks',
  detail: 'Meeting Detail',
  profile: 'Profile',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [meetingFilter, setMeetingFilter] = useState('all');
  const [taskFilter, setTaskFilter] = useState('all');
  const [selectedMeetingId, setSelectedMeetingId] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [processing, setProcessing] = useState(false);
  const [uploadStep, setUploadStep] = useState('step-upload');
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState('');
  const [toastIsError, setToastIsError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('meetflow_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = localStorage.getItem('meetflow_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error(err);
      }
    }

    const loadProfile = async () => {
      try {
        const response = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          localStorage.setItem('meetflow_user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleLogout = () => {
    localStorage.removeItem('meetflow_token');
    localStorage.removeItem('meetflow_user');
    navigate('/login');
  };

  const showToast = (message, isError = false) => {
    setToast(message);
    setToastIsError(isError);
  };

  const filteredDashboardMeetings = useMemo(() => {
    if (!searchQuery.trim()) return meetings.slice(0, 3);
    const query = searchQuery.toLowerCase();
    return meetings.filter((meeting) => meeting.title.toLowerCase().includes(query));
  }, [meetings, searchQuery]);

  const filteredMeetings = useMemo(() => {
    if (meetingFilter === 'done') return meetings.filter((meeting) => meeting.status === 'done');
    if (meetingFilter === 'processing') return meetings.filter((meeting) => meeting.status === 'processing');
    return meetings;
  }, [meetings, meetingFilter]);

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'pending') return tasks.filter((task) => !task.done);
    if (taskFilter === 'done') return tasks.filter((task) => task.done);
    if (taskFilter === 'high') return tasks.filter((task) => task.priority === 'high');
    if (taskFilter === 'medium') return tasks.filter((task) => task.priority === 'medium');
    return tasks;
  }, [tasks, taskFilter]);

  const selectedMeeting = meetings.find((meeting) => meeting.id === selectedMeetingId) || meetings[0];
  const detailTasks = tasks.filter((task) => task.meetingId === selectedMeeting?.id);
  const pendingTasks = tasks.filter((task) => !task.done).length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const meetingCard = (meeting) => (
    <div
      key={meeting.id}
      className="meeting-card"
      onClick={() => {
        setSelectedMeetingId(meeting.id);
        handlePageChange('detail');
      }}
    >
      <div className="meeting-icon">{meeting.icon}</div>
      <div className="meeting-info">
        <div className="meeting-title">{meeting.title}</div>
        <div className="meeting-meta">
          <span>📅 {meeting.date}</span>
          <span>⏱ {meeting.duration}</span>
        </div>
      </div>
      <div className={`meeting-status ${meeting.status === 'done' ? 'status-done' : 'status-processing'}`}>
        <span className="status-dot" />
        {meeting.status === 'done' ? 'Done' : 'Processing'}
      </div>
      <div className="meeting-task-count">
        <strong>{meeting.taskCount}</strong>
        tasks
      </div>
    </div>
  );

  const taskCard = (task, showMeeting = false) => {
    const priorityClass = task.priority === 'high' ? 'chip-high' : task.priority === 'medium' ? 'chip-medium' : 'chip-low';
    const meeting = meetings.find((meetingItem) => meetingItem.id === task.meetingId);
    return (
      <div key={task.id} className={`task-card ${task.done ? 'done' : ''}`} id={`task-${task.id}`}>
        <div className={`task-checkbox ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)} />
        <div className="task-body">
          <div className="task-title-text">{task.title}</div>
          <div className="task-chips">
            <span className="chip chip-assignee">👤 {task.assignee}</span>
            <span className="chip chip-deadline">📅 {task.deadline}</span>
            <span className={`chip ${priorityClass}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            {showMeeting && meeting ? (
              <span className="chip" style={{ background: '#161929', color: '#94a1c4', border: '1px solid rgba(255,255,255,0.08)' }}>
                {meeting.title}
              </span>
            ) : null}
          </div>
        </div>
        <div className="task-actions">
          <button className="task-action-btn del" type="button" onClick={() => deleteTask(task.id)} title="Delete">
            🗑
          </button>
        </div>
      </div>
    );
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    setSidebarOpen(false);
    setSearchQuery('');
  };

  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
    showToast('Task updated');
  };

  const deleteTask = (id) => {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
    showToast('Task deleted');
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  };

  const setFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['mp3', 'mp4', 'wav', 'm4a'].includes(ext)) {
      showToast('Please upload MP3, MP4, WAV or M4A only', true);
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragging');
  };

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove('dragging');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragging');
    const file = event.dataTransfer.files?.[0];
    if (file) setFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    const input = document.getElementById('file-input');
    if (input) input.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('Please select an audio file first', true);
      return;
    }
    if (!uploadTitle.trim()) {
      showToast('Please enter a meeting title', true);
      return;
    }

    setProcessing(true);
    setProgress(0);
    setUploadStep('step-upload');

    const steps = [
      { id: 'step-upload', title: 'Uploading to cloud…', progress: 20, delay: 1000 },
      { id: 'step-transcribe', title: 'Whisper is transcribing…', progress: 55, delay: 2200 },
      { id: 'step-extract', title: 'GPT-4o extracting tasks…', progress: 80, delay: 2000 },
      { id: 'step-save', title: 'Saving to your dashboard…', progress: 100, delay: 800 },
    ];

    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      setUploadStep(step.id);
      setProgress(step.progress);
      await new Promise((resolve) => setTimeout(resolve, step.delay));
    }

    const nextMeetingId = Math.max(0, ...meetings.map((meeting) => meeting.id)) + 1;
    const nextTaskId = Math.max(0, ...tasks.map((task) => task.id)) + 1;
    const newMeeting = {
      id: nextMeetingId,
      title: uploadTitle,
      date: 'Today',
      duration: '—',
      taskCount: 3,
      status: 'done',
      icon: '🆕',
      summary: 'A new meeting was uploaded and processed automatically. Tasks were extracted from the recording and added to your workspace.',
      transcript: `Uploaded meeting file: ${selectedFile.name}\nThis meeting transcript is not available in the demo view.`,
    };
    const newTasks = [
      { id: nextTaskId, meetingId: nextMeetingId, title: 'Complete action item from new meeting', assignee: 'You', deadline: 'This week', priority: 'high', done: false },
      { id: nextTaskId + 1, meetingId: nextMeetingId, title: 'Follow up on discussion points', assignee: 'Team', deadline: 'No deadline', priority: 'medium', done: false },
      { id: nextTaskId + 2, meetingId: nextMeetingId, title: 'Send summary to stakeholders', assignee: 'You', deadline: 'Today', priority: 'high', done: false },
    ];

    setMeetings((previous) => [newMeeting, ...previous]);
    setTasks((previous) => [...newTasks, ...previous]);

    showToast('Tasks extracted successfully!');
    setTimeout(() => {
      setProcessing(false);
      setSelectedFile(null);
      setUploadTitle('');
      setProgress(0);
      setUploadStep('step-upload');
      removeFile();
      setSelectedMeetingId(nextMeetingId);
      handlePageChange('detail');
    }, 600);
  };

  const exportCSV = () => {
    if (!selectedMeeting) return;
    const rows = [['Title', 'Assignee', 'Deadline', 'Priority', 'Status']];
    detailTasks.forEach((task) => {
      rows.push([task.title, task.assignee, task.deadline, task.priority, task.done ? 'Done' : 'Pending']);
    });
    const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'meeting-tasks.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('CSV exported!');
  };

  const copyTranscript = async () => {
    if (!selectedMeeting) return;
    try {
      await navigator.clipboard.writeText(selectedMeeting.transcript || '');
      showToast('Transcript copied!');
    } catch (err) {
      showToast('Unable to copy transcript', true);
    }
  };

  if (loading) {
    return (
      <section className="dashboard-page">
        <div className="content">
          <p style={{ color: '#d2d7f1' }}>Loading dashboard…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-page">
      <div className="sidebar-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
        ☰
      </div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" onClick={() => handlePageChange('dashboard')}>
          <div className="logo-dot" />
          <span className="logo-text">MeetSync AI</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Workspace</div>
          {['dashboard', 'upload', 'meetings', 'tasks'].map((item) => (
            <div
              key={item}
              className={`nav-item ${activePage === item ? 'active' : ''}`}
              onClick={() => handlePageChange(item)}
            >
              <span className="nav-icon">⬛</span>
              {PAGE_TITLES[item]}
              {item === 'tasks' ? <span className="nav-badge">{pendingTasks}</span> : null}
            </div>
          ))}
          <div className="nav-section-label">Account</div>
          <div className={`nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => handlePageChange('profile')}>
            <span className="nav-icon">⬛</span>
            Profile
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
          <div>
            <div className="user-name">{user?.name || 'Rahul Sharma'}</div>
            <div className="user-plan">Free Plan</div>
          </div>
          <button className="logout-btn" type="button" title="Logout" onClick={handleLogout}>
            ⏻
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-title">{PAGE_TITLES[activePage]}</div>
          <div className="topbar-right">
            <input
              className="topbar-search"
              placeholder="🔍  Search meetings…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onInput={(event) => setSearchQuery(event.target.value)}
            />
            <button className="topbar-btn" type="button" onClick={() => handlePageChange('upload')}>
              + Upload Meeting
            </button>
          </div>
        </div>

        <div className="content">
          <div id="page-dashboard" className={`page ${activePage === 'dashboard' ? 'active' : ''}`}>
            <div className="metrics">
              <div className="metric-card" style={{ '--glow-color': 'rgba(124,92,252,.15)' }}>
                <div className="metric-label">Total Meetings</div>
                <div className="metric-val" style={{ color: '#a78bfa' }}>{meetings.length}</div>
                <div className="metric-sub"><span>+3</span> this week</div>
              </div>
              <div className="metric-card" style={{ '--glow-color': 'rgba(6,182,212,.12)' }}>
                <div className="metric-label">Tasks Extracted</div>
                <div className="metric-val" style={{ color: '#38bdf8' }}>{tasks.length}</div>
                <div className="metric-sub"><span>+11</span> this week</div>
              </div>
              <div className="metric-card" style={{ '--glow-color': 'rgba(245,158,11,.1)' }}>
                <div className="metric-label">Pending Tasks</div>
                <div className="metric-val" style={{ color: '#f59e0b' }}>{pendingTasks}</div>
                <div className="metric-sub">across {new Set(tasks.filter((task) => !task.done).map((task) => task.meetingId)).size} meetings</div>
              </div>
              <div className="metric-card" style={{ '--glow-color': 'rgba(16,212,160,.1)' }}>
                <div className="metric-label">Completed</div>
                <div className="metric-val" style={{ color: '#10d4a0' }}>{completedTasks}</div>
                <div className="metric-sub"><span>{completionRate}%</span> completion rate</div>
              </div>
            </div>

            <div className="sec-hdr">
              <div className="sec-title">Recent Meetings</div>
              <div className="sec-link" onClick={() => handlePageChange('meetings')}>View all →</div>
            </div>
            <div className="meetings-list">
              {filteredDashboardMeetings.length > 0 ? (
                filteredDashboardMeetings.map(meetingCard)
              ) : (
                <div className="empty">
                  <div className="empty-icon">🔍</div>
                  <div className="empty-title">No meetings found</div>
                </div>
              )}
            </div>

            <div className="sec-hdr" style={{ marginTop: 32 }}>
              <div className="sec-title">Recent Tasks</div>
              <div className="sec-link" onClick={() => handlePageChange('tasks')}>View all →</div>
            </div>
            <div className="task-grid">
              {tasks.filter((task) => !task.done).slice(0, 4).map((task) => taskCard(task))}
            </div>
          </div>

          <div id="page-upload" className={`page ${activePage === 'upload' ? 'active' : ''}`}>
            <div className="upload-wrap">
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: '0.78rem', color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  New Meeting
                </div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
                  Upload & Extract Tasks
                </div>
                <div style={{ color: '#94a1c4', fontSize: '0.92rem', marginTop: 6, fontWeight: 300 }}>
                  Upload your meeting recording and AI will transcribe and extract all action items automatically.
                </div>
              </div>

              <div
                className={`upload-zone ${processing ? 'disabled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <div className="upload-icon">🎙️</div>
                <div className="upload-title">Drop your meeting file here</div>
                <div className="upload-sub">or click to browse files from your device</div>
                <div className="upload-formats">
                  <span className="format-tag">.mp3</span>
                  <span className="format-tag">.mp4</span>
                  <span className="format-tag">.wav</span>
                  <span className="format-tag">.m4a</span>
                  <span className="format-tag">max 25 MB</span>
                </div>
                <button
                  className="upload-btn-file"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    document.getElementById('file-input')?.click();
                  }}
                >
                  Browse Files
                </button>
                <input id="file-input" className="file-input-hidden" type="file" accept=".mp3,.mp4,.wav,.m4a" onChange={handleFileSelect} />
              </div>

              <div className={`file-preview ${selectedFile ? 'show' : ''}`}>
                <div className="file-icon">{selectedFile?.name?.split('.').pop()?.toLowerCase() === 'mp4' ? '🎬' : '🎵'}</div>
                <div>
                  <div className="file-name">{selectedFile?.name || 'filename.mp3'}</div>
                  <div className="file-size">{selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '0 MB'}</div>
                </div>
                <div className="remove-file" onClick={removeFile}>✕</div>
              </div>

              <div className="upload-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="meeting-title">Meeting Title</label>
                  <input
                    className="form-input"
                    id="meeting-title"
                    type="text"
                    placeholder="e.g. Sprint Planning Q3 — Week 2"
                    value={uploadTitle}
                    onChange={(event) => setUploadTitle(event.target.value)}
                  />
                </div>
                <button className="upload-submit" type="button" disabled={processing} onClick={handleUpload}>
                  <span>🚀</span> Process with AI
                </button>
              </div>

              <div className={`processing-overlay ${processing ? 'show' : ''}`}>
                <div className="spinner" />
                <div className="processing-title">{uploadStep === 'step-upload' ? 'Uploading your file…' : uploadStep === 'step-transcribe' ? 'Transcribing audio…' : uploadStep === 'step-extract' ? 'Extracting tasks…' : 'Saving results…'}</div>
                <div className="processing-sub">This usually takes 30–60 seconds</div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <div className="processing-steps">
                  <div className={`proc-step ${uploadStep === 'step-upload' ? 'active' : uploadStep !== 'step-upload' ? 'done' : ''}`}>
                    <div className="proc-step-dot" /> Uploading to cloud storage
                  </div>
                  <div className={`proc-step ${uploadStep === 'step-transcribe' ? 'active' : ['step-extract', 'step-save'].includes(uploadStep) ? 'done' : ''}`}>
                    <div className="proc-step-dot" /> Transcribing speech with Whisper AI
                  </div>
                  <div className={`proc-step ${uploadStep === 'step-extract' ? 'active' : uploadStep === 'step-save' ? 'done' : ''}`}>
                    <div className="proc-step-dot" /> Extracting tasks with GPT-4o
                  </div>
                  <div className={`proc-step ${uploadStep === 'step-save' ? 'active' : ''}`}>
                    <div className="proc-step-dot" /> Saving results to dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="page-meetings" className={`page ${activePage === 'meetings' ? 'active' : ''}`}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div className="dashboard-section-title">All Meetings</div>
                <div className="dashboard-section-sub">{meetings.length} meetings · {tasks.length} tasks extracted</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="form-input" style={{ width: 'auto', padding: '10px 14px', fontSize: '0.88rem' }} value={meetingFilter} onChange={(event) => setMeetingFilter(event.target.value)}>
                  <option value="all">All Status</option>
                  <option value="done">Completed</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
            </div>
            <div className="meetings-list">
              {filteredMeetings.map(meetingCard)}
            </div>
          </div>

          <div id="page-tasks" className={`page ${activePage === 'tasks' ? 'active' : ''}`}>
            <div style={{ marginBottom: 24 }}>
              <div className="dashboard-section-title">All Tasks</div>
              <div className="dashboard-section-sub">{tasks.length} tasks across {meetings.length} meetings</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {[
                { key: 'all', label: `All (${tasks.length})` },
                { key: 'pending', label: `Pending (${pendingTasks})` },
                { key: 'done', label: `Done (${completedTasks})` },
                { key: 'high', label: '🔴 High Priority' },
                { key: 'medium', label: '🟡 Medium' },
              ].map((filter) => (
                <button key={filter.key} className={`filter-btn ${taskFilter === filter.key ? 'active' : ''}`} type="button" onClick={() => setTaskFilter(filter.key)}>
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="task-grid">
              {filteredTasks.length > 0 ? filteredTasks.map((task) => taskCard(task, true)) : (
                <div className="empty">
                  <div className="empty-icon">✅</div>
                  <div className="empty-title">No tasks here</div>
                  <div className="empty-sub">Try a different filter</div>
                </div>
              )}
            </div>
          </div>

          <div id="page-detail" className={`page ${activePage === 'detail' ? 'active' : ''}`}>
            <div className="detail-back" onClick={() => handlePageChange('meetings')}>← Back to Meetings</div>
            <div className="detail-header">
              <div className="detail-title">{selectedMeeting?.title}</div>
              <div className="detail-meta">
                <span>📅 {selectedMeeting?.date}</span>
                <span>⏱ {selectedMeeting?.duration}</span>
                <span>🎯 {selectedMeeting?.taskCount} tasks extracted</span>
                <span className={`meeting-status ${selectedMeeting?.status === 'done' ? 'status-done' : 'status-processing'}`}>
                  <span className="status-dot" /> {selectedMeeting?.status === 'done' ? 'Completed' : 'Processing'}
                </span>
              </div>
              <div className="summary-card">
                <div className="summary-label">AI Summary</div>
                <div className="summary-text">{selectedMeeting?.summary}</div>
              </div>
            </div>

            <div className="transcript-card">
              <div className="transcript-header">
                <div className="sec-title">📄 Full Transcript</div>
                <button className="export-btn" type="button" onClick={copyTranscript}>📋 Copy</button>
              </div>
              <div className="transcript-body">
                {selectedMeeting?.transcript.split('\n').map((line, index) => (
                  <p key={index} style={{ margin: '0 0 12px' }}>{line}</p>
                ))}
              </div>
            </div>

            <div className="tasks-panel">
              <div className="tasks-panel-header">
                <div className="sec-title">✅ Extracted Tasks <span style={{ color: '#94a1c4', fontWeight: 400, fontSize: '0.85rem' }}>({detailTasks.length})</span></div>
                <button className="export-btn" type="button" onClick={exportCSV}>⬇ Export CSV</button>
              </div>
              <div className="tasks-panel-body">
                <div className="task-grid">
                  {detailTasks.length > 0 ? detailTasks.map((task) => taskCard(task)) : (
                    <div className="empty">
                      <div className="empty-icon">✅</div>
                      <div className="empty-title">No tasks found</div>
                      <div className="empty-sub">This meeting has no extracted tasks yet.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div id="page-profile" className={`page ${activePage === 'profile' ? 'active' : ''}`}>
            <div style={{ maxWidth: 480 }}>
              <div className="dashboard-section-title" style={{ marginBottom: 24 }}>Profile Settings</div>
              <div style={{ background: '#161929', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 28, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 20, background: 'linear-gradient(135deg,#7c5cfc,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.3rem', color: '#fff' }}>
                    {user?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '1.1rem' }}>{user?.name || 'Rahul Sharma'}</div>
                    <div style={{ fontSize: '0.82rem', color: '#94a1c4' }}>{user?.email || 'rahul@example.com'} · Free Plan</div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" defaultValue={user?.name || 'Rahul Sharma'} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" defaultValue={user?.email || 'rahul@example.com'} type="email" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" placeholder="Leave blank to keep current" />
                </div>
                <button className="upload-submit" style={{ marginTop: 8 }} type="button" onClick={() => showToast('Profile updated successfully!')}>Save Changes</button>
              </div>
              <div style={{ background: 'rgba(248,113,113,.06)', border: '1px solid rgba(248,113,113,.15)', borderRadius: 16, padding: 22 }}>
                <div style={{ fontWeight: 500, color: '#f87171', marginBottom: 6, fontSize: '0.9rem' }}>Danger Zone</div>
                <div style={{ fontSize: '0.84rem', color: '#94a1c4', marginBottom: 14 }}>Permanently delete your account and all data.</div>
                <button style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.2)', color: '#f87171', padding: '10px 18px', borderRadius: 12, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} type="button">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className={`toast ${toast ? 'show' : ''}`} style={{ background: toastIsError ? 'rgba(248, 113, 113, 0.95)' : undefined }}>
        <div className="toast-dot" style={{ background: toastIsError ? '#f87171' : '#10d4a0' }} />
        <span>{toast || 'Done!'}</span>
      </div>
    </section>
  );
}
