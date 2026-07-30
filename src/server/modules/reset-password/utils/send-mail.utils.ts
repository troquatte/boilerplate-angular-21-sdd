import nodemailer from 'nodemailer';
import { getEnv } from '../../../utils/get-env.utils';

// Link: https://myaccount.google.com/lesssecureapps
export class UtilsSendMail {
  public static async send(email: string, secret: number) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: getEnv('SEND_EMAIL'),
        pass: getEnv('SEND_EMAIL_PASSWORD'),
      },
    });

    const mailOptions = {
      from: getEnv('SEND_EMAIL'),
      to: email,
      subject: '[Segurança] Resete sua senha',
      text: `Código de segurança: ${secret}`,
    };

    await transporter.sendMail(mailOptions);
  }
}
