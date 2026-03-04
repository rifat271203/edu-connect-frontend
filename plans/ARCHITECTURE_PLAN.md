# EduConnect - Social Media Frontend Architecture

## Project Overview
A professional, scalable social media frontend application built with Nuxt 3, featuring a pure dark theme and modern glassmorphism UI design.

## Tech Stack
- **Framework**: Nuxt 3 (Vue 3 Composition API)
- **Build Tool**: Vite (built into Nuxt)
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Routing**: Nuxt file-based routing
- **Dark Theme**: Pure dark mode with accent glow effects

---

## Folder Structure

```
educonnect/
├── src/                          # Custom source directory
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Global styles & Tailwind imports
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Card.vue
│   │   │   ├── Avatar.vue
│   │   │   ├── Badge.vue
│   │   │   ├── Skeleton.vue
│   │   │   └── Toggle.vue
│   │   │
│   │   ├── layout/               # Layout-specific components
│   │   │   ├── Sidebar.vue
│   │   │   ├── Navbar.vue
│   │   │   ├── RightSidebar.vue
│   │   │   └── MobileNav.vue
│   │   │
│   │   ├── feed/                 # Feed-related components
│   │   │   ├── PostCard.vue
│   │   │   ├── PostGrid.vue
│   │   │   ├── LikeButton.vue
│   │   │   ├── CommentSection.vue
│   │   │   └── ShareButton.vue
│   │   │
│   │   └── classroom/            # Classroom components
│   │       ├── TabNav.vue
│   │       ├── AssignmentCard.vue
│   │       └── MemberList.vue
│   │
│   ├── composables/              # Vue composables
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   └── useTheme.ts
│   │
│   ├── layouts/
│   │   ├── default.vue            # Login/auth layout
│   │   └── main.vue              # Main app layout (3-column)
│   │
│   ├── pages/
│   │   ├── index.vue              # Redirects to login
│   │   ├── login.vue              # Login page
│   │   ├── home.vue               # Home/Feed page
│   │   ├── classroom.vue          # Classroom page
│   │   ├── profile.vue            # Profile page
│   │   ├── messages.vue           # Messages page
│   │   └── settings.vue           # Settings page
│   │
│   ├── stores/                   # Pinia stores
│   │   ├── user.ts                # User state
│   │   ├── posts.ts               # Posts state
│   │   └── notifications.ts       # Notifications state
│   │
│   └── types/                    # TypeScript types
│       ├── user.ts
│       ├── post.ts
│       └── notification.ts
│
├── public/
│   └── images/                   # Static images
│
├── nuxt.config.ts               # Nuxt configuration
├── tailwind.config.ts           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── package.json
```

---

## Component Architecture

### 1. UI Components (`src/components/ui/`)

| Component | Purpose | Props |
|-----------|---------|-------|
| Button | Reusable button with variants | `variant`, `size`, `loading`, `icon` |
| Input | Form input with floating labels | `type`, `label`, `modelValue`, `error` |
| Card | Glassmorphism card wrapper | `hover`, `padding`, `glass` |
| Avatar | User avatar with fallback | `src`, `size`, `alt`, `online` |
| Badge | Status/notification badge | `variant`, `count`, `dot` |
| Skeleton | Loading placeholder | `variant`, `animated` |
| Toggle | Show/hide password toggle | `modelValue` |

### 2. Layout Components (`src/components/layout/`)

| Component | Purpose |
|-----------|---------|
| Sidebar | Left navigation with icons |
| Navbar | Top navigation (mobile) |
| RightSidebar | Notifications panel |
| MobileNav | Bottom navigation (mobile) |

### 3. Feed Components (`src/components/feed/`)

| Component | Purpose |
|-----------|---------|
| PostCard | Individual post display |
| PostGrid | Grid layout for posts |
| LikeButton | Animated like interaction |
| CommentSection | Comments display/add |
| ShareButton | Share options |

---

## Page Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Redirect to login |
| `/login` | Login | Authentication page |
| `/home` | Home | Main feed with 3-column layout |
| `/classroom` | Classroom | Tabs: Overview, Assignments, Members |
| `/profile` | Profile | User profile page |
| `/messages` | Messages | Messages/conversations |
| `/settings` | Settings | App settings |

---

## Dark Theme System

### Color Palette
```css
--bg-primary: #0a0a0f          /* Main background */
--bg-secondary: #12121a       /* Card backgrounds */
--bg-tertiary: #1a1a24        /* Elevated surfaces */
--bg-glass: rgba(18, 18, 26, 0.7)  /* Glassmorphism */

--text-primary: #f0f0f5        /* Primary text */
--text-secondary: #a0a0b0     /* Secondary text */
--text-muted: #606070         /* Muted text */

--accent-primary: #6366f1     /* Indigo accent */
--accent-glow: #818cf8        /* Lighter accent for glow */
--accent-hover: #4f46e5       /* Hover state */

--border-color: rgba(255, 255, 255, 0.08)
--border-glow: rgba(99, 102, 241, 0.3)
```

### Tailwind Config
- Extend `colors` with custom dark theme colors
- Add custom `boxShadow` for glow effects
- Configure `animation` for micro-interactions

---

## State Management (Pinia)

### Stores Structure

1. **user.ts** - User authentication state
   - `user`: Current user object
   - `isAuthenticated`: Auth status
   - `login()`, `logout()` actions

2. **posts.ts** - Posts feed state
   - `posts`: Array of posts
   - `loading`: Loading state
   - `fetchPosts()`, `likePost()`, `addPost()` actions

3. **notifications.ts** - Notifications state
   - `notifications`: Array of notifications
   - `unreadCount`: Badge count
   - `markAsRead()`, `fetchNotifications()` actions

---

## Dummy Data

### Sample User
```typescript
{
  id: '1',
  username: 'johndoe',
  displayName: 'John Doe',
  avatar: '/images/avatar-1.jpg',
  bio: 'Computer Science Student',
  followers: 1234,
  following: 567
}
```

### Sample Post
```typescript
{
  id: '1',
  userId: '2',
  username: 'janedoe',
  avatar: '/images/avatar-2.jpg',
  image: '/images/post-1.jpg',
  caption: 'Just completed my assignment! 🎉',
  likes: 42,
  comments: 8,
  timestamp: '2 hours ago'
}
```

### Sample Notification
```typescript
{
  id: '1',
  type: 'friend_request',
  user: { username: 'alex', avatar: '...' },
  message: 'sent you a friend request',
  timestamp: '5 min ago',
  read: false
}
```

---

## Login Page Design

### Features
- Full-screen dark gradient background with animated glow
- Glassmorphism card (backdrop-blur)
- Floating label inputs with focus animation
- Password visibility toggle
- Animated submit button with hover effect
- Smooth transitions between states

### Layout
```
┌─────────────────────────────────┐
│     [Animated Background]      │
│                                 │
│         ┌───────────┐           │
│         │   Logo    │           │
│         └───────────┘           │
│                                 │
│    ┌─────────────────────┐      │
│    │  Email Input       │      │
│    └─────────────────────┘      │
│    ┌─────────────────────┐      │
│    │  Password Input   │      │
│    └─────────────────────┘      │
│                                 │
│    ┌─────────────────────┐      │
│    │     Login          │      │
│    └─────────────────────┘      │
│                                 │
└─────────────────────────────────┘
```

---

## Main Layout (3-Column)

### Desktop Layout
```
┌────────┬───────────────────┬──────────┐
│        │                   │          │
│ Sidebar│     Feed Grid    │ Notifs   │
│  (240px)│    (flex-1)     │ (300px)  │
│        │                   │          │
│ - Home │  ┌────┐ ┌────┐   │ Activity │
│ - Class│  │Post│ │Post│   │ Requests │
│ - Prof │  └────┘ └────┘   │          │
│ - Msg  │  ┌────┐ ┌────┐   │          │
│ - Set  │  │Post│ │Post│   │          │
│        │  └────┘ └────┘   │          │
│        │                   │          │
└────────┴───────────────────┴──────────┘
```

### Responsive Breakpoints
- **Desktop**: ≥1280px - Full 3-column
- **Tablet**: 768px-1279px - 2-column (hide right sidebar)
- **Mobile**: <768px - Single column with bottom nav

---

## Animations & Transitions

### Page Transitions
- Fade + slide effect (300ms)
- Staggered content reveal

### Micro-interactions
- Button hover: Scale 1.02 + glow
- Card hover: Subtle lift + border glow
- Like button: Heart animation burst
- Input focus: Border glow animation

### Background Effects
- Gradient animation (slow movement)
- Floating orbs (CSS animation)
- Subtle noise texture overlay

---

## Implementation Priority

### Phase 1: Foundation
1. Configure Nuxt with srcDir
2. Install & configure Tailwind CSS
3. Install Pinia
4. Create global styles & dark theme

### Phase 2: UI Components
5. Build core UI components (Button, Input, Card, Avatar)
6. Create layout components

### Phase 3: Pages & Routing
7. Create login page
8. Create main layout
9. Build home/feed page
10. Build classroom page
11. Create remaining pages

### Phase 4: Polish
12. Add animations & transitions
13. Test responsiveness
14. Add dummy data
15. Final polish

---

## Notes

- No backend integration required
- No real authentication (mock login)
- All data is static/dummy
- Focus on clean architecture and reusability
- Use Nuxt auto-imports for components
- Maintain production-ready code quality
