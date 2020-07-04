import {Request, Response } from 'express'
import { parseISO } from 'date-fns'
import {container} from 'tsyringe'
import CreatedAppointmentService from '@modules/appointments/services/CreatedAppointmentService'

class AppointmentsController {
  public async create(request:Request, response:Response): Promise<Response> {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date)

    const createdAppointment = container.resolve(CreatedAppointmentService);

    const appointment = await createdAppointment.execute({ provider_id, date: parsedDate });

    return response.json(appointment)
  }
}

export default AppointmentsController
