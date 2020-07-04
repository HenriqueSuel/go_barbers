import "reflect-metadata"
import { injectable, inject } from 'tsyringe';
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

    @inject('MailProviders')
    private mailProviders:IMailProviders,

    @inject('userTokensRepository')
    private userTokensRepository:IUserTokenRepository
    ) {}

  public async execute({ email }: IRequest): Promise<void> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email address already used.', 400)
    }

    await this.userTokensRepository.generate(user.id)

    this.mailProviders.sendMail(email, 'Pedido de recuperação de senha recebido')

  }
}

export default SendForgotPasswordEmailService
