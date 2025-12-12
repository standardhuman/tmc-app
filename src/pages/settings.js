import { renderMemberLayout } from '../main.js';
import { getConfig } from '../lib/api.js';

// Settings page - read-only view of site configuration
// To edit these values, update the Config sheet directly in Google Sheets

export async function renderSettings(app) {
  app.innerHTML = renderMemberLayout(`
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `, 'settings');

  try {
    const config = await getConfig();

    app.innerHTML = renderMemberLayout(`
      <div class="page-header">
        <h1 class="page-title">Site Information</h1>
        <p class="page-subtitle">Current site configuration (managed via Google Sheets)</p>
      </div>

      <!-- Circling Information -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <h3 style="color: var(--color-forest); margin-bottom: 1rem;">Circling Location</h3>

        ${config.circling_location_name ? `
          <div style="margin-bottom: 1rem;">
            <strong>Location:</strong> ${config.circling_location_name}
          </div>
        ` : ''}

        ${config.circling_address ? `
          <div style="margin-bottom: 1rem;">
            <strong>Address:</strong> ${config.circling_address}
          </div>
        ` : ''}

        ${config.circling_directions_url ? `
          <div style="margin-bottom: 1rem;">
            <a href="${config.circling_directions_url}" target="_blank" class="btn btn-outline" style="display: inline-block;">
              Get Directions
            </a>
          </div>
        ` : ''}

        ${config.circling_notes ? `
          <div style="background: var(--color-cream); padding: 1rem; border-radius: 6px; margin-top: 1rem;">
            <strong>Notes:</strong><br>
            ${config.circling_notes}
          </div>
        ` : ''}

        ${!config.circling_location_name && !config.circling_address ? `
          <p style="color: var(--color-muted);">No circling location configured yet.</p>
        ` : ''}
      </div>

      <!-- Quick Links -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <h3 style="color: var(--color-forest); margin-bottom: 1rem;">Quick Links</h3>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          ${config.calendar_url ? `
            <a href="${config.calendar_url}" target="_blank" class="btn btn-primary">
              Calendar
            </a>
          ` : ''}

          ${config.communication_url ? `
            <a href="${config.communication_url}" target="_blank" class="btn btn-primary">
              Slack / Communication
            </a>
          ` : ''}
        </div>

        ${!config.calendar_url && !config.communication_url ? `
          <p style="color: var(--color-muted);">No quick links configured yet.</p>
        ` : ''}
      </div>

      <p style="color: var(--color-muted); font-size: 0.875rem; margin-top: 2rem;">
        To update this information, edit the "Config" tab in the Google Sheet.
      </p>
    `, 'settings');

  } catch (error) {
    app.innerHTML = renderMemberLayout(`
      <div class="page-header">
        <h1 class="page-title">Site Information</h1>
      </div>
      <div class="card">
        <p style="color: var(--color-muted);">
          No configuration has been set up yet. The Config sheet may need to be created.
        </p>
      </div>
    `, 'settings');
  }
}
