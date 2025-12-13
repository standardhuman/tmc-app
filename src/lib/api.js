// API client for backend calls
import { getSession, clearSession } from './auth.js';

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const session = getSession();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  // Handle 401 - clear session and redirect to login
  if (response.status === 401) {
    clearSession();
    window.location.hash = '/login';
    throw new Error('Session expired');
  }

  // Handle empty responses (e.g., 404 from missing API endpoint)
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error('Server error: Unable to connect to API');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth endpoints
export async function requestMagicLink(email) {
  return request('/auth/request', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function verifyMagicLink(token) {
  return request('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
}

// Contact form
export async function submitContactForm(data) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Members
export async function getMembers() {
  return request('/members');
}

export async function getMember(email) {
  return request(`/members/${encodeURIComponent(email)}`);
}

export async function updateMember(email, data) {
  return request(`/members/${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Onboarding
export async function completeOnboarding(data) {
  return request('/onboarding', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Upload photo - converts to base64 and sends as JSON
export async function uploadPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await request('/upload', {
          method: 'POST',
          body: JSON.stringify({ photoData: reader.result })
        });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Resources
export async function getResources() {
  return request('/resources');
}

// Announcements
export async function getAnnouncements() {
  return request('/announcements');
}

// Config / Settings
export async function getConfig() {
  return request('/config');
}

export async function updateConfig(data) {
  return request('/config', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
