import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/shared/utils/enums';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
}
