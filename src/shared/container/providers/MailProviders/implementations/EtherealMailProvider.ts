import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe'
import IMailProvider from '../models/IMailProviders';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
@injectable()
export default class EtherealMailProvider implements IMailProvider {

  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
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

  public async sendMail({ to, subject, template, from }: ISendMailDTO): Promise<void> {
    console.log('chegou 02')

    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBaber' ,
        address: from?.email || 'equipe@gobaber.com.br',
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject,
      html: await this.mailTemplateProvider.parse(template),
    })

    console.log('email enviado', message)
    console.log('email enviado 02', nodemailer.getTestMessageUrl(message))
  }
}
