import Appointment from "../infra/typeorm/entities/Appointments";
import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "../dtos/IFindAllInMonthFromProviderDTO";

interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(data: Date): Promise<Appointment | undefined>
  findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO
    ):Promise<Appointment[]>
}

export default IAppointmentsRepository;
