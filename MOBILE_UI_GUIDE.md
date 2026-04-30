# EduConnect Mobile UI & API Guide

This document serves as a guide for building a React-based mobile application with the same UI/UX and theme as the EduConnect web application.

---

## 🎨 Theme & Styling

### Colors (Brand Palette)
- **Primary:** `#2E6F40` (Vibrant Green)
- **Dark:** `#121A15` (Deep Dark Green/Black)
- **Light:** `#ffffff` (Pure White)
- **Accent:** `#4DBF7D` (Light Green)
- **Secondary:** `#253D2C` (Muted Dark Green)
- **Background:** `#f8f9fa` (Light Mode) / `#141c2e` (Dark Mode)
- **Surface:** Glassmorphism style using `backdrop-blur-xl` and `white/5` or `black/40` transparency.

### Typography
- **Primary Font:** `Plus Jakarta Sans`
- **Secondary Font:** `Manrope`
- **Display Font:** `Instrument Serif` (For large titles)

---

## 📱 Mobile Layout Components

### 1. Mobile Bottom Navigation
**Location:** Fixed at the bottom of the screen.
**Style:** 
- Background: `#141c2e` with `92%` opacity and `blur(20px)`.
- Border-top: 1px solid `rgba(255,255,255,0.06)`.
- **Items:**
  1. **Home:** `/home` (Icon: Home)
  2. **Learn:** `/classroom` (Icon: Book/Classroom)
  3. **AI Tutor:** `/ai-tutor` (Icon: Bot/Monitor)
  4. **Messages:** `/messages` (Icon: Chat)
  5. **Profile:** `/profile` (Icon: Person)

### 2. Mobile Header
**Location:** Sticky at the top.
**Components:**
- **Left:** Logo (EduConnect Icon + Text).
- **Right:** Hamburger Menu (Menu icon) for additional options.
- **Style:** Semi-transparent background with backdrop blur.

---

## 📄 Pages & API Endpoints

### 1. Home Page (`/home`)
- **Mobile UI:**
  - Vertical feed of posts and updates.
  - Social-like interaction (Like, Comment, Share).
  - Stories/Highlights at the top (optional).
- **API Endpoints:**
  - `GET /api/feed/home`: Fetch the main social feed.
  - `GET /api/auth/me`: Fetch current user data.
  - `POST /api/social/posts`: Create a new post.

### 2. Learn / Classroom (`/classroom`)
- **Mobile UI:**
  - List of enrolled courses as cards.
  - Search bar to find new courses.
  - Tab switcher: "My Courses" vs "All Courses".
- **API Endpoints:**
  - `GET /api/classroom/courses`: List all available courses.
  - `GET /api/classroom/me/enrollments`: List courses the student is enrolled in.
  - `POST /api/classroom/courses/:courseId/enrollment-requests`: Request to join a course.

### 3. AI Tutor (`/ai-tutor`)
- **Mobile UI:**
  - Full-screen chat interface.
  - Subject selector (Chemistry, Math, Physics).
  - Dynamic response rendering (Markdown, LaTeX for formulas).
  - Reaction diagrams for Chemistry.
- **API Endpoints:**
  - `POST /api/ai/ask`: Send a question to the AI.
  - `GET /api/ai/history`: Fetch previous chat sessions.

### 4. Messages (`/messages`)
- **Mobile UI:**
  - List of active chats/conversations.
  - Individual chat screens with message history.
  - Search bar for contacts.
- **API Endpoints:**
  - `GET /api/classroom/courses/:courseId/messages`: Fetch chat history for a course.
  - `POST /api/classroom/courses/:courseId/messages`: Send a message (text or file).
  - `DELETE /api/classroom/courses/:courseId/messages/:messageId`: Delete a message.

### 5. Profile & Settings (`/profile`)
- **Mobile UI:**
  - User avatar and basic info at the top.
  - Statistics (Courses completed, Activity score).
  - List of settings options (Account, Privacy, Theme).
  - Logout button.
- **API Endpoints:**
  - `GET /api/auth/me`: Fetch profile details.
  - `PATCH /api/auth/password`: Update password.
  - `POST /api/auth/profile-picture`: Upload/Update profile picture.

### 6. Tuition Connect (`/tuition-connect`)
- **Mobile UI:**
  - Marketplace for tuition posts.
  - Filter by subject, location, and fee.
  - "Apply" or "Connect" button on each post.
  - Teacher profiles with ratings/popularity.
- **API Endpoints:**
  - `GET /api/tuition/posts`: Fetch all tuition posts.
  - `POST /api/tuition/posts/:id/connect`: Request to connect with a teacher.
  - `GET /api/tuition/teachers/popular`: Fetch top-rated teachers.

### 7. Meetings (`/meeting`)
- **Mobile UI:**
  - Video conferencing interface (integrated or webview).
  - Mute/Unmute, Camera On/Off, and Chat controls.
  - List of participants.
- **API Endpoints:**
  - `POST /api/meetings/create`: Create a new meeting room (Teacher only).
  - `GET /api/meetings/:roomId`: Fetch meeting details and status.
  - `POST /api/meetings/:roomId/end`: End a meeting session.

---

## 🛠 Interaction Details
- **Active State:** The bottom nav active item should use a subtle highlight (e.g., `#2E6F40` with low opacity) and a colored icon.
- **Transitions:** Use `slide-up` for page transitions and modals.
- **Loading:** Use shimmer effects (skeleton screens) instead of spinners where possible.
