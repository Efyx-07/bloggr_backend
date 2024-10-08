import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from '../entities/article.entity';
import { ArticleEntriesDTO } from './articles-DTO/article-entries.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { KeywordEntity } from '../entities/keyword.entity';
import { KeywordDTO } from './articles-DTO/keyword.dto';

describe('ArticlesService', () => {
  let articlesService: ArticlesService;
  let articlesRepository: Repository<ArticleEntity>;
  let keywordRepository: Repository<KeywordEntity>;

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
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(KeywordEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    articlesService = module.get<ArticlesService>(ArticlesService);
    articlesRepository = module.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity),
    );
    keywordRepository = module.get<Repository<KeywordEntity>>(
      getRepositoryToken(KeywordEntity),
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
      keywords: [{ name: 'keyword1' }, { name: 'keyword2' }],
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
      published: false,
      publicationDate: null,
      keywords: keywordEntities,
    };

    it('should create an article and return the article with details', async () => {
      jest
        .spyOn(keywordRepository, 'findOne')
        .mockImplementation(async (condition: any) => {
          if (Array.isArray(condition)) {
            return null;
          }

          if (condition && condition.where) {
            const name = condition.where.name;
            const keyword = keywordEntities.find((k) => k.name === name);
            return keyword || null;
          }

          return null;
        });

      jest
        .spyOn(keywordRepository, 'create')
        .mockImplementation((keywordDTO: KeywordDTO) => {
          return { id: Date.now(), ...keywordDTO } as KeywordEntity;
        });

      jest
        .spyOn(keywordRepository, 'save')
        .mockImplementation(async (keyword: KeywordEntity) => {
          return keyword;
        });
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
          published: mockArticle.published,
          publicationDate: mockArticle.publicationDate,
          keywords: mockArticle.keywords,
        },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage =
        "Cannot set properties of undefined (setting 'keywords')";
      jest
        .spyOn(articlesRepository, 'create')
        .mockReturnValue({} as ArticleEntity);
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

  // Test - updateArticlePublishedStatus
  // ===========================================================================================
  describe('updateArticlePublishedStatus', () => {
    const keywordEntities: KeywordEntity[] = [
      { id: 1, name: 'keyword1' } as KeywordEntity,
      { id: 2, name: 'keyword2' } as KeywordEntity,
    ];

    const mockArticleId = 1;
    const mockPublishedStatus = true;
    const mockUnpublishedStatus = false;

    const mockArticle: ArticleEntity = {
      id: mockArticleId,
      title: 'Article 1',
      imageUrl: 'url1',
      body: 'body1',
      creationDate: new Date(),
      lastUpdate: new Date(),
      published: false,
      publicationDate: null,
      keywords: keywordEntities,
    };

    it('should publish the article if not already published', async () => {
      (articlesRepository.findOne as jest.Mock).mockResolvedValue(mockArticle);
      const updateSpy = jest
        .spyOn(articlesRepository, 'update')
        .mockResolvedValueOnce({} as any);

      const result = await articlesService.updateArticlePublishedStatus(
        mockArticleId,
        mockPublishedStatus,
      );

      expect(articlesRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockArticleId },
      });
      expect(updateSpy).toHaveBeenCalledWith(mockArticleId, {
        published: true,
        publicationDate: expect.any(Date),
      });
      expect(result).toEqual({ message: 'Article published' });
    });

    it('should unpublish the article if already published', async () => {
      (articlesRepository.findOne as jest.Mock).mockResolvedValue(mockArticle);
      const updateSpy = jest
        .spyOn(articlesRepository, 'update')
        .mockResolvedValueOnce({} as any);

      const result = await articlesService.updateArticlePublishedStatus(
        mockArticleId,
        mockUnpublishedStatus,
      );

      expect(articlesRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockArticleId },
      });
      expect(updateSpy).toHaveBeenCalledWith(mockArticleId, {
        published: false,
      });
      expect(result).toEqual({ message: 'Article unpublished' });
    });

    it('should throw InternalServerErrorException if repository throws an error', async () => {
      const errorMessage = 'Some error';
      (articlesRepository.findOne as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        articlesService.updateArticlePublishedStatus(
          mockArticleId,
          mockPublishedStatus,
        ),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'Error while changing article published status: ' + errorMessage,
        ),
      );
    });
  });

  // Test - getArticles
  // ===========================================================================================
  describe('getArticles', () => {
    const keywordEntities: KeywordEntity[] = [
      { id: 1, name: 'keyword1' } as KeywordEntity,
      { id: 2, name: 'keyword2' } as KeywordEntity,
    ];

    it('should return an array of all articles', async () => {
      const mockArticles: ArticleEntity[] = [
        {
          id: 1,
          title: 'Article 1',
          imageUrl: 'url1',
          body: 'body1',
          creationDate: new Date('2024-08-30T12:00:00Z'),
          lastUpdate: new Date('2024-08-30T12:00:00Z'),
          published: false,
          publicationDate: null,
          keywords: keywordEntities,
        },
        {
          id: 2,
          title: 'Article 2',
          imageUrl: 'url2',
          body: 'body2',
          creationDate: new Date('2024-08-30T12:00:00Z'),
          lastUpdate: new Date('2024-08-30T12:00:00Z'),
          published: false,
          publicationDate: null,
          keywords: keywordEntities,
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
      published: false,
      publicationDate: null,
      keywords: keywordEntities,
    };

    it('should return an article and its details', async () => {
      jest.spyOn(articlesRepository, 'findOne').mockResolvedValue(mockArticle);

      const result = await articlesService.getArticleById(1);

      expect(result).toEqual(mockArticle);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
      jest
        .spyOn(articlesRepository, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      await expect(articlesService.getArticleById(1)).rejects.toThrow(
        new InternalServerErrorException(
          `Error while fetching article ${mockArticle.id}: ${errorMessage}`,
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
      keywords: [{ name: 'keyword1' }, { name: 'keyword2' }],
    };

    it('should update an article', async () => {
      const mockKeywordEntities: KeywordEntity[] =
        articleEntriesDTO.keywords.map((keyword, index) => ({
          id: index + 1,
          name: keyword.name,
          articles: [],
        }));

      const mockArticleUpdated: ArticleEntity = {
        id: articleId,
        ...articleEntriesDTO,
        creationDate: new Date('2024-01-01'),
        lastUpdate: new Date('2024-01-02'),
        published: true,
        publicationDate: expect.any(Date),
        keywords: mockKeywordEntities,
      };

      jest
        .spyOn(articlesService, 'checkAndInsertKeywords')
        .mockResolvedValue(mockKeywordEntities);
      jest.spyOn(articlesRepository, 'findOne').mockResolvedValue({
        ...mockArticleUpdated,
        lastUpdate: new Date('2024-01-01'),
      });
      jest
        .spyOn(articlesRepository, 'save')
        .mockResolvedValue(mockArticleUpdated);
      jest.spyOn(articlesRepository, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(articlesService, 'updateLastUpdateAfterHandling')
        .mockResolvedValue(undefined);

      await expect(
        articlesService.updateArticleById(articleId, articleEntriesDTO),
      ).resolves.not.toThrow();

      expect(articlesRepository.update).toHaveBeenCalledWith(
        articleId,
        expect.objectContaining({
          title: articleEntriesDTO.title,
          imageUrl: articleEntriesDTO.imageUrl,
          body: articleEntriesDTO.body,
        }),
      );
      expect(articlesService.checkAndInsertKeywords).toHaveBeenCalledWith(
        articleEntriesDTO.keywords,
      );
      expect(articlesRepository.findOne).toHaveBeenCalledWith({
        where: { id: articleId },
        relations: ['keywords'],
      });
      expect(articlesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockArticleUpdated,
          lastUpdate: expect.any(Date),
        }),
      );
      expect(
        articlesService.updateLastUpdateAfterHandling,
      ).toHaveBeenCalledWith(articleId);
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

  // Test - deleteArticleById
  // ===========================================================================================
  describe('deleteArticleById', () => {
    const articleId: ArticleEntity['id'] = 1;

    it('should delete an article', async () => {
      jest.spyOn(articlesRepository, 'delete').mockResolvedValue(undefined);

      await articlesService.deleteArticleById(articleId);

      expect(articlesRepository.delete).toHaveBeenCalledWith(articleId);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
      jest
        .spyOn(articlesRepository, 'delete')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        articlesService.deleteArticleById(articleId),
      ).rejects.toThrow(
        new InternalServerErrorException(
          `Error while deleting article: ${errorMessage}`,
        ),
      );
    });
  });
});
