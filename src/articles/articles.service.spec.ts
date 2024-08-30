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
});
