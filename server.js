const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
console.log('Email user:', process.env.EMAIL_USER);
console.log('Email pass set:', !!process.env.EMAIL_PASS);

const app = express();
const port = process.env.PORT || 3001; // ✅ use dynamic port for Render

// ✅ CORS: Allow GitHub Pages frontend
app.use(cors({
  origin: [
    'https://pheello-codes.github.io',          // ✅ GitHub Pages origin
    'https://launchfy-digitals-sa.onrender.com', // ✅ Your backend itself
    'http://127.0.0.1:5500'                      // ✅ For local HTML testing (optional)
  ]
}));

// ✅ Middleware to parse body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // example: launchfydigitalssa@gmail.com
    pass: process.env.EMAIL_PASS    // App password from Gmail settings
  }
});

// ✅ Handle POST from form
app.post('/send-form', (req, res) => {
  const { name, _replyto, phone, message } = req.body;

  const mailOptions = {
    from: `"Launchify SA Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: _replyto,
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${_replyto}\nPhone: ${phone}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Email error:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    } else {
      console.log('✅ Email sent:', info.response);
      return res.json({ success: true, message: 'Email sent successfully' });
    }
  });
});

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Launchify backend is live!');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
