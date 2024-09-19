import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { KeywordEntity } from '../entities/keyword.entity';
import { Repository } from 'typeorm';
import { ArticleEntriesDTO } from './articles-DTO/article-entries.dto';
import { KeywordDTO } from './articles-DTO/keyword.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(KeywordEntity)
    private readonly keywordRepository: Repository<KeywordEntity>,
  ) {}

  // Crée un nouvel article
  // ===========================================================================================
  async createArticle(
    articleEntriesDTO: ArticleEntriesDTO,
  ): Promise<{ article: ArticleEntity }> {
    const { title, imageUrl, body, keywords } = articleEntriesDTO;
    try {
      const newArticle: ArticleEntity = this.articleRepository.create({
        title,
        imageUrl,
        body,
      });

      if (keywords && keywords.length > 0) {
        const keywordEntities = await Promise.all(
          keywords.map(async (keywordDTO: KeywordDTO) => {
            let keyword = await this.keywordRepository.findOne({ where: { name: keywordDTO.name } });
            if (!keyword) {
              keyword = this.keywordRepository.create(keywordDTO);
              await this.keywordRepository.save(keyword);
            }
            return keyword;
          }),
        );
        newArticle.keywords = keywordEntities;
      }
      const result = await this.articleRepository.save(newArticle);
      return {
        article: {
          id: result.id,
          title: result.title,
          imageUrl: result.imageUrl,
          body: result.body,
          creationDate: result.creationDate,
          lastUpdate: result.lastUpdate,
          keywords: result.keywords
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
      const articles: ArticleEntity[] = await this.articleRepository.find();
      return articles;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while fetching articles: ' + error.message,
      );
    }
  }

  // Récupère un article par son ID
  // ===========================================================================================
  async getArticleById(id: ArticleEntity['id']): Promise<ArticleEntity> {
    try {
      const article: ArticleEntity = await this.articleRepository.findOne({
        where: { id },
      });
      return article;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching article ${id}: ` + error.message,
      );
    }
  }

  // Met à jour un article par son ID
  // ===========================================================================================
  async updateArticleById(
    id: ArticleEntity['id'],
    articleEntriesDTO: ArticleEntriesDTO,
  ): Promise<void> {
    try {
      await this.articleRepository.update(id, articleEntriesDTO);
      // Met à jour last update après chaque modification de l'article
      await this.updateLastUpdateAfterHandling(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while updating article: ' + error.message,
      );
    }
  }

  // Met à jour la date de mise à jour après chaque modification de l'article
  // ===========================================================================================
  public async updateLastUpdateAfterHandling(
    id: ArticleEntity['id'],
  ): Promise<void> {
    try {
      await this.articleRepository.update(
        { id: id },
        { lastUpdate: new Date() },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating last update' + error.message,
      );
    }
  }

  // Supprime un article par son ID
  // ===========================================================================================
  async deleteArticleById(id: ArticleEntity['id']): Promise<void> {
    try {
      await this.articleRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while deleting article: ' + error.message,
      );
    }
  }
}
