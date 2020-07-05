
import { uuid } from 'uuidv4'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { isEqual, getMonth, getDate, getYear } from 'date-fns'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date))

      return findAppointment
  }

  public async create({ provider_id, date } : ICreateAppointmentDTO):Promise<Appointment>{
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id } )

    this.appointments.push(appointment)

    return appointment
  }

  public async findAllInMonthFromProvider({ provider_id, year, month } : IFindAllInMonthFromProviderDTO):Promise<Appointment[]>{
    const appointment = this.appointments.filter(
      appointment => appointment.provider_id === provider_id &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
      )
      return appointment
  }

  public async findAllInDayFromProvider({ provider_id, year, month, day } : IFindAllInDayFromProviderDTO):Promise<Appointment[]>{
    const appointment = this.appointments.filter(
      appointment => appointment.provider_id === provider_id &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year &&
      getDate(appointment.date) === day
      )
      return appointment
  }
}

export default FakeAppointmentsRepository;
