import { Colors } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  name: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  description: string;
}

export class UpdateCommunityDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  description: string;
}

export class ColorUpdate {
  @IsEnum(Colors)
  color: Colors;
}
