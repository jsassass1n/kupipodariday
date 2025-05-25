import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateWishDto {
  @IsString({ message: 'Имя должен быть строкой' })
  @MinLength(1, { message: 'Имя должен быть более 1 символа' })
  @MaxLength(250, { message: 'Имя должно быть менее 30 символов' })
  @IsOptional()
  name: string;

  @IsString()
  @IsUrl({}, { message: 'Ссылка должна быть валидным URL' })
  @IsOptional()
  link: string;

  @IsString()
  @IsUrl({}, { message: 'Картинка должна быть валидным URL' })
  @IsOptional()
  image: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Transform(
    ({ value }: { value: string }) => Math.round(parseFloat(value) * 100) / 100,
  )
  @IsOptional()
  price: number;

  @IsString({ message: 'Описание обязательное поле' })
  @MinLength(1, { message: 'Описание должен быть более 1 символа' })
  @MaxLength(250, { message: 'Описание должно быть менее 30 символов' })
  @IsOptional()
  description: string;
}
