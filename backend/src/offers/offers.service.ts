import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { RequestUser } from 'src/global';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private wishService: WishesService,
  ) {}

  async createOffer(reqUser: RequestUser, payload: CreateOfferDto) {
    const wish = await this.wishService.getWishById(payload.itemId);
    const formattedPrice = Number(wish.price);
    const formattedRaisedAmount = Number(wish.raised);
    const formattedpayloadAmount = Number(payload.amount);

    if (wish.owner.id === reqUser?.id) {
      throw new ConflictException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }

    if (formattedRaisedAmount === formattedPrice) {
      throw new ConflictException('Уже собранно достаточно денег на подарок');
    }

    if (formattedRaisedAmount + formattedpayloadAmount > formattedPrice) {
      throw new ConflictException('Предложенная сумма больше чем нужно');
    }

    const offer = this.offersRepository.create({
      amount: payload.amount,
      hidden: payload.hidden,
      wish: { id: wish.id },
      user: { id: reqUser?.id },
    });

    await this.wishService.updateRiased(
      wish.id,
      formattedRaisedAmount + formattedpayloadAmount,
    );

    const newOffer = await this.offersRepository.save(offer);

    return newOffer;
  }

  getAllOffers() {
    return this.offersRepository.find();
  }

  async getOfferById(id: number) {
    const offer = await this.offersRepository.findOneBy({ id });

    return offer;
  }
}
