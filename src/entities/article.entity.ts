import { IsNotEmpty, IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KeywordEntity } from './keyword.entity';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'title' })
  @IsNotEmpty()
  title: string;

  @Column({ type: 'varchar', length: 255, name: 'image_url' })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @Column({ type: 'longtext', name: 'body' })
  @IsNotEmpty()
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

  @Column({ type: 'boolean', default: false, name: 'published' })
  published: boolean;

  @Column({
    type: 'timestamp',
    name: 'publication_date',
    nullable: true,
  })
  publicationDate: Date;

  @Column({
    type: 'timestamp',
    name: 'publication_update',
    nullable: true,
  })
  publicationUpdate: Date;

  @Column({
    type: 'int',
    default: 1,
    name: 'published_version',
  })
  publishedVersion: number;

  @Column({
    type: 'int',
    default: 1,
    name: 'current_version',
  })
  currentVersion: number;

  @ManyToMany(() => KeywordEntity, (keyword) => keyword.articles)
  @JoinTable({
    name: 'article_keywords',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'keyword_id', referencedColumnName: 'id' },
  })
  keywords: KeywordEntity[];
}
