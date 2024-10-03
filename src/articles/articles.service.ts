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

  // Crée un nouvel article et le retourne
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
      // Gère les keywords selon la méthode établie dans checkAndInsertKeywords
      newArticle.keywords = await this.checkAndInsertKeywords(keywords);
      const result = await this.articleRepository.save(newArticle);
      return {
        article: {
          id: result.id,
          title: result.title,
          imageUrl: result.imageUrl,
          body: result.body,
          creationDate: result.creationDate,
          lastUpdate: result.lastUpdate,
          published: result.published,
          publicationDate: result.publicationDate,
          publicationUpdate: result.publicationUpdate,
          publishedVersion: result.publishedVersion,
          currentVersion: result.currentVersion,
          keywords: result.keywords || [],
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating article: ' + error.message,
      );
    }
  }

  // Publie un article et le retourne
  // ===========================================================================================
  async publishArticle(id: ArticleEntity['id']) {}

  // Récupère tous les articles
  // ===========================================================================================
  async getArticles(): Promise<ArticleEntity[]> {
    try {
      const articles: ArticleEntity[] = await this.articleRepository.find({
        relations: ['keywords'],
      });
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
        relations: ['keywords'],
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
      await this.articleRepository.update(id, {
        title: articleEntriesDTO.title,
        imageUrl: articleEntriesDTO.imageUrl,
        body: articleEntriesDTO.body,
      });
      // Récupère l'article avec ses keywords
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: ['keywords'],
      });
      // Gère les keywords selon la méthode établie dans checkAndInsertKeywords
      article.keywords = await this.checkAndInsertKeywords(
        articleEntriesDTO.keywords,
      );
      await this.articleRepository.save(article);
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

  // Vérifie si un keyword existe déjà, si non l'insère dans la table keywords et retourne un tableau de keywords
  // ===========================================================================================
  public async checkAndInsertKeywords(
    keywords: KeywordDTO[],
  ): Promise<KeywordEntity[]> {
    try {
      // Vérifie la présence du keyword dans keywords
      if (keywords && keywords.length > 0) {
        const keywordEntities = await Promise.all(
          keywords.map(async (keywordDTO: KeywordDTO) => {
            let keyword = await this.keywordRepository.findOne({
              where: { name: keywordDTO.name },
            });
            // Si le keyword n'existe pas, l'insère dans la table keywords
            if (!keyword) {
              keyword = this.keywordRepository.create(keywordDTO);
              await this.keywordRepository.save(keyword);
            }
            return keyword;
          }),
        );
        return keywordEntities;
      } else {
        return [];
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Error checking and inserting keywords: ' + error,
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
