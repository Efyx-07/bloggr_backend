import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleEntriesDTO } from './articles-DTO/article-entries.dto';
import { Article } from '../interfaces/article.interface';
import { ArticleEntity } from '../entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Crée un nouvel article - endpoint .../articles/create-article
  // ===========================================================================================
  @Post('create-article')
  async createArticle(
    @Body() articleEntriesDTO: ArticleEntriesDTO,
  ): Promise<{ message: string; article: Article }> {
    try {
      const { article } =
        await this.articlesService.createArticle(articleEntriesDTO);
      return { message: 'Article succesfully created', article };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating article: ' + error.message,
      );
    }
  }

  // Récupère tous les articles - endpoint .../articles
  // ===========================================================================================
  @Get()
  async getArticles(): Promise<{ articles: ArticleEntity[] }> {
    try {
      const articles: ArticleEntity[] =
        await this.articlesService.getArticles();
      return { articles: articles };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while fetching articles: ' + error.message,
      );
    }
  }

  // Récupère un article par son ID - endpoint .../articles/id
  // ===========================================================================================
  @Get(':id')
  async getArticleById(
    @Param('id') id: ArticleEntity['id'],
  ): Promise<{ article: ArticleEntity }> {
    try {
      const article: ArticleEntity =
        await this.articlesService.getArticleById(id);
      return { article: article };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while fetching article: ' + error.message,
      );
    }
  }

  // Met à jour un article par son ID - endpoint .../articles/id
  // ===========================================================================================
  @Put(':id')
  async updateArticle(
    @Param('id') id: ArticleEntity['id'],
    @Body() articleEntriesDTO: ArticleEntriesDTO,
  ): Promise<{ message: string }> {
    try {
      await this.articlesService.updateArticleById(id, articleEntriesDTO);
      return { message: `Article ${id} successfully updated` };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while updating article: ' + error.message,
      );
    }
  }

  // Supprime un article par son ID - endpoint .../articles/id
  // ===========================================================================================
  @Delete(':id')
  async deleteArticle(
    @Param('id') id: ArticleEntity['id'],
  ): Promise<{ message: string }> {
    try {
      await this.articlesService.deleteArticleById(id);
      return { message: `Article ${id} successfully deleted` };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while deleting article: ' + error.message,
      );
    }
  }
}
