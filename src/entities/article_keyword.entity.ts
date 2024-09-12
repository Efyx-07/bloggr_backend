import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { KeywordEntity } from './keyword.entity';

@Entity('article_keywords')
export class ArticleKeywordEntity {
  @PrimaryColumn()
  articleId: number;

  @PrimaryColumn()
  keywordId: number;

  @ManyToOne(() => ArticleEntity, (article) => article.articleKeywords)
  article: ArticleEntity;

  @ManyToOne(() => KeywordEntity, (keyword) => keyword.articleKeywords)
  keyword: KeywordEntity;
}
