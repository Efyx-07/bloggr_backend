import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ArticleEntity } from '../../entities/article.entity';

export class ArticleEntriesDTO {
  @IsString()
  @IsNotEmpty()
  title: ArticleEntity['title'];

  @IsString()
  @IsNotEmpty()
  imageUrl: ArticleEntity['imageUrl'];

  @IsString()
  @IsNotEmpty()
  body: ArticleEntity['body'];
}
