import nodemailer from 'nodemailer';

// Configure transporter using environment variables for security
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // e.g. registrar@smspro.edu
    pass: process.env.SMTP_PASS, // App-specific password
  },
});

interface WelcomeEmailParams {
  toEmail: string;
  studentName: string;
  temporaryPassword: string;
}

/**
 * Sends a premium "Welcome" email to newly registered students.
 */
export async function sendWelcomeEmail({ toEmail, studentName, temporaryPassword }: WelcomeEmailParams) {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`;

  const mailOptions = {
    from: `"SMS Pro Registrar" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: '🎓 Your Academic Identity has been Initialized',
    html: `
      <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; padding: 40px; border-radius: 24px; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0;">
         <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: 900; color: #2563eb; letter-spacing: -0.025em;">SMS <span style="color: #64748b; font-weight: 300;">PRO</span></div>
            <p style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; color: #64748b; margin-top: 4px;">Institutional Access Protocol</p>
         </div>

         <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 20px; tracking: -0.01em;">Greetings, ${studentName}</h1>
         
         <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">Your academic identity has been successfully registered in the <strong>Student Management System Cloud</strong>. You can now access your customized performance dashboard and results.</p>
         
         <div style="background-color: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); margin-bottom: 30px;">
            <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 12px;">Authentication Credentials</p>
            <p style="font-size: 14px; margin: 4px 0;"><strong>Email:</strong> ${toEmail}</p>
            <p style="font-size: 14px; margin: 4px 0;"><strong>Password:</strong> <code style="background-color: #f1f5f9; padding: 4px 8px; border-radius: 6px; color: #2563eb; font-weight: 700;">${temporaryPassword}</code></p>
         </div>

         <div style="text-align: center;">
            <a href="${loginUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">Access Secure Portal</a>
         </div>

         <p style="font-size: 11px; color: #94a3b8; margin-top: 40px; text-align: center; border-top: 1px solid #f1f5f9; pt: 20px;">
            This is an automated system notification. If you did not expect this registration, please contact your academic advisor immediately.
         </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
