import { IsString, MaxLength, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsString({ message: 'Username должен быть строкой' })
  @MinLength(2, { message: 'Username должен быть более 2 символов' })
  @MaxLength(30, { message: 'Имя должно быть менее 30 символов' })
  username: string;

  @IsString({ message: 'Пароль обязательное поле' })
  @MinLength(2, { message: 'Пароль должен быть более 2 символов' })
  password: string;
}
