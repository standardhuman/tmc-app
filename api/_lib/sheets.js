import { google } from 'googleapis';

// Initialize Google Sheets client
function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Get all rows from a sheet
export async function getSheetData(spreadsheetId, range) {
  const sheets = getSheets();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];
  if (rows.length === 0) return [];

  // First row is headers
  const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });

  return data;
}

// Append a row to a sheet
export async function appendSheetRow(spreadsheetId, range, values) {
  const sheets = getSheets();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
}

// Update a row in a sheet (by row number)
export async function updateSheetRow(spreadsheetId, range, values) {
  const sheets = getSheets();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
}

// Find row index by email
export async function findRowByEmail(spreadsheetId, sheetName, email) {
  const sheets = getSheets();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
  });

  const rows = response.data.values || [];
  if (rows.length === 0) return null;

  const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
  const emailIndex = headers.indexOf('email');

  if (emailIndex === -1) return null;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][emailIndex]?.toLowerCase() === email.toLowerCase()) {
      return {
        rowIndex: i + 1, // 1-indexed for Sheets API
        data: rows[i],
        headers,
      };
    }
  }

  return null;
}
