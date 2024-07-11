import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/shared/utils/enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsBoolean()
  @IsOptional()
  verified: boolean;

  @IsOptional()
  verifyToken: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password too weak. It must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
    },
  )
  password: string;

  @IsString()
  @IsOptional()
  deviceToken: string;

  @IsString()
  @IsOptional()
  authType: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
}
