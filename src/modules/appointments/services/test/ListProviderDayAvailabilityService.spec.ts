import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '../ListProviderDayAvailabilityService';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the month availability from provider', async () => {

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 27, 9, 0, 0),
      provider_id: 'user',
    })

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 27, 11, 0, 0),
      provider_id: 'user',
    })

    const availability = await listProviderDayAvailabilityService.execute({
      month: 5,
      provider_id: 'user',
      year: 2020,
      day: 27
    })

    expect(availability).toEqual(expect.arrayContaining([
      { hour: 8, available: false },
      { hour: 9, available: true },
      { hour: 10, available: false },
      { hour: 11, available: true },
    ]))

  });

});
