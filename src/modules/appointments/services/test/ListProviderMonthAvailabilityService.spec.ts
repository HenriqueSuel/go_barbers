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

  it.only('should be able to list the month availability from provider', async () => {

    for(let index = 8; index <= 17; index++) {
      await fakeAppointmentsRepository.create({
        date: new Date(2020, 4, 21, index, 0, 0),
        provider_id: 'user',
        user_id: 'user'
      })
    }

     await fakeAppointmentsRepository.create({
        date: new Date(2020, 4, 27, 8 , 0, 0),
        provider_id: 'user',
        user_id: 'user'
      })

    const availability = await listProviderMonthAvailabilityService.execute({
      month: 5,
      provider_id: 'user',
      year: 2020
    })

    expect(availability).toEqual(expect.arrayContaining([
      { day: 21, available:false},
      { day: 27, available:true},
      { day: 1, available:true},
    ]))

  });

});
