// Config endpoint - read-only mode
// Edit config values directly in the Google Sheet "Config" tab

import { getSheetData } from './_lib/sheets.js';
import { requireAuth } from './_lib/auth.js';

const CONFIG_SHEET_ID = process.env.CONFIG_SHEET_ID || process.env.ROSTER_SHEET_ID;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check auth
  const auth = requireAuth(req);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }

  // GET - fetch config
  if (req.method === 'GET') {
    try {
      const configData = await getSheetData(CONFIG_SHEET_ID, 'Config!A:B');

      // Convert array of {key, value} to object
      const config = {};
      configData.forEach(row => {
        if (row.key) {
          config[row.key] = row.value || '';
        }
      });

      return res.status(200).json(config);

    } catch (error) {
      console.error('Config GET error:', error);
      // Return empty config if sheet doesn't exist
      return res.status(200).json({});
    }
  }

  // POST - not available in read-only mode
  if (req.method === 'POST') {
    return res.status(501).json({
      error: 'Config editing is not available. Edit values directly in the Google Sheet.',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
