export function getWelcomeEmailHtml(fullName: string): string {
  const firstName = fullName.split(' ')[0];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Islamic Wills</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #32A853; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Islamic Wills</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    As-salamu alaykum ${firstName},
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Thank you for creating your account with Islamic Wills. We're honored to help you create a Shariah-compliant will that protects your loved ones and fulfills your religious obligations.
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    <strong>What you can do next:</strong>
                  </p>
                  
                  <ul style="margin: 0 0 30px 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                    <li>Complete your Islamic will in just 10 minutes</li>
                    <li>Get a professionally formatted, UK-legally valid document</li>
                    <li>Include Faraid calculations according to your chosen madhhab</li>
                    <li>Add wasiyyah (charitable bequests) up to 1/3 of your estate</li>
                    <li>Receive instant PDF delivery to your email</li>
                  </ul>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/dashboard` : 'https://islamicwills.co.uk/dashboard'}" 
                       style="display: inline-block; padding: 14px 32px; background-color: #32A853; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      Start Creating Your Will
                    </a>
                  </div>
                  
                  <p style="margin: 30px 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    <strong>Need help?</strong><br>
                    Our support team is here to assist you with any questions about the process.
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Best regards,<br>
                    <strong>The Islamic Wills Team</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; text-align: center; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    This email was sent to you because you registered for an account at Islamic Wills.<br>
                    If you have any questions, please contact us at support@islamicwills.co.uk
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getWelcomeEmailText(fullName: string): string {
  const firstName = fullName.split(' ')[0];
  
  return `
As-salamu alaykum ${firstName},

Thank you for creating your account with Islamic Wills. We're honored to help you create a Shariah-compliant will that protects your loved ones and fulfills your religious obligations.

What you can do next:
- Complete your Islamic will in just 10 minutes
- Get a professionally formatted, UK-legally valid document
- Include Faraid calculations according to your chosen madhhab
- Add wasiyyah (charitable bequests) up to 1/3 of your estate
- Receive instant PDF delivery to your email

Visit your dashboard to get started: ${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/dashboard` : 'https://islamicwills.co.uk/dashboard'}

Need help?
Our support team is here to assist you with any questions about the process.

Best regards,
The Islamic Wills Team

---
This email was sent to you because you registered for an account at Islamic Wills.
If you have any questions, please contact us at support@islamicwills.co.uk
  `.trim();
}
