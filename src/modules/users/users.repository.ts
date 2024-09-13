import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUserById(id: string): Promise<User | null> {
    const foundUser = await this.usersRepository.findOne({ where: { id } });
    return foundUser ? foundUser : null;
  }

  async addUser(user: User): Promise<User> {
    if (
      !user ||
      !user.name ||
      !user.email ||
      !user.password ||
      !user.address ||
      !user.phone
    ) {
      throw new BadRequestException('Missing required fields');
    }

    const newUser = this.usersRepository.create(user);
    console.log(newUser);
    return await this.usersRepository.save(newUser);
  }

  async updateUser(updatedUser: User): Promise<User> {
    return this.usersRepository.save(updatedUser);
  }

  async deleteUser(id: string): Promise<string> {
    await this.usersRepository.delete(id);
    return id;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
}

export default User;
