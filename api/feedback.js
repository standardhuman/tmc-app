// Feedback API - receives feedback from the proposal site
// Writes to the "Website Feedback" tab and sends email notification

import { appendRow } from './_lib/sheets-write.js';

const ROSTER_SHEET_ID = process.env.ROSTER_SHEET_ID;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

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

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const missingFeaturesStr = Array.isArray(missingFeatures) ? missingFeatures.join(', ') : (missingFeatures || '');

    // 1. Write to Google Sheet
    if (ROSTER_SHEET_ID) {
      try {
        await appendRow(ROSTER_SHEET_ID, 'Website Feedback', [
          timestamp,
          name || 'Anonymous',
          overall,
          design,
          designComments || '',
          directory,
          directoryComments || '',
          intros,
          login,
          loginComments || '',
          missingFeaturesStr,
          missingOther || '',
          bugs || '',
          other || ''
        ]);
        console.log('Feedback written to sheet');
      } catch (sheetError) {
        console.error('Failed to write to sheet:', sheetError);
        // Continue - still try to send email
      }
    }

    // 2. Send email notification
    if (RESEND_API_KEY && NOTIFICATION_EMAIL) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'TMC Website <noreply@sailorskills.com>',
            to: NOTIFICATION_EMAIL,
            subject: `Website Feedback: ${name || 'Anonymous'} (${overall}/5)`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4A5D4A; border-bottom: 2px solid #D4652F; padding-bottom: 10px;">New Website Feedback</h2>

                <p><strong>From:</strong> ${name || 'Anonymous'}</p>
                <p><strong>Submitted:</strong> ${timestamp}</p>

                <h3 style="color: #8B5A2B; margin-top: 20px;">Ratings</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="background: #FAF8F5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Overall Experience</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${overall}/5</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Design Feel</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${design}</td>
                  </tr>
                  <tr style="background: #FAF8F5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Directory Usefulness</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${directory}/5</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Intro Letters Opinion</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${intros}</td>
                  </tr>
                  <tr style="background: #FAF8F5;">
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Login Experience</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${login}</td>
                  </tr>
                </table>

                ${designComments ? `<h3 style="color: #8B5A2B; margin-top: 20px;">Design Comments</h3><div style="background: #FAF8F5; padding: 15px; border-radius: 6px;">${designComments}</div>` : ''}

                ${directoryComments ? `<h3 style="color: #8B5A2B; margin-top: 20px;">Directory Comments</h3><div style="background: #FAF8F5; padding: 15px; border-radius: 6px;">${directoryComments}</div>` : ''}

                ${loginComments ? `<h3 style="color: #8B5A2B; margin-top: 20px;">Login Comments</h3><div style="background: #FAF8F5; padding: 15px; border-radius: 6px;">${loginComments}</div>` : ''}

                ${missingFeaturesStr ? `<h3 style="color: #8B5A2B; margin-top: 20px;">Missing Features Requested</h3><div style="background: #FAF8F5; padding: 15px; border-radius: 6px;">${missingFeaturesStr}</div>` : ''}

                ${missingOther ? `<h3 style="color: #8B5A2B; margin-top: 20px;">Other Missing Features</h3><div style="background: #FAF8F5; padding: 15px; border-radius: 6px;">${missingOther}</div>` : ''}

                ${bugs ? `<h3 style="color: #8B5A2B; margin-top: 20px;">Bugs Reported</h3><div style="background: #FAF8F5; padding: 15px; border-radius: 6px;">${bugs}</div>` : ''}

                ${other ? `<h3 style="color: #8B5A2B; margin-top: 20px;">Other Comments</h3><div style="background: #FAF8F5; padding: 15px; border-radius: 6px;">${other}</div>` : ''}

                <p style="margin-top: 30px; font-size: 12px; color: #6B6B6B; border-top: 1px solid #ddd; padding-top: 15px;">
                  This feedback was also saved to the "Website Feedback" tab in the roster sheet.
                </p>
              </div>
            `,
          }),
        });

        if (!response.ok) {
          console.error('Failed to send email:', await response.text());
        } else {
          console.log('Feedback email sent');
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Continue - sheet write may have succeeded
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback received successfully'
    });

  } catch (error) {
    console.error('Feedback error:', error);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
}
