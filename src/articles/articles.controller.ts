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

  // Publie / dépublie un article existant - endpoint .../articles/publish-article/:id
  // ===========================================================================================
  @Put('publish-article/:id')
  async updateArticlePublishedStatus(
    @Param('id') id: ArticleEntity['id'],
    @Body('published') published: ArticleEntity['published'],
  ): Promise<{ message: string }> {
    try {
      await this.articlesService.updateArticlePublishedStatus(id, published);
      return {
        message: published ? 'Article published' : 'Article unpublished',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while changing article published status: ' + error.message,
      );
    }
  }

  // !! Route pour l'API de tous les articles à utiliser dans le dashboard
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

  // !!! IMPORTANT garder cette route devant @Get(':id') pour éviter un conflit (sinon 'published-articles' serait considéré comme un ID)
  // !! Route pour l'API des articles publiés à utiliser dans app externes
  // Récupère tous les articles publiés - endpoint .../articles/published-articles
  // ===========================================================================================
  @Get('published-articles')
  async getPublishedArticles(): Promise<{ articles: ArticleEntity[] }> {
    try {
      const publishedArticles: ArticleEntity[] =
        await this.articlesService.getPublishedArticles();
      return { articles: publishedArticles };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while fetching published articles: ' + error.message,
      );
    }
  }

  // !!! IMPORTANT garder cette route devant @Get(':id') pour éviter un conflit (sinon 'published-articles/:id' serait considéré comme un ID)
  // !! Route pour l'API d'un'article publié à utiliser dans app externes
  // Récupère un article par son ID parmi les articles publiés - endpoint .../articles/published-articles/:id
  // ===========================================================================================
  @Get('published-articles/:id')
  async getPublishedArticleById(
    @Param('id') id: ArticleEntity['id'],
  ): Promise<{ article: ArticleEntity }> {
    try {
      const publishedArticle: ArticleEntity =
        await this.articlesService.getPublishedArticleById(id);
      return { article: publishedArticle };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching published article ${id}: ` + error.message,
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
