import { Colors } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsLowercase,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserUpdateProfileDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsLowercase()
  @MinLength(3)
  username: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  age: number;

  @IsOptional()
  @IsString()
  image_url: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  description: string;
}

export class UserUpdatePasswordDto {
  @IsString()
  @MinLength(5)
  oldPassword: string;

  @IsString()
  @MinLength(5)
  newPassword: string;
}

export class ColorUpdate {
  @IsEnum(Colors)
  color: Colors;
}
