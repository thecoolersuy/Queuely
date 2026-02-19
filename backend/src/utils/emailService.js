import nodemailer from 'nodemailer';

// Create transporter using Gmail (or any SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password, NOT your real Gmail password
    },
});

/**
 * Sends a 6-digit OTP to the given email address.
 * @param {string} toEmail - recipient email
 * @param {string} otp - the 6-digit OTP code
 * @param {string} accountType - 'customer' or 'business'
 */
export const sendOtpEmail = async (toEmail, otp, accountType = 'customer') => {
    const mailOptions = {
        from: `"Queuely" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your Queuely Password Reset OTP',
        html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f0f; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #111 100%); padding: 36px 40px 28px; text-align: center; border-bottom: 1px solid #222;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0;">Queuely</h1>
          <p style="color: #888; font-size: 13px; margin: 6px 0 0;">Your trusted barbershop booking platform</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px;">
          <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 12px;">Password Reset Request</h2>
          <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
            We received a request to reset the password for your ${accountType === 'business' ? 'Queuely Business' : 'Queuely'} account associated with <strong style="color: #fff;">${toEmail}</strong>.
          </p>

          <p style="color: #aaa; font-size: 14px; margin: 0 0 12px;">Use the OTP code below to reset your password:</p>

          <!-- OTP Box -->
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 28px;">
            <p style="color: #666; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px;">One-Time Password</p>
            <div style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #ffffff; font-family: 'Courier New', monospace;">${otp}</div>
            <p style="color: #555; font-size: 12px; margin: 14px 0 0;">⏱ This code expires in <strong style="color: #aaa;">10 minutes</strong></p>
          </div>

          <p style="color: #555; font-size: 13px; line-height: 1.6; margin: 0;">
            If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 40px; border-top: 1px solid #1a1a1a; text-align: center;">
          <p style="color: #444; font-size: 12px; margin: 0;">© 2025 Queuely. All rights reserved.</p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};
