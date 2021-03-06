import Appointment from "../infra/typeorm/entities/Appointments";
import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "../dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "../dtos/IFindAllInDayFromProviderDTO";

interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(data: Date, id_provider: string): Promise<Appointment | undefined>
  findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO
    ):Promise<Appointment[]>
  findAllInDayFromProvider(data: IFindAllInDayFromProviderDTO):Promise<Appointment[]>
}

export default IAppointmentsRepository;
