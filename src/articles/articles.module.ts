import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { KeywordEntity } from '../entities/keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, KeywordEntity])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
