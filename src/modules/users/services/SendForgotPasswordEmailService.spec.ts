import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'
import AppError from '@shared/errors/AppError'
import FakeMailProvider from '@shared/container/providers/MailProviders/fakes/FakeMailProvider'

describe('SendForgotPasswordEmailService', () => {
  it('should be able to recorver the password using the email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const createUsers = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider
    )

    await fakeUsersRepository.create({
      email:'h.suel17@hotmail.com',
      name: 'henrique',
      password: 'teste123'
    })

    await createUsers.execute({
      email: 'h.suel17@hotmail.com',
    })

    expect(sendMail).toHaveBeenCalled();
  })

  it('Should not be able to recover a non-existing user password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const createUsers = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider
    )

    await expect(createUsers.execute({
      email: 'h.suel17@hotmail.com',
    })).rejects.toBeInstanceOf(AppError);
  })
})
