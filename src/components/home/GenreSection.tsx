import { Link } from 'react-router-dom';
import { Genre } from '@/types/manga';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface GenreSectionProps {
  genres: Genre[];
}

export function GenreSection({ genres }: GenreSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thể Loại</h2>
        <Link 
          to="/genres" 
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          Xem tất cả
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Link key={genre.id} to={`/genre/${genre.slug}`}>
            <Badge 
              variant="outline" 
              className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              {genre.name}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}