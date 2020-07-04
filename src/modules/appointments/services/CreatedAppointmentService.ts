import "reflect-metadata"
import Appointments from '@modules/appointments/infra/typeorm/entities/Appointments'
import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import { startOfHour } from 'date-fns'
import { injectable, inject } from 'tsyringe';


interface IRequest {
  provider_id: string,
  date: Date
}

@injectable()
class CreatedAppointmentService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository:IAppointmentsRepository
    ) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointments> {

    const appointmentDate = startOfHour(date)
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate)

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already blooked', 400)
    }

    const appointment = await this.appointmentsRepository.create({ provider_id, date: appointmentDate })

    return appointment;
  }

}
export default CreatedAppointmentService
