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
        const email = m.email || m.e_mail;
        return (status === 'active' || status === 'sabbatical') && email;
      })
      .map(m => ({
        name: `${m.first_name || ''} ${m.last_name || ''}`.trim(),
        firstName: m.first_name,
        lastName: m.last_name,
        email: m.email || m.e_mail,
        phone: m.cell,
        team: m.current_team,
        position: m.current_position,
        status: m.status,
        city: m.city,
        state: m.state,
        website: m.website,
        yearJoined: m.year_joined,
        sponsor: m.sponsor,
        occupation: m.occupation,
        identities: m.identities_use_laptop_not_phone_to_update,
        purposeEssence: m.purpose_expressed_as_essence,
        purposeBlessing: m.purpose_expressed_as_blessing,
        purposeMission: m.purpose_expressed_as_mission,
        purposeMessage: m.purpose_expressed_as_message,
        photoUrl: m.photo_url || m.photo || null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json(activeMembers);

  } catch (error) {
    console.error('Members error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
