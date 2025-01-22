const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route for sending email
app.post('/api/send-email', async (req, res) => {
  const { firstName, lastName, email, service, message } = req.body;

  try {
    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider (e.g., Gmail, Outlook, etc.)
      auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL, // Sender's email
      to: process.env.RECEIVER_EMAIL, // Receiver's email
      subject: `New Inquiry from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table style="width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-collapse: collapse;">
            <thead>
              <tr>
                <th colspan="2" style="background-color: #4CAF50; color: white; text-align: center; padding: 15px;">
                  <h3 style="margin: 0;">New Contact Form Submission</h3>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">First Name</td>
                <td style="padding: 10px;">${firstName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">Last Name</td>
                <td style="padding: 10px;">${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">Email</td>
                <td style="padding: 10px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">Service</td>
                <td style="padding: 10px;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">Message</td>
                <td style="padding: 10px;">${message}</td>
              </tr>
            </tbody>
          </table>
          <footer style="margin-top: 20px; text-align: center; color: #888;">
            <p style="margin: 0;">Thank you for using our services!</p>
          </footer>
        </div>
      `,
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

app.get('/api/', (req, res) => {
  res.send('API is working');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
