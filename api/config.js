import { getSheetData, appendSheetRow, updateSheetRow, findRowByEmail } from './_lib/sheets.js';
import { requireAuth } from './_lib/auth.js';

const CONFIG_SHEET_ID = process.env.CONFIG_SHEET_ID || process.env.ROSTER_SHEET_ID;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  // POST - update config
  if (req.method === 'POST') {
    try {
      const updates = req.body;

      // Get existing config
      let existingConfig = [];
      try {
        existingConfig = await getSheetData(CONFIG_SHEET_ID, 'Config!A:B');
      } catch (e) {
        // Sheet might not exist yet
      }

      // Build map of existing keys to row indices
      const keyToRow = {};
      existingConfig.forEach((row, i) => {
        if (row.key) {
          keyToRow[row.key] = i + 2; // +2 because 1-indexed and skip header
        }
      });

      // Update or append each config value
      const { google } = await import('googleapis');
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });

      const newRows = [];

      for (const [key, value] of Object.entries(updates)) {
        if (keyToRow[key]) {
          // Update existing row
          await sheets.spreadsheets.values.update({
            spreadsheetId: CONFIG_SHEET_ID,
            range: `Config!A${keyToRow[key]}:B${keyToRow[key]}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[key, value]],
            },
          });
        } else {
          // Collect new rows to append
          newRows.push([key, value]);
        }
      }

      // Append any new rows
      if (newRows.length > 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId: CONFIG_SHEET_ID,
          range: 'Config!A:B',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: newRows,
          },
        });
      }

      return res.status(200).json({ success: true });

    } catch (error) {
      console.error('Config POST error:', error);
      return res.status(500).json({ error: 'Failed to save config' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
