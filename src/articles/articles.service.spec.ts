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
      keywords: [
        { name: 'keyword1' },
        { name: 'keyword2' },
      ],
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

    it('should create an article and return the article with details', async () => {
      jest.spyOn(keywordRepository, 'findOne').mockImplementation(async (condition: any) => {
        if (Array.isArray(condition)) {
          return null;
        }
        
        if (condition && condition.where) {
          const name = condition.where.name;
          const keyword = keywordEntities.find(k => k.name === name);
          return keyword || null;
        }
        
        return null;
      });

      jest.spyOn(keywordRepository, 'create').mockImplementation((keywordDTO: KeywordDTO) => {
        return { id: Date.now(), ...keywordDTO } as KeywordEntity;
      });

      jest.spyOn(keywordRepository, 'save').mockImplementation(async (keyword: KeywordEntity) => {
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
          keywords: mockArticle.keywords,
        },
      });
    });

    /*it('should throw InternalServerErrorException on error', async () => {
      const errorMessage = 'Database error';
    
      // Simule une erreur lors de la sauvegarde de l'article
      jest.spyOn(articlesRepository, 'save').mockRejectedValue(new Error(errorMessage));
    
      // Exécute le test pour vérifier que l'exception est correctement lancée
      await expect(articlesService.createArticle(articleEntriesDTO)).rejects.toThrow(
        new InternalServerErrorException(`Error while creating article: ${errorMessage}`)
      );
    });*/
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
          keywords: keywordEntities
        },
        {
          id: 2,
          title: 'Article 2',
          imageUrl: 'url2',
          body: 'body2',
          creationDate: new Date('2024-08-30T12:00:00Z'),
          lastUpdate: new Date('2024-08-30T12:00:00Z'),
          keywords: keywordEntities
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
