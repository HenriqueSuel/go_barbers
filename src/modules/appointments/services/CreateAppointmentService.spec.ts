import CreateAppointmentService from './CreatedAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;


describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository)
  })

  it('should be able to create a new appointment', async () => {

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '1231312'
    })

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1231312');

  })

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentMock = {
      date: new Date(2030, 4 , 10, 11),
      provider_id: '1231312'
    }

    await createAppointmentService.execute(appointmentMock)

    await expect(createAppointmentService.execute(appointmentMock)).rejects.toBeInstanceOf(AppError);
  })
})
