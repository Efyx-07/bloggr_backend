export interface Article {
  id: number;
  title: string;
  imageUrl: string;
  body: string;
  creationDate: Date;
  lastUpdate: Date;
  keywords: Keyword[];
}

interface Keyword {
  id: number;
  keyword: string;
}
