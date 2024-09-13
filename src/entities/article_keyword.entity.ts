import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { KeywordEntity } from "./keyword.entity";

@Entity('article_keyword')
export class ArticleKeywordEntity {
    @PrimaryColumn({ type: 'int' })
    @Column({ name: 'article_id' })
    articleId: number;

    @PrimaryColumn({ type: 'int' })
    @Column({ name: 'keyword_id' })
    keywordId: number;

    @ManyToOne(() => ArticleEntity, (article) => article.articleKeywords, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'article_id', referencedColumnName: 'id'})
    article: ArticleEntity;

    @ManyToOne(() => KeywordEntity, (keyword) => keyword.articleKeywords, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'keyword_id', referencedColumnName: 'id'})
    keyword: KeywordEntity;
}