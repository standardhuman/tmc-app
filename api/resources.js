import { getSheetData } from './_lib/sheets.js';
import { requireAuth } from './_lib/auth.js';

const RESOURCES_SHEET_ID = process.env.RESOURCES_SHEET_ID || process.env.ROSTER_SHEET_ID;

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
    const resources = await getSheetData(RESOURCES_SHEET_ID, 'Resources!A:Z');

    // Format response
    const formattedResources = resources.map((r, i) => ({
      id: r.id || `resource-${i}`,
      title: r.title,
      description: r.description,
      category: r.category || 'General',
      content: r.content,
    }));

    return res.status(200).json(formattedResources);

  } catch (error) {
    console.error('Resources error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
