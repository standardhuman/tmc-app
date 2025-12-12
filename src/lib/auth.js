// Auth helper functions
const TOKEN_KEY = 'tmc_session';

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    // Decode JWT payload (without verification - server will verify)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check if expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearSession();
      return null;
    }

    return {
      token,
      user: payload
    };
  } catch (e) {
    clearSession();
    return null;
  }
}

export function setSession(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return getSession() !== null;
}

export function getUser() {
  const session = getSession();
  return session ? session.user : null;
}

export function requireAuth(callback) {
  const session = getSession();
  if (!session) {
    window.location.hash = '/login';
    return false;
  }

  // Check if user needs onboarding
  if (session.user.status === 'pending' && window.location.hash !== '#/onboarding') {
    window.location.hash = '/onboarding';
    return false;
  }

  if (callback) callback(session);
  return true;
}
