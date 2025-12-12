import { renderMemberLayout } from '../main.js';
import { getResources } from '../lib/api.js';

export async function renderResources(app) {
  app.innerHTML = renderMemberLayout(`
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `, 'resources');

  try {
    const resources = await getResources();

    // Group by category
    const grouped = resources.reduce((acc, resource) => {
      const category = resource.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(resource);
      return acc;
    }, {});

    app.innerHTML = renderMemberLayout(`
      <div class="page-header">
        <h1 class="page-title">Resources</h1>
        <p class="page-subtitle">Documentation, guidelines, and reference materials</p>
      </div>

      ${Object.keys(grouped).length > 0 ? `
        ${Object.entries(grouped).map(([category, items]) => `
          <div class="card" style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--color-forest); margin-bottom: 1rem;">${category}</h3>
            <div class="resource-list">
              ${items.map(resource => `
                <div class="resource-item" style="padding: 1rem 0; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                  <div class="resource-info" style="flex: 1;">
                    <h4 style="margin-bottom: 0.25rem;">${resource.title}</h4>
                    ${resource.description ? `<p style="margin: 0; color: var(--color-muted);">${resource.description}</p>` : ''}
                  </div>
                  ${resource.url ? `
                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="flex-shrink: 0;">
                      Open
                    </a>
                  ` : resource.content ? `
                    <button class="btn btn-outline" onclick="toggleContent(this, '${resource.id}')" style="flex-shrink: 0;">
                      View
                    </button>
                  ` : ''}
                </div>
                ${resource.content && !resource.url ? `
                  <div id="content-${resource.id}" style="display: none; padding: 1rem; background: var(--color-cream); border-radius: 6px; margin: 0.5rem 0 1rem; white-space: pre-wrap;">
                    ${resource.content}
                  </div>
                ` : ''}
              `).join('')}
            </div>
          </div>
        `).join('')}
      ` : `
        <div class="card" style="text-align: center; padding: 3rem;">
          <p style="color: var(--color-muted); margin: 0;">No resources available yet</p>
        </div>
      `}
    `, 'resources');

    // Add toggle function
    window.toggleContent = (btn, id) => {
      const content = document.getElementById(`content-${id}`);
      if (content.style.display === 'none') {
        content.style.display = 'block';
        btn.textContent = 'Hide';
      } else {
        content.style.display = 'none';
        btn.textContent = 'View';
      }
    };

  } catch (error) {
    app.innerHTML = renderMemberLayout(`
      <div class="message message-error">
        Unable to load resources. ${error.message}
      </div>
    `, 'resources');
  }
}
