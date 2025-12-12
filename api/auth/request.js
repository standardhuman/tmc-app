import { getSheetData } from '../_lib/sheets.js';
import { createMagicToken } from '../_lib/auth.js';

const ROSTER_SHEET_ID = process.env.ROSTER_SHEET_ID;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export default async function handler(req, res) {
  // Set CORS headers
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email exists in roster
    // Sheet columns: "E-Mail", "First Name", "Last Name", "Status", "Current Team"
    const members = await getSheetData(ROSTER_SHEET_ID, 'Sheet1');
    const member = members.find(m =>
      m.email?.toLowerCase() === email.toLowerCase() ||
      m['e-mail']?.toLowerCase() === email.toLowerCase()
    );

    if (!member) {
      return res.status(404).json({
        error: "We couldn't find that email in our member list. If you're interested in The Men's Circle, please use the contact form on our homepage."
      });
    }

    // Build name from first + last name columns
    const memberEmail = member.email || member['e-mail'];
    const memberName = member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim();
    const memberStatus = member.status?.toLowerCase();

    // Only allow "Active" status members to log in
    if (memberStatus !== 'active') {
      return res.status(403).json({
        error: "Your membership status doesn't allow access. Please contact an administrator."
      });
    }

    // Create magic link token
    const token = createMagicToken(memberEmail, memberName, memberStatus);
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5173';
    const magicLink = `${baseUrl}/#/verify?token=${token}`;

    // Send email via Resend
    if (RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'The Men\'s Circle <noreply@sailorskills.com>',
          to: email,
          subject: 'Your login link for The Men\'s Circle',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #8B5A2B; font-size: 24px;">The Men's Circle</h1>
              <p>Hello ${memberName || 'Brother'},</p>
              <p>Click the button below to log in to The Men's Circle member area:</p>
              <p style="margin: 30px 0;">
                <a href="${magicLink}" style="background: #D4652F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Log In Now
                </a>
              </p>
              <p style="color: #6B6B6B; font-size: 14px;">
                This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #E5E0DA; margin: 30px 0;">
              <p style="color: #6B6B6B; font-size: 12px; font-style: italic;">
                "We forge brotherhood, inspire transformation, and support men in living on purpose."
              </p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send email:', await response.text());
        return res.status(500).json({ error: 'Failed to send login email' });
      }
    } else {
      // Development mode - log the link
      console.log('Magic link (dev mode):', magicLink);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Auth request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
