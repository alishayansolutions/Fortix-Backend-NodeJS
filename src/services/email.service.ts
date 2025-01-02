import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const send2FACode = async (email: string, code: string) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Your 2FA Code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('SendGrid Error:', error);
    throw new Error('Failed to send 2FA code');
  }
}; 