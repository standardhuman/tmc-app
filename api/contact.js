// Contact form - sends email notification only (no sheet writing)
// Contacts go directly to NOTIFICATION_EMAIL

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export default async function handler(req, res) {
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
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Send notification email
    if (RESEND_API_KEY && NOTIFICATION_EMAIL) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'The Men\'s Circle <noreply@sailorskills.com>',
          to: NOTIFICATION_EMAIL,
          reply_to: email,
          subject: `New Contact: ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #8B5A2B;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Message:</strong></p>
              <div style="background: #FAF8F5; padding: 15px; border-radius: 6px; white-space: pre-wrap;">
                ${message}
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #6B6B6B;">
                Submitted: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send email:', await response.text());
        return res.status(500).json({ error: 'Failed to send message. Please try again.' });
      }
    } else {
      // No email configured - log it
      console.log('Contact submission (no email configured):', { name, email, message });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
