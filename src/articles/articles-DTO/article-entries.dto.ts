import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ArticleEntity } from '../../entities/article.entity';
import { KeywordDTO } from './keyword.dto';
import { Type } from 'class-transformer';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeywordDTO)
  @IsOptional()
  keywords?: KeywordDTO[];
}
