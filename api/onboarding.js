// Onboarding endpoint - DISABLED in read-only mode
// New members are added directly to the roster sheet by admins

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Self-service onboarding is not available in read-only mode
  // Admins add new members directly to the Google Sheet
  return res.status(501).json({
    error: 'Self-service onboarding is not available. Please contact an administrator to complete your member setup.',
  });
}
