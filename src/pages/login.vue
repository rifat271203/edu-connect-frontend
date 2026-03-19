<template>
  <div class="landing-page" @mousemove="handleMouseMove">
    <div ref="cursorDotRef" class="cur-dot"></div>
    <div ref="cursorRingRef" class="cur-ring"></div>

    <div class="grain"></div>
    <canvas id="bg-canvas" ref="bgCanvasRef"></canvas>

    <nav :class="{ scrolled: isScrolled }">
      <div class="nav-inner">
        <a href="#hero" class="nav-brand">
          <div class="nav-emblem">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <span class="nav-wordmark">EduConnect</span>
        </a>
        <ul class="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#purpose">How it Works</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#testimonials">Reviews</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#login" class="nav-cta">Sign In</a></li>
        </ul>
        <button class="mob-btn" aria-label="Menu" @click="toggleMob">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
      </div>
    </nav>

    <div class="mob-menu" :class="{ open: isMobileMenuOpen }">
      <a href="#features" @click="closeMob">Features</a>
      <a href="#purpose" @click="closeMob">How it Works</a>
      <a href="#about" @click="closeMob">About</a>
      <a href="#testimonials" @click="closeMob">Reviews</a>
      <a href="#contact" @click="closeMob">Contact</a>
      <a href="#login" @click="closeMob">Sign In →</a>
    </div>

    <main>
      <section id="hero">
        <div class="hero-badge"><span class="badge-dot"></span>Intelligent Learning Platform</div>
        <h1 class="hero-title">
          Where Education<br />
          <span class="italic">Meets Intelligence</span>
        </h1>
        <p class="hero-sub">EduConnect unifies students and teachers in one beautifully designed workspace — AI tutoring, social learning, live classrooms, and real analytics.</p>
        <div class="hero-actions">
          <a href="#login" class="btn btn-gold">
            Get Started Free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
          <a href="#features" class="btn btn-outline">Explore Features</a>
        </div>
        <div class="hero-pills">
          <div class="hero-pill"><span class="pill-sep gold"></span><strong>12K+</strong> Students</div>
          <div class="hero-pill"><span class="pill-sep blue"></span><strong>850+</strong> Teachers</div>
          <div class="hero-pill"><span class="pill-sep gold2"></span><strong>500+</strong> Classrooms</div>
          <div class="hero-pill"><span class="pill-sep gold"></span><strong>4.9 ★</strong> Rating</div>
        </div>
        <div class="scroll-cue">
          <div class="scroll-cue-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      <div class="divider-line"></div>

      <section id="features">
        <div class="wrap">
          <p v-reveal class="sec-label rv">Platform Features</p>
          <h2 v-reveal class="sec-heading rv d1">Everything you need to<br /><em>teach and learn</em></h2>
          <p v-reveal class="sec-body rv d2">Purpose-built tools for modern education — whether you're a student seeking answers or a teacher building the next generation.</p>

          <div class="feat-grid">
            <div v-reveal class="fc rv d1">
              <div class="fc-num">01</div>
              <div class="fc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <h3>AI Tutor, 24/7</h3>
              <p>Instant personalized explanations, step-by-step problem solving, and adaptive paths — available any hour of the day.</p>
            </div>
            <div v-reveal class="fc rv d2">
              <div class="fc-num">02</div>
              <div class="fc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 11a3 3 0 100-6 3 3 0 000 6zM16 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3.5 18.5c0-2.5 2.1-4.5 4.7-4.5h.6c2.6 0 4.7 2 4.7 4.5M13 18.5c.2-1.8 1.7-3.3 3.6-3.3h.3c2 0 3.6 1.5 3.6 3.3" /></svg></div>
              <h3>Social Learning Feed</h3>
              <p>Trending discussions, course updates, and peer collaboration — a smart, education-focused community in real time.</p>
            </div>
            <div v-reveal class="fc rv d3">
              <div class="fc-num">03</div>
              <div class="fc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
              <h3>Interactive Classrooms</h3>
              <p>Private teacher-managed spaces for notes, live sessions, exams, and assignments — structured and simple.</p>
            </div>
            <div v-reveal class="fc rv d4">
              <div class="fc-num">04</div>
              <div class="fc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
              <h3>Progress Analytics</h3>
              <p>Rich dashboards for both students and teachers — track scores, completion, attendance, and learning streaks.</p>
            </div>
            <div v-reveal class="fc rv d5">
              <div class="fc-num">05</div>
              <div class="fc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
              <h3>Secure & Private</h3>
              <p>Role-based access control, encrypted data, and academic integrity built into every feature.</p>
            </div>
            <div v-reveal class="fc rv d6">
              <div class="fc-num">06</div>
              <div class="fc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 18h.01M8 21h8a2 2 0 002-2v-1a2 2 0 00-2-2H8a2 2 0 00-2 2v1a2 2 0 002 2zM12 3v4M3 12h18" /></svg></div>
              <h3>Any Device</h3>
              <p>Fully responsive from phone to desktop. Offline-ready for key content — learn anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <div class="divider-line"></div>

      <section id="purpose">
        <div class="wrap">
          <p v-reveal class="sec-label rv">How It Works</p>
          <h2 v-reveal class="sec-heading rv d1">From signup to <em>learning</em><br />in minutes</h2>

          <div class="purpose-grid">
            <div v-reveal class="purpose-canvas-wrap rv-l">
              <canvas id="purpose-canvas" ref="purposeCanvasRef"></canvas>
            </div>
            <div v-reveal class="rv-r">
              <div class="steps">
                <div class="step"><div class="step-num">01</div><div><h4>Create Your Account</h4><p>Sign up as a Student or Teacher in under 60 seconds. Choose your institution, department, and role to personalise your workspace.</p></div></div>
                <div class="step"><div class="step-num">02</div><div><h4>Join or Build a Classroom</h4><p>Students join with a classroom code. Teachers create their space, upload materials, and invite their class instantly.</p></div></div>
                <div class="step"><div class="step-num">03</div><div><h4>Learn, Post & Collaborate</h4><p>Ask the AI Tutor, post to the social feed, attend live sessions, and submit assignments — all in one place.</p></div></div>
                <div class="step"><div class="step-num">04</div><div><h4>Track Real Outcomes</h4><p>Both students and teachers see rich analytics. Identify gaps, celebrate milestones, and continuously improve together.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="divider-line"></div>

      <section id="about">
        <div class="wrap">
          <div class="about-grid">
            <div v-reveal class="rv-l">
              <p class="sec-label">About EduConnect</p>
              <h2 class="sec-heading">Built by educators,<br /><em>for educators</em></h2>
              <p class="sec-body">EduConnect was born from a simple frustration — education tools were either too complex, too expensive, or too disconnected. We built one unified platform that puts learning relationships first.</p>
              <p class="sec-body mt12">Our mission is to make quality, connected education accessible to every student and teacher — regardless of location, institution size, or budget.</p>

              <div class="stats-grid">
                <div v-reveal class="stat-card rv d1"><div class="stat-num">12K+</div><div class="stat-lbl">Active Students</div></div>
                <div v-reveal class="stat-card rv d2"><div class="stat-num">850+</div><div class="stat-lbl">Teachers Onboard</div></div>
                <div v-reveal class="stat-card rv d3"><div class="stat-num">98%</div><div class="stat-lbl">Satisfaction Rate</div></div>
                <div v-reveal class="stat-card rv d4"><div class="stat-num">15+</div><div class="stat-lbl">Institutions</div></div>
              </div>

              <div class="about-tags">
                <span class="tag">👨‍💻 Built with passion</span>
                <span class="tag">🇧🇩 Made in Bangladesh</span>
                <span class="tag">🌍 Global vision</span>
              </div>
            </div>
            <div v-reveal class="about-canvas-wrap rv-r">
              <canvas id="about-canvas" ref="aboutCanvasRef"></canvas>
            </div>
          </div>
        </div>
      </section>

      <div class="divider-line"></div>

      <section id="testimonials">
        <div class="wrap">
          <p v-reveal class="sec-label rv">Voices</p>
          <h2 v-reveal class="sec-heading rv d1">Trusted by students<br />and <em>teachers alike</em></h2>

          <div class="testi-grid">
            <div v-reveal class="tc rv d1"><div class="tc-stars">★★★★★</div><p class="tc-quote">"The AI tutor changed everything for me. Instant help at any hour — my grades improved in the first month."</p><div class="tc-author"><div class="tc-avatar">🎓</div><div><div class="tc-name">Ranya Islam</div><div class="tc-role">CSE Student, Dhaka University</div></div></div></div>
            <div v-reveal class="tc rv d2"><div class="tc-stars">★★★★★</div><p class="tc-quote">"Managing three classrooms used to be exhausting. EduConnect consolidated everything — I save four hours every week."</p><div class="tc-author"><div class="tc-avatar">📖</div><div><div class="tc-name">Md. Farhan Hossain</div><div class="tc-role">Lecturer, BUET</div></div></div></div>
            <div v-reveal class="tc rv d3"><div class="tc-stars">★★★★★</div><p class="tc-quote">"The social feed keeps our community alive between sessions. Students help each other — it's a classroom that never sleeps."</p><div class="tc-author"><div class="tc-avatar">✨</div><div><div class="tc-name">Tasnim Akter</div><div class="tc-role">Physics Teacher, Rajshahi College</div></div></div></div>
          </div>
        </div>
      </section>

      <div class="divider-line"></div>

      <section id="contact">
        <div class="wrap">
          <p v-reveal class="sec-label rv">Get In Touch</p>
          <h2 v-reveal class="sec-heading rv d1">We'd love to<br /><em>hear from you</em></h2>

          <div class="contact-grid">
            <div v-reveal class="rv-l">
              <p class="sec-body">Have questions about EduConnect? Want to bring it to your institution? Our team responds within 24 hours.</p>
              <div class="contact-info">
                <div class="ci"><div class="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l8.2 5.2a1.5 1.5 0 001.6 0L21 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div><div><h4>Email</h4><p>hello@educonnect.io</p></div></div>
                <div class="ci"><div class="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div><h4>Location</h4><p>Dhaka, Bangladesh 🇧🇩</p></div></div>
                <div class="ci"><div class="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div><div><h4>Live Chat</h4><p>Mon–Fri, 9am–6pm BST</p></div></div>
              </div>
            </div>
            <div v-reveal class="rv-r">
              <form class="cf" @submit.prevent="sendContact">
                <div class="cf-row">
                  <div class="cf-f"><label>First Name</label><input v-model.trim="contactForm.firstName" type="text" placeholder="Ranya" /></div>
                  <div class="cf-f"><label>Last Name</label><input v-model.trim="contactForm.lastName" type="text" placeholder="Islam" /></div>
                </div>
                <div class="cf-f"><label>Email</label><input v-model.trim="contactForm.email" type="email" placeholder="you@institution.edu" /></div>
                <div class="cf-f"><label>Role</label><select v-model="contactForm.role"><option>Student</option><option>Teacher</option><option>Institution Admin</option><option>Other</option></select></div>
                <div class="cf-f"><label>Message</label><textarea v-model.trim="contactForm.message" rows="4" placeholder="How can we help?"></textarea></div>
                <button type="submit" class="btn btn-gold cta-btn" :disabled="isContactSending || contactMessageType === 'ok'">
                  <span v-if="isContactSending" class="btn-inline"><span class="spin"></span>Sending…</span>
                  <span v-else-if="contactMessageType === 'ok'">✓ Message Sent</span>
                  <span v-else class="btn-inline">Send Message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" /></svg></span>
                </button>
                <div class="amsg" :class="{ on: Boolean(contactMessageText), ok: contactMessageType === 'ok', err: contactMessageType === 'err' }">{{ contactMessageText }}</div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div class="divider-line"></div>

      <section id="login">
        <div class="wrap">
          <div class="login-grid login-pad">
            <div v-reveal class="rv-l">
              <p class="sec-label">Secure Access</p>
              <h2 class="sec-heading">Ready to<br /><em>get started?</em></h2>
              <p class="sec-body">Join thousands of students and teachers already using EduConnect. Your journey begins now.</p>
              <div class="login-perks">
                <div class="perk"><div class="perk-check">✓</div>Free to join — no credit card needed</div>
                <div class="perk"><div class="perk-check">✓</div>End-to-end encrypted and private</div>
                <div class="perk"><div class="perk-check">✓</div>Classroom ready in under 2 minutes</div>
                <div class="perk"><div class="perk-check">✓</div>AI Tutor available immediately</div>
                <div class="perk"><div class="perk-check">✓</div>Works on any device, anywhere</div>
              </div>
            </div>

            <div v-reveal class="rv-r">
              <div class="auth-card">
                <div v-if="!isRegisterMode">
                  <p class="auth-mode">Secure Access</p>
                  <h3 class="auth-title">Welcome back</h3>
                  <p class="auth-sub">Sign in to your EduConnect dashboard</p>

                  <div class="fg">
                    <div class="af">
                      <label>Role</label>
                      <div class="sw">
                        <select v-model="loginRole"><option value="student">🎓 Student</option><option value="teacher">📖 Teacher</option></select>
                        <span class="sw-arr"><svg viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
                      </div>
                    </div>

                    <div class="af">
                      <label>Email</label>
                      <div class="aw">
                        <span class="ai"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l8.2 5.2a1.5 1.5 0 001.6 0L21 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
                        <input v-model.trim="loginEmail" type="email" class="pl" :class="{ err: Boolean(loginErrors.email) }" placeholder="you@institution.edu" @input="clearLoginFieldError('email')" />
                      </div>
                      <span class="fe" :class="{ on: Boolean(loginErrors.email) }">{{ loginErrors.email }}</span>
                    </div>

                    <div class="af">
                      <label>Password</label>
                      <div class="aw">
                        <input v-model="loginPassword" :type="showLoginPassword ? 'text' : 'password'" class="pr" :class="{ err: Boolean(loginErrors.password) }" placeholder="Enter your password" @input="clearLoginFieldError('password')" />
                        <button class="eye" type="button" @click="showLoginPassword = !showLoginPassword">
                          <svg v-if="!showLoginPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0" /><path d="M2.5 12C3.8 8 7.5 5.25 12 5.25S20.2 8 21.5 12c-1.3 4-5 6.75-9.5 6.75S3.8 16 2.5 12z" /></svg>
                          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 102.8 2.8" /><path d="M9.7 5.4A10.8 10.8 0 0112 5.25c4.5 0 8.2 2.75 9.5 6.75a11 11 0 01-3.3 4.8" /><path d="M6.5 8.3A10.7 10.7 0 002.5 12c1.3 4 5 6.75 9.5 6.75 1 0 2-.13 2.9-.4" /></svg>
                        </button>
                      </div>
                      <span class="fe" :class="{ on: Boolean(loginErrors.password) }">{{ loginErrors.password }}</span>
                    </div>

                    <div class="opts-row">
                      <label class="chk-lbl"><input v-model="loginRemember" type="checkbox" /> Remember me</label>
                      <button class="ghost-btn" type="button">Forgot password?</button>
                    </div>

                    <button class="abtn" :disabled="isLoginLoading" @click="handleLogin">
                      <span v-if="isLoginLoading" class="btn-inline"><span class="spin"></span>Signing in…</span>
                      <span v-else class="btn-inline">Sign In <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></span>
                    </button>
                  </div>

                  <div class="auth-div"><div class="adl"></div><span class="adt">or</span><div class="adl"></div></div>
                  <div class="soc-row">
                    <button class="soc-btn" type="button"><svg viewBox="0 0 24 24" width="13" height="13"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg> Google</button>
                    <button class="soc-btn" type="button"><svg viewBox="0 0 24 24" width="13" height="13" fill="#00a4ef"><path d="M11.5 12.5H0v-1.5L8.5 0H11.5V12.5ZM12.5 0H24V12.5H12.5V0ZM0 13.5H11.5V24L0 13.5ZM12.5 13.5H24V24H12.5V13.5Z" /></svg> Microsoft</button>
                  </div>

                  <p class="auth-footer">New here? <button class="sw-mode" type="button" @click="toReg">Create account →</button></p>
                  <div class="amsg err" :class="{ on: Boolean(loginErrorMessage) }">{{ loginErrorMessage }}</div>
                  <div class="amsg ok" :class="{ on: Boolean(loginSuccessMessage) }">{{ loginSuccessMessage }}</div>
                </div>

                <div v-else>
                  <p class="auth-mode">New Account</p>
                  <h3 class="auth-title">Join EduConnect</h3>
                  <p class="auth-sub">Start your learning journey today</p>

                  <div class="fg fg2">
                    <div class="af c2">
                      <label>Role</label>
                      <div class="sw">
                        <select v-model="registerRole"><option value="student">🎓 Student</option><option value="teacher">📖 Teacher</option></select>
                        <span class="sw-arr"><svg viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
                      </div>
                    </div>

                    <div class="af c2"><label>Full Name</label><input v-model.trim="registerName" type="text" placeholder="Your full name" :class="{ err: Boolean(registerErrors.name) }" @input="clearRegisterFieldError('name')" /><span class="fe" :class="{ on: Boolean(registerErrors.name) }">{{ registerErrors.name }}</span></div>
                    <div class="af c2"><label>Email</label><input v-model.trim="registerEmail" type="email" placeholder="you@institution.edu" :class="{ err: Boolean(registerErrors.email) }" @input="clearRegisterFieldError('email')" /><span class="fe" :class="{ on: Boolean(registerErrors.email) }">{{ registerErrors.email }}</span></div>

                    <div class="af c2">
                      <label>Password</label>
                      <div class="aw">
                        <input v-model="registerPassword" :type="showRegisterPassword ? 'text' : 'password'" class="pr" placeholder="Create a strong password" :class="{ err: Boolean(registerErrors.password) }" @input="clearRegisterFieldError('password')" />
                        <button class="eye" type="button" @click="showRegisterPassword = !showRegisterPassword">
                          <svg v-if="!showRegisterPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0" /><path d="M2.5 12C3.8 8 7.5 5.25 12 5.25S20.2 8 21.5 12c-1.3 4-5 6.75-9.5 6.75S3.8 16 2.5 12z" /></svg>
                          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 102.8 2.8" /><path d="M9.7 5.4A10.8 10.8 0 0112 5.25c4.5 0 8.2 2.75 9.5 6.75a11 11 0 01-3.3 4.8" /><path d="M6.5 8.3A10.7 10.7 0 002.5 12c1.3 4 5 6.75 9.5 6.75 1 0 2-.13 2.9-.4" /></svg>
                        </button>
                      </div>
                      <div class="str">
                        <div v-for="segment in 4" :key="segment" class="ss" :style="getStrengthSegmentStyle(segment)"></div>
                      </div>
                      <span class="fe" :class="{ on: Boolean(registerErrors.password) }">{{ registerErrors.password }}</span>
                    </div>

                    <div class="af"><label>Department</label><input v-model.trim="registerDepartment" type="text" placeholder="Computer Science" :class="{ err: Boolean(registerErrors.department) }" @input="clearRegisterFieldError('department')" /><span class="fe" :class="{ on: Boolean(registerErrors.department) }">{{ registerErrors.department }}</span></div>
                    <div class="af"><label>Institution</label><input v-model.trim="registerInstitution" type="text" placeholder="Dhaka College" :class="{ err: Boolean(registerErrors.institution) }" @input="clearRegisterFieldError('institution')" /><span class="fe" :class="{ on: Boolean(registerErrors.institution) }">{{ registerErrors.institution }}</span></div>

                    <button class="abtn c2" :disabled="isRegisterLoading" @click="handleRegister">
                      <span v-if="isRegisterLoading" class="btn-inline"><span class="spin"></span>Creating account…</span>
                      <span v-else class="btn-inline">Create Account <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></span>
                    </button>
                  </div>

                  <p class="auth-footer">Have an account? <button class="sw-mode" type="button" @click="toLgn">Sign in →</button></p>
                  <div class="amsg err" :class="{ on: Boolean(registerErrorMessage) }">{{ registerErrorMessage }}</div>
                  <div class="amsg ok" :class="{ on: Boolean(registerSuccessMessage) }">{{ registerSuccessMessage }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="#hero" class="nav-brand footer-brand-link">
              <div class="nav-emblem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></div>
              <span class="nav-wordmark">EduConnect</span>
            </a>
            <p>Connecting students and teachers in one intelligent, beautifully designed learning workspace.</p>
          </div>
          <div class="footer-col"><h5>Platform</h5><a href="#features">Features</a><a href="#purpose">How it Works</a><a href="#login">Sign Up</a><a href="#">Pricing</a></div>
          <div class="footer-col"><h5>Company</h5><a href="#about">About</a><a href="#contact">Contact</a><a href="#">Blog</a><a href="#">Careers</a></div>
          <div class="footer-col"><h5>Legal</h5><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Policy</a></div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 EduConnect. Made with care in Bangladesh 🇧🇩</span>
          <div class="footer-soc"><a href="#">Twitter</a><a href="#">LinkedIn</a><a href="#">GitHub</a></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { login, register, type AuthUser, type UserRole } from '~/services/api/auth'
import { useUserStore } from '~/stores/user'

definePageMeta({ layout: 'blank' })

type LoginField = 'email' | 'password'
type RegisterField = 'name' | 'email' | 'password' | 'department' | 'institution'
type MessageType = 'ok' | 'err' | ''

const router = useRouter()
const userStore = useUserStore()

const cursorDotRef = ref<HTMLDivElement | null>(null)
const cursorRingRef = ref<HTMLDivElement | null>(null)
const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
const purposeCanvasRef = ref<HTMLCanvasElement | null>(null)
const aboutCanvasRef = ref<HTMLCanvasElement | null>(null)

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isRegisterMode = ref(false)

const loginRole = ref<UserRole>('student')
const loginEmail = ref('')
const loginPassword = ref('')
const loginRemember = ref(false)
const showLoginPassword = ref(false)
const isLoginLoading = ref(false)
const loginErrorMessage = ref('')
const loginSuccessMessage = ref('')

const registerRole = ref<UserRole>('student')
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerDepartment = ref('')
const registerInstitution = ref('')
const showRegisterPassword = ref(false)
const isRegisterLoading = ref(false)
const registerErrorMessage = ref('')
const registerSuccessMessage = ref('')

const loginErrors = reactive<Record<LoginField, string>>({
  email: '',
  password: '',
})

const registerErrors = reactive<Record<RegisterField, string>>({
  name: '',
  email: '',
  password: '',
  department: '',
  institution: '',
})

const contactForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: 'Student',
  message: '',
})

const isContactSending = ref(false)
const contactMessageText = ref('')
const contactMessageType = ref<MessageType>('')

const authCookie = useCookie<string | null>('educonnect_auth', { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
const tokenCookie = useCookie<string | null>('educonnect_token', { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })

let revealObserver: IntersectionObserver | null = null
let cursorAnimationFrame = 0
const mousePos = { x: 0, y: 0, rx: 0, ry: 0 }
const cleanupFns: Array<() => void> = []
const activeTimeouts = new Set<number>()

const scheduleTimeout = (fn: () => void, delay: number): void => {
  const timerId = window.setTimeout(() => {
    activeTimeouts.delete(timerId)
    fn()
  }, delay)
  activeTimeouts.add(timerId)
}

const getRevealObserver = (): IntersectionObserver | null => {
  if (!process.client) return null

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            revealObserver?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
  }

  return revealObserver
}

const vReveal = {
  mounted(el: HTMLElement) {
    getRevealObserver()?.observe(el)
  },
  unmounted(el: HTMLElement) {
    revealObserver?.unobserve(el)
  },
}

const toggleMob = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMob = (): void => {
  isMobileMenuOpen.value = false
}

const clearLoginFieldError = (field: LoginField): void => {
  loginErrors[field] = ''
}

const clearRegisterFieldError = (field: RegisterField): void => {
  registerErrors[field] = ''
}

const clearAuthMessages = (): void => {
  loginErrorMessage.value = ''
  loginSuccessMessage.value = ''
  registerErrorMessage.value = ''
  registerSuccessMessage.value = ''
}

const toReg = (): void => {
  clearAuthMessages()
  isRegisterMode.value = true
}

const toLgn = (): void => {
  clearAuthMessages()
  isRegisterMode.value = false
}

const validateEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const validateLoginForm = (): boolean => {
  loginErrors.email = ''
  loginErrors.password = ''

  let isValid = true

  if (!loginEmail.value.trim()) {
    loginErrors.email = 'Email is required'
    isValid = false
  } else if (!validateEmail(loginEmail.value.trim())) {
    loginErrors.email = 'Valid email is required'
    isValid = false
  }

  if (!loginPassword.value) {
    loginErrors.password = 'Password is required'
    isValid = false
  } else if (loginPassword.value.length < 6) {
    loginErrors.password = 'Minimum 6 characters'
    isValid = false
  }

  return isValid
}

const validateRegisterForm = (): boolean => {
  registerErrors.name = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.department = ''
  registerErrors.institution = ''

  let isValid = true

  if (!registerName.value.trim()) {
    registerErrors.name = 'Full name required'
    isValid = false
  }

  if (!registerEmail.value.trim()) {
    registerErrors.email = 'Email required'
    isValid = false
  } else if (!validateEmail(registerEmail.value.trim())) {
    registerErrors.email = 'Valid email required'
    isValid = false
  }

  if (!registerPassword.value) {
    registerErrors.password = 'Password required'
    isValid = false
  } else if (registerPassword.value.length < 6) {
    registerErrors.password = 'Minimum 6 characters'
    isValid = false
  }

  if (!registerDepartment.value.trim()) {
    registerErrors.department = 'Department required'
    isValid = false
  }

  if (!registerInstitution.value.trim()) {
    registerErrors.institution = 'Institution required'
    isValid = false
  }

  return isValid
}

const passwordStrengthScore = computed<number>(() => {
  const value = registerPassword.value
  let score = 0
  if (value.length >= 6) score++
  if (value.length >= 10) score++
  if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++
  return score
})

const getStrengthSegmentStyle = (segment: number): { background: string } => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#86efac']
  const score = passwordStrengthScore.value
  return {
    background: segment <= score && score > 0 ? colors[score - 1] : 'var(--line)',
  }
}

const setAuthCookies = (token: string | null): void => {
  if (token) {
    tokenCookie.value = token
    authCookie.value = 'true'
  } else {
    tokenCookie.value = null
    authCookie.value = null
  }
}

const mapUser = (apiUser: AuthUser) => ({
  id: apiUser.id,
  role: apiUser.role,
  email: apiUser.email,
  name: apiUser.name,
  displayName: apiUser.name,
  username: apiUser.username,
  avatar: apiUser.profilePicUrl || apiUser.avatar,
  profilePicUrl: apiUser.profilePicUrl,
  isProfilePublic: apiUser.isProfilePublic,
  department: apiUser.department,
  institution: apiUser.institution,
})

const persistAuthSession = (token: string, user: AuthUser): void => {
  if (!process.client) return

  const mappedUser = mapUser(user)
  localStorage.setItem('educonnect_token', token)
  localStorage.setItem('educonnect_auth', 'true')
  localStorage.setItem('educonnect_user', JSON.stringify(mappedUser))
  setAuthCookies(token)

  userStore.token = token
  userStore.user = mappedUser
  userStore.isAuthenticated = true
  userStore.persistSession()
}

const handleLogin = async (): Promise<void> => {
  clearAuthMessages()
  if (!validateLoginForm()) return

  isLoginLoading.value = true
  const response = await login(loginEmail.value.trim(), loginPassword.value, loginRole.value)
  isLoginLoading.value = false

  if (!response.success || !response.data) {
    loginErrorMessage.value = response.error || 'Login failed. Please try again.'
    return
  }

  persistAuthSession(response.data.token, response.data.user)
  loginSuccessMessage.value = '✓ Signed in successfully — redirecting…'
  await router.push('/home')
}

const handleRegister = async (): Promise<void> => {
  clearAuthMessages()
  if (!validateRegisterForm()) return

  isRegisterLoading.value = true
  const response = await register(
    registerName.value.trim(),
    registerEmail.value.trim(),
    registerPassword.value,
    registerRole.value,
    {
      department: registerDepartment.value.trim(),
      institution: registerInstitution.value.trim(),
    },
  )
  isRegisterLoading.value = false

  if (!response.success || !response.data) {
    registerErrorMessage.value = response.error || 'Registration failed. Please try again.'
    return
  }

  persistAuthSession(response.data.token, response.data.user)
  registerSuccessMessage.value = '✓ Account created — redirecting to dashboard…'
  await router.push('/home')
}

const sendContact = (): void => {
  contactMessageText.value = ''
  contactMessageType.value = ''

  if (!contactForm.firstName || !contactForm.email || !contactForm.message) {
    contactMessageText.value = 'Please provide your name, email, and message.'
    contactMessageType.value = 'err'
    return
  }

  isContactSending.value = true
  scheduleTimeout(() => {
    isContactSending.value = false
    contactMessageText.value = "Thank you — we'll be in touch within 24 hours."
    contactMessageType.value = 'ok'

    scheduleTimeout(() => {
      contactMessageType.value = ''
      contactMessageText.value = ''
    }, 3500)
  }, 1600)
}

const checkAuth = async (): Promise<void> => {
  if (!process.client) return
  userStore.checkAuth()

  const token = localStorage.getItem('educonnect_token') || tokenCookie.value
  const isAuthenticated = localStorage.getItem('educonnect_auth') || authCookie.value
  if (token && isAuthenticated === 'true') {
    await router.push('/home')
  }
}

const handleMouseMove = (event: MouseEvent): void => {
  mousePos.x = event.clientX
  mousePos.y = event.clientY

  if (cursorDotRef.value) {
    cursorDotRef.value.style.left = `${mousePos.x}px`
    cursorDotRef.value.style.top = `${mousePos.y}px`
  }
}

const startCursorAnimation = (): void => {
  const animate = () => {
    mousePos.rx += (mousePos.x - mousePos.rx) * 0.12
    mousePos.ry += (mousePos.y - mousePos.ry) * 0.12

    if (cursorRingRef.value) {
      cursorRingRef.value.style.left = `${mousePos.rx}px`
      cursorRingRef.value.style.top = `${mousePos.ry}px`
    }

    cursorAnimationFrame = window.requestAnimationFrame(animate)
  }

  cursorAnimationFrame = window.requestAnimationFrame(animate)
}

const disposeScene = (scene: THREE.Scene): void => {
  scene.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose())
      } else {
        mesh.material.dispose()
      }
    }
  })
}

const initHeroScene = (): (() => void) => {
  const canvas = bgCanvasRef.value
  if (!canvas) return () => undefined

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x07090f, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300)
  camera.position.set(0, 0, 22)

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  scene.add(new THREE.AmbientLight(0x1a2035, 1))

  const nodeCount = 120
  const positions = new Float32Array(nodeCount * 3)
  const nodeData: Array<{ ox: number; oy: number; oz: number; vx: number; vy: number; vz: number; phase: number }> = []

  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 6 + Math.random() * 8

    const x = (positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta))
    const y = (positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta))
    const z = (positions[i * 3 + 2] = radius * Math.cos(phi))

    nodeData.push({
      ox: x,
      oy: y,
      oz: z,
      vx: (Math.random() - 0.5) * 0.004,
      vy: (Math.random() - 0.5) * 0.004,
      vz: (Math.random() - 0.5) * 0.003,
      phase: Math.random() * Math.PI * 2,
    })
  }

  const nodeGeo = new THREE.BufferGeometry()
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const nodeMat = new THREE.PointsMaterial({ color: 0xc4a464, size: 0.09, transparent: true, opacity: 0.75, sizeAttenuation: true })
  const nodePoints = new THREE.Points(nodeGeo, nodeMat)
  scene.add(nodePoints)

  const lineGeo = new THREE.BufferGeometry()
  const lineArr = new Float32Array(50000 * 6)
  lineGeo.setAttribute('position', new THREE.BufferAttribute(lineArr, 3))
  const lineMat = new THREE.LineBasicMaterial({ color: 0x8a6a38, transparent: true, opacity: 0.18 })
  const lineSegs = new THREE.LineSegments(lineGeo, lineMat)
  scene.add(lineSegs)

  const dust = 600
  const dustPos = new Float32Array(dust * 3)
  for (let i = 0; i < dust; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 80
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 50
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  const dustMat = new THREE.PointsMaterial({ color: 0xd4c090, size: 0.035, transparent: true, opacity: 0.22, sizeAttenuation: true })
  scene.add(new THREE.Points(dustGeo, dustMat))

  const linePositions: number[] = []
  const maxDistance = 5.5
  const buildLines = () => {
    linePositions.length = 0
    const pos = nodeGeo.attributes.position.array as Float32Array
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3]
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDistance) {
          linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2])
        }
      }
    }
  }
  buildLines()

  let tmx = 0
  let tmy = 0
  let cmx = 0
  let cmy = 0
  let time = 0
  let animationFrame = 0

  const onMouseMove = (event: MouseEvent) => {
    tmx = event.clientX / window.innerWidth - 0.5
    tmy = event.clientY / window.innerHeight - 0.5
  }
  document.addEventListener('mousemove', onMouseMove)

  const animate = () => {
    animationFrame = window.requestAnimationFrame(animate)
    time += 0.004
    cmx += (tmx - cmx) * 0.025
    cmy += (tmy - cmy) * 0.025

    const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)
    const pos = nodeGeo.attributes.position.array as Float32Array

    for (let i = 0; i < nodeCount; i++) {
      const d = nodeData[i]
      d.ox += d.vx
      d.oy += d.vy
      d.oz += d.vz

      const breathe = 1 + Math.sin(time * 0.6 + d.phase) * 0.025
      pos[i * 3] = d.ox * breathe
      pos[i * 3 + 1] = d.oy * breathe + Math.sin(time * 0.5 + d.phase) * 0.08
      pos[i * 3 + 2] = d.oz * breathe

      if (Math.abs(d.ox) > 12) d.vx *= -1
      if (Math.abs(d.oy) > 12) d.vy *= -1
      if (Math.abs(d.oz) > 14) d.vz *= -1
    }

    nodeGeo.attributes.position.needsUpdate = true

    if (Math.round(time * 250) % 4 === 0) {
      buildLines()
      const lineArray = lineGeo.attributes.position.array as Float32Array
      const length = Math.min(linePositions.length, lineArray.length)
      for (let i = 0; i < length; i++) {
        lineArray[i] = linePositions[i]
      }
      lineGeo.setDrawRange(0, length / 3)
      lineGeo.attributes.position.needsUpdate = true
    }

    nodePoints.rotation.y = cmx * 0.6 + time * 0.05 + scrollPct * 1.2
    nodePoints.rotation.x = cmy * 0.4 + scrollPct * 0.4
    lineSegs.rotation.copy(nodePoints.rotation)

    renderer.domElement.style.opacity = String(Math.max(0, 1 - scrollPct * 2.5))
    renderer.render(scene, camera)
  }
  animate()

  return () => {
    window.cancelAnimationFrame(animationFrame)
    window.removeEventListener('resize', resize)
    document.removeEventListener('mousemove', onMouseMove)
    disposeScene(scene)
    renderer.dispose()
  }
}

const initPurposeScene = (): (() => void) => {
  const canvas = purposeCanvasRef.value
  if (!canvas || !canvas.parentElement) return () => undefined

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x141c2e, 1)

  const scene = new THREE.Scene()
  const getSize = () => ({ w: canvas.parentElement?.clientWidth ?? 1, h: canvas.parentElement?.clientHeight ?? 1 })
  const initial = getSize()

  const camera = new THREE.PerspectiveCamera(52, initial.w / initial.h, 0.1, 80)
  camera.position.set(0, 0, 10)
  renderer.setSize(initial.w, initial.h)

  const resizeObserver = new ResizeObserver(() => {
    const next = getSize()
    renderer.setSize(next.w, next.h)
    camera.aspect = next.w / next.h
    camera.updateProjectionMatrix()
  })
  resizeObserver.observe(canvas.parentElement)

  scene.add(new THREE.AmbientLight(0x111827, 1))
  const keyLight = new THREE.PointLight(0xc4a464, 3, 20)
  keyLight.position.set(4, 3, 5)
  scene.add(keyLight)
  const fillLight = new THREE.PointLight(0x6b9fd4, 2, 18)
  fillLight.position.set(-4, -2, 4)
  scene.add(fillLight)

  const configs = [
    [0, 0, 0, 1.4, 0xc4a464, 0.4],
    [-2.8, 1.2, 0.5, 0.7, 0x8a6a38, 0.28],
    [2.5, -1, 0.3, 0.85, 0x6b9fd4, 0.2],
    [-1.5, -2, -0.5, 0.55, 0xc4a464, 0.18],
    [1.8, 2.2, -0.4, 0.6, 0x6b9fd4, 0.22],
  ] as const

  const shapes: Array<{ seg: THREE.LineSegments; rx: number; ry: number; phase: number; speed: number; py: number }> = []

  configs.forEach(([x, y, z, radius, color, opacity]) => {
    const geo = new THREE.IcosahedronGeometry(radius, 1)
    const wireframe = new THREE.WireframeGeometry(geo)
    const seg = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
    seg.position.set(x, y, z)
    scene.add(seg)
    shapes.push({
      seg,
      rx: (Math.random() - 0.5) * 0.006,
      ry: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.3,
      py: y,
    })
  })

  let t = 0
  let animationFrame = 0

  const animate = () => {
    animationFrame = window.requestAnimationFrame(animate)
    t += 0.007

    shapes.forEach((shape) => {
      shape.seg.rotation.x += shape.rx
      shape.seg.rotation.y += shape.ry
      shape.seg.position.y = shape.py + Math.sin(t * shape.speed + shape.phase) * 0.12
    })

    keyLight.position.x = Math.cos(t * 0.3) * 5
    keyLight.position.z = Math.sin(t * 0.3) * 5 + 3
    renderer.render(scene, camera)
  }
  animate()

  return () => {
    window.cancelAnimationFrame(animationFrame)
    resizeObserver.disconnect()
    disposeScene(scene)
    renderer.dispose()
  }
}

const initAboutScene = (): (() => void) => {
  const canvas = aboutCanvasRef.value
  if (!canvas || !canvas.parentElement) return () => undefined

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x141c2e, 1)

  const scene = new THREE.Scene()
  const getSize = () => ({ w: canvas.parentElement?.clientWidth ?? 1, h: canvas.parentElement?.clientHeight ?? 1 })
  const initial = getSize()

  const camera = new THREE.PerspectiveCamera(50, initial.w / initial.h, 0.1, 80)
  camera.position.set(0, 0, 8)
  renderer.setSize(initial.w, initial.h)

  const resizeObserver = new ResizeObserver(() => {
    const next = getSize()
    renderer.setSize(next.w, next.h)
    camera.aspect = next.w / next.h
    camera.updateProjectionMatrix()
  })
  resizeObserver.observe(canvas.parentElement)

  scene.add(new THREE.AmbientLight(0x0c1120, 1))
  const keyLight = new THREE.PointLight(0xc4a464, 4, 22)
  scene.add(keyLight)
  const fillLight = new THREE.PointLight(0x6b9fd4, 2, 18)
  fillLight.position.set(-4, -3, 3)
  scene.add(fillLight)

  const globeGeo = new THREE.SphereGeometry(2.6, 24, 18)
  const globeWire = new THREE.WireframeGeometry(globeGeo)
  const globe = new THREE.LineSegments(globeWire, new THREE.LineBasicMaterial({ color: 0x8a6a38, transparent: true, opacity: 0.22 }))
  scene.add(globe)

  for (let i = 1; i < 5; i++) {
    const ringRadius = 2.6 * Math.sin((i / 5) * Math.PI)
    const ringY = 2.6 * Math.cos((i / 5) * Math.PI)
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadius, 0.008, 8, 60),
      new THREE.MeshBasicMaterial({ color: 0xc4a464, transparent: true, opacity: 0.35 }),
    )
    ring.position.y = ringY
    ring.rotation.x = Math.PI / 2
    scene.add(ring)
  }

  const orbitNode = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.18, 1),
    new THREE.MeshPhysicalMaterial({ color: 0xc4a464, emissive: 0xc4a464, emissiveIntensity: 0.4, metalness: 0.8, roughness: 0.1 }),
  )
  scene.add(orbitNode)

  let t = 0
  let animationFrame = 0

  const animate = () => {
    animationFrame = window.requestAnimationFrame(animate)
    t += 0.008
    globe.rotation.y = t * 0.12
    globe.rotation.x = Math.sin(t * 0.07) * 0.1

    orbitNode.position.set(Math.cos(t * 0.5) * 3.2, 0.6 * Math.sin(t * 0.7), Math.sin(t * 0.5) * 3.2)
    orbitNode.rotation.y = t

    keyLight.position.set(Math.cos(t * 0.35) * 6, 3, Math.sin(t * 0.35) * 6)
    renderer.render(scene, camera)
  }
  animate()

  return () => {
    window.cancelAnimationFrame(animationFrame)
    resizeObserver.disconnect()
    disposeScene(scene)
    renderer.dispose()
  }
}

onMounted(async () => {
  if (!process.client) return

  document.body.classList.add('landing-body')
  await checkAuth()

  const onScroll = () => {
    isScrolled.value = window.scrollY > 30
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  startCursorAnimation()

  cleanupFns.push(initHeroScene())
  cleanupFns.push(initPurposeScene())
  cleanupFns.push(initAboutScene())
  cleanupFns.push(() => window.removeEventListener('scroll', onScroll))
  cleanupFns.push(() => document.body.classList.remove('landing-body'))
})

onUnmounted(() => {
  if (cursorAnimationFrame) {
    window.cancelAnimationFrame(cursorAnimationFrame)
  }

  cleanupFns.forEach((cleanup) => cleanup())
  cleanupFns.length = 0

  revealObserver?.disconnect()
  revealObserver = null

  activeTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
  activeTimeouts.clear()
})
</script>

<style scoped>
:global(html) { scroll-behavior: smooth; }

.landing-page {
  --ink: var(--ec-page-bg, #07090f);
  --ink2: #0c1120;
  --ink3: #111827;
  --surface: rgba(255, 255, 255, 0.04);
  --surface2: #1a2438;
  --surface3: #1f2d45;

  --line: var(--border, rgba(255, 255, 255, 0.055));
  --line2: rgba(255, 255, 255, 0.1);
  --line-gold: rgba(196, 164, 100, 0.28);

  --gold: #c4a464;
  --gold2: #e8c882;
  --gold-dim: rgba(196, 164, 100, 0.1);
  --gold-glow: rgba(196, 164, 100, 0.18);

  --blue: #6b9fd4;

  --t1: #f4f1eb;
  --t2: rgba(244, 241, 235, 0.58);
  --t3: rgba(244, 241, 235, 0.28);
  --t4: rgba(244, 241, 235, 0.14);

  --r1: 16px;
  --r2: 12px;
  --r3: 8px;

  background: var(--ink);
  color: var(--t1);
  overflow-x: hidden;
  min-height: 100vh;
  cursor: none;
}

.landing-page,
.landing-page * {
  box-sizing: border-box;
}

.cur-dot {
  position: fixed;
  z-index: 9999;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.1s, background 0.2s;
  box-shadow: 0 0 8px var(--gold);
}

.cur-ring {
  position: fixed;
  z-index: 9998;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid rgba(196, 164, 100, 0.45);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: all 0.18s ease;
}

#bg-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 1;
  transition: opacity 1s;
}

.grain {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
}

main { position: relative; z-index: 2; }

.wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 72px);
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: 68px;
  display: flex;
  align-items: center;
  padding: 0 clamp(20px, 5vw, 72px);
  transition: background 0.4s, border-color 0.4s, backdrop-filter 0.4s;
  border-bottom: 1px solid transparent;
}

nav.scrolled {
  background: rgba(7, 9, 15, 0.88);
  backdrop-filter: blur(24px) saturate(1.3);
  border-color: var(--line);
}

.nav-inner {
  max-width: 1160px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.nav-emblem {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--gold), var(--gold2));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 1px rgba(196, 164, 100, 0.4), 0 4px 14px rgba(196, 164, 100, 0.15);
}

.nav-emblem svg { width: 15px; height: 15px; color: #07090f; }
.nav-wordmark { font-family: 'Instrument Serif', Georgia, serif; font-size: 18px; font-weight: 400; color: var(--t1); }

.nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
.nav-links a { font-size: 13.5px; font-weight: 500; color: var(--t2); text-decoration: none; transition: color 0.2s; }
.nav-links a:hover { color: var(--t1); }

.nav-cta {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid var(--line-gold) !important;
  background: var(--gold-dim) !important;
  color: var(--gold) !important;
  font-weight: 600 !important;
}

.mob-btn { display: none; background: none; border: none; color: var(--t1); cursor: pointer; }
.mob-btn svg { width: 20px; height: 20px; }

.mob-menu {
  position: fixed;
  top: 68px;
  left: 0;
  right: 0;
  background: rgba(7, 9, 15, 0.97);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--line);
  padding: 18px 24px;
  z-index: 199;
  transform: translateY(-6px);
  opacity: 0;
  pointer-events: none;
  transition: all 0.22s;
}

.mob-menu.open { transform: translateY(0); opacity: 1; pointer-events: all; }
.mob-menu a { display: block; padding: 12px 0; font-size: 15px; color: var(--t2); text-decoration: none; border-bottom: 1px solid var(--line); }

section { position: relative; }

.sec-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
}

.sec-heading { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 400; line-height: 1.18; }
.sec-heading em { font-style: italic; background: linear-gradient(90deg, var(--gold), var(--gold2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.sec-body { font-size: 15.5px; font-weight: 300; line-height: 1.82; color: var(--t2); max-width: 54ch; margin-top: 14px; }

.rv { opacity: 0; transform: translateY(32px); transition: opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1); }
.rv-l { opacity: 0; transform: translateX(-32px); transition: opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1); }
.rv-r { opacity: 0; transform: translateX(32px); transition: opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1); }
.rv.in, .rv-l.in, .rv-r.in { opacity: 1; transform: none; }
.d1 { transition-delay: 0.06s; }
.d2 { transition-delay: 0.14s; }
.d3 { transition-delay: 0.22s; }
.d4 { transition-delay: 0.3s; }
.d5 { transition-delay: 0.38s; }
.d6 { transition-delay: 0.46s; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  border-radius: 10px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: none;
}

.btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #07090f; }
.btn-outline { background: transparent; border: 1px solid var(--line2) !important; color: var(--t2); }

#hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 130px clamp(20px, 6vw, 80px) 100px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  border-radius: 100px;
  border: 1px solid rgba(196, 164, 100, 0.3);
  background: rgba(196, 164, 100, 0.07);
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 30px;
}

.badge-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); animation: pulse 2.2s infinite; }
.hero-title { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(3rem, 7.5vw, 7rem); font-weight: 400; line-height: 1.04; }
.hero-title .italic { font-style: italic; background: linear-gradient(100deg, var(--gold), var(--gold2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-sub { margin-top: 22px; font-size: clamp(15px, 1.8vw, 17px); font-weight: 300; line-height: 1.78; color: var(--t2); max-width: 52ch; }
.hero-actions { margin-top: 42px; display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.hero-pills { margin-top: 60px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.hero-pill { display: flex; align-items: center; gap: 8px; padding: 9px 18px; border-radius: 100px; border: 1px solid var(--line); background: rgba(20, 28, 46, 0.6); font-size: 12.5px; color: var(--t2); }
.pill-sep { width: 4px; height: 4px; border-radius: 50%; }
.pill-sep.gold { background: var(--gold); }
.pill-sep.blue { background: var(--blue); }
.pill-sep.gold2 { background: var(--gold2); }

.scroll-cue { position: absolute; bottom: 38px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; }
.scroll-cue-line { width: 1px; height: 44px; background: linear-gradient(to bottom, var(--gold), transparent); animation: breathe-line 2.2s ease-in-out infinite; }
.scroll-cue span { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--t3); }

.divider-line { height: 1px; background: linear-gradient(90deg, transparent, var(--line), transparent); }

#features, #purpose, #about, #testimonials, #contact, #login { padding: 110px 0; }
#features { background: linear-gradient(180deg, var(--ink) 0%, var(--ink2) 100%); }
#purpose { background: var(--ink2); }
#about { background: linear-gradient(180deg, var(--ink2) 0%, var(--ink3) 100%); }
#testimonials { background: var(--ink3); }
#contact { background: linear-gradient(180deg, var(--ink3) 0%, var(--ink2) 100%); }
#login { background: var(--ink2); }

.feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--r1); overflow: hidden; margin-top: 60px; }
.fc { padding: 36px 32px; background: var(--ink2); }
.fc-num { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--t3); margin-bottom: 20px; }
.fc-icon { width: 42px; height: 42px; border-radius: 11px; border: 1px solid rgba(196, 164, 100, 0.2); background: rgba(196, 164, 100, 0.07); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
.fc h3 { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
.fc p { font-size: 13.5px; font-weight: 300; line-height: 1.72; color: var(--t2); }

.purpose-grid, .about-grid, .contact-grid, .login-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
.purpose-canvas-wrap, .about-canvas-wrap { height: 440px; border-radius: var(--r1); border: 1px solid var(--line); background: var(--surface); overflow: hidden; position: relative; }
.about-canvas-wrap { height: 460px; }
#purpose-canvas, #about-canvas { position: absolute; inset: 0; width: 100% !important; height: 100% !important; }

.steps { display: flex; flex-direction: column; }
.step { display: flex; gap: 20px; padding: 22px 0; border-bottom: 1px solid var(--line); }
.step-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--gold); opacity: 0.6; min-width: 28px; }
.step h4 { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
.step p { font-size: 13.5px; font-weight: 300; line-height: 1.7; color: var(--t2); }

.mt12 { margin-top: 12px; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 38px; }
.stat-card { padding: 22px 20px; border-radius: var(--r2); border: 1px solid var(--line); background: var(--surface); }
.stat-num { font-family: 'Instrument Serif', Georgia, serif; font-size: 32px; background: linear-gradient(90deg, var(--gold), var(--gold2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-lbl { font-size: 12px; color: var(--t3); margin-top: 5px; }
.about-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
.tag { padding: 7px 14px; border-radius: 100px; border: 1px solid var(--line); background: var(--surface); font-size: 12.5px; color: var(--t2); }

.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
.tc { padding: 30px 28px; border-radius: var(--r1); border: 1px solid var(--line); background: var(--surface); }
.tc-stars { font-size: 12px; letter-spacing: 2px; color: var(--gold); margin-bottom: 16px; }
.tc-quote { font-family: 'Instrument Serif', Georgia, serif; font-size: 16px; font-style: italic; line-height: 1.7; margin-bottom: 24px; }
.tc-author { display: flex; align-items: center; gap: 12px; }
.tc-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--line-gold); display: flex; align-items: center; justify-content: center; }
.tc-name { font-size: 13.5px; font-weight: 700; }
.tc-role { font-size: 12px; color: var(--t3); margin-top: 2px; }

.contact-info { display: flex; flex-direction: column; gap: 14px; margin-top: 32px; }
.ci { display: flex; gap: 15px; align-items: flex-start; padding: 18px 20px; border-radius: var(--r2); border: 1px solid var(--line); background: var(--surface); }
.ci-icon { width: 36px; height: 36px; border-radius: 9px; border: 1px solid rgba(196, 164, 100, 0.2); background: var(--gold-dim); display: flex; align-items: center; justify-content: center; color: var(--gold); }

.cf { display: flex; flex-direction: column; gap: 13px; }
.cf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
.cf-f { display: flex; flex-direction: column; gap: 5px; }
.cf-f label { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: var(--t3); text-transform: uppercase; }
.cf-f input, .cf-f textarea, .cf-f select { padding: 12px 15px; border-radius: var(--r3); border: 1px solid var(--line); background: rgba(255, 255, 255, 0.03); color: var(--t1); font-family: 'Manrope', sans-serif; font-size: 13.5px; outline: none; }
.cf-f input:focus, .cf-f textarea:focus, .cf-f select:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(196, 164, 100, 0.1); }
.cta-btn { width: 100%; height: 46px; border-radius: 10px; justify-content: center; }

.login-pad { padding: 110px 0; }
.login-perks { display: flex; flex-direction: column; gap: 12px; margin-top: 34px; }
.perk { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--t2); }
.perk-check { width: 22px; height: 22px; border-radius: 6px; border: 1px solid rgba(196, 164, 100, 0.25); background: var(--gold-dim); display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--gold); }

.auth-card { border-radius: var(--r1); border: 1px solid var(--line); background: rgba(20, 28, 46, 0.8); backdrop-filter: blur(24px); box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.03), 0 32px 80px rgba(0, 0, 0, 0.45); padding: 36px; }
.auth-mode { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
.auth-title { font-family: 'Instrument Serif', Georgia, serif; font-size: 1.8rem; font-weight: 400; margin-bottom: 4px; }
.auth-sub { font-size: 13px; font-weight: 300; color: var(--t2); margin-bottom: 26px; }

.fg { display: grid; grid-template-columns: 1fr; gap: 13px; }
.fg2 { grid-template-columns: 1fr 1fr; }
.c2 { grid-column: span 2; }
.af { display: flex; flex-direction: column; gap: 5px; }
.af label { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: var(--t3); text-transform: uppercase; }
.aw { position: relative; }
.ai { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--t4); pointer-events: none; }
.ai svg { width: 13px; height: 13px; }

.af input, .af select {
  width: 100%;
  height: 42px;
  padding: 0 13px;
  border-radius: var(--r3);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
  color: var(--t1);
  font-family: 'Manrope', sans-serif;
  font-size: 13.5px;
  outline: none;
}

.af input.pl { padding-left: 38px; }
.af input.pr { padding-right: 40px; }
.af input.err { border-color: rgba(239, 68, 68, 0.45); }

.sw { position: relative; }
.sw-arr { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--t3); pointer-events: none; }
.sw-arr svg { width: 13px; height: 13px; }

.eye { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: var(--t3); cursor: pointer; border-radius: 6px; }
.eye svg { width: 14px; height: 14px; }

.fe { font-size: 11px; color: rgba(248, 113, 113, 0.85); display: none; }
.fe.on { display: block; }

.opts-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.chk-lbl { display: flex; align-items: center; gap: 7px; cursor: pointer; font-size: 12px; color: var(--t2); }

.ghost-btn { background: none; border: none; font-family: 'Manrope', sans-serif; font-size: 12px; color: var(--t3); cursor: pointer; padding: 0; }

.abtn {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(130deg, var(--gold), var(--gold2));
  color: #07090f;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-inline { display: inline-flex; align-items: center; gap: 7px; }
.abtn:disabled { opacity: 0.6; cursor: not-allowed; }

.spin {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(7, 9, 15, 0.3);
  border-top-color: #07090f;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.auth-div { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
.adl { flex: 1; height: 1px; background: var(--line); }
.adt { font-size: 10px; color: var(--t3); letter-spacing: 0.12em; text-transform: uppercase; }
.soc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.soc-btn { height: 38px; border-radius: var(--r3); border: 1px solid var(--line); background: rgba(255, 255, 255, 0.025); color: var(--t2); font-family: 'Manrope', sans-serif; font-size: 12.5px; display: flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer; }

.auth-footer { text-align: center; font-size: 13px; color: var(--t2); margin-top: 14px; }
.sw-mode { background: none; border: none; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; color: var(--gold); cursor: pointer; margin-left: 4px; }

.amsg { margin-top: 12px; padding: 10px 14px; border-radius: 9px; font-size: 12px; text-align: center; display: none; }
.amsg.on { display: block; }
.amsg.err { background: rgba(127, 29, 29, 0.22); border: 1px solid rgba(248, 113, 113, 0.2); color: rgba(248, 113, 113, 0.9); }
.amsg.ok { background: rgba(6, 78, 59, 0.22); border: 1px solid rgba(110, 231, 183, 0.2); color: rgba(110, 231, 183, 0.9); }

.str { display: flex; gap: 3px; margin-top: 5px; }
.ss { flex: 1; height: 2px; border-radius: 2px; background: var(--line); transition: background 0.3s; }

footer { background: var(--ink); border-top: 1px solid var(--line); padding: 56px clamp(20px, 5vw, 72px) 32px; }
.footer-inner { max-width: 1160px; margin: 0 auto; }
.footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.footer-brand-link { text-decoration: none; }
.footer-brand p { font-size: 13.5px; font-weight: 300; color: var(--t3); margin-top: 14px; max-width: 32ch; line-height: 1.72; }
.footer-col h5 { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--t3); margin-bottom: 16px; }
.footer-col a { display: block; font-size: 13.5px; color: var(--t3); text-decoration: none; margin-bottom: 10px; }
.footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 24px; border-top: 1px solid var(--line); font-size: 12.5px; color: var(--t3); }
.footer-soc { display: flex; gap: 18px; }
.footer-soc a { color: var(--t3); text-decoration: none; font-size: 12.5px; }

@keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
@keyframes breathe-line { 0%,100% { opacity: 0.4; transform: scaleY(0.55); } 50% { opacity: 1; transform: scaleY(1); } }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .feat-grid { grid-template-columns: 1fr 1fr; }
  .testi-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .mob-btn { display: flex; }
  .purpose-grid, .about-grid, .contact-grid, .login-grid { grid-template-columns: 1fr; gap: 48px; }
  .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
}

@media (max-width: 580px) {
  .feat-grid, .testi-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .cf-row { grid-template-columns: 1fr; }
  .fg2 { grid-template-columns: 1fr; }
  .c2 { grid-column: span 1; }
  .footer-top { grid-template-columns: 1fr; }
}
</style>
