import { sendEmail } from '@/mail';
import { websiteConfig } from '@/config/website';

/**
 * Send the manual delivery email with PDF attachment
 * @param to recipient email
 * @param name recipient name
 */
export async function sendManualEmail(to: string, name: string) {
  const subject = 'Your Order is Ready! 📦 - Yotrade LLC';

  // You can customize this HTML content
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you for your purchase, ${name}! 🎉</h2>
      <p>We successfully received your payment.</p>
      <p>Please find your specialized manual attached to this email.</p>
      <br/>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br/>The Yotrade Team</p>
    </div>
  `;

  // TODO: Replace this URL with the actual location of your PDF file
  // It can be a public URL (recommended) or a local path if running on a server with file access
  // Example: 'https://www.yotradellc.com/files/manual_v1.pdf'
  // Or put the file in 'public/manual.pdf' and deploy it.
  const pdfUrl = 'https://www.yotradellc.com/manual.pdf';

  console.log(`Sending manual email to ${to} with attachment from ${pdfUrl}`);

  await sendEmail({
    to,
    subject,
    html,
    text: `Thank you for your purchase, ${name}! Please find your manual attached.`,
    attachments: [
      {
        filename: 'Yotrade_Manual.pdf',
        path: pdfUrl,
      },
    ],
  });
}
