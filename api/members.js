import { getSheetData } from './_lib/sheets.js';
import { requireAuth } from './_lib/auth.js';

const ROSTER_SHEET_ID = process.env.ROSTER_SHEET_ID;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check auth
  const auth = requireAuth(req);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const members = await getSheetData(ROSTER_SHEET_ID, 'Roster!A:Z');

    // Filter to only active members (not pending) and format response
    const activeMembers = members
      .filter(m => m.status !== 'pending' && m.email)
      .map(m => ({
        name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim(),
        email: m.email,
        phone: m.phone,
        team: m.team,
        photoUrl: m.photo_url || m.photo,
      }));

    return res.status(200).json(activeMembers);

  } catch (error) {
    console.error('Members error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
