<template>
  <div class="edu-page">
    <div class="ambient ambient-1"></div>
    <div class="ambient ambient-2"></div>
    <div class="grid-overlay"></div>
    <div class="noise-overlay"></div>

    <header class="nav" :class="{ shadow: isScrolled }">
      <div class="container nav-inner">
        <a href="#hero" class="brand">
          <span class="brand-mark">EC</span>
          <span class="brand-name">EduConnect</span>
        </a>

        <nav class="desktop-links">
          <a href="#features">Features</a>
          <a href="#journey">How it works</a>
          <a href="#about">About</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
          <a href="#signup" class="cta-link">Get Started</a>
        </nav>

        <button class="mobile-toggle" @click="mobileOpen = !mobileOpen" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="mobile-menu" :class="{ open: mobileOpen }">
        <a href="#features" @click="mobileOpen = false">Features</a>
        <a href="#journey" @click="mobileOpen = false">How it works</a>
        <a href="#about" @click="mobileOpen = false">About</a>
        <a href="#reviews" @click="mobileOpen = false">Reviews</a>
        <a href="#contact" @click="mobileOpen = false">Contact</a>
        <a href="#signup" @click="mobileOpen = false">Get Started</a>
      </div>
    </header>

    <main>
      <section id="hero" class="hero container">
        <div class="hero-copy reveal">
          <div class="eyebrow">
            <span class="eyebrow-dot"></span>
            Bangladesh-born learning platform
          </div>

          <h1>
            Learn smarter.<br />
            <span>Connect deeper.</span><br />
            Grow globally.
          </h1>

          <p class="hero-text">
            A premium dark-mode education platform for students and teachers — with AI tutoring,
            live classrooms, a social learning feed, analytics, and a global vision that starts from Bangladesh.
          </p>

          <div class="hero-actions">
            <a href="#signup" class="btn btn-primary">Start for free</a>
            <a href="#features" class="btn btn-secondary">Explore features</a>
          </div>

          <div class="hero-metrics">
            <div class="metric-card">
              <strong>12K+</strong>
              <span>active learners</span>
            </div>
            <div class="metric-card">
              <strong>850+</strong>
              <span>teachers onboard</span>
            </div>
            <div class="metric-card">
              <strong>🇧🇩</strong>
              <span>Bangladesh highlighted</span>
            </div>
          </div>
        </div>

        <div class="hero-visual reveal reveal-delay-1">
          <div class="visual-shell">
            <canvas ref="heroCanvas" class="globe-canvas"></canvas>
            <div class="orbital-card orbital-card-1">
              <span class="card-label">Focus</span>
              <strong>Dhaka → Global</strong>
              <small>Bangladesh highlighted on the globe</small>
            </div>
            <div class="orbital-card orbital-card-2">
              <span class="card-label">AI sessions today</span>
              <strong>3,291</strong>
              <small>live adaptive tutoring</small>
            </div>
            <div class="orbital-card orbital-card-3">
              <span class="card-label">Average score boost</span>
              <strong>+34%</strong>
              <small>after 30 days</small>
            </div>
          </div>
        </div>
      </section>

      <section class="ticker-wrap">
        <div class="ticker-track">
          <span v-for="(item, index) in repeatedTicker" :key="`${item}-${index}`" class="ticker-item">
            {{ item }}
          </span>
        </div>
      </section>

      <section id="features" class="section container">
        <div class="section-head reveal">
          <div>
            <div class="chip">Platform features</div>
            <h2>Designed for the <span>future of education</span></h2>
          </div>
          <p>
            Everything students and teachers need in one polished, premium interface — built to feel modern,
            fast, and focused.
          </p>
        </div>

        <div class="feature-grid">
          <article v-for="(feature, index) in features" :key="feature.title" class="feature-card reveal" :style="delayStyle(index)">
            <div class="feature-index">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </article>
        </div>
      </section>

      <section id="journey" class="section muted-section">
        <div class="container journey-grid">
          <div class="journey-copy reveal">
            <div class="chip">How it works</div>
            <h2>From signup to live learning in <span>minutes</span></h2>
            <div class="step-list">
              <div v-for="(step, index) in steps" :key="step.title" class="step-item">
                <div class="step-no">{{ String(index + 1).padStart(2, '0') }}</div>
                <div>
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.text }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="journey-visual reveal reveal-delay-1">
            <div class="visual-panel">
              <div class="mini-window">
                <div class="mini-topbar">
                  <span></span><span></span><span></span>
                </div>
                <div class="mini-content">
                  <div class="mini-sidebar">
                    <div></div><div></div><div></div><div></div>
                  </div>
                  <div class="mini-main">
                    <div class="mini-row large"></div>
                    <div class="mini-row"></div>
                    <div class="mini-row"></div>
                    <div class="mini-cards">
                      <div></div><div></div><div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="journey-badge">Private classrooms • AI tutor • Live sessions</div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="section container">
        <div class="about-grid">
          <div class="about-copy reveal">
            <div class="chip">About EduConnect</div>
            <h2>Built in <span>Bangladesh</span>, designed for everywhere</h2>
            <p>
              This version leans into a darker, more premium visual system with better contrast, softer glow,
              stronger hierarchy, and a globe that makes Bangladesh the focal point instead of just another point on Earth.
            </p>
            <div class="stats-grid">
              <div class="stat-card">
                <strong>12K+</strong>
                <span>students</span>
              </div>
              <div class="stat-card">
                <strong>98%</strong>
                <span>satisfaction</span>
              </div>
              <div class="stat-card">
                <strong>15+</strong>
                <span>institutions</span>
              </div>
              <div class="stat-card accent-card">
                <strong>BD</strong>
                <span>spotlight region</span>
              </div>
            </div>
          </div>

          <div class="about-visual reveal reveal-delay-1">
            <div class="about-orb-shell">
              <canvas ref="aboutCanvas" class="about-canvas"></canvas>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" class="section muted-section">
        <div class="container">
          <div class="section-head reveal">
            <div>
              <div class="chip">Reviews</div>
              <h2>Why people <span>love</span> the platform</h2>
            </div>
            <p>Students and teachers get one focused workspace instead of fragmented tools and confusing dashboards.</p>
          </div>

          <div class="review-grid">
            <article v-for="(review, index) in reviews" :key="review.name" class="review-card reveal" :style="delayStyle(index)">
              <div class="stars">★★★★★</div>
              <p>{{ review.text }}</p>
              <div class="review-user">
                <div class="avatar">{{ review.initials }}</div>
                <div>
                  <strong>{{ review.name }}</strong>
                  <span>{{ review.role }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" class="section container">
        <div class="contact-grid">
          <div class="contact-copy reveal">
            <div class="chip">Contact</div>
            <h2>Ready to launch your <span>next-gen classroom</span>?</h2>
            <p>
              This Vue version keeps the strong presentation feel but is much easier to maintain, theme, and extend.
            </p>

            <div class="contact-list">
              <div class="contact-item">
                <strong>Email</strong>
                <span>hello@educonnect.io</span>
              </div>
              <div class="contact-item">
                <strong>Location</strong>
                <span>Dhaka, Bangladesh</span>
              </div>
              <div class="contact-item">
                <strong>Support</strong>
                <span>Mon–Fri • 9am–6pm</span>
              </div>
            </div>
          </div>

          <div id="signup" class="signup-card reveal reveal-delay-1">
            <div class="signup-top">
              <span class="signup-chip">Secure access</span>
              <h3>Create your account</h3>
              <p>Dark-themed, premium auth card ready for your Vue project.</p>
            </div>

            <form class="signup-form" @submit.prevent>
              <div class="field-grid">
                <label>
                  <span>Full name</span>
                  <input type="text" placeholder="Tanjid Rifat" />
                </label>
                <label>
                  <span>Role</span>
                  <select>
                    <option>Student</option>
                    <option>Teacher</option>
                    <option>Institution Admin</option>
                  </select>
                </label>
              </div>

              <label>
                <span>Email</span>
                <input type="email" placeholder="you@institution.edu" />
              </label>

              <label>
                <span>Password</span>
                <input type="password" placeholder="Create a strong password" />
              </label>

              <button class="btn btn-primary btn-block" type="submit">Get started</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const mobileOpen = ref(false)
const isScrolled = ref(false)
const heroCanvas = ref(null)
const aboutCanvas = ref(null)

const features = [
  {
    icon: '✦',
    title: 'AI Tutor 24/7',
    text: 'Instant step-by-step explanations, personalized help, and adaptive support whenever students need it.',
  },
  {
    icon: '◉',
    title: 'Social Learning Feed',
    text: 'A focused educational community where students discuss lessons, courses, and questions in real time.',
  },
  {
    icon: '▣',
    title: 'Private Classrooms',
    text: 'Teacher-managed spaces for notes, live sessions, notices, assignments, and course discussions.',
  },
  {
    icon: '⬈',
    title: 'Progress Analytics',
    text: 'Track engagement, streaks, attendance, and performance across the entire learning journey.',
  },
  {
    icon: '⟡',
    title: 'Secure by Design',
    text: 'Role-aware access and clean architecture that is easier to connect with your backend later.',
  },
  {
    icon: '◎',
    title: 'Responsive Experience',
    text: 'A polished layout that feels premium on desktop while still adapting well for smaller screens.',
  },
]

const steps = [
  {
    title: 'Create an account',
    text: 'Students and teachers can join quickly with a clean, focused authentication flow.',
  },
  {
    title: 'Build or join a classroom',
    text: 'Teachers open private rooms, students enroll, and each course gets its own dedicated space.',
  },
  {
    title: 'Learn and collaborate',
    text: 'Use AI tutoring, community discussion, notices, and live sessions without leaving the platform.',
  },
  {
    title: 'Measure real progress',
    text: 'Analytics and outcomes stay visible so learners and teachers can keep improving together.',
  },
]

const reviews = [
  {
    initials: 'RI',
    name: 'Ranya Islam',
    role: 'CSE Student, Dhaka',
    text: 'The interface feels premium and calm. The dark design makes long study sessions much easier on the eyes.',
  },
  {
    initials: 'FH',
    name: 'Farhan Hossain',
    role: 'Lecturer, BUET',
    text: 'The classroom structure is clearer, and the platform finally feels like one product instead of many disconnected tools.',
  },
  {
    initials: 'TA',
    name: 'Tasnim Akter',
    role: 'Physics Teacher',
    text: 'The Bangladesh-first identity with a global look gives the whole landing page a much stronger presence.',
  },
]

const tickerItems = [
  'AI tutor 24/7',
  'Social learning feed',
  'Live classrooms',
  'Progress analytics',
  'Secure & private',
  'Responsive design',
  'Bangladesh spotlight',
]

const repeatedTicker = computed(() => [...tickerItems, ...tickerItems, ...tickerItems])

const cleanups = []

const delayStyle = (index) => ({ '--delay': `${index * 90}ms` })

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

function createBangladeshHighlight(radius = 1.01) {
  const group = new THREE.Group()

  const bangladeshLat = 23.685
  const bangladeshLng = 90.3563
  const position = latLngToVector3(bangladeshLat, bangladeshLng, radius)

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x49e6ff })
  )
  marker.position.copy(position)
  group.add(marker)

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.06, 0.105, 48),
    new THREE.MeshBasicMaterial({
      color: 0x7c5cff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
  )
  ring.position.copy(position.clone().multiplyScalar(1.001))
  ring.lookAt(position.clone().multiplyScalar(2))
  group.add(ring)

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.15,
    })
  )
  glow.position.copy(position)
  group.add(glow)

  const arcMaterial = new THREE.LineBasicMaterial({ color: 0x49e6ff, transparent: true, opacity: 0.75 })
  const destinations = [
    { lat: 51.5072, lng: -0.1276 },
    { lat: 40.7128, lng: -74.006 },
    { lat: 35.6762, lng: 139.6503 },
  ]

  for (const destination of destinations) {
    const start = latLngToVector3(bangladeshLat, bangladeshLng, radius)
    const end = latLngToVector3(destination.lat, destination.lng, radius)
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.45)
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
    const points = curve.getPoints(90)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, arcMaterial)
    group.add(line)
  }

  return group
}

function createSimpleEarth({ canvas, radius = 1, autoRotateSpeed = 0.0035, particleCount = 800, cameraZ = 3.2 }) {
  if (!canvas) return () => {}

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 0.1, cameraZ)

  const globeGroup = new THREE.Group()
  scene.add(globeGroup)

  const ambient = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(ambient)

  const point = new THREE.PointLight(0x61a8ff, 5.2, 20)
  point.position.set(4, 3, 4)
  scene.add(point)

  const rim = new THREE.PointLight(0x8b5cf6, 3.8, 20)
  rim.position.set(-4, -2, -2)
  scene.add(rim)

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 72, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0x0b1220,
      metalness: 0.18,
      roughness: 0.26,
      transmission: 0.02,
      clearcoat: 0.75,
      clearcoatRoughness: 0.3,
      emissive: 0x10213c,
      emissiveIntensity: 0.45,
    })
  )
  globeGroup.add(globe)

  const wire = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.003, 30, 30),
    new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
  )
  globeGroup.add(wire)

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.12, 72, 72),
    new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    })
  )
  globeGroup.add(atmosphere)

  const starsGeometry = new THREE.BufferGeometry()
  const starPositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount * 3; i += 3) {
    const r = 8 + Math.random() * 7
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    starPositions[i] = r * Math.sin(phi) * Math.cos(theta)
    starPositions[i + 1] = r * Math.cos(phi)
    starPositions[i + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
      color: 0xb8d4ff,
      size: 0.03,
      transparent: true,
      opacity: 0.7,
    })
  )
  scene.add(stars)

  const highlight = createBangladeshHighlight(radius * 1.015)
  globeGroup.add(highlight)

  let rafId = 0
  const clock = new THREE.Clock()

  const onResize = () => {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const animate = () => {
    rafId = requestAnimationFrame(animate)
    const elapsed = clock.getElapsedTime()

    globeGroup.rotation.y += autoRotateSpeed
    globeGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.06
    stars.rotation.y -= autoRotateSpeed * 0.15

    const pulse = 1 + Math.sin(elapsed * 2.3) * 0.08
    highlight.children[1].scale.setScalar(pulse)
    highlight.children[2].scale.setScalar(1 + Math.sin(elapsed * 2.1) * 0.12)

    renderer.render(scene, camera)
  }

  onResize()
  animate()
  window.addEventListener('resize', onResize)

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
    globe.geometry.dispose()
    globe.material.dispose()
    wire.geometry.dispose()
    wire.material.dispose()
    atmosphere.geometry.dispose()
    atmosphere.material.dispose()
    stars.geometry.dispose()
    stars.material.dispose()
    highlight.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    })
  }
}

function setupReveal() {
  const elements = document.querySelectorAll('.reveal')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    },
    { threshold: 0.14 }
  )

  elements.forEach((el) => observer.observe(el))
  return () => observer.disconnect()
}

function handleScroll() {
  isScrolled.value = window.scrollY > 18
}

onMounted(async () => {
  await nextTick()
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  cleanups.push(() => window.removeEventListener('scroll', handleScroll))

  cleanups.push(setupReveal())
  cleanups.push(
    createSimpleEarth({ canvas: heroCanvas.value, radius: 1.08, autoRotateSpeed: 0.0037, particleCount: 1000, cameraZ: 3.4 })
  )
  cleanups.push(
    createSimpleEarth({ canvas: aboutCanvas.value, radius: 0.92, autoRotateSpeed: 0.0026, particleCount: 520, cameraZ: 3.0 })
  )
})

onBeforeUnmount(() => {
  while (cleanups.length) {
    const cleanup = cleanups.pop()
    if (typeof cleanup === 'function') cleanup()
  }
})
</script>

<style scoped>
:global(body) {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #060816 0%, #070b14 35%, #05070f 100%);
  color: #eef4ff;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

:global(html) {
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}

.edu-page {
  position: relative;
  min-height: 100vh;
  min-width: 0;
  width: 100%;
  overflow-x: hidden;
  color: #e8eefc;
}

.ambient,
.grid-overlay,
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.ambient-1 {
  background: radial-gradient(circle at 16% 18%, rgba(0, 209, 255, 0.12), transparent 24%);
}

.ambient-2 {
  background: radial-gradient(circle at 82% 20%, rgba(124, 92, 255, 0.16), transparent 28%);
}

.grid-overlay {
  opacity: 0.08;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at center, black 48%, transparent 100%);
}

.noise-overlay {
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.05' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
}

.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(18px);
  background: rgba(5, 9, 19, 0.7);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  transition: box-shadow 0.25s ease, background 0.25s ease;
}

.nav.shadow {
  box-shadow: 0 10px 40px rgba(2, 6, 23, 0.34);
  background: rgba(4, 8, 17, 0.84);
}

.nav-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: white;
  background: linear-gradient(135deg, #38bdf8, #4f46e5 68%, #8b5cf6);
  box-shadow: 0 10px 30px rgba(56, 189, 248, 0.3);
}

.brand-name {
  color: #f8fbff;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -0.04em;
}

.desktop-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.desktop-links a,
.mobile-menu a {
  color: #b7c4df;
  text-decoration: none;
  transition: color 0.2s ease;
}

.desktop-links a:hover,
.mobile-menu a:hover {
  color: #ffffff;
}

.cta-link {
  padding: 10px 16px;
  border-radius: 999px;
  color: white !important;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(124, 92, 255, 0.95));
  box-shadow: 0 10px 28px rgba(59, 130, 246, 0.24);
}

.mobile-toggle {
  display: none;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 0;
  cursor: pointer;
}

.mobile-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  background: white;
  margin: 4px auto;
  border-radius: 999px;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 18px;
  padding: 0 20px 20px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.25s ease;
}

.mobile-menu.open {
  max-height: 320px;
  opacity: 1;
  padding-top: 18px;
}

.hero {
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  gap: 42px;
  align-items: center;
  padding: 64px 0 88px;
}

.hero-copy,
.hero-visual,
.section,
.muted-section {
  position: relative;
  z-index: 1;
}

.eyebrow,
.chip,
.signup-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #97c8ff;
  background: rgba(10, 17, 30, 0.68);
  border: 1px solid rgba(82, 145, 255, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.eyebrow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #45d7ff;
  box-shadow: 0 0 0 6px rgba(69, 215, 255, 0.11);
}

.hero h1,
.section-head h2,
.journey-copy h2,
.about-copy h2,
.contact-copy h2 {
  margin: 20px 0 0;
  font-size: clamp(2.75rem, 5vw, 5.4rem);
  line-height: 0.96;
  letter-spacing: -0.06em;
  color: #f6f9ff;
}

.section-head h2,
.journey-copy h2,
.about-copy h2,
.contact-copy h2 {
  font-size: clamp(2rem, 3.8vw, 3.4rem);
  line-height: 1.02;
}

.hero h1 span,
.section-head h2 span,
.journey-copy h2 span,
.about-copy h2 span,
.contact-copy h2 span {
  background: linear-gradient(90deg, #38bdf8 0%, #7c5cff 48%, #9ae6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-text,
.section-head p,
.journey-copy p,
.about-copy p,
.contact-copy p,
.signup-top p,
.review-card p {
  color: #a9b6d0;
  line-height: 1.78;
  font-size: 1rem;
}

.hero-text {
  max-width: 60ch;
  margin-top: 22px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 34px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 22px;
  border-radius: 14px;
  border: 1px solid transparent;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  color: white;
  background: linear-gradient(135deg, #2563eb, #7c5cff);
  box-shadow: 0 16px 36px rgba(37, 99, 235, 0.28);
}

.btn-secondary {
  color: #dbe8ff;
  background: rgba(11, 18, 32, 0.7);
  border-color: rgba(148, 163, 184, 0.18);
}

.btn-block {
  width: 100%;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 34px;
}

.metric-card,
.feature-card,
.review-card,
.contact-item,
.stat-card,
.signup-card,
.visual-shell,
.visual-panel,
.about-orb-shell {
  background: linear-gradient(180deg, rgba(11, 18, 32, 0.88), rgba(8, 13, 24, 0.88));
  border: 1px solid rgba(148, 163, 184, 0.13);
  box-shadow: 0 20px 45px rgba(2, 6, 23, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.metric-card {
  border-radius: 18px;
  padding: 16px;
}

.metric-card strong,
.stat-card strong {
  display: block;
  font-size: 1.3rem;
  letter-spacing: -0.05em;
  color: white;
}

.metric-card span,
.stat-card span {
  display: block;
  margin-top: 6px;
  color: #8fa3c8;
  font-size: 0.92rem;
}

.visual-shell {
  position: relative;
  min-height: 620px;
  border-radius: 32px;
  overflow: hidden;
}

.globe-canvas,
.about-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.orbital-card {
  position: absolute;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(6, 10, 18, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.14);
  backdrop-filter: blur(10px);
  box-shadow: 0 14px 28px rgba(2, 6, 23, 0.28);
  animation: floaty 5s ease-in-out infinite;
}

.orbital-card-1 { top: 10%; right: 8%; }
.orbital-card-2 { bottom: 12%; left: 7%; animation-delay: 1s; }
.orbital-card-3 { top: 56%; right: 6%; animation-delay: 1.8s; }

.card-label {
  display: block;
  color: #8cbcff;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 6px;
}

.orbital-card strong {
  display: block;
  color: white;
  font-size: 1rem;
}

.orbital-card small {
  color: #97a9c9;
}

.ticker-wrap {
  overflow: hidden;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  background: linear-gradient(90deg, rgba(10, 16, 28, 0.9), rgba(10, 16, 28, 0.55), rgba(10, 16, 28, 0.9));
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker 30s linear infinite;
}

.ticker-item {
  padding: 18px 28px;
  color: #cddcff;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.82rem;
}

.section,
.muted-section {
  padding: 100px 0;
}

.muted-section {
  background: linear-gradient(180deg, rgba(9, 13, 24, 0.78), rgba(7, 11, 20, 0.88));
  border-top: 1px solid rgba(148, 163, 184, 0.08);
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
}

.section-head {
  display: grid;
  grid-template-columns: 1fr 0.8fr;
  gap: 26px;
  align-items: end;
  margin-bottom: 34px;
}

.feature-grid,
.review-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.feature-card,
.review-card {
  border-radius: 24px;
  padding: 24px;
}

.feature-index {
  color: #7588aa;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.feature-icon {
  width: 52px;
  height: 52px;
  margin: 18px 0 14px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  font-size: 1.15rem;
  color: #87dbff;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(124, 92, 255, 0.18));
  border: 1px solid rgba(85, 145, 255, 0.18);
}

.feature-card h3,
.review-user strong,
.step-item h4,
.signup-top h3 {
  margin: 0;
  color: white;
  letter-spacing: -0.04em;
}

.feature-card h3 {
  font-size: 1.18rem;
}

.feature-card p {
  margin: 10px 0 0;
  color: #9eb0ce;
  line-height: 1.7;
}

.journey-grid,
.about-grid,
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.step-list {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.step-no {
  color: #7ebeff;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding-top: 3px;
}

.step-item p {
  margin: 6px 0 0;
  color: #9fb0cb;
}

.visual-panel,
.about-orb-shell {
  border-radius: 28px;
  padding: 22px;
}

.mini-window {
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.1);
  background: rgba(7, 12, 21, 0.95);
}

.mini-topbar {
  display: flex;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.mini-topbar span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.24);
}

.mini-content {
  display: grid;
  grid-template-columns: 82px 1fr;
  min-height: 340px;
}

.mini-sidebar {
  padding: 16px;
  border-right: 1px solid rgba(148, 163, 184, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mini-sidebar div,
.mini-row,
.mini-cards div {
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.18), rgba(124, 92, 255, 0.12));
  border: 1px solid rgba(90, 149, 255, 0.1);
}

.mini-sidebar div {
  height: 38px;
  border-radius: 12px;
}

.mini-main {
  padding: 18px;
}

.mini-row {
  height: 52px;
  border-radius: 16px;
  margin-bottom: 14px;
}

.mini-row.large {
  height: 82px;
}

.mini-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.mini-cards div {
  height: 110px;
  border-radius: 18px;
}

.journey-badge {
  margin-top: 18px;
  color: #8fc4ff;
  letter-spacing: 0.12em;
  font-size: 0.82rem;
  text-transform: uppercase;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 28px;
}

.stat-card {
  border-radius: 22px;
  padding: 20px;
}

.accent-card {
  background: linear-gradient(135deg, rgba(24, 40, 75, 0.95), rgba(24, 20, 62, 0.95));
  border-color: rgba(93, 152, 255, 0.24);
}

.about-orb-shell {
  height: 420px;
}

.stars {
  color: #7dc6ff;
  letter-spacing: 0.18em;
  margin-bottom: 16px;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
}

.review-user span {
  display: block;
  margin-top: 4px;
  color: #90a4c5;
  font-size: 0.92rem;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 800;
  background: linear-gradient(135deg, #2563eb, #7c5cff);
}

.contact-list {
  display: grid;
  gap: 14px;
  margin-top: 26px;
}

.contact-item {
  padding: 18px 20px;
  border-radius: 18px;
}

.contact-item strong {
  display: block;
  color: white;
}

.contact-item span {
  display: block;
  margin-top: 6px;
  color: #95a9c8;
}

.signup-card {
  border-radius: 30px;
  padding: 28px;
}

.signup-top h3 {
  font-size: 2rem;
  margin-top: 16px;
}

.signup-form {
  margin-top: 22px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.signup-form label {
  display: block;
  margin-bottom: 14px;
}

.signup-form span {
  display: block;
  margin-bottom: 8px;
  color: #9cb0cf;
  font-size: 0.88rem;
}

.signup-form input,
.signup-form select {
  width: 100%;
  min-height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  outline: none;
  background: rgba(6, 10, 18, 0.85);
  color: #eef4ff;
  padding: 0 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.signup-form input:focus,
.signup-form select:focus {
  border-color: rgba(96, 165, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  transition-delay: var(--delay, 0ms);
}

.reveal.reveal-delay-1 {
  --delay: 110ms;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-33.333%); }
}

@keyframes floaty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 1080px) {
  .hero,
  .journey-grid,
  .about-grid,
  .contact-grid,
  .section-head {
    grid-template-columns: 1fr;
  }

  .feature-grid,
  .review-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero {
    padding-top: 42px;
  }

  .visual-shell {
    min-height: 540px;
  }
}

@media (max-width: 820px) {
  .desktop-links {
    display: none;
  }

  .mobile-toggle,
  .mobile-menu {
    display: flex;
  }

  .hero h1 {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .hero-metrics,
  .feature-grid,
  .review-grid,
  .field-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .orbital-card {
    position: static;
    margin-top: 12px;
  }

  .visual-shell {
    padding: 0 0 16px;
  }

  .globe-canvas {
    min-height: 400px;
  }

  .about-orb-shell {
    height: 340px;
  }

  .ticker-item {
    padding-inline: 18px;
  }
}
</style>
