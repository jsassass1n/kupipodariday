import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { ConfigService } from '@nestjs/config';
import { hashPassword } from 'src/common/helpers/hash-password';
import { RequestUser } from 'src/global';

@Injectable()
export class UsersService {
  salt: string;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.salt = this.configService.get<string>('BCRYPT_SALT') ?? '';
  }

  async findMany(query: string) {
    return this.userRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
  }

  async findOne(options?: FindOneOptions<User>) {
    const user = await this.userRepository.findOne({ ...options });

    if (!user) {
      throw new NotFoundException('Такой пользователь не существует');
    }

    return user;
  }

  findUserByUsernameAndEmail(
    payload: FindUserDto,
    options?: FindOneOptions<User>,
  ) {
    const { username, email } = payload;

    return this.findOne({
      where: [{ username }, { email }],
      ...options,
    });
  }

  async createUser(payload: CreateUserDto) {
    const hash = await hashPassword(payload.password);
    const user = await this.userRepository.save({
      ...payload,
      password: hash,
    });

    return user;
  }

  async getMe(reqUser: RequestUser) {
    const user = await this.userRepository.findOneBy({ id: reqUser?.id });

    return user;
  }

  async updateUser(reqUser: RequestUser, payload: UpdateUserDto) {
    const updatedPayload: UpdateUserDto = payload;

    if (payload.password) {
      updatedPayload.password = await hashPassword(payload.password);
    }

    const result = await this.userRepository.update(
      { id: reqUser?.id },
      updatedPayload,
    );

    return result;
  }

  async getMyWishes(reqUser: RequestUser) {
    const user = await this.userRepository.findOne({
      where: { id: reqUser?.id },
      relations: ['wishes'],
    });

    return user?.wishes;
  }

  async getUsersWishesByUsername(username: string) {
    const user = await this.findUserByUsernameAndEmail(
      { username },
      { relations: { wishes: true } },
    );

    return user.wishes;
  }
}
