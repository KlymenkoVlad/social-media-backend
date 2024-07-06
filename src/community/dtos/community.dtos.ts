import { Colors } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  name: string;

  @IsString()
  image_url: string;

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
  image_url: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  description: string;
}

export class ColorUpdate {
  @IsEnum(Colors)
  color: Colors;
}
