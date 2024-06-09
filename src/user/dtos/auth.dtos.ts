import {
  IsEmail,
  IsLowercase,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @MaxLength(30)
  @IsString()
  name: string;

  @IsString()
  @IsLowercase()
  @MinLength(3)
  @MaxLength(20)
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
