import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from '../updateUserAvatarService'
import FakeDiskStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeDiskStorageProvider';


let fakeUsersRepository: FakeUsersRepository;
let fakeDiskStorageProvider: FakeDiskStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;


describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeDiskStorageProvider = new FakeDiskStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeDiskStorageProvider);

  })
  it('should be able to create avatar for user', async () => {

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
    await expect(updateUserAvatarService.execute({
      user_id: '123132',
      avatarFilename: 'qualquecoisa.png'
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update the users avatar', async () => {

    const deleteFile = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

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
