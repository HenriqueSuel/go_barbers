import IMailProviders  from '../models/IMailProviders';

interface IMenssage {
  to:string,
  body:string
}
export default class DiskStorageProvider implements IMailProviders {
  private menssage: IMenssage[] = [];

  public async sendMail(to:string, body:string): Promise<void> {
    this.menssage.push({to, body});
  }
}
