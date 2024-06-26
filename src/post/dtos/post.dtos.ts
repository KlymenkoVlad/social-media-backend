import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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
  @Expose({ name: 'image_url' })
  imageUrl: string;
}

export class CommentPostDto {
  @MaxLength(500)
  @IsString()
  text: string;
}
