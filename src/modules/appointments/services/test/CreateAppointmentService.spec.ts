import CreateAppointmentService from '../CreatedAppointmentService';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;


describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository)
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '1231312',
      user_id: 'ada'
    })

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1231312');

  })

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentMock = {
      date: new Date(2030, 4, 10, 11),
      provider_id: '1231312',
      user_id: 'asd'
    }

    await createAppointmentService.execute(appointmentMock)

    await expect(createAppointmentService.execute(appointmentMock)).rejects.toBeInstanceOf(AppError);
  })

  it('Should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: '123123',
        user_id: '131231'
      })).rejects.toBeInstanceOf(AppError);
  })

  it('Should not be able to create an appointment wtih same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: '123123',
        user_id: '123123'
      })).rejects.toBeInstanceOf(AppError);
  })

  it('Should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider_id',
        user_id: 'user_id'
      })).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: 'provider_id',
        user_id: 'user_id'
      })).rejects.toBeInstanceOf(AppError);
  })
})
