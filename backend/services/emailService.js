
const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
      },
    });

    return await transporter.sendMail({
      from: process.env.EMAIL_FROM,

      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Email sending error:", error);

    throw error;
  }
};

module.exports = {
  sendEmail,
};
