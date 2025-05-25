import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username должен быть строкой' })
  @MinLength(2, { message: 'Username должен быть более 2 символов' })
  @MaxLength(30, { message: 'Имя должно быть менее 30 символов' })
  username: string;

  @IsString()
  @MinLength(2, { message: 'Описание должно быть более 2 символов' })
  @MaxLength(200, { message: 'Описание должно быть менее 30 символов' })
  @IsOptional()
  about: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Аватар должен быть валидным URL' })
  avatar: string;

  @IsEmail({}, { message: 'E-mail должен быть валидным' })
  email: string;

  @IsString({ message: 'Пароль обязательное поле' })
  @MinLength(2, { message: 'Пароль должен быть более 2 символов' })
  password: string;
}
