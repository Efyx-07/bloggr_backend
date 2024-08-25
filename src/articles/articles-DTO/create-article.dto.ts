import { IsNotEmpty, IsString } from 'class-validator';
import { ArticleEntity } from 'src/entities/article.entity';

export default class CreateArticleDTO {
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
