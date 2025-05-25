import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishDto {
  @IsString({ message: 'Имя должен быть строкой' })
  @MinLength(1, { message: 'Имя должен быть более 1 символа' })
  @MaxLength(250, { message: 'Имя должно быть менее 30 символов' })
  name: string;

  @IsString()
  @IsUrl({}, { message: 'Ссылка должна быть валидным URL' })
  link: string;

  @IsString()
  @IsUrl({}, { message: 'Картинка должна быть валидным URL' })
  image: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Transform(
    ({ value }: { value: string }) => Math.round(parseFloat(value) * 100) / 100,
  )
  price: number;

  @IsString({ message: 'Описание обязательное поле' })
  @MinLength(1, { message: 'Описание должен быть более 1 символа' })
  @MaxLength(250, { message: 'Описание должно быть менее 30 символов' })
  description: string;
}
