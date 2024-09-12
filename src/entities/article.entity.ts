import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleKeywordEntity } from './article_keyword.entity';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'title' })
  title: string;

  @Column({ type: 'varchar', length: 255, name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'longtext', name: 'body' })
  body: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'creation_date',
  })
  creationDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'last_update',
  })
  lastUpdate: Date;

  @OneToMany(
    () => ArticleKeywordEntity,
    (articleKeyword) => articleKeyword.article,
  )
  articleKeywords: ArticleKeywordEntity[];
}
