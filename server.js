const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { name, email, phone, subject, reason, website, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.MAIL_TO,
    subject: `New Contact Form Submission - ${subject}`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; color: #333;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #1a1a1a; border-bottom: 1px solid #eee; padding-bottom: 10px;">Contact Request Summary</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Name:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0;">${phone || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Reason:</td>
            <td style="padding: 8px 0;">${reason}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Website:</td>
            <td style="padding: 8px 0;">${website || 'Not Provided'}</td>
          </tr>
        </table>

        <h3 style="margin-top: 25px; color: #1a1a1a;">Message</h3>
        <p style="background-color: #f1f1f1; padding: 12px 15px; border-left: 4px solid #facc15; font-style: italic; border-radius: 5px;">
          ${message}
        </p>

        <p style="margin-top: 30px; font-size: 12px; color: #999;">This message was sent from your portfolio contact form.</p>
      </div>
    </div>
  `
  };


  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
