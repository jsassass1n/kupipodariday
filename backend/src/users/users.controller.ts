import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/global';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@CurrentUser() reqUser: RequestUser) {
    return this.usersService.getMe(reqUser);
  }

  @Patch('me')
  @UseGuards(JwtGuard)
  updateUser(
    @CurrentUser() reqUser: RequestUser,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.updateUser(reqUser, payload);
  }

  @Get('me/wishes')
  @UseGuards(JwtGuard)
  getMyWishes(@CurrentUser() reqUser: RequestUser) {
    return this.usersService.getMyWishes(reqUser);
  }

  @Get(':username')
  @UseGuards(JwtGuard)
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findUserByUsernameAndEmail({ username });
  }

  @Get(':username/wishes')
  @UseGuards(JwtGuard)
  getUsersWishesByUsername(@Param('username') username: string) {
    return this.usersService.getUsersWishesByUsername(username);
  }

  @Post('find')
  @UseGuards(JwtGuard)
  getUsersByQuery(@Body() { query }: { query: string }) {
    return this.usersService.findMany(query);
  }
}
