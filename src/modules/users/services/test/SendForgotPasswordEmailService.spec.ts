import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '../SendForgotPasswordEmailService'
import FakeUsersTokensReposity from '../../repositories/fakes/FakeUsersTokensReposity'
import AppError from '@shared/errors/AppError'
import FakeMailProvider from '@shared/container/providers/MailProviders/fakes/FakeMailProvider'

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUsersTokensReposity: FakeUsersTokensReposity;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUsersTokensReposity = new FakeUsersTokensReposity();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUsersTokensReposity
    )
  })

  it('should be able to recorver the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      email: 'h.suel17@hotmail.com',
      name: 'henrique',
      password: 'teste123'
    })

    await sendForgotPasswordEmail.execute({
      email: 'h.suel17@hotmail.com',
    })

    expect(sendMail).toHaveBeenCalled();
  })

  it('Should not be able to recover a non-existing user password', async () => {
    await expect(sendForgotPasswordEmail.execute({
      email: 'testeasa@example.com'
    })).rejects.toBeInstanceOf(AppError);
  })

  it('Should generate a forgot password token', async () => {

    const generateToken = jest.spyOn(fakeUsersTokensReposity, 'generate');

    const user = await fakeUsersRepository.create({
      email: 'h.suel17@hotmail.com',
      name: 'henrique',
      password: 'teste123'
    })

    await sendForgotPasswordEmail.execute({
      email: 'h.suel17@hotmail.com',
    })

    expect(generateToken).toHaveBeenCalledWith(user.id);
  })
})
