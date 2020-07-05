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
      date: new Date(2020, 4, 27, 14, 0, 0),
      provider_id: 'user',
      user_id: 'user'
    })

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 27, 15, 0, 0),
      provider_id: 'user',
      user_id: 'user'
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 27, 11).getTime();
    })

    const availability = await listProviderDayAvailabilityService.execute({
      month: 5,
      provider_id: 'user',
      year: 2020,
      day: 27
    })

    expect(availability).toEqual(expect.arrayContaining([
      { hour: 8, available: false },
      { hour: 9, available: false },
      { hour: 10, available: false },
      { hour: 12, available: true },
      { hour: 13, available: true },
      { hour: 14, available: false },
      { hour: 15, available: false },
      { hour: 16, available: true },
    ]))

  });


});
