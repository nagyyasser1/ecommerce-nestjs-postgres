import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPassDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
