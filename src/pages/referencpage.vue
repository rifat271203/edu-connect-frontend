<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EduConnect — Learn Together</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;1,300&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0c10;
    --surface: #10141c;
    --surface2: #161c28;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.14);
    --text: #e8ecf4;
    --text-muted: #6b7691;
    --text-dim: #3d4660;
    --accent: #c8a96e;
    --accent-soft: rgba(200,169,110,0.12);
    --accent-glow: rgba(200,169,110,0.25);
    --blue: #4b8bff;
    --blue-soft: rgba(75,139,255,0.1);
    --green: #3ecf8e;
    --green-soft: rgba(62,207,142,0.1);
    --radius: 16px;
    --radius-sm: 10px;
    --sidebar: 240px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Ambient background */
  body::before {
    content: '';
    position: fixed;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 600px;
    background: radial-gradient(ellipse, rgba(200,169,110,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    position: fixed;
    top: 0; left: 0;
    width: var(--sidebar);
    height: 100vh;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 0;
    z-index: 100;
  }

  .logo-wrap {
    padding: 28px 24px 24px;
    border-bottom: 1px solid var(--border);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--accent), #a07840);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Fraunces', serif;
    font-size: 17px;
    color: #0a0c10;
    font-weight: 700;
    flex-shrink: 0;
  }

  .logo-text {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.3px;
  }

  /* Search in sidebar */
  .sidebar-search {
    padding: 20px 16px 12px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-search label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 10px;
  }

  .search-input-wrap {
    position: relative;
  }

  .search-input-wrap svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 9px 10px 9px 32px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--text-dim); }

  .role-select {
    width: 100%;
    margin-top: 8px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 9px 10px;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    appearance: none;
  }

  /* Nav */
  nav {
    padding: 16px 12px;
    flex: 1;
    overflow-y: auto;
  }

  .nav-section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-dim);
    padding: 0 8px;
    margin-bottom: 6px;
    margin-top: 16px;
  }

  .nav-section-label:first-child { margin-top: 0; }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.18s;
    border: 1px solid transparent;
    margin-bottom: 2px;
    position: relative;
  }

  .nav-item:hover {
    background: var(--surface2);
    color: var(--text);
    border-color: var(--border);
  }

  .nav-item.active {
    background: var(--accent-soft);
    color: var(--accent);
    border-color: rgba(200,169,110,0.2);
  }

  .nav-item svg { flex-shrink: 0; }

  .nav-badge {
    margin-left: auto;
    background: var(--accent);
    color: #0a0c10;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 20px;
    min-width: 18px;
    text-align: center;
  }

  /* User at bottom */
  .sidebar-user {
    padding: 16px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .user-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3a5a9a, #1a3060);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #7fa8ff;
    border: 2px solid var(--border-hover);
    flex-shrink: 0;
    overflow: hidden;
  }

  .user-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .user-info { flex: 1; min-width: 0; }
  .user-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-handle {
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── MAIN LAYOUT ── */
  .layout {
    margin-left: var(--sidebar);
    display: grid;
    grid-template-columns: 1fr 300px;
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  /* ── FEED ── */
  .feed {
    padding: 36px 32px;
    border-right: 1px solid var(--border);
    max-width: 740px;
  }

  .page-header {
    margin-bottom: 32px;
  }

  .page-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 32px;
    font-weight: 500;
    letter-spacing: -0.8px;
    color: var(--text);
    line-height: 1.15;
  }

  .page-header h1 em {
    font-style: italic;
    color: var(--accent);
  }

  .page-header p {
    margin-top: 6px;
    font-size: 14px;
    color: var(--text-muted);
  }

  /* Compose box */
  .compose-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 28px;
    transition: border-color 0.2s;
  }

  .compose-box:hover { border-color: var(--border-hover); }

  .compose-top {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .compose-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3a5a9a, #1a3060);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    font-weight: 600;
    color: #7fa8ff;
    border: 2px solid var(--border-hover);
    flex-shrink: 0;
  }

  .compose-input {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 13px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    resize: none;
    min-height: 52px;
    transition: border-color 0.2s;
  }

  .compose-input:focus { border-color: var(--accent); }
  .compose-input::placeholder { color: var(--text-dim); }

  .compose-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .compose-action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.18s;
  }

  .compose-action-btn:hover {
    background: var(--surface2);
    color: var(--text);
    border-color: var(--border-hover);
  }

  .post-btn {
    background: var(--accent);
    color: #0a0c10;
    border: none;
    padding: 9px 22px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    letter-spacing: 0.2px;
  }

  .post-btn:hover { background: #d4b87c; transform: translateY(-1px); }

  /* Section header */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 18px;
  }

  .section-title {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.3px;
  }

  .section-sub {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .refresh-btn {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 12px;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .refresh-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* Course card */
  .course-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 20px;
    transition: all 0.22s;
    cursor: pointer;
  }

  .course-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .card-header {
    padding: 18px 20px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .card-author {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .teacher-avatar {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1a3a6e, #0d2044);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #6699ff;
    border: 1.5px solid rgba(75,139,255,0.3);
    flex-shrink: 0;
  }

  .author-details { flex: 1; }

  .author-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .author-meta {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 1px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    flex-shrink: 0;
  }

  .status-pill.active {
    background: var(--green-soft);
    color: var(--green);
    border: 1px solid rgba(62,207,142,0.2);
  }

  .status-pill::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .course-title {
    padding: 0 20px 14px;
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.4px;
  }

  .course-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    background: linear-gradient(135deg, #0d1a3a 0%, #1a3060 50%, #0a1525 100%);
    position: relative;
  }

  .course-image-placeholder {
    height: 220px;
    background: linear-gradient(135deg, #0d1a3a 0%, #142850 40%, #0a1525 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fraunces', serif;
    font-size: 38px;
    font-weight: 300;
    color: rgba(200,169,110,0.3);
    letter-spacing: -1px;
    position: relative;
    overflow: hidden;
  }

  .course-image-placeholder::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(200,169,110,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 30%, rgba(75,139,255,0.06) 0%, transparent 50%);
  }

  .math-bg {
    position: absolute;
    inset: 0;
    opacity: 0.06;
    font-size: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    font-style: italic;
  }

  .course-label {
    position: absolute;
    bottom: 14px;
    left: 14px;
    background: rgba(10,12,16,0.85);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border-hover);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .card-footer {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--border);
  }

  .card-stats {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .card-stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .card-actions-group {
    display: flex;
    gap: 8px;
  }

  .card-action {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 12px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.18s;
  }

  .card-action:hover {
    background: var(--surface2);
    color: var(--text);
    border-color: var(--border-hover);
  }

  .enroll-btn {
    background: var(--blue-soft);
    color: var(--blue);
    border-color: rgba(75,139,255,0.25);
    font-weight: 500;
  }

  .enroll-btn:hover {
    background: rgba(75,139,255,0.2) !important;
    color: #7aaaff !important;
    border-color: rgba(75,139,255,0.4) !important;
  }

  /* second card variation */
  .card-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 9px;
    background: var(--accent-soft);
    border: 1px solid rgba(200,169,110,0.2);
    border-radius: 6px;
    font-size: 11px;
    color: var(--accent);
    font-weight: 500;
    margin: 0 20px 14px;
  }

  /* ── RIGHT PANEL ── */
  .right-panel {
    padding: 36px 24px;
  }

  .panel-section {
    margin-bottom: 32px;
  }

  .panel-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panel-title-action {
    font-size: 11px;
    color: var(--accent);
    cursor: pointer;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
  }

  /* Activity item */
  .activity-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }

  .activity-item:last-child { border-bottom: none; }

  .activity-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3a2a6e, #1a1040);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #a07af0;
    flex-shrink: 0;
    border: 1.5px solid rgba(160,122,240,0.25);
  }

  .activity-text { flex: 1; }

  .activity-name {
    font-size: 13px;
    color: var(--text);
    font-weight: 500;
    line-height: 1.4;
  }

  .activity-name span { color: var(--text-muted); font-weight: 400; }

  .activity-time {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 2px;
  }

  /* Popular course widget */
  .popular-course {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px;
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.18s;
  }

  .popular-course:hover {
    border-color: var(--border-hover);
    background: var(--surface2);
  }

  .popular-course-thumb {
    width: 48px; height: 48px;
    border-radius: 10px;
    background: linear-gradient(135deg, #0d1a3a, #1a3060);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    border: 1px solid var(--border-hover);
  }

  .popular-course-info { flex: 1; min-width: 0; }

  .popular-course-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .popular-course-meta {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .popular-course-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3px;
    flex-shrink: 0;
  }

  .badge-active {
    background: var(--green-soft);
    color: var(--green);
    border: 1px solid rgba(62,207,142,0.2);
  }

  /* Stats row */
  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px;
  }

  .stat-value {
    font-family: 'Fraunces', serif;
    font-size: 24px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.5px;
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .stat-change {
    font-size: 11px;
    color: var(--green);
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  /* Top header bar */
  .topbar {
    display: none;
  }

  /* Scroll animations */
  .course-card {
    animation: cardIn 0.4s ease both;
  }

  .course-card:nth-child(1) { animation-delay: 0.1s; }
  .course-card:nth-child(2) { animation-delay: 0.2s; }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .compose-box {
    animation: cardIn 0.3s ease both;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 24px 0;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 10px; }

</style>
</head>
<body>

<!-- SIDEBAR -->
<aside class="sidebar">
  <div class="logo-wrap">
    <a href="#" class="logo">
      <div class="logo-mark">E</div>
      <span class="logo-text">EduConnect</span>
    </a>
  </div>

  <div class="sidebar-search">
    <label>Find Users</label>
    <div class="search-input-wrap">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input class="search-input" type="text" placeholder="Search users...">
    </div>
    <select class="role-select">
      <option>All roles</option>
      <option>Students</option>
      <option>Teachers</option>
    </select>
  </div>

  <nav>
    <div class="nav-section-label">Main</div>
    <a class="nav-item active" href="#">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      Home
    </a>
    <a class="nav-item" href="#">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      Classroom
      <span class="nav-badge">3</span>
    </a>
    <a class="nav-item" href="#">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
      AI Tutor
    </a>

    <div class="nav-section-label">Account</div>
    <a class="nav-item" href="#">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
      Profile
    </a>
    <a class="nav-item" href="#">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      Messages
      <span class="nav-badge">2</span>
    </a>
    <a class="nav-item" href="#">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
      Settings
    </a>
  </nav>

  <div class="sidebar-user">
    <div class="user-avatar">TH</div>
    <div class="user-info">
      <div class="user-name">Tanjid Hosen</div>
      <div class="user-handle">@tanjidhosenri...</div>
    </div>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--text-dim)">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </div>
</aside>

<!-- MAIN -->
<div class="layout">

  <!-- FEED -->
  <main class="feed">
    <div class="page-header">
      <h1>Good morning, <em>Tanjid</em> ✦</h1>
      <p>See what your classmates are up to today</p>
    </div>

    <!-- Compose -->
    <div class="compose-box">
      <div class="compose-top">
        <div class="compose-avatar">TH</div>
        <textarea class="compose-input" placeholder="Share something with your class…" rows="2"></textarea>
      </div>
      <div class="compose-actions">
        <button class="compose-action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          Photo / Video
        </button>
        <button class="post-btn">Publish Post</button>
      </div>
    </div>

    <!-- Section header -->
    <div class="section-header">
      <div>
        <div class="section-title">Course Feed</div>
        <div class="section-sub">Teacher-created courses available for enrollment</div>
      </div>
      <button class="refresh-btn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Course Card 1 -->
    <div class="course-card">
      <div class="card-header">
        <div class="card-author">
          <div class="teacher-avatar">TE</div>
          <div class="author-details">
            <div class="author-name">Teacher</div>
            <div class="author-meta">@teacher &middot; 5 days ago</div>
          </div>
        </div>
        <span class="status-pill active">Active</span>
      </div>

      <div class="course-title">Higher Math</div>
      <div class="card-tag">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        HSC · One Short Course
      </div>

      <!-- Image placeholder with math feel -->
      <div class="course-image-placeholder" style="position:relative;">
        <div class="math-bg" style="font-family:'Fraunces',serif;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:100px;opacity:0.05;color:var(--accent);">∑</div>
        <div style="position:relative;z-index:1;text-align:center;">
          <div style="font-size:48px;margin-bottom:8px;">📐</div>
          <div style="font-family:'Fraunces',serif;font-size:28px;color:var(--accent);font-weight:500;letter-spacing:-0.5px;">HSC Math</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">a² + b² = c² &nbsp;·&nbsp; x = −b ± √(b²−4ac) / 2a</div>
        </div>
        <div class="course-label">One Short Course</div>
      </div>

      <div class="card-footer">
        <div class="card-stats">
          <div class="card-stat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            0 members
          </div>
          <div class="card-stat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            124 views
          </div>
        </div>
        <div class="card-actions-group">
          <button class="card-action">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Like
          </button>
          <button class="card-action">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Comment
          </button>
          <button class="card-action enroll-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            Enroll
          </button>
        </div>
      </div>
    </div>

    <!-- Course Card 2 -->
    <div class="course-card">
      <div class="card-header">
        <div class="card-author">
          <div class="teacher-avatar" style="background:linear-gradient(135deg,#1a3a2e,#0a2018);color:#3ecf8e;border-color:rgba(62,207,142,0.3);">MR</div>
          <div class="author-details">
            <div class="author-name">Ms. Rahman</div>
            <div class="author-meta">@msrahman &middot; 2 days ago</div>
          </div>
        </div>
        <span class="status-pill active">Active</span>
      </div>

      <div class="course-title">English Literature & Composition</div>
      <div class="card-tag" style="background:rgba(75,139,255,0.1);border-color:rgba(75,139,255,0.2);color:var(--blue);">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        SSC · Full Course
      </div>

      <div class="course-image-placeholder" style="background:linear-gradient(135deg,#0a1a2e 0%,#0e2240 50%,#061018 100%);">
        <div style="position:relative;z-index:1;text-align:center;">
          <div style="font-size:48px;margin-bottom:8px;">📚</div>
          <div style="font-family:'Fraunces',serif;font-size:28px;color:#7aaaff;font-weight:500;letter-spacing:-0.5px;">English Lit.</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">Literature &nbsp;·&nbsp; Grammar &nbsp;·&nbsp; Composition</div>
        </div>
        <div class="course-label" style="color:#7aaaff;">Full Course</div>
      </div>

      <div class="card-footer">
        <div class="card-stats">
          <div class="card-stat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            12 members
          </div>
          <div class="card-stat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            89 views
          </div>
        </div>
        <div class="card-actions-group">
          <button class="card-action">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Like
          </button>
          <button class="card-action">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Comment
          </button>
          <button class="card-action enroll-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            Enroll
          </button>
        </div>
      </div>
    </div>

  </main>

  <!-- RIGHT PANEL -->
  <aside class="right-panel">

    <!-- Quick stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">3</div>
        <div class="stat-label">Enrolled</div>
        <div class="stat-change">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
          +1 this week
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-value">68%</div>
        <div class="stat-label">Completion</div>
        <div class="stat-change">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
          +12% avg
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="panel-section">
      <div class="panel-title">
        Recent Activity
        <span class="panel-title-action">Mark all read</span>
      </div>

      <div class="activity-item">
        <div class="activity-avatar">RM</div>
        <div class="activity-text">
          <div class="activity-name">Rafin Mahmud <span>liked your post</span></div>
          <div class="activity-time">5 days ago</div>
        </div>
      </div>

      <div class="activity-item">
        <div class="activity-avatar" style="background:linear-gradient(135deg,#1a3a2e,#0a2018);color:#3ecf8e;border-color:rgba(62,207,142,0.25);">AK</div>
        <div class="activity-text">
          <div class="activity-name">Anika Khan <span>enrolled in Higher Math</span></div>
          <div class="activity-time">3 days ago</div>
        </div>
      </div>

      <div class="activity-item">
        <div class="activity-avatar" style="background:linear-gradient(135deg,#1a2a3e,#0a1825);color:#4b8bff;border-color:rgba(75,139,255,0.25);">TE</div>
        <div class="activity-text">
          <div class="activity-name">Teacher <span>posted a new assignment</span></div>
          <div class="activity-time">1 day ago</div>
        </div>
      </div>
    </div>

    <!-- Popular courses -->
    <div class="panel-section">
      <div class="panel-title">
        Popular Courses
        <span class="panel-title-action" onclick="">Refresh</span>
      </div>

      <div class="popular-course">
        <div class="popular-course-thumb">📐</div>
        <div class="popular-course-info">
          <div class="popular-course-name">Higher Math</div>
          <div class="popular-course-meta">12 · Teacher</div>
        </div>
        <span class="popular-course-badge badge-active">Active</span>
      </div>

      <div class="popular-course">
        <div class="popular-course-thumb">📚</div>
        <div class="popular-course-info">
          <div class="popular-course-name">English Literature</div>
          <div class="popular-course-meta">8 · Ms. Rahman</div>
        </div>
        <span class="popular-course-badge badge-active">Active</span>
      </div>

      <div class="popular-course">
        <div class="popular-course-thumb">🔬</div>
        <div class="popular-course-info">
          <div class="popular-course-name">Physics Fundamentals</div>
          <div class="popular-course-meta">5 · Mr. Islam</div>
        </div>
        <span class="popular-course-badge badge-active">Active</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="font-size:11px;color:var(--text-dim);line-height:1.8;">
      © 2024 EduConnect &nbsp;·&nbsp;
      <a href="#" style="color:var(--text-dim);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-dim)'">Privacy</a>
      &nbsp;·&nbsp;
      <a href="#" style="color:var(--text-dim);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-dim)'">Terms</a>
    </div>

  </aside>
</div>

<script>
  // Compose textarea auto-resize
  const ta = document.querySelector('.compose-input');
  ta.addEventListener('input', () => {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  });

  // Post button interaction
  document.querySelector('.post-btn').addEventListener('click', () => {
    const val = ta.value.trim();
    if (!val) { ta.focus(); return; }
    ta.value = '';
    ta.style.height = '';
  });

  // Enroll button interaction
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.textContent = '✓ Enrolled';
      btn.style.background = 'rgba(62,207,142,0.1)';
      btn.style.color = '#3ecf8e';
      btn.style.borderColor = 'rgba(62,207,142,0.25)';
    });
  });

  // Like button toggle
  document.querySelectorAll('.card-action:first-child').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.color = btn.style.color === 'rgb(200, 80, 80)' ? '' : '#c85050';
    });
  });
</script>
</body>
</html>