import { Expose } from 'class-transformer';
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
  @Expose({ name: 'image_url' })
  imageUrl: string;

  @IsOptional()
  @Expose({ name: 'community_id' })
  @IsNumber()
  communityId: number;
}

export class CommentPostDto {
  @MaxLength(500)
  @IsString()
  text: string;
}
