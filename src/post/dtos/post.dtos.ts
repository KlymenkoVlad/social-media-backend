import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  title: string;

  @IsString()
  @MaxLength(3000)
  text: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsNumber()
  communityId: number;
}

export class CommentPostDto {
  @MaxLength(500)
  @IsString()
  text: string;
}
