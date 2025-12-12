import { renderMemberLayout } from '../main.js';
import { getUser } from '../lib/auth.js';
import { getAnnouncements } from '../lib/api.js';

export async function renderDashboard(app) {
  const user = getUser();

  app.innerHTML = renderMemberLayout(`
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `, 'dashboard');

  try {
    const announcements = await getAnnouncements();
    const recentAnnouncements = announcements.slice(0, 3);

    app.innerHTML = renderMemberLayout(`
      <div class="page-header">
        <h1 class="page-title">Welcome back, ${user?.name?.split(' ')[0] || 'Brother'}</h1>
        <p class="page-subtitle">The Men's Circle Member Dashboard</p>
      </div>

      <div style="background: var(--color-charcoal); color: white; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; text-align: center;">
        <p style="font-family: var(--font-serif); font-size: 1.25rem; font-style: italic; margin: 0;">
          "We forge brotherhood, inspire transformation, and support men in living on purpose."
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <a href="#/members/directory" class="card" style="text-decoration: none; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
          <h3 style="margin-bottom: 0.25rem;">Directory</h3>
          <p style="color: var(--color-muted); margin: 0; font-size: 0.9375rem;">Find and connect with brothers</p>
        </a>
        <a href="#/members/resources" class="card" style="text-decoration: none; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📚</div>
          <h3 style="margin-bottom: 0.25rem;">Resources</h3>
          <p style="color: var(--color-muted); margin: 0; font-size: 0.9375rem;">Guidelines, agendas & documents</p>
        </a>
        <a href="#/members/announcements" class="card" style="text-decoration: none; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📢</div>
          <h3 style="margin-bottom: 0.25rem;">Announcements</h3>
          <p style="color: var(--color-muted); margin: 0; font-size: 0.9375rem;">Latest updates & news</p>
        </a>
      </div>

      ${recentAnnouncements.length > 0 ? `
        <div class="card">
          <h3 style="margin-bottom: 1rem;">Recent Announcements</h3>
          <div class="announcement-list">
            ${recentAnnouncements.map(a => `
              <div class="announcement-item card" style="border-left: 4px solid var(--color-ember);">
                <p class="announcement-date">${formatDate(a.date)}</p>
                <h4 class="announcement-title">${a.title}</h4>
                <p class="announcement-body">${truncate(a.body, 150)}</p>
              </div>
            `).join('')}
          </div>
          <a href="#/members/announcements" style="display: inline-block; margin-top: 1rem;">View all announcements →</a>
        </div>
      ` : `
        <div class="card" style="text-align: center; padding: 3rem;">
          <p style="color: var(--color-muted); margin: 0;">No announcements yet</p>
        </div>
      `}
    `, 'dashboard');

  } catch (error) {
    app.innerHTML = renderMemberLayout(`
      <div class="message message-error">
        Unable to load dashboard. ${error.message}
      </div>
    `, 'dashboard');
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncate(text, length) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}
