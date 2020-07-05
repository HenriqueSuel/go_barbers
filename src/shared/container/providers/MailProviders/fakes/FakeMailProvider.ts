import IMailProviders  from '../models/IMailProviders';
import ISendMailDTO from '../dtos/ISendMailDTO';
export default class DiskStorageProvider implements IMailProviders {
  private menssage: ISendMailDTO[] = [];

  public async sendMail( message: ISendMailDTO): Promise<void> {
    this.menssage.push(message);
  }
}
