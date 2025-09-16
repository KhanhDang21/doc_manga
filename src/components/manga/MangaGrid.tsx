import { Manga } from '@/types/manga';
import { MangaCard } from './MangaCard';

interface MangaGridProps {
  manga: Manga[];
  title?: string;
  variant?: 'default' | 'compact';
}

export function MangaGrid({ manga, title, variant = 'default' }: MangaGridProps) {
  return (
    <section className="space-y-4">
      {title && (
        <h2 className="text-2xl font-bold">{title}</h2>
      )}
      
      {variant === 'default' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {manga.map((item) => (
            <MangaCard key={item.id} manga={item} variant={variant} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {manga.map((item) => (
            <MangaCard key={item.id} manga={item} variant={variant} />
          ))}
        </div>
      )}
    </section>
  );
}