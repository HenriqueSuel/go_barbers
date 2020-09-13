import "reflect-metadata"
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointments from '@modules/appointments/infra/typeorm/entities/Appointments'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

interface IRequest {
  provider_id: string,
  date: Date,
  user_id: string
}

@injectable()
class CreatedAppointmentService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) { }

  public async execute({ provider_id, date, user_id }: IRequest): Promise<Appointments> {
    const appointmentDate = startOfHour(date);

    if(user_id === provider_id) {
      throw new AppError("You can't create an appointemnt with yourself", 400)
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }

    if(isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointemnt on a past date", 400)
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
      )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already blooked', 400)
    }

    const appointment = await this.appointmentsRepository.create({ provider_id, date: appointmentDate, user_id })

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`
    })

    return appointment;
  }

}
export default CreatedAppointmentService
