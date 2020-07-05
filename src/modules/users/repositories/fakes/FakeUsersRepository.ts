import { uuid } from 'uuidv4'

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

import User from '../../infra/typeorm/entities/User'
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {

  private users: User[] = []

  constructor() {
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid(), ...userData })
    this.users.push(user);
    return user;

  }

  public async save(user: User): Promise<User> {
    const id = this.users.findIndex(userId => userId.id === user.id)
    this.users[id] = user;
    return user;
  }

  public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
    const listUser = this.users.filter(userId => userId.id !== except_user_id)

    return listUser;
  }

}

export default UsersRepository;
