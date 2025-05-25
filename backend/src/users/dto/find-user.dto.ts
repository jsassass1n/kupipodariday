import { IsOptional, IsString } from 'class-validator';

export class FindUserDto {
  @IsString({ message: 'Username должен быть строкой' })
  @IsOptional()
  username: string;

  @IsString({ message: 'E-mail должен быть валидным' })
  @IsOptional()
  email?: string;
}
