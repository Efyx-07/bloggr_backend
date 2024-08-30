import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from '../entities/article.entity';
import { ArticleEntriesDTO } from './articles-DTO/article-entries.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';

describe('ArticlesService', () => {
  let articlesService: ArticlesService;
  let articlesRepository: Repository<ArticleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    articlesService = module.get<ArticlesService>(ArticlesService);
    articlesRepository = module.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity),
    );
  });

  it('should be defined', () => {
    expect(articlesService).toBeDefined();
  });

  // Test - createArticle
  // ===========================================================================================
  describe('createArticle', () => {
    const articleEntriesDTO: ArticleEntriesDTO = {
      title: 'title',
      imageUrl: 'http://albumurl.com',
      body: 'body',
    };

    const mockArticle: ArticleEntity = {
      id: 1,
      title: articleEntriesDTO.title,
      imageUrl: articleEntriesDTO.imageUrl,
      body: articleEntriesDTO.body,
      creationDate: new Date(),
      lastUpdate: new Date(),
    };

    it('should create an article and return the article with details', async () => {
      jest.spyOn(articlesRepository, 'create').mockReturnValue(mockArticle);
      jest.spyOn(articlesRepository, 'save').mockResolvedValue(mockArticle);

      const result = await articlesService.createArticle(articleEntriesDTO);

      expect(result).toEqual({
        article: {
          id: mockArticle.id,
          title: articleEntriesDTO.title,
          imageUrl: articleEntriesDTO.imageUrl,
          body: articleEntriesDTO.body,
          creationDate: mockArticle.creationDate,
          lastUpdate: mockArticle.lastUpdate,
        },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';

      jest
        .spyOn(articlesRepository, 'save')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        articlesService.createArticle(articleEntriesDTO),
      ).rejects.toThrow(
        new InternalServerErrorException(
          `Error while creating article: ${errorMessage}`,
        ),
      );
    });
  });

  // Test - getArticles
  // ===========================================================================================
  describe('getArticles', () => {
    it('should return an array of all articles', async () => {
      const mockArticles: ArticleEntity[] = [
        {
          id: 1,
          title: 'Article 1',
          imageUrl: 'url1',
          body: 'body1',
          creationDate: new Date('2024-08-30T12:00:00Z'),
          lastUpdate: new Date('2024-08-30T12:00:00Z'),
        },
        {
          id: 2,
          title: 'Article 2',
          imageUrl: 'url2',
          body: 'body2',
          creationDate: new Date('2024-08-30T12:00:00Z'),
          lastUpdate: new Date('2024-08-30T12:00:00Z'),
        },
      ];

      jest.spyOn(articlesRepository, 'find').mockResolvedValue(mockArticles);

      const result = await articlesService.getArticles();

      expect(result).toEqual(mockArticles);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
      jest
        .spyOn(articlesRepository, 'find')
        .mockRejectedValue(new Error(errorMessage));

      await expect(articlesService.getArticles()).rejects.toThrow(
        new InternalServerErrorException(
          `Error while fetching articles: ${errorMessage}`,
        ),
      );
    });
  });

  // Test - updateArticleById
  // ===========================================================================================
  describe('updateArticleById', () => {
    const articleId: ArticleEntity['id'] = 1;
    const articleEntriesDTO: ArticleEntriesDTO = {
      title: 'title',
      imageUrl: 'http://albumurl.com',
      body: 'body',
    };

    it('should update an article', async () => {
      jest
        .spyOn(articlesService, 'updateLastUpdateAfterHandling')
        .mockResolvedValue(undefined);

      jest.spyOn(articlesRepository, 'update').mockResolvedValue(undefined);

      await articlesService.updateArticleById(articleId, articleEntriesDTO);

      expect(articlesRepository.update).toHaveBeenCalledWith(
        articleId,
        articleEntriesDTO,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
      jest
        .spyOn(articlesRepository, 'update')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        articlesService.updateArticleById(articleId, articleEntriesDTO),
      ).rejects.toThrow(
        new InternalServerErrorException(
          `Error while updating article: ${errorMessage}`,
        ),
      );
    });
  });
});
