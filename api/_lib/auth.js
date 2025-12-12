import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-me';

// Create a magic link token (short-lived, for email)
export function createMagicToken(email, name, status) {
  return jwt.sign(
    { email, name, status, type: 'magic' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

// Create a session token (longer-lived, for auth)
export function createSessionToken(user) {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      status: user.status,
      team: user.team,
      type: 'session'
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Verify any token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Extract token from Authorization header
export function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// Middleware-style auth check
export function requireAuth(req) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return { error: 'No token provided', status: 401 };
  }

  const payload = verifyToken(token);
  if (!payload || payload.type !== 'session') {
    return { error: 'Invalid or expired token', status: 401 };
  }

  return { user: payload };
}
