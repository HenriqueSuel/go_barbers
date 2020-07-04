import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProviders/fakes/fakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './updateUserAvatarService'
import FakeDiskStorageProvider from '../../../shared/container/providers/StorageProviders/fakes/FakeDiskStorageProvider';

describe('UpdateUserAvatar', () => {
  it('should be able to create avatar for user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeDiskStorageProvider);

    const user = await fakeUsersRepository.create({
      name: 'Henrique',
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    })

    await updateUserAvatarService.execute({
      user_id: user?.id,
      avatarFilename: 'qualquecoisa.png'
    })

    expect(user.avatar).toBe('qualquecoisa.png');
  })

  it('should not be able to create avatar for user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeDiskStorageProvider);

    await expect(updateUserAvatarService.execute({
      user_id: '123132',
      avatarFilename: 'qualquecoisa.png'
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update the users avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();

    const deleteFile = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeDiskStorageProvider);

    const user = await fakeUsersRepository.create({
      name: 'Henrique',
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    })

   await updateUserAvatarService.execute({
      user_id: user?.id,
      avatarFilename: 'qualquecoisa.png'
    })

    await updateUserAvatarService.execute({
      user_id: user?.id,
      avatarFilename: 'OutraQualquecoisa.png'
    })

    expect(deleteFile).toHaveBeenCalledWith('qualquecoisa.png');
    expect(user.avatar).toBe('OutraQualquecoisa.png');
  })
})
