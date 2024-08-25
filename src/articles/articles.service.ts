import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  // Crée un nouvel article
  // ===========================================================================================
  async createArticle() {}

  // Récupère tous les articles
  // ===========================================================================================
  async getArticles() {}

  // Met à jour un article par son ID
  // ===========================================================================================
  async updateArticle() {}

  // Supprime un article
  // ===========================================================================================
  async deleteArticle() {}
}
