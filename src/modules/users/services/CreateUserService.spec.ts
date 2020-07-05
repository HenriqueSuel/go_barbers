import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProviders/fakes/fakeHashProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUsersService: CreateUserService;


describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUsersService = new CreateUserService(fakeUsersRepository,fakeHashProvider)

  })

  it('should be able to create a new user', async () => {

    const user = await createUsersService.execute({
      name: 'Henrique',
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    })

    expect(user).toHaveProperty('id');
  })

  it('should not be able to create a new user with same email from another', async () => {
    const userMock = {
      name: 'Henrique',
      email: 'h.suel17@hotmail.com',
      password: 'teste123',
    };

    await createUsersService.execute(userMock)

    await expect(createUsersService.execute(userMock)).rejects.toBeInstanceOf(AppError);
  })
})
