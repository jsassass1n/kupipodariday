import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalGuard } from './guards/local.guard';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  signIn(@Req() req: Request) {
    return this.authService.signIn(req);
  }

  @Post('signup')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }
}
