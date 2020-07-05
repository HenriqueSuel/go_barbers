import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '../ListProviderMonthAvailabilityService';

let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 27, 8, 0, 0),
      provider_id: 'user'
    })
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 27, 10, 0, 0),
      provider_id: 'user'
    })
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 21, 8, 0, 0),
      provider_id: 'user'
    })

    const availability = await listProviderMonthAvailabilityService.execute({
      month: 5,
      provider_id: 'user',
      year: 2020
    })

    expect(availability).toEqual(expect.arrayContaining([
      { day: 19, availability:true},
      { day: 27, availability:false},
      { day: 21, availability:false},
      { day: 20, availability:true},

    ]))

  });

});
