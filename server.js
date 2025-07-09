const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Email configuration
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-form', (req, res) => {
  const { name, _replyto, phone, message } = req.body;

  const mailOptions = {
  from: '"Launchify SA Website" <launchfydigitalssa@gmail.com>', // ✅ Authenticated sender
  to: 'launchfydigitalssa@gmail.com', // ✅ Your inbox
  replyTo: _replyto, // ✅ So you can "Reply" to the form sender
  subject: 'New Contact Form Submission',
  text: `Name: ${name}\nEmail: ${_replyto}\nPhone: ${phone}\nMessage: ${message}`
};


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      return res.json({ success: true, message: 'Email sent successfully' });
    }
  });
});

app.get('/', (req, res) => {
  res.send('✅ Launchify backend is live!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
