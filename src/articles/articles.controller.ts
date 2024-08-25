import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Put,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import CreateArticleDTO from './articles-DTO/create-article.dto';
import { Article } from 'src/interfaces/article.interface';
import { ArticleEntity } from 'src/entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Crée un nouvel article - endpoint .../articles/create-article
  // ===========================================================================================
  @Post('create-article')
  async createArticle(
    @Body() createArticleDTO: CreateArticleDTO,
  ): Promise<{ message: string; article: Article }> {
    try {
      const { article } =
        await this.articlesService.createArticle(createArticleDTO);
      return { message: 'Article succesfully created', article };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating article' + error.message,
      );
    }
  }

  // Récupère tous les articles - endpoint .../articles
  // ===========================================================================================
  @Get()
  async getArticles(): Promise<ArticleEntity[]> {
    try {
      const articles = await this.articlesService.getArticles();
      return articles;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching articles' + error.message,
      );
    }
  }

  // Met à jour un article par son ID - endpoint .../articles/id
  // ===========================================================================================
  @Put(':id')
  async updateArticle() {}

  // Supprime un article par son ID - endpoint .../articles/id
  // ===========================================================================================
  @Delete(':id')
  async deleteArticle() {}
}
