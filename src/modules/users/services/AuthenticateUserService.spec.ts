import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProviders/fakes/fakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService';
import AppError from '@shared/errors/AppError'
import CreateUserService from './CreateUserService';


let fakeUsersRepository:FakeUsersRepository;
let fakeHashProvider:FakeHashProvider;

let createUser:CreateUserService;
let authenticateUserService:AuthenticateUserService

describe('Authenticate', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)

  })
  it('should be able to authenticate', async () => {

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
    const userMock = {
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    }

    await expect(authenticateUserService.execute(userMock)).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to authenticate with wrong password', async () => {
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
