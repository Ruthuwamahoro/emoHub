import { transporter } from "./nodemailerConfig";

export const sendMail = async (email: string, fullName: string, token: string) => {
  const finalHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #334155;
          background-color: #f8fafc;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          padding: 32px 24px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header p {
          margin: 8px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 24px;
          background-color: #ffffff;
        }
        .greeting {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 24px;
          font-weight: 500;
        }
        .message {
          font-size: 16px;
          color: #475569;
          margin-bottom: 32px;
          line-height: 1.7;
        }
        .verify-button {
          display: inline-block;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white !important;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px 0 rgba(249, 115, 22, 0.25);
          border: none;
          cursor: pointer;
          margin-bottom: 24px;
        }
        .verify-button:hover {
          background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px 0 rgba(249, 115, 22, 0.35);
        }
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        .alternative-link {
          font-size: 14px;
          color: #64748b;
          margin-top: 24px;
        }
        .alternative-link a {
          color: #f97316;
          text-decoration: none;
          word-break: break-all;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 0;
          font-size: 14px;
          color: #64748b;
        }
        .security-note {
          background-color: #f8fafc;
          border-left: 4px solid #f97316;
          padding: 16px;
          margin: 24px 0;
          border-radius: 0 6px 6px 0;
        }
        .security-note p {
          margin: 0;
          font-size: 14px;
          color: #475569;
        }
        .icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        @media only screen and (max-width: 600px) {
          .email-container {
            margin: 0;
            border-radius: 0;
          }
          .header, .content, .footer {
            padding: 24px 16px;
          }
          .verify-button {
            width: 100%;
            box-sizing: border-box;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="icon">✉️</div>
          <h1>Verify Your Email</h1>
          <p>Complete your account setup</p>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${fullName}!</div>
          
          <div class="message">
            Thank you for signing up! We're excited to have you on board. To complete your registration and secure your account, please verify your email address by clicking the button below.
          </div>
          
          <div class="button-container">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}" class="verify-button">
              Verify Email Address
            </a>
          </div>
          
          <div class="security-note">
            <p><strong>Security Note:</strong> This verification link will expire in 24 hours for your security. If you didn't create this account, you can safely ignore this email.</p>
          </div>
          
          <div class="alternative-link">
            <p>If the button above doesn't work, you can also verify your email by copying and pasting this link into your browser:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}</a>
          </div>
        </div>
        
        <div class="footer">
          <p>If you have any questions, feel free to contact our support team.</p>
          <p style="margin-top: 8px; font-size: 12px;">This email was sent to ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email Address",
    html: finalHtml
  });
};