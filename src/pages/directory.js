import { renderMemberLayout } from '../main.js';
import { getMembers } from '../lib/api.js';

export async function renderDirectory(app) {
  app.innerHTML = renderMemberLayout(`
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `, 'directory');

  try {
    const members = await getMembers();

    // Get unique teams and sort them
    const teams = [...new Set(members.map(m => m.team).filter(Boolean))].sort();

    app.innerHTML = renderMemberLayout(`
      <div class="page-header">
        <h1 class="page-title">Member Directory</h1>
        <p class="page-subtitle">${members.length} brothers in The Men's Circle</p>
      </div>

      <div class="directory-controls">
        <div class="team-tabs">
          <button class="team-tab active" data-team="all">All Teams</button>
          ${teams.map(team => `
            <button class="team-tab" data-team="${team}">${team}</button>
          `).join('')}
        </div>

        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search by name or email...">
        </div>
      </div>

      <div id="directory-grid" class="directory-grid">
        ${renderMemberCards(members)}
      </div>
    `, 'directory');

    // State
    let activeTeam = 'all';
    let searchQuery = '';

    const filterMembers = () => {
      let filtered = members;

      // Filter by team
      if (activeTeam !== 'all') {
        filtered = filtered.filter(m => m.team === activeTeam);
      }

      // Filter by search
      if (searchQuery) {
        filtered = filtered.filter(m =>
          m.name?.toLowerCase().includes(searchQuery) ||
          m.email?.toLowerCase().includes(searchQuery)
        );
      }

      directoryGrid.innerHTML = renderMemberCards(filtered);
    };

    // Team tab functionality
    const teamTabs = document.querySelectorAll('.team-tab');
    const directoryGrid = document.getElementById('directory-grid');

    teamTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        teamTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTeam = tab.dataset.team;
        filterMembers();
      });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      filterMembers();
    });

  } catch (error) {
    app.innerHTML = renderMemberLayout(`
      <div class="message message-error">
        Unable to load directory. ${error.message}
      </div>
    `, 'directory');
  }
}

function renderMemberCards(members) {
  if (members.length === 0) {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="color: var(--color-muted);">No members found</p>
      </div>
    `;
  }

  return members.map(member => `
    <div class="card member-card">
      ${member.photoUrl
        ? `<img src="${member.photoUrl}" alt="${member.name}" class="member-avatar">`
        : `<div class="member-avatar-placeholder">${getInitials(member.name)}</div>`
      }
      <div class="member-info">
        <h4>${member.name || 'Unknown'}</h4>
        <p>${member.email || ''}</p>
        ${member.phone ? `<p>${member.phone}</p>` : ''}
        ${member.team ? `<span class="member-team">${member.team}</span>` : ''}
      </div>
    </div>
  `).join('');
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
