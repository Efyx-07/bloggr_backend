import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleEntriesDTO } from './articles-DTO/article-entries.dto';
import { ArticleEntity } from '../entities/article.entity';

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
});
