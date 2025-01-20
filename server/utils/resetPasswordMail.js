const nodemailer = require('nodemailer');
const { EMAIL, EMAIL_PASSWORD, FRONTEND_URL } = require('../config/ENV_VARS');

async function sendResetPasswordMail(userEmail, userName, res, req, resetToken) {
    try {
        console.log(resetToken)
        const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Set up the transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD,
            },
        });

        // Define email content
        const mailOptions = {
            from: `"Vogeues Team " <${EMAIL}>`,
            to: userEmail,
            subject: 'Password Reset Request',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                    }
                    .email-container {
                      max-width: 600px;
                      margin: 20px auto;
                      background-color: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                      overflow: hidden;
                    }
                    .email-header {
                      background-color: #007BFF;
                      color: #ffffff;
                      text-align: center;
                      padding: 20px;
                    }
                    .email-body {
                      padding: 20px;
                      color: #333333;
                      line-height: 1.6;
                    }
                    .reset-button {
                      display: inline-block;
                      background-color: black;
                      color: white;
                      text-decoration: none;
                      padding: 12px 20px;
                      border-radius: 5px;
                      font-weight: bold;
                      margin: 20px 0;
                    }
                    .email-footer {
                      background-color: #f8f9fa;
                      text-align: center;
                      padding: 10px;
                      font-size: 12px;
                      color: #6c757d;
                    }
                  </style>
                </head>
                <body>
                  <div class="email-container">
                    <div class="email-header">
                      <h1>Password Reset Request</h1>
                    </div>
                    <div class="email-body">
                      <p>Hi ${userName},</p>
                      <p>You requested to reset your password. Click the button below to reset it:</p>
                      <a href="${resetLink}" class="reset-button">Reset Password</a>
                      <p>Please note: This link will expire in 3 hours.</p>
                      <p>If you didn't request this, please ignore this email or contact our support team.</p>
                      <p>Best regards,<br>Your Application Team</p>
                    </div>
                    <div class="email-footer">
                      <p>&copy; 2025 Vogeues Team . All rights reserved.</p>
                    </div>
                  </div>
                </body>
                </html>
            `,
        };

        // Send the email
        const sendMailResponse = await transporter.sendMail(mailOptions);
        if (sendMailResponse) {
            req.session.resetToken = resetToken;
            req.session.linkExpiry = Date.now() + 3 * 60 * 60 * 1000; // 3 hours
            await req.session.save(); // Ensure the session is explicitly saved
            console.log(req.session)
            res.status(200).json({ success: true, message: 'Reset password email sent successfully. Please check your inbox.' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to send reset password email.' });
        }
    } catch (error) {
        console.error('Error sending reset password email:', error);
        res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
}

module.exports = sendResetPasswordMail;
