import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleKeywordEntity } from './article_keyword.entity';

@Entity('keywords')
export class KeywordEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'title' })
  name: string;

  @OneToMany(() => ArticleKeywordEntity, (articleKeyword) => articleKeyword.keyword)
  articleKeywords: ArticleKeywordEntity[];
}
