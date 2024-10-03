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
import { ArticleEntity } from '../entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Crée un nouvel article - endpoint .../articles/create-article
  // A ce stade, l'article est créé mais non publié
  // ===========================================================================================
  @Post('create-article')
  async createArticle(
    @Body() articleEntriesDTO: ArticleEntriesDTO,
  ): Promise<{ message: string; article: ArticleEntity }> {
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

  // Publie un article existant - endpoint .../articles/publish-article/:id
  // ===========================================================================================
  @Post('publish-article/:id')
  async publishArticle(
    @Param('id') id: ArticleEntity['id'],
  ): Promise<{ message: string; article: ArticleEntity }> {
    try {
      const { article } = await this.articlesService.publishArticle(id);
      return { message: 'Article succesfully published', article };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while publishing article: ' + error.message,
      );
    }
  }

  // Récupère tous les articles sans distinction de statut de publication - endpoint .../articles
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

  // Récupère un article par son ID parmi tous les articles - endpoint .../articles/id
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
        `Error while fetching article ${id}: ` + error.message,
      );
    }
  }

  // Récupère tous les articles publiés - endpoint .../articles
  // ===========================================================================================

  // Récupère un article par son ID parmi les articles publiés - endpoint .../articles/id
  // ===========================================================================================

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
