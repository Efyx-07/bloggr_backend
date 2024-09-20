import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('keywords')
export class KeywordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => ArticleEntity, (article) => article.keywords)
  articles: ArticleEntity[];
}
