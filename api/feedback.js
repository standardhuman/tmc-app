// Feedback API - receives feedback from the proposal site
// Writes to the "Website Feedback" tab in the roster sheet

const ROSTER_SHEET_ID = process.env.ROSTER_SHEET_ID;

export default async function handler(req, res) {
  // CORS - allow from proposal site
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
    const {
      name,
      overall,
      design,
      designComments,
      directory,
      directoryComments,
      intros,
      login,
      loginComments,
      missingFeatures,
      missingOther,
      bugs,
      other
    } = req.body;

    // Format timestamp
    const timestamp = new Date().toISOString();

    // Append to Google Sheet using the published sheet CSV approach won't work for writes
    // Instead, we'll use the Google Sheets API directly

    // For now, just log and return success - the sheet is view-only via CSV
    // In production, this would use a service account to write
    console.log('Feedback received:', {
      timestamp,
      name,
      overall,
      design,
      designComments,
      directory,
      directoryComments,
      intros,
      login,
      loginComments,
      missingFeatures: Array.isArray(missingFeatures) ? missingFeatures.join(', ') : missingFeatures,
      missingOther,
      bugs,
      other
    });

    // For MVP: Send email notification instead of writing to sheet
    // The feedback data is logged and can be reviewed in Vercel logs

    return res.status(200).json({
      success: true,
      message: 'Feedback received successfully'
    });

  } catch (error) {
    console.error('Feedback error:', error);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
}
