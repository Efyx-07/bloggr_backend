import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { Repository } from 'typeorm';
import CreateArticleDTO from './articles-DTO/create-article.dto';
import { Article } from 'src/interfaces/article.interface';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  // Crée un nouvel article
  // ===========================================================================================
  async createArticle(
    createArticleDTO: CreateArticleDTO,
  ): Promise<{ article: Article }> {
    const { title, imageUrl, body } = createArticleDTO;
    try {
      const newArticle: ArticleEntity = this.articleRepository.create({
        title,
        imageUrl,
        body,
      });
      const result = await this.articleRepository.save(newArticle);
      return {
        article: {
          id: result.id,
          title: result.title,
          imageUrl: result.imageUrl,
          body: result.body,
          creationDate: result.creationDate,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating article: ' + error.message,
      );
    }
  }

  // Récupère tous les articles
  // ===========================================================================================
  async getArticles(): Promise<ArticleEntity[]> {
    try {
      const articles = await this.articleRepository.find();
      return articles;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching articles' + error.message,
      );
    }
  }

  // Met à jour un article par son ID
  // ===========================================================================================
  async updateArticleById() {}

  // Supprime un article par son ID
  // ===========================================================================================
  async deleteArticleById(id: ArticleEntity['id']) {
    try {
      await this.articleRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while deleting article' + error.message,
      );
    }
  }
}
