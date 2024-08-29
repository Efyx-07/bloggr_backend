import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleEntriesDTO } from './articles-DTO/article-entries.dto';
import { ArticleEntity } from '../entities/article.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('ArticlesController', () => {
  let articlesController: ArticlesController;
  let articlesService: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: {
            createArticle: jest.fn(),
            getArticles: jest.fn(),
            updateArticleById: jest.fn(),
            deleteArticleById: jest.fn(),
          },
        },
      ],
    }).compile();

    articlesController = module.get<ArticlesController>(ArticlesController);
    articlesService = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(articlesController).toBeDefined();
  });

  // Test - createArticle
  // ===========================================================================================
  describe('createArticle', () => {
    it('should return a success message and article details', async () => {
      const articleEntriesDTO: ArticleEntriesDTO = {
        title: 'title',
        imageUrl: 'imageUrl',
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

      jest
        .spyOn(articlesService, 'createArticle')
        .mockResolvedValue({ article: mockArticle });

      const result = await articlesController.createArticle(articleEntriesDTO);

      expect(result).toEqual({
        message: 'Article succesfully created',
        article: mockArticle,
      });
    });
  });

  // Test - getArticle
  // ===========================================================================================
  describe('get-articles', () => {
    it('should return an array of all the articles', async () => {
      const mockArticles: ArticleEntity[] = [
        {
          id: 1,
          title: 'Article 1',
          imageUrl: 'url1',
          body: 'body1',
          creationDate: new Date(),
          lastUpdate: new Date(),
        },
        {
          id: 2,
          title: 'Article 2',
          imageUrl: 'url2',
          body: 'body2',
          creationDate: new Date(),
          lastUpdate: new Date(),
        },
      ];

      jest
        .spyOn(articlesService, 'getArticles')
        .mockResolvedValue(mockArticles);

      const result = await articlesController.getArticles();

      expect(result).toEqual(mockArticles);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(articlesService, 'getArticles')
        .mockRejectedValue(new Error('Database error'));

      await expect(articlesController.getArticles()).rejects.toThrow(
        new InternalServerErrorException(
          'Error fetching articlesDatabase error',
        ),
      );
    });
  });

  // Test - updateArticle
  // ===========================================================================================
  describe('update-article', () => {
    it('should return a success message after a successfully updating of an article', async () => {
      const articleEntriesDTO: ArticleEntriesDTO = {
        title: 'title',
        imageUrl: 'imageUrl',
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

      jest
        .spyOn(articlesService, 'updateArticleById')
        .mockResolvedValue(undefined);

      const result = await articlesController.updateArticle(
        mockArticle.id,
        articleEntriesDTO,
      );

      expect(result).toEqual({
        message: `Article ${mockArticle.id} successfully updated`,
      });
    });
  });

  // Test - deleteArticle
  // ===========================================================================================
  describe('deleteArticle', () => {
    it('should return a success message after a successful deleting of an article', async () => {
      const mockArticleId: ArticleEntity['id'] = 1;

      jest
        .spyOn(articlesService, 'deleteArticleById')
        .mockResolvedValue(undefined);

      const result = await articlesController.deleteArticle(mockArticleId);

      expect(result).toEqual({
        message: `Article ${mockArticleId} successfully deleted`,
      });
    });
  });
});
