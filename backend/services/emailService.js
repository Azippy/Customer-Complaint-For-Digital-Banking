const nodemailer = require("nodemailer");

const createTransporter = () => {
  const port = Number(process.env.EMAIL_PORT) || 587;

  return nodemailer.createTransport({
    host: (process.env.EMAIL_HOST || "smtp.gmail.com").trim(),
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,

      to,
      subject,
      text,
      html,
    });

    console.log("Email accepted by SMTP:", {
      to: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
    });

    return info;
  } catch (error) {
    console.error("Email sending error:", error);

    throw error;
  }
};
const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  const mailOptions = {
    to: email,
    subject: "Reset Your Password",
    text: `Hello ${name || "there"},\n\nReset your password here: ${resetUrl}\n\nThis link expires in 15 minutes.`,
    html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Password Reset</h2>

                <p>Hello ${name || "there"},</p>

                <p>
                    We received a request to reset
                    your password.
                </p>

                <p>
                    Click the button below to create
                    a new password:
                </p>

                <a
                    href="${resetUrl}"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>

                <p>
                    This link expires in 15 minutes.
                </p>

                <p>
                    If you did not request a password
                    reset, you can safely ignore this email.
                </p>
            </div>
        `,
  };

  return sendEmail(mailOptions);
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
};
