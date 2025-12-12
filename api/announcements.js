import { getSheetData } from './_lib/sheets.js';
import { requireAuth } from './_lib/auth.js';

const ANNOUNCEMENTS_SHEET_ID = process.env.ANNOUNCEMENTS_SHEET_ID || process.env.ROSTER_SHEET_ID;

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
    const announcements = await getSheetData(ANNOUNCEMENTS_SHEET_ID, 'Announcements!A:Z');

    // Format and sort by date (newest first)
    const formattedAnnouncements = announcements
      .map(a => ({
        date: a.date,
        title: a.title,
        body: a.body || a.content,
        author: a.author,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json(formattedAnnouncements);

  } catch (error) {
    console.error('Announcements error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
