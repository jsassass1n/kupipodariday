import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/global';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  createOffer(
    @CurrentUser() reqUser: RequestUser,
    @Body() payload: CreateOfferDto,
  ) {
    return this.offersService.createOffer(reqUser, payload);
  }

  @Get()
  getAllOffers() {
    return this.offersService.getAllOffers();
  }

  @Get(':id')
  getOfferById(@Param('id') id: string) {
    return this.offersService.getOfferById(Number(id));
  }
}
