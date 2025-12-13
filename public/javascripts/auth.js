// public/js/auth.js

async function signup(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
  
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
  
    const data = await res.json();
    const msgEl = document.getElementById('msg');
    if (res.ok) {
      msgEl.textContent = 'Account created — redirecting...';
      // redirect to quiz or login page
      setTimeout(() => window.location.href = '/login.html', 800);
    } else {
      msgEl.textContent = data.message || 'Signup failed';
    }
  }
  
  async function login(e) {
    e.preventDefault();
    const emailOrUsername = document.getElementById('emailOrUsername').value.trim();
    const password = document.getElementById('password').value;
  
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password })
    });
  
    const data = await res.json();
    const msgEl = document.getElementById('msg');
    if (res.ok) {
      msgEl.textContent = 'Logged in — redirecting...';
      setTimeout(() => window.location.href = '/profile.html', 600);
    } else {
      msgEl.textContent = data.message || 'Login failed';
    }
  }
  