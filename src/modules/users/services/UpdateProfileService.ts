import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProviders/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string
  name: string,
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfile {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }

  public async execute({ email, name, user_id, old_password, password }: IRequest): Promise<User | undefined> {
    const user = await this.usersRepository.findById(user_id);
    console.log('chegouuuu')
    if (!user) {
      throw new AppError('User not found.');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfile;
