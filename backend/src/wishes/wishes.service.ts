/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { RequestUser } from 'src/global';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
  ) {}

  async validateWishOwner(wishId: number, userId: number) {
    const wish = await this.getWishById(Number(wishId), {
      relations: { owner: true },
    });

    if (wish.owner.id !== userId) {
      throw new UnauthorizedException(
        'У вас не достаточно прав на это действие',
      );
    }

    return wish;
  }

  async updateRiased(wishId: number, raised: number) {
    return this.wishesRepository.update(wishId, { raised });
  }

  async getAllWishes(where: any) {
    return this.wishesRepository.find({ where: where });
  }

  async getWishById(id: number, options?: FindOneOptions<Wish>) {
    const wish = await this.wishesRepository.findOne({
      where: { id, ...options?.where },
      relations: ['owner', 'offers', 'offers.user'],
      ...options,
    });

    if (!wish) {
      throw new NotFoundException('Wish с такой id не существует');
    }

    return wish;
  }

  async create(reqUser: RequestUser, payload: CreateWishDto) {
    const userId = reqUser?.id;

    const wish = this.wishesRepository.create({
      ...payload,
      owner: { id: userId },
    });

    await this.wishesRepository.save(wish);

    return wish;
  }

  getLatestWishes() {
    return this.wishesRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.owner', 'user')
      .leftJoinAndSelect('wish.offers', 'offers')
      .leftJoinAndSelect('wish.wishLists', 'wishlists')
      .orderBy('wish.createdAt', 'DESC')
      .limit(10)
      .getMany();
  }

  getTopWishes() {
    return this.wishesRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.owner', 'user')
      .leftJoinAndSelect('wish.offers', 'offers')
      .leftJoinAndSelect('wish.wishLists', 'wishlists')
      .orderBy('wish.price', 'DESC')
      .limit(5)
      .getMany();
  }

  async update(id: number, payload: UpdateWishDto, reqUser: RequestUser) {
    const wish = await this.validateWishOwner(id, reqUser?.id);

    if ('raised' in payload) {
      delete payload.raised;
    }

    if (wish?.offers?.length && payload?.price) {
      throw new ConflictException(
        'Нельзя изменить стоимость подарка, так как уже есть желающие скинуться',
      );
    }

    return this.wishesRepository.update({ id }, payload);
  }

  async delete(id: number, reqUser: RequestUser) {
    await this.validateWishOwner(id, reqUser?.id);
    return this.wishesRepository.delete({ id });
  }

  async copy(reqUser: RequestUser, wishId: number) {
    const wish = await this.getWishById(wishId, { relations: { owner: true } });

    if (wish.owner.id === reqUser?.id) {
      throw new BadRequestException('Вы не можете скопировать свой wish');
    }

    await this.wishesRepository.update(
      { id: wishId },
      { copied: wish?.copied + 1 },
    );

    const copiedWish = await this.create(reqUser, {
      name: wish.name,
      description: wish.description,
      link: wish.link,
      price: wish.price,
      image: wish.image,
    });
    return copiedWish;
  }
}
