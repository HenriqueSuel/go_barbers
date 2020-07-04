import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProviders/fakes/fakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService';
import AppError from '@shared/errors/AppError'
import CreateUserService from './CreateUserService';

describe('Authenticate', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)

    const userMock = {
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    }

    const user = await createUser.execute({
      name: 'Henrique',
      ...userMock
    });

    const authenticate = await authenticateUserService.execute(userMock)

    expect(authenticate).toHaveProperty('token');
    expect(user?.email).toEqual(userMock.email);
  })

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)

    const userMock = {
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    }

    await expect(authenticateUserService.execute(userMock)).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)

    const userMock = {
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    }

    const user = await createUser.execute({
      name: 'Henrique',
      ...userMock
    });

    await expect(authenticateUserService.execute({...userMock, password: '1234562'})).rejects.toBeInstanceOf(AppError);
  })

})
