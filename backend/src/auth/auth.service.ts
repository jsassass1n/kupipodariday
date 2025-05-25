import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByUsernameAndEmail(
      {
        username,
      },
      { select: ['id', 'username', 'email', 'password'] },
    );

    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    return { username: user.username, id: user.id };
  }

  signIn(req: Request) {
    const payload = {
      username: req?.user?.username,
      sub: req?.user?.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(payload: CreateUserDto) {
    const user = await this.usersService.createUser(payload);
    return user;
  }
}
