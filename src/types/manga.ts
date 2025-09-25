export interface Manga {
  id: string;
  title: string;
  slug: string;
  alternativeTitles?: string[];
  author: string;
  artist?: string;
  coverImage: string;
  description: string;
  genres: Genre[];
  status: MangaStatus;
  releaseYear: number;
  lastUpdated: Date;
  rating: number;
  views: number;
  follows: number;
  chapters: string;
  tags?: string[];
}

export interface MangaDetail {
  id: string;
  title: string;
  slug: string;
  alternativeTitles?: string[];
  author: string[];
  artist?: string;
  coverImage: string;
  description: string;
  genres: Genre[];
  status: MangaStatus;
  releaseYear: number;
  lastUpdated: Date;
  rating: number;
  views: number;
  follows: number;
  chapters: Chapter[];
  tags?: string[];
}

export interface Chapter {
  id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  releaseDate: Date;
  views: number;
  pages?: string[];
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export enum MangaStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  HIATUS = 'hiatus',
  CANCELLED = 'cancelled',
  UNKNOWN = 'unknown'
}


export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  followedManga: string[];
  readHistory: ReadHistory[];
  createdAt: Date;
}

export interface ReadHistory {
  mangaId: string;
  chapterId: string;
  page: number;
  readAt: Date;
}

export interface TopMangaPeriod {
  weekly: Manga[];
  monthly: Manga[];
  yearly: Manga[];
}