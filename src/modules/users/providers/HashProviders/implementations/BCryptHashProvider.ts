import { compare, hash } from 'bcryptjs'
import IHashProvider from '../models/IHashProvider';

export default class BCryptyHashProvider implements IHashProvider {
  public async generateHash(payload: string) :Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload:string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
