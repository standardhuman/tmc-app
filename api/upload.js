import { requireAuth } from './_lib/auth.js';

// For the prototype, we'll store photos as base64 data URLs
// In production, use Vercel Blob, Cloudinary, or similar

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

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
    // For the prototype, accept base64 data URL directly from the form
    // The frontend sends the photo as a base64 data URL after reading it
    const { photoData } = req.body;

    if (!photoData) {
      return res.status(400).json({ error: 'No photo data provided' });
    }

    // In a real app, you'd upload to cloud storage here
    // For prototype, we just return the data URL
    // Note: This is not ideal for production (data URLs are large)

    return res.status(200).json({ url: photoData });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
