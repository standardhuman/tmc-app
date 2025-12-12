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
    // Sheet columns: "E-Mail", "First Name", "Last Name", "Status", "Current Team", "Cell"
    const members = await getSheetData(ROSTER_SHEET_ID, 'Sheet1');

    // Filter to only active members and format response
    const activeMembers = members
      .filter(m => {
        const status = m.status?.toLowerCase();
        const email = m.email || m['e-mail'];
        return status === 'active' && email;
      })
      .map(m => ({
        name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim(),
        email: m.email || m['e-mail'],
        phone: m.phone || m.cell,
        team: m.team || m.current_team,
        photoUrl: m.photo_url || m.photo || null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json(activeMembers);

  } catch (error) {
    console.error('Members error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
