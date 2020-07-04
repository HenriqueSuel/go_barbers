import "reflect-metadata"
import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider'


interface IRequest {
  token:string;
  password: string;
}

@injectable()
class ResetPasswordService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('userTokensRepository')
    private userTokensRepository:IUserTokenRepository,

    @inject('HashProvider')
    private hashProvider:IHashProvider,
    ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if(!userToken) {
      throw new AppError('User Token does not exists', 401)
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if(!user) {
      throw new AppError('User Token does not exists', 401)
    }

    const tokenCreatedAt = userToken.created_at

    if(differenceInHours( Date.now(), tokenCreatedAt) > 2 ) {
      throw new AppError('Token expired')
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService
