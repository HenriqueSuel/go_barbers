import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProviders/fakes/fakeHashProvider'

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsersService = new CreateUserService(fakeUsersRepository,fakeHashProvider)

    const user = await createUsersService.execute({
      name: 'Henrique',
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    })

    expect(user).toHaveProperty('id');
  })

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsersService = new CreateUserService(fakeUsersRepository, fakeHashProvider)

    const userMock = {
      name: 'Henrique',
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    };

    await createUsersService.execute(userMock)

    await expect(createUsersService.execute(userMock)).rejects.toBeInstanceOf(AppError);
  })
})
