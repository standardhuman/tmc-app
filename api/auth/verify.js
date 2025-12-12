import { getSheetData } from '../_lib/sheets.js';
import { verifyToken, createSessionToken } from '../_lib/auth.js';

const ROSTER_SHEET_ID = process.env.ROSTER_SHEET_ID;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify the magic token
    const payload = verifyToken(token);
    if (!payload || payload.type !== 'magic') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get fresh user data from roster
    // Sheet columns: "E-Mail", "First Name", "Last Name", "Status", "Current Team"
    const members = await getSheetData(ROSTER_SHEET_ID, 'Sheet1');
    const member = members.find(m =>
      m.email?.toLowerCase() === payload.email.toLowerCase() ||
      m['e-mail']?.toLowerCase() === payload.email.toLowerCase()
    );

    if (!member) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Map column names from sheet
    const memberEmail = member.email || member['e-mail'];
    const memberName = member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim();
    const memberTeam = member.team || member.current_team;

    // Create session token with current user data
    const sessionToken = createSessionToken({
      email: memberEmail,
      name: memberName,
      status: member.status?.toLowerCase() || 'active',
      team: memberTeam,
    });

    return res.status(200).json({ token: sessionToken });

  } catch (error) {
    console.error('Auth verify error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
