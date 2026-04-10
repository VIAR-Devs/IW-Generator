export function getFollowUpEmailHtml(fullName: string): string {
  const firstName = fullName.split(' ')[0];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ready to Complete Your Islamic Will?</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #32A853; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Ready to Secure Your Legacy?</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    As-salamu alaykum ${firstName},
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    We noticed you haven't completed your Islamic will yet. Creating a will is one of the most important responsibilities we have to protect our families and fulfill our Islamic obligations.
                  </p>
                  
                  <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #32A853; margin: 25px 0;">
                    <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6; font-style: italic;">
                      "It is the duty of a Muslim who has anything to bequest not to let two nights pass without writing a will about it."<br>
                      <span style="font-size: 14px; color: #666666;">— Sahih al-Bukhari 2738, Sahih Muslim 1627</span>
                    </p>
                  </div>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    <strong>It only takes 10 minutes</strong> to create your Shariah-compliant will with:
                  </p>
                  
                  <ul style="margin: 0 0 30px 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                    <li>Accurate Faraid calculations</li>
                    <li>UK legal validity</li>
                    <li>Wasiyyah provisions for charitable giving</li>
                    <li>Executor and guardian appointments</li>
                    <li>Funeral preference documentation</li>
                  </ul>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/dashboard` : 'https://islamicwills.co.uk/dashboard'}" 
                       style="display: inline-block; padding: 14px 32px; background-color: #32A853; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      Complete Your Will Now
                    </a>
                  </div>
                  
                  <p style="margin: 30px 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    <strong>Need assistance?</strong><br>
                    If you have any questions or concerns about the process, our support team is ready to help.
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    JazakAllahu Khairan,<br>
                    <strong>The Islamic Wills Team</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; text-align: center; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    You're receiving this email because you registered at Islamic Wills but haven't completed your will yet.<br>
                    Questions? Contact us at support@islamicwills.co.uk
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

export function getFollowUpEmailText(fullName: string): string {
  const firstName = fullName.split(' ')[0];
  
  return `
As-salamu alaykum ${firstName},

We noticed you haven't completed your Islamic will yet. Creating a will is one of the most important responsibilities we have to protect our families and fulfill our Islamic obligations.

"It is the duty of a Muslim who has anything to bequest not to let two nights pass without writing a will about it."
— Sahih al-Bukhari 2738, Sahih Muslim 1627

It only takes 10 minutes to create your Shariah-compliant will with:
- Accurate Faraid calculations
- UK legal validity
- Wasiyyah provisions for charitable giving
- Executor and guardian appointments
- Funeral preference documentation

Complete your will now: ${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/dashboard` : 'https://islamicwills.co.uk/dashboard'}

Need assistance?
If you have any questions or concerns about the process, our support team is ready to help.

JazakAllahu Khairan,
The Islamic Wills Team

---
You're receiving this email because you registered at Islamic Wills but haven't completed your will yet.
Questions? Contact us at support@islamicwills.co.uk
  `.trim();
}
