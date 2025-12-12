// Fetch data from published Google Sheets (no API key needed)
// Sheets must be published: File > Share > Publish to web

/**
 * Fetches data from a published Google Sheet
 * @param {string} spreadsheetId - The sheet ID from the URL
 * @param {string} sheetName - The tab/sheet name (e.g., "Roster", "Resources")
 * @returns {Promise<Array<Object>>} Array of row objects with header keys
 */
export async function getSheetData(spreadsheetId, sheetName) {
  // Handle "SheetName!A:Z" format from existing code
  const cleanSheetName = sheetName.replace(/!.*$/, '');

  // Published sheets can be fetched as CSV
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(cleanSheetName)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
  }

  const csv = await response.text();
  return parseCSV(csv);
}

/**
 * Parse CSV text into array of objects
 * First row is treated as headers
 */
function parseCSV(csv) {
  const lines = parseCSVLines(csv);
  if (lines.length === 0) return [];

  // First row is headers - normalize them
  const headers = lines[0].map(h =>
    h.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
  );

  // Convert remaining rows to objects
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    // Skip empty rows
    if (row.every(cell => !cell.trim())) continue;

    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] || '';
    });
    data.push(obj);
  }

  return data;
}

/**
 * Parse CSV handling quoted fields with commas and newlines
 */
function parseCSVLines(csv) {
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        // End of quoted field
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
      } else if (char === ',') {
        // Field separator
        currentLine.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        // End of line
        currentLine.push(currentField.trim());
        if (currentLine.some(f => f)) { // Skip completely empty lines
          lines.push(currentLine);
        }
        currentLine = [];
        currentField = '';
        if (char === '\r') i++; // Skip \n in \r\n
      } else if (char !== '\r') {
        currentField += char;
      }
    }
  }

  // Don't forget the last field/line
  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some(f => f)) {
      lines.push(currentLine);
    }
  }

  return lines;
}

// These functions are no longer available with published sheets
// Keeping stubs for compatibility - they'll return errors if called

export async function appendSheetRow(spreadsheetId, range, values) {
  throw new Error('Write operations not supported with published sheets. Add data directly to Google Sheets.');
}

export async function updateSheetRow(spreadsheetId, range, values) {
  throw new Error('Write operations not supported with published sheets. Edit data directly in Google Sheets.');
}

export async function findRowByEmail(spreadsheetId, sheetName, email) {
  // This can still work - just fetch and find
  const data = await getSheetData(spreadsheetId, sheetName);
  const member = data.find(row => row.email?.toLowerCase() === email.toLowerCase());

  if (!member) return null;

  return {
    data: member,
    // Row index not available with this approach, but not needed for read-only
  };
}
