import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Eye, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Manga } from '@/types/manga';

interface HeroSectionProps {
  featuredManga: Manga[];
}

export function HeroSection({ featuredManga }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = featuredManga[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredManga.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === featuredManga.length - 1 ? 0 : prev + 1));
  };

  if (!current) return null;

  return (
    <section className="relative h-[500px] overflow-hidden rounded-xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={current.coverImage}
          alt={current.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container px-4">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              {current.genres.slice(0, 3).map(genre => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold">
              {current.title}
            </h1>

            <p className="text-muted-foreground line-clamp-3 max-w-xl">
              {current.description}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="font-medium">{current.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{current.views.toLocaleString()} lượt xem</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{current.chapters} chương</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to={`/manga/${current.id}`}>
                <Button size="lg" className="font-semibold">
                  Đọc Ngay
                </Button>
              </Link>
              <Link to={`/manga/${current.id}`}>
                <Button size="lg" variant="outline">
                  Xem Chi Tiết
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handlePrevious}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleNext}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {featuredManga.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 transition-all ${
              index === currentIndex ? 'w-8 bg-primary' : 'w-4 bg-primary/40'
            } rounded-full`}
          />
        ))}
      </div>
    </section>
  );
}