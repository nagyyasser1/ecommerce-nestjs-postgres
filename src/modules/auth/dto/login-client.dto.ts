import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginClientDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
