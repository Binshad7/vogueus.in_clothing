const nodeMailer = require('nodemailer')
const { EMAIL, EMAIL_PASSWORD } = require('../config/ENV_VARS');

async function sendEmail(userEmail, userName, res ,req) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: EMAIL,
            to: userEmail,
            subject: 'Vogueus Email Verification',
            text: `Welcome to Vogueus, ${userName}`,
            html: `
               <div style="max-width: 600px; margin: 20px auto; padding: 40px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-family: Helvetica, Arial, sans-serif;">
   <div style="text-align: center; margin-bottom: 30px;">
<img src="http://localhost:5000/img/vogueus.png" alt="Vogueus Logo" style="width: 120px; margin-bottom: 20px;">
       <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">Welcome to Vogueus!</h1>
   </div>
   
   <p style="color: #444; font-size: 16px; margin-bottom: 25px;">Hi ${userName},</p>
   
   <div style="background: #f8f8f8; border: 2px dashed #e0e0e0; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
       <p style="color: #666; font-size: 14px; margin: 0 0 10px;">Your verification code is:</p>
       <h2 style="color: #1a1a1a; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h2>
       <p style="color: #ff4444; font-size: 13px; font-style: italic; margin: 10px 0 0;">Expires in 60 seconds</p>
   </div>

   <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
       <p style="color: #444; margin: 0;">
           Best regards,<br>
           <strong style="color: #1a1a1a;">Vogueus Team</strong>
       </p>
   </div>
</div>`
        }

        const send_Mail = await transporter.sendMail(mailOptions);
        if (send_Mail) {
            console.log('current time :',Date.now(),',   expiry time :', Date.now() + 60000)
            req.session.otp =  otp;
            req.session.otpExpiry  =  Date.now() + 70000
            res.status(200).json({ success: true, message: 'OTP sent to your email check your email' })
        } else {
            res.status(400).json({ success: false, message: 'Failed to send OTP'})
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error);
    }
}
module.exports = sendEmail