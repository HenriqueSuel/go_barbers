import "reflect-metadata"
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProviders/models/IHashProvider'


interface IRequest {
  name: string,
  email: string,
  password: string,
}

@injectable()
class CreateUserService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('BCryptyHashProvider')
    private bcryptyHashProvider: IHashProvider
    ) {}

  public async execute({ name, email, password }: IRequest): Promise<User | undefined> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Email address already used.', 400)
    }

    const hashedPassword = await this.bcryptyHashProvider.generateHash(password);


    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    })

    return user;
  }
}

export default CreateUserService
