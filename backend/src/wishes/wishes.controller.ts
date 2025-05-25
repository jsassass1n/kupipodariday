import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/global';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  wishes(@CurrentUser() reqUser: RequestUser, @Body() payload: CreateWishDto) {
    return this.wishesService.create(reqUser, payload);
  }

  @Get('last')
  getLatestWishes() {
    return this.wishesService.getLatestWishes();
  }

  @Get('top')
  getTopWish() {
    return this.wishesService.getTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getWishById(@Param('id') id: string) {
    return this.wishesService.getWishById(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updateWish(
    @Param('id') id: string,
    @Body() payload: UpdateWishDto,
    @CurrentUser() reqUser: RequestUser,
  ) {
    return this.wishesService.update(Number(id), payload, reqUser);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  deleteWish(@Param('id') id: string, @CurrentUser() reqUser: RequestUser) {
    return this.wishesService.delete(Number(id), reqUser);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  copyWish(@CurrentUser() reqUser: RequestUser, @Param('id') id: string) {
    return this.wishesService.copy(reqUser, Number(id));
  }
}
