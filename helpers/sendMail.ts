import { createTransport } from 'nodemailer';
import * as ENV from '../config/global.config'

export default function confirmEmail(email: string, subject: string, html: string) {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: ENV.EMAIL_USER,
    to: email,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}