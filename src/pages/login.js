import { requestMagicLink } from '../lib/api.js';
import { isAuthenticated } from '../lib/auth.js';
import { router } from '../lib/router.js';

export function renderLogin(app) {
  // If already logged in, redirect to members area
  if (isAuthenticated()) {
    router.navigate('/members');
    return;
  }

  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <h1>Member Login</h1>
        <p class="subtitle">Enter your email to receive a login link</p>

        <form id="login-form" class="login-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" name="email" class="form-input" required placeholder="your@email.com">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            Send Login Link
          </button>

          <div id="form-message" style="margin-top: 1rem;"></div>
        </form>

        <div class="login-footer">
          <p>Not a member? <a href="#/">Learn about The Men's Circle</a></p>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('login-form');
  const messageDiv = document.getElementById('form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    messageDiv.innerHTML = '';

    const email = form.email.value.trim();

    try {
      await requestMagicLink(email);
      messageDiv.innerHTML = `
        <div class="message message-success">
          Check your email! We've sent a login link to <strong>${email}</strong>
        </div>
      `;
      form.reset();
    } catch (error) {
      messageDiv.innerHTML = `
        <div class="message message-error">
          ${error.message || 'Unable to send login link. Please try again.'}
        </div>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Login Link';
    }
  });
}
