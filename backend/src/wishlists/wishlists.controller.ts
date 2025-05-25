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
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateWishListDto } from './dto/create-wishlist.dto';
import { UpdateWishListDto } from './dto/update-wishlist.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/global';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private wishListsService: WishlistsService) {}

  @Get()
  getAllWishLists() {
    return this.wishListsService.getAllWishLists();
  }

  @Post()
  createWishList(
    @CurrentUser() reqUser: RequestUser,
    @Body() payload: CreateWishListDto,
  ) {
    return this, this.wishListsService.createWishList(reqUser, payload);
  }

  @Get(':id')
  async getWishListById(@Param('id') id: string) {
    const wishList = await this.wishListsService.getWishListById(Number(id), {
      relations: { items: true, owner: true },
    });

    return wishList;
  }

  @Patch(':id')
  updateWishList(
    @Param('id') id: string,
    @Body() payload: UpdateWishListDto,
    @CurrentUser() reqUser: RequestUser,
  ) {
    return this.wishListsService.updateWishList(Number(id), payload, reqUser);
  }

  @Delete(':id')
  deleteWishList(@Param('id') id: string, @CurrentUser() reqUser: RequestUser) {
    return this.wishListsService.deleteWishList(Number(id), reqUser);
  }
}
