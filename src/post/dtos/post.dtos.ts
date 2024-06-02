import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  title: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'image_url' })
  imageUrl: string;
}

export class CommentPost {
  @IsString()
  text: string;
}
