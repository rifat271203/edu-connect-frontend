<template>
  <div class="login-container">
    <!-- Left Section - Promotional -->
    <div class="left-section">
      <!-- Decorative Clouds -->
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
      <div class="cloud cloud-4"></div>
      <div class="cloud cloud-5"></div>
      
      <!-- Logo -->
      <div class="logo-container">
        <div class="logo">
          <!-- Book Icon -->
          <svg class="book-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12C8 9.79086 9.79086 8 12 8H28C30.2091 8 32 9.79086 32 12V52C32 54.2091 30.2091 56 28 56H12C9.79086 56 8 54.2091 8 52V12Z" fill="white" fill-opacity="0.9"/>
            <path d="M32 12C32 9.79086 33.7909 8 36 8H52C54.2091 8 56 9.79086 56 12V52C56 54.2091 54.2091 56 52 56H36C33.7909 56 32 54.2091 32 52V12Z" fill="white" fill-opacity="0.8"/>
            <path d="M20 8H44V20C44 20 38 16 32 16C26 16 20 20 20 20V8Z" fill="#3b4fd6"/>
            <!-- Graduation Cap -->
            <path d="M32 2L52 10L32 18L12 10L32 2Z" fill="white"/>
            <path d="M44 12V22L32 28L20 22V12" stroke="white" stroke-width="2" fill="none"/>
            <rect x="48" y="10" width="4" height="14" fill="white"/>
            <circle cx="50" cy="26" r="3" fill="white"/>
          </svg>
        </div>
        <h1 class="logo-text">EduConnect</h1>
      </div>
      
      <!-- Promotional Text -->
      <div class="promo-content">
        <p class="promo-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco.
        </p>
        <div class="promo-footer">
          <p class="footer-line">CREATOR HERE</p>
          <p class="footer-line">DESIGNER HERE</p>
        </div>
      </div>
    </div>
    
    <!-- Right Section - Login Form -->
    <div class="right-section">
      <div class="login-form-container">
        <h2 class="form-title">Log In to EduConnect</h2>
        
        <form @submit.prevent="handleSubmit" class="login-form">
          <!-- Email Input -->
          <div class="input-group">
            <label class="input-label">Email or Username</label>
            <input 
              type="text" 
              class="input-field" 
              placeholder="Enter your username"
              v-model="username"
            />
          </div>
          
          <!-- Password Input -->
          <div class="input-group">
            <label class="input-label">Password</label>
            <input 
              type="password" 
              class="input-field" 
              placeholder="Enter your password"
              v-model="password"
            />
          </div>
          
          <!-- Forgot Password -->
          <div class="forgot-password">
            <a href="#" class="forgot-link">Forgot Password?</a>
          </div>
          
          <!-- Sign In Button -->
          <button type="submit" class="btn btn-signin">
            Sign In
          </button>
          
          <!-- Sign Up Button -->
          <button type="button" class="btn btn-signup">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EduConnectLogin',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>

<style scoped>
/* Reset and Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Container */
.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
}

/* Left Section */
.left-section {
  flex: 0 0 45%;
  background: linear-gradient(180deg, #0a192f 0%, #112240 100%);
  padding: 40px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Cloud Styles */
.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  filter: blur(2px);
}

.cloud-1 {
  width: 200px;
  height: 60px;
  top: 15%;
  left: 10%;
  border-radius: 100px;
}

.cloud-2 {
  width: 150px;
  height: 45px;
  top: 25%;
  left: 25%;
  border-radius: 100px;
}

.cloud-3 {
  width: 180px;
  height: 55px;
  top: 45%;
  left: 5%;
  border-radius: 100px;
}

.cloud-4 {
  width: 220px;
  height: 65px;
  top: 60%;
  left: 20%;
  border-radius: 100px;
}

.cloud-5 {
  width: 160px;
  height: 50px;
  top: 75%;
  left: 8%;
  border-radius: 100px;
}

/* Logo */
.logo-container {
  text-align: center;
  margin-top: 40px;
  position: relative;
  z-index: 10;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.book-icon {
  width: 100%;
  height: 100%;
}

.logo-text {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Promotional Content */
.promo-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 20px;
}

.promo-text {
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
}

.promo-footer {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.footer-line {
  color: #888888;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Right Section */
.right-section {
  flex: 0 0 55%;
  background: #121212;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Login Form Container */
.login-form-container {
  width: 100%;
  max-width: 400px;
}

.form-title {
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
}

/* Form Styles */
.login-form {
  width: 100%;
}

.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  height: 48px;
  background: #2a2a2a;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.input-field::placeholder {
  color: #e0e0e0;
}

.input-field:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 79, 214, 0.5);
  background: #333333;
}

/* Forgot Password */
.forgot-password {
  text-align: right;
  margin-bottom: 24px;
}

.forgot-link {
  color: #ffffff;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #3b4fd6;
}

/* Buttons */
.btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-signin {
  background: #3b4fd6;
  color: #ffffff;
  border: none;
  margin-bottom: 16px;
}

.btn-signin:hover {
  background: #2d3cb3;
  box-shadow: 0 4px 15px rgba(59, 79, 214, 0.4);
}

.btn-signup {
  background: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.btn-signup:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }
  
  .left-section,
  .right-section {
    flex: none;
    width: 100%;
  }
  
  .left-section {
    min-height: 40vh;
    padding: 30px 20px;
  }
  
  .right-section {
    min-height: 60vh;
    padding: 40px 20px;
  }
  
  .cloud-1, .cloud-2, .cloud-3, .cloud-4, .cloud-5 {
    opacity: 0.5;
  }
  
  .promo-content {
    display: none;
  }
}

@media (max-width: 480px) {
  .form-title {
    font-size: 24px;
  }
  
  .login-form-container {
    padding: 0 10px;
  }
}
</style>
