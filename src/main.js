import './styles.css';
import { router } from './lib/router.js';
import { requireAuth, getUser, isAuthenticated, clearSession } from './lib/auth.js';

// Import pages
import { renderHome } from './pages/home.js';
import { renderLogin } from './pages/login.js';
import { renderVerify } from './pages/verify.js';
// import { renderOnboarding } from './pages/onboarding.js'; // Disabled in read-only mode
import { renderDashboard } from './pages/dashboard.js';
import { renderDirectory } from './pages/directory.js';
import { renderResources } from './pages/resources.js';
import { renderAnnouncements } from './pages/announcements.js';
import { renderSettings } from './pages/settings.js';

const app = document.getElementById('app');

// Public routes
router.addRoute('/', () => renderHome(app));
router.addRoute('/login', () => renderLogin(app));
router.addRoute('/verify', ({ params }) => renderVerify(app, params));

// Protected routes
// Onboarding disabled in read-only mode - redirect to dashboard
router.addRoute('/onboarding', () => {
  router.navigate('/members');
});

router.addRoute('/members', () => {
  if (requireAuth()) {
    renderDashboard(app);
  }
});

router.addRoute('/members/directory', () => {
  if (requireAuth()) {
    renderDirectory(app);
  }
});

router.addRoute('/members/resources', () => {
  if (requireAuth()) {
    renderResources(app);
  }
});

router.addRoute('/members/announcements', () => {
  if (requireAuth()) {
    renderAnnouncements(app);
  }
});

router.addRoute('/members/settings', () => {
  if (requireAuth()) {
    renderSettings(app);
  }
});

router.addRoute('/logout', () => {
  clearSession();
  router.navigate('/');
});

// Helper to render member layout
export function renderMemberLayout(content, activePage = '') {
  const user = getUser();

  return `
    <nav class="nav">
      <div class="nav-content">
        <a href="#/" class="nav-logo">The Men's Circle</a>
        <div class="nav-links">
          <span style="color: var(--color-muted);">Welcome, ${user?.name || 'Member'}</span>
          <a href="#/logout">Logout</a>
        </div>
      </div>
    </nav>
    <div class="member-layout">
      <aside class="member-sidebar">
        <ul class="member-nav">
          <li><a href="#/members" class="${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
          <li><a href="#/members/directory" class="${activePage === 'directory' ? 'active' : ''}">Directory</a></li>
          <li><a href="#/members/resources" class="${activePage === 'resources' ? 'active' : ''}">Resources</a></li>
          <li><a href="#/members/announcements" class="${activePage === 'announcements' ? 'active' : ''}">Announcements</a></li>
          <li style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-border);"><a href="#/members/settings" class="${activePage === 'settings' ? 'active' : ''}">Info</a></li>
        </ul>
      </aside>
      <main class="member-main">
        ${content}
      </main>
    </div>
  `;
}

// Helper to render public layout
export function renderPublicLayout(content) {
  return `
    <nav class="nav">
      <div class="nav-content">
        <a href="#/" class="nav-logo">The Men's Circle</a>
        <div class="nav-links">
          <a href="#/login" class="btn btn-outline">Member Login</a>
        </div>
      </div>
    </nav>
    ${content}
    <footer class="footer">
      <p>The Men's Circle &bull; Berkeley, CA</p>
    </footer>
  `;
}
