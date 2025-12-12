// Photo upload endpoint - DISABLED in read-only mode
// Member photos should be added as URLs directly in the Google Sheet

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(501).json({
    error: 'Photo upload is not available. Add photo URLs directly to the roster sheet.',
  });
}
