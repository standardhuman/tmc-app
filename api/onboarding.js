import { findRowByEmail, updateSheetRow, getSheetData } from './_lib/sheets.js';
import { requireAuth, createSessionToken } from './_lib/auth.js';

const ROSTER_SHEET_ID = process.env.ROSTER_SHEET_ID;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check auth
  const auth = requireAuth(req);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const {
      firstName,
      lastName,
      phone,
      team,
      emergencyContact,
      howFound,
      sponsor,
      photoUrl
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !team || !emergencyContact || !howFound || !sponsor) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find the user's row in the roster
    const result = await findRowByEmail(ROSTER_SHEET_ID, 'Roster', auth.user.email);

    if (!result) {
      return res.status(404).json({ error: 'User not found in roster' });
    }

    const { rowIndex, headers } = result;

    // Build the updated row data
    // We need to map our fields to the sheet columns
    const newRowData = [...result.data];

    // Helper to set column value
    const setColumn = (columnName, value) => {
      const index = headers.indexOf(columnName.toLowerCase().replace(/\s+/g, '_'));
      if (index !== -1) {
        newRowData[index] = value;
      }
    };

    // Update the fields
    setColumn('name', `${firstName} ${lastName}`);
    setColumn('first_name', firstName);
    setColumn('last_name', lastName);
    setColumn('phone', phone);
    setColumn('team', team);
    setColumn('emergency_contact_name', emergencyContact.name);
    setColumn('emergency_contact_phone', emergencyContact.phone);
    setColumn('emergency_contact_relationship', emergencyContact.relationship);
    setColumn('how_found', howFound);
    setColumn('sponsor', sponsor);
    setColumn('photo_url', photoUrl);
    setColumn('status', 'active'); // Change from pending to active
    setColumn('onboarding_completed', new Date().toISOString());

    // Update the row
    await updateSheetRow(
      ROSTER_SHEET_ID,
      `Roster!A${rowIndex}:Z${rowIndex}`,
      newRowData
    );

    // Create new session token with updated status
    const newToken = createSessionToken({
      email: auth.user.email,
      name: `${firstName} ${lastName}`,
      status: 'active',
      team: team,
    });

    return res.status(200).json({
      success: true,
      token: newToken
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
