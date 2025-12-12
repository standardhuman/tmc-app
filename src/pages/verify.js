import { verifyMagicLink } from '../lib/api.js';
import { setSession, getUser } from '../lib/auth.js';
import { router } from '../lib/router.js';

export async function renderVerify(app, params) {
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="loading">
          <div class="spinner"></div>
        </div>
        <p style="text-align: center; color: var(--color-muted); margin-top: 1rem;">
          Verifying your login...
        </p>
      </div>
    </div>
  `;

  const token = params.token;

  if (!token) {
    showError(app, 'Invalid login link. Please request a new one.');
    return;
  }

  try {
    const response = await verifyMagicLink(token);

    if (response.token) {
      setSession(response.token);

      // Check if user needs onboarding
      const user = getUser();
      if (user?.status === 'pending') {
        router.navigate('/onboarding');
      } else {
        router.navigate('/members');
      }
    } else {
      showError(app, 'Invalid or expired login link. Please request a new one.');
    }
  } catch (error) {
    showError(app, error.message || 'Unable to verify login. Please try again.');
  }
}

function showError(app, message) {
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <h1 style="color: var(--color-error);">Login Failed</h1>
        <p style="color: var(--color-muted); margin-bottom: 2rem;">${message}</p>
        <a href="#/login" class="btn btn-primary" style="width: 100%;">
          Try Again
        </a>
      </div>
    </div>
  `;
}
