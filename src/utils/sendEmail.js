// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Heavy Forum App" <noreply@myapp.com>',
    to,
    subject,
    html,
  });

  console.log("Message sent:", info.messageId);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  console.log("Ethereal test account:", testAccount);
};

/////

/* För att skicka riktiga mejl istället för Ethereal behöver du:

✔️ 1. Skapa en riktig SMTP-leverantör

De vanligaste:

📌 Gmail (enkelt för utveckling)

Men du måste använda App Passwords, inte ditt riktiga lösenord.

Aktivera 2FA i Google-kontot

Gå till: https://myaccount.google.com/apppasswords

Skapa ett nytt "App Password"

Google ger dig ett 16-teckens lösenord → använd det i Nodemailer */

/* import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,   // Din Gmail-adress
      pass: process.env.SMTP_PASS,   // App Password!
    },
  });

  const info = await transporter.sendMail({
    from: `"Heavy Forum App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
}; */
