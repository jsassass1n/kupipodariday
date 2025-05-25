import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishList } from './entities/wishlist.entity';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { CreateWishListDto } from './dto/create-wishlist.dto';
import { UpdateWishListDto } from './dto/update-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { RequestUser } from 'src/global';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private wishListRepository: Repository<WishList>,
    private wishService: WishesService,
  ) {}

  async validateWishListOwner(
    wishListId: number,
    userId: number,
    options?: FindOneOptions<WishList>,
  ) {
    const wishList = await this.getWishListById(Number(wishListId), {
      relations: { owner: true },
      ...options,
    });

    if (wishList.owner.id !== userId) {
      throw new UnauthorizedException(
        'У вас не достаточно прав на это действие',
      );
    }

    return wishList;
  }

  getAllWishLists(options?: FindManyOptions<WishList>) {
    return this.wishListRepository.find(options);
  }

  async getWishListById(id: number, options?: FindOneOptions<WishList>) {
    const wishList = await this.wishListRepository.findOne({
      where: { id, ...options?.where },
      ...options,
    });

    if (!wishList) {
      throw new NotFoundException('WishList с такой id не существует');
    }

    return wishList;
  }

  async createWishList(reqUser: RequestUser, payload: CreateWishListDto) {
    const wishes = await this.wishService.getAllWishes({
      id: In(payload.itemsId),
    });

    const wishList = this.wishListRepository.create({
      image: payload.image,
      name: payload.name,
      description: payload.description,
      items: wishes,
      owner: { id: reqUser?.id },
    });

    const savedWishList = await this.wishListRepository.save(wishList);

    return savedWishList;
  }

  async updateWishList(
    id: number,
    payload: UpdateWishListDto,
    reqUser: RequestUser,
  ) {
    const wishes = await this.wishService.getAllWishes({
      id: In(payload.items),
    });

    const wishList = await this.validateWishListOwner(id, reqUser.id, {
      select: { items: true },
    });

    wishList.name = payload.name;
    wishList.description = payload.description;
    wishList.image = payload.image;
    wishList.items = [...wishList.items, ...wishes];

    return this.wishListRepository.save(wishList);
  }

  async deleteWishList(id: number, reqUser: RequestUser) {
    await this.validateWishListOwner(id, reqUser?.id);
    const result = await this.wishListRepository.delete(id);
    return result;
  }
}
