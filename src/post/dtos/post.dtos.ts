import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'image_url' })
  imageUrl: string;

  // @Expose({ name: 'user_id' })
  @IsNumber()
  userId: number;
}

export class CommentPost {
  @IsString()
  text: string;
}
