const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD",
  },
});

const sendVerificationEmail = async (email, token) => {
  const link = `http://localhost:3000/verify/${token}`;

  await transporter.sendMail({
    from: "Telegram Downloader",
    to: email,
    subject: "Verify your email",
    html: `
      <h3>Verify your account</h3>
      <p>Click below to verify:</p>
      <a href="${link}">${link}</a>
    `,
  });
};

module.exports = sendVerificationEmail;
