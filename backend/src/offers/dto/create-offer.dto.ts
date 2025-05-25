import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';

export class CreateOfferDto {
  @IsNumber({}, { message: 'Количество должна быть числом' })
  amount: number;

  @IsNumber({}, { message: 'Подарок не выбран' })
  itemId: Wish['id'];

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
