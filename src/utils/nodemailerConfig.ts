import nodemailer from "nodemailer";
console.log("process.env.EMAIL_USER", process.env.EMAIL_USER)
console.log("process.env.EMAIL_PASS", process.env.EMAIL_PASS)
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})