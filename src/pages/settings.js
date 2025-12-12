import { renderMemberLayout } from '../main.js';
import { getConfig, updateConfig } from '../lib/api.js';
import { getUser } from '../lib/auth.js';

export async function renderSettings(app) {
  const user = getUser();

  app.innerHTML = renderMemberLayout(`
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `, 'settings');

  try {
    const config = await getConfig();

    app.innerHTML = renderMemberLayout(`
      <div class="page-header">
        <h1 class="page-title">Site Settings</h1>
        <p class="page-subtitle">Configure dynamic content and data sources</p>
      </div>

      <form id="settings-form">
        <!-- Circling Information -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="color: var(--color-forest); margin-bottom: 1rem;">Circling Location</h3>
          <p style="color: var(--color-muted); margin-bottom: 1.5rem;">
            Update this when the circling location changes (e.g., winter vs summer locations)
          </p>

          <div class="form-group">
            <label class="form-label">Current Location Name</label>
            <input type="text" name="circling_location_name" class="form-input"
                   value="${config.circling_location_name || ''}"
                   placeholder="e.g., John's Backyard, Berkeley Hills">
          </div>

          <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" name="circling_address" class="form-input"
                   value="${config.circling_address || ''}"
                   placeholder="123 Main St, Berkeley, CA">
          </div>

          <div class="form-group">
            <label class="form-label">Google Maps / Directions URL</label>
            <input type="url" name="circling_directions_url" class="form-input"
                   value="${config.circling_directions_url || ''}"
                   placeholder="https://maps.google.com/...">
          </div>

          <div class="form-group">
            <label class="form-label">Additional Notes</label>
            <textarea name="circling_notes" class="form-textarea"
                      placeholder="Parking instructions, gate codes, etc.">${config.circling_notes || ''}</textarea>
          </div>
        </div>

        <!-- Data Sources -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="color: var(--color-forest); margin-bottom: 1rem;">Google Sheets Data Sources</h3>
          <p style="color: var(--color-muted); margin-bottom: 1.5rem;">
            URLs to the Google Sheets that power different sections. Changes here require a site redeploy to take effect.
          </p>

          <div class="form-group">
            <label class="form-label">Roster Sheet URL</label>
            <input type="url" name="roster_sheet_url" class="form-input"
                   value="${config.roster_sheet_url || ''}"
                   placeholder="https://docs.google.com/spreadsheets/d/...">
            <p class="form-hint">Contains member directory and authentication data</p>
          </div>

          <div class="form-group">
            <label class="form-label">Resources Sheet URL</label>
            <input type="url" name="resources_sheet_url" class="form-input"
                   value="${config.resources_sheet_url || ''}"
                   placeholder="https://docs.google.com/spreadsheets/d/...">
            <p class="form-hint">Contains documents, guidelines, and reference materials</p>
          </div>

          <div class="form-group">
            <label class="form-label">Announcements Sheet URL</label>
            <input type="url" name="announcements_sheet_url" class="form-input"
                   value="${config.announcements_sheet_url || ''}"
                   placeholder="https://docs.google.com/spreadsheets/d/...">
            <p class="form-hint">Contains community announcements and updates</p>
          </div>

          <div class="form-group">
            <label class="form-label">House Cleaning Documents URL</label>
            <input type="url" name="house_cleaning_url" class="form-input"
                   value="${config.house_cleaning_url || ''}"
                   placeholder="https://docs.google.com/spreadsheets/d/...">
            <p class="form-hint">Documents for men going through initiation</p>
          </div>
        </div>

        <!-- Custom Links -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="color: var(--color-forest); margin-bottom: 1rem;">Quick Links</h3>
          <p style="color: var(--color-muted); margin-bottom: 1.5rem;">
            Useful links that appear throughout the site
          </p>

          <div class="form-group">
            <label class="form-label">Calendar URL</label>
            <input type="url" name="calendar_url" class="form-input"
                   value="${config.calendar_url || ''}"
                   placeholder="https://calendar.google.com/...">
          </div>

          <div class="form-group">
            <label class="form-label">Slack / Communication Channel URL</label>
            <input type="url" name="communication_url" class="form-input"
                   value="${config.communication_url || ''}"
                   placeholder="https://slack.com/...">
          </div>
        </div>

        <button type="submit" class="btn btn-primary">
          Save Settings
        </button>

        <div id="form-message" style="margin-top: 1rem;"></div>
      </form>
    `, 'settings');

    // Handle form submission
    const form = document.getElementById('settings-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
      messageDiv.innerHTML = '';

      const formData = new FormData(form);
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      try {
        await updateConfig(data);
        messageDiv.innerHTML = `
          <div class="message message-success">
            Settings saved successfully!
          </div>
        `;
      } catch (error) {
        messageDiv.innerHTML = `
          <div class="message message-error">
            ${error.message || 'Failed to save settings. Please try again.'}
          </div>
        `;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Settings';
      }
    });

  } catch (error) {
    app.innerHTML = renderMemberLayout(`
      <div class="message message-error">
        Unable to load settings. ${error.message}
      </div>
    `, 'settings');
  }
}
