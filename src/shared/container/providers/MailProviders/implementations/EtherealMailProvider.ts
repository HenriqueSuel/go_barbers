import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../models/IMailProviders';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class EtherealMailProvider implements IMailProvider {

  private client:Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport ({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })
      this.client = transporter;
    });
  }

  public async sendMail(to: string, body: string): Promise<void> {
    const message = await this.client.sendMail({
      from: 'Equipe GoBaber <equipe@gobarber.com.br',
      to,
      subject: 'Recuperacao de senha',
      text: body,
    })

    console.log('email enviado', message)
    console.log('email enviado 02', nodemailer.getTestMessageUrl(message))
  }
}
