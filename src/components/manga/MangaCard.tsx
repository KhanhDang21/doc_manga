import { Link } from 'react-router-dom';
import { Star, Eye, Clock } from 'lucide-react';
import { Manga } from '@/types/manga';
import { Badge } from '@/components/ui/badge';

interface MangaCardProps {
  manga: Manga;
  variant?: 'default' | 'compact';
}

export function MangaCard({ manga, variant = 'default' }: MangaCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (variant === 'compact') {
    return (
      <Link to={`/manga/${manga.slug}`} className="group flex gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
        <img
          src={manga.coverImage}
          alt={manga.title}
          className="w-16 h-20 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {manga.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Ch. {manga.chapters}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="h-3 w-3" /> {manga.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" /> {formatViews(manga.views)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/manga/${manga.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-card">
        <div className="aspect-[3/4] relative">
          <img
            src={manga.coverImage}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Status Badge */}
          {manga.status === 'ongoing' && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              Đang tiến hành
            </Badge>
          )}
          
          {/* Rating */}
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span className="text-xs font-medium">{manga.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {manga.title}
          </h3>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(manga.views)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Ch. {manga.chapters}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {manga.genres.slice(0, 3).map(genre => (
              <Badge key={genre.id} variant="secondary" className="text-xs">
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}