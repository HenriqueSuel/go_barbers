import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '../ListProviderAppointmentsService';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmentsRepository);
  });

  it('should be able to list the appointments on a specific day', async () => {

   const appointment1 =  await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 27, 14, 0, 0),
      provider_id: 'provider',
      user_id: 'user'
    })

    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 27, 8, 0, 0),
      provider_id: 'provider',
      user_id: 'user'
    })

    const appointment = await listProviderAppointmentsService.execute({
      month: 5,
      provider_id: 'provider',
      year: 2020,
      day: 27
    })

    expect(appointment).toEqual([appointment1,appointment2])

  });

});
