import { renderMemberLayout } from '../main.js';
import { getAnnouncements } from '../lib/api.js';

export async function renderAnnouncements(app) {
  app.innerHTML = renderMemberLayout(`
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `, 'announcements');

  try {
    const announcements = await getAnnouncements();

    app.innerHTML = renderMemberLayout(`
      <div class="page-header">
        <h1 class="page-title">Announcements</h1>
        <p class="page-subtitle">Updates and news from The Men's Circle</p>
      </div>

      ${announcements.length > 0 ? `
        <div class="announcement-list">
          ${announcements.map(announcement => `
            <div class="card announcement-item">
              <p class="announcement-date">${formatDate(announcement.date)}</p>
              <h3 class="announcement-title">${announcement.title}</h3>
              <div class="announcement-body" style="white-space: pre-wrap;">
                ${announcement.body}
              </div>
              ${announcement.author ? `
                <p style="margin-top: 1rem; font-size: 0.9375rem; color: var(--color-muted);">
                  — ${announcement.author}
                </p>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="card" style="text-align: center; padding: 3rem;">
          <p style="color: var(--color-muted); margin: 0;">No announcements yet</p>
        </div>
      `}
    `, 'announcements');

  } catch (error) {
    app.innerHTML = renderMemberLayout(`
      <div class="message message-error">
        Unable to load announcements. ${error.message}
      </div>
    `, 'announcements');
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
