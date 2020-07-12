import "reflect-metadata"
import { injectable, inject } from 'tsyringe';
import path from 'path'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';


import IMailProviders from '@shared/container/providers/MailProviders/models/IMailProviders'


interface IRequest {
  email: string,
}

@injectable()
class SendForgotPasswordEmailService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProviders: IMailProviders,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokenRepository
  ) { }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email address already used.', 400)
    }

    const { token } = await this.userTokensRepository.generate(user.id)

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );
    await this.mailProviders.sendMail({
      to: {
        email: user.email,
        name: user.name
      },
      subject: '[GoBaber] Recuperação de senha',
      template: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          token,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
        }
      }
    })

  }
}

export default SendForgotPasswordEmailService
