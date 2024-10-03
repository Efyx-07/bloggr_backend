import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleEntriesDTO } from './articles-DTO/article-entries.dto';
import { ArticleEntity } from '../entities/article.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { KeywordEntity } from '../entities/keyword.entity';

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
            getArticleById: jest.fn(),
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
    const articleEntriesDTO: ArticleEntriesDTO = {
      title: 'title',
      imageUrl: 'imageUrl',
      body: 'body',
      keywords: [{ name: 'keyword1' }, { name: 'keyword2' }],
    };

    const keywordEntities: KeywordEntity[] = [
      { id: 1, name: 'keyword1' } as KeywordEntity,
      { id: 2, name: 'keyword2' } as KeywordEntity,
    ];

    it('should return a success message and article details', async () => {
      const mockArticle: ArticleEntity = {
        id: 1,
        title: articleEntriesDTO.title,
        imageUrl: articleEntriesDTO.imageUrl,
        body: articleEntriesDTO.body,
        creationDate: new Date(),
        lastUpdate: new Date(),
        published: false,
        publicationDate: null,
        publicationUpdate: null,
        publishedVersion: 1,
        currentVersion: 1,
        keywords: keywordEntities,
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

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';

      jest
        .spyOn(articlesService, 'createArticle')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        articlesController.createArticle(articleEntriesDTO),
      ).rejects.toThrow(
        new InternalServerErrorException(
          `Error while creating article: ${errorMessage}`,
        ),
      );
    });
  });

  // Test - getArticle
  // ===========================================================================================
  describe('get-articles', () => {
    const keywordEntities: KeywordEntity[] = [
      { id: 1, name: 'keyword1' } as KeywordEntity,
      { id: 2, name: 'keyword2' } as KeywordEntity,
    ];
    it('should return an array of all the articles', async () => {
      const mockArticles: { articles: ArticleEntity[] } = {
        articles: [
          {
            id: 1,
            title: 'Article 1',
            imageUrl: 'url1',
            body: 'body1',
            creationDate: new Date(),
            lastUpdate: new Date(),
            published: false,
            publicationDate: null,
            publicationUpdate: null,
            publishedVersion: 1,
            currentVersion: 1,
            keywords: keywordEntities,
          },
          {
            id: 2,
            title: 'Article 2',
            imageUrl: 'url2',
            body: 'body2',
            creationDate: new Date(),
            lastUpdate: new Date(),
            published: false,
            publicationDate: null,
            publicationUpdate: null,
            publishedVersion: 1,
            currentVersion: 1,
            keywords: keywordEntities,
          },
        ],
      };

      jest
        .spyOn(articlesService, 'getArticles')
        .mockResolvedValue(mockArticles.articles);

      const result = await articlesController.getArticles();

      expect(result).toEqual({ articles: mockArticles.articles });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
      jest
        .spyOn(articlesService, 'getArticles')
        .mockRejectedValue(new Error(errorMessage));

      await expect(articlesController.getArticles()).rejects.toThrow(
        new InternalServerErrorException(
          `Error while fetching articles: ${errorMessage}`,
        ),
      );
    });
  });

  /*
  // Test - getArticleById
  // ===========================================================================================
  describe('getArticleById', () => {
    const keywordEntities: KeywordEntity[] = [
      { id: 1, name: 'keyword1' } as KeywordEntity,
      { id: 2, name: 'keyword2' } as KeywordEntity,
    ];
    const mockArticle: ArticleEntity = {
      id: 1,
      title: 'Article 1',
      imageUrl: 'url1',
      body: 'body1',
      creationDate: new Date(),
      lastUpdate: new Date(),
      keywords: keywordEntities,
    };

    it('should return an article and its details', async () => {
      jest
        .spyOn(articlesService, 'getArticleById')
        .mockResolvedValue(mockArticle);

      const result = await articlesController.getArticleById(mockArticle.id);

      expect(result).toEqual({ article: mockArticle });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
      jest
        .spyOn(articlesService, 'getArticleById')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        articlesController.getArticleById(mockArticle.id),
      ).rejects.toThrow(
        new InternalServerErrorException(
          `Error while fetching article ${mockArticle.id}: ${errorMessage}`,
        ),
      );
    });
  });

  // Test - updateArticle
  // ===========================================================================================
  describe('update-article', () => {
    const articleEntriesDTO: ArticleEntriesDTO = {
      title: 'title',
      imageUrl: 'imageUrl',
      body: 'body',
    };

    const keywordEntities: KeywordEntity[] = [
      { id: 1, name: 'keyword1' } as KeywordEntity,
      { id: 2, name: 'keyword2' } as KeywordEntity,
    ];

    const mockArticle: ArticleEntity = {
      id: 1,
      title: articleEntriesDTO.title,
      imageUrl: articleEntriesDTO.imageUrl,
      body: articleEntriesDTO.body,
      creationDate: new Date(),
      lastUpdate: new Date(),
      keywords: keywordEntities,
    };

    it('should return a success message after a successfully updating of an article', async () => {
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

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
      jest
        .spyOn(articlesService, 'updateArticleById')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        articlesController.updateArticle(mockArticle.id, articleEntriesDTO),
      ).rejects.toThrow(
        new InternalServerErrorException(
          `Error while updating article: ${errorMessage}`,
        ),
      );
    });
  });*/

  // Test - deleteArticle
  // ===========================================================================================
  describe('deleteArticle', () => {
    const mockArticleId: ArticleEntity['id'] = 1;

    it('should return a success message after a successful deleting of an article', async () => {
      jest
        .spyOn(articlesService, 'deleteArticleById')
        .mockResolvedValue(undefined);

      const result = await articlesController.deleteArticle(mockArticleId);

      expect(result).toEqual({
        message: `Article ${mockArticleId} successfully deleted`,
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
      jest
        .spyOn(articlesService, 'deleteArticleById')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        articlesController.deleteArticle(mockArticleId),
      ).rejects.toThrow(
        new InternalServerErrorException(
          `Error while deleting article: ${errorMessage}`,
        ),
      );
    });
  });
});
