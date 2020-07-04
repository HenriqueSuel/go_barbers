import User from '@modules/users/infra/typeorm/entities/User'
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProviders from '@shared/container/providers/StorageProviders/models/IStorageProviders';

interface IRequest {
  user_id: string,
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('DiskStorageProvider')
    private diskStorageProvider: IStorageProviders
    ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401)
    }

    if (user.avatar) {
      await this.diskStorageProvider.deleteFile(user.avatar)
    }

    const fileName = await this.diskStorageProvider.saveFile(avatarFilename)
    user.avatar = fileName;

    await this.usersRepository.save(user);
    delete user.password
    return user;
  }
}

export default UpdateUserAvatarService;
