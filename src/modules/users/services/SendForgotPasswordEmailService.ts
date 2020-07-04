import "reflect-metadata"
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User'

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
    private mailProviders:IMailProviders
    ) {}

  public async execute({ email }: IRequest): Promise<void> {

    const checkUserExists = await this.usersRepository.findByEmail(email)t

    if (!checkUserExists) {
      throw new AppError('Email address already used.', 400)
    }

    this.mailProviders.sendMail(email, 'Teste henrique')

  }
}

export default SendForgotPasswordEmailService
