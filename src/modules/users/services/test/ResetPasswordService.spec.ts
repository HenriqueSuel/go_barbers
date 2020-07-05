import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensReposity from '../../repositories/fakes/FakeUsersTokensReposity'
import ResetPasswordService from '../ResetPasswordService'

import FakeHashProvider from '../../providers/HashProviders/fakes/fakeHashProvider'

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensReposity: FakeUsersTokensReposity;
let fakeHashProvider: FakeHashProvider
let resetPasswordService: ResetPasswordService;

describe('SendForgotPasswordEmailService', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensReposity = new FakeUsersTokensReposity();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUsersTokensReposity,
      fakeHashProvider,
    )
  })

  it('should be able to reset the password', async () => {

    const { id } = await fakeUsersRepository.create({
      email: 'h.suel17@hotmail.com',
      name: 'henrique',
      password: 'teste123'
    })

    const { token } = await fakeUsersTokensReposity.generate(id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '12345',
      token
    })

    const user = await fakeUsersRepository.findById(id)

    expect(generateHash).toHaveBeenCalledWith('12345')
    expect(user?.password).toBe('12345');
  })

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  })


  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUsersTokensReposity.generate('non-existing-user')

    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to reset the password if passed more than 2 hours', async () => {

    const { id } = await fakeUsersRepository.create({
      email: 'h.suel17@hotmail.com',
      name: 'henrique',
      password: 'teste123'
    })

    const { token } = await fakeUsersTokensReposity.generate(id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    })

    await expect(resetPasswordService.execute({
      password: '12345',
      token,
    })).rejects.toBeInstanceOf(AppError);
  })

})
