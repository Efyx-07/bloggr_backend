import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('articles')
export class ArticlesController {
  // Crée un nouvel article - endpoint .../articles/create-article
  // ===========================================================================================
  @Post('create-article')
  async createArticle() {}

  // Récupère tous les articles - endpoint .../articles
  // ===========================================================================================
  @Get()
  async getArticles() {}

  // Met à jour un article par son ID - endpoint .../articles/id
  // ===========================================================================================
  @Put(':id')
  async updateArticle() {}

  // Supprime un article par son ID - endpoint .../articles/id
  // ===========================================================================================
  @Delete(':id')
  async deleteArticle() {}
}
