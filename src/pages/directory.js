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

      <!-- Member Detail Modal -->
      <div id="member-modal" class="modal" style="display: none;">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div id="modal-body"></div>
        </div>
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
          m.email?.toLowerCase().includes(searchQuery) ||
          m.occupation?.toLowerCase().includes(searchQuery)
        );
      }

      directoryGrid.innerHTML = renderMemberCards(filtered);
      attachCardListeners();
    };

    // Team tab functionality
    const teamTabs = document.querySelectorAll('.team-tab');
    const directoryGrid = document.getElementById('directory-grid');
    const modal = document.getElementById('member-modal');
    const modalBody = document.getElementById('modal-body');

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

    // Modal functionality
    const openModal = (member) => {
      modalBody.innerHTML = renderMemberDetail(member);
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Attach click listeners to cards
    const attachCardListeners = () => {
      document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('click', () => {
          const memberName = card.dataset.member;
          const member = members.find(m => m.name === memberName);
          if (member) openModal(member);
        });
      });
    };

    attachCardListeners();

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
    <div class="card member-card" data-member="${member.name}" style="cursor: pointer;">
      ${member.photoUrl
        ? `<img src="${member.photoUrl}" alt="${member.name}" class="member-avatar">`
        : `<div class="member-avatar-placeholder">${getInitials(member.name)}</div>`
      }
      <div class="member-info">
        <h4>${member.name || 'Unknown'}${member.position ? ` <span class="member-position">${member.position}</span>` : ''}</h4>
        ${member.occupation ? `<p class="member-occupation">${member.occupation}</p>` : ''}
        ${member.purposeEssence ? `<p class="member-essence">"${member.purposeEssence}"</p>` : ''}
        <div class="member-meta">
          ${member.team ? `<span class="member-team">${member.team}</span>` : ''}
          ${member.yearJoined ? `<span class="member-year">Since ${member.yearJoined}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function renderMemberDetail(member) {
  return `
    <div class="member-detail">
      <div class="member-detail-header">
        ${member.photoUrl
          ? `<img src="${member.photoUrl}" alt="${member.name}" class="member-detail-avatar">`
          : `<div class="member-detail-avatar-placeholder">${getInitials(member.name)}</div>`
        }
        <div class="member-detail-title">
          <h2>${member.name}</h2>
          ${member.position ? `<span class="member-position-badge">${member.position}</span>` : ''}
          ${member.status === 'Sabbatical' ? `<span class="member-status-badge">On Sabbatical</span>` : ''}
        </div>
      </div>

      ${member.purposeEssence || member.purposeBlessing || member.purposeMission ? `
        <div class="member-detail-section">
          <h3>Purpose</h3>
          ${member.purposeEssence ? `<p><strong>Essence:</strong> ${member.purposeEssence}</p>` : ''}
          ${member.purposeBlessing ? `<p><strong>Blessing:</strong> ${member.purposeBlessing}</p>` : ''}
          ${member.purposeMission ? `<p><strong>Mission:</strong> ${member.purposeMission}</p>` : ''}
          ${member.purposeMessage ? `<p><strong>Message:</strong> ${member.purposeMessage}</p>` : ''}
        </div>
      ` : ''}

      <div class="member-detail-section">
        <h3>About</h3>
        ${member.occupation ? `<p><strong>Occupation:</strong> ${member.occupation}</p>` : ''}
        ${member.city && member.state ? `<p><strong>Location:</strong> ${member.city}, ${member.state}</p>` : ''}
        ${member.identities ? `<p><strong>Identities:</strong> ${member.identities}</p>` : ''}
      </div>

      <div class="member-detail-section">
        <h3>TMC Journey</h3>
        <p><strong>Team:</strong> ${member.team || 'Unknown'}</p>
        ${member.yearJoined ? `<p><strong>Member Since:</strong> ${member.yearJoined}</p>` : ''}
        ${member.sponsor ? `<p><strong>Sponsor:</strong> ${member.sponsor}</p>` : ''}
      </div>

      <div class="member-detail-section">
        <h3>Contact</h3>
        ${member.email ? `<p><a href="mailto:${member.email}">${member.email}</a></p>` : ''}
        ${member.phone ? `<p><a href="tel:${member.phone}">${member.phone}</a></p>` : ''}
        ${member.website ? `<p><a href="${member.website.startsWith('http') ? member.website : 'https://' + member.website}" target="_blank" rel="noopener">${member.website}</a></p>` : ''}
      </div>
    </div>
  `;
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
