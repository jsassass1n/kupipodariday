import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';

export class CreateWishListDto {
  @IsString({ message: 'Имя должен быть строкой' })
  @MinLength(1, { message: 'Имя должен быть более 1 символа' })
  @MaxLength(250, { message: 'Имя должно быть менее 30 символов' })
  name: string;

  @IsString({ message: 'Описание должна быть строкой' })
  @MaxLength(1500, { message: 'Описание должна быть менее 30 символов' })
  @IsOptional()
  description: string;

  @IsString()
  @IsUrl({}, { message: 'Картинка должна быть валидным URL' })
  image: string;

  @IsArray({ message: 'Не валидный id подарков' })
  @IsInt({ each: true, message: 'Значение не валидное' })
  itemsId: Wish[];
}
