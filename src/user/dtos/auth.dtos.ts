import {
  IsEmail,
  IsLowercase,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsLowercase()
  @MinLength(3)
  username: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}
