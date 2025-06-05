import { transporter } from "./nodemailerConfig";

export const sendMail = async(email: string, fullName: string, token: string) => {
    const finalHtml = `
      <div>
        <h2>New Message from ${fullName}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> Email Verification</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">Verify Email</a>
      </div>
    `;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        html: finalHtml
    })
}