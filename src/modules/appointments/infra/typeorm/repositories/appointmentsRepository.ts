import { getRepository, Repository, Raw } from 'typeorm'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository:Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async findByDate(date: Date, id_provider:string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, id_provider },
    })
    return findAppointment;
  }

  public async create({ provider_id, date, user_id} : ICreateAppointmentDTO):Promise<Appointment>{
      const appointment = this.ormRepository.create({provider_id, date, user_id });
      await this.ormRepository.save(appointment);
      return appointment;
  }

  public async findAllInMonthFromProvider({month, provider_id, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const appointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`)
      },
    })
    return appointment;
  }

  public async findAllInDayFromProvider({month, provider_id, year, day }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`)
      },
      relations: ['user'],
    })
    console.log(appointments)
    return appointments;
  }
}

export default AppointmentsRepository;
