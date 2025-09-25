import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { TopMangaTabs } from '@/components/home/TopMangaTabs';
import { GenreSection } from '@/components/home/GenreSection';
import { mockGenres } from '@/data/mockData';

import { useEffect, useState } from 'react';
import { fetchHomeManga } from '@/services/api';
import { Genre, Manga } from '@/types/manga';

export default function Home() {
  const [suggestHomeManga, setSuggestHomeManga] = useState<Manga[]>([]);
  const [heroHomeManga, setHeroHomeManga] = useState<Manga[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHomeManga();
        const items = response.data || [];

        // Lấy tất cả cover_art ids từ relationships
        const coverIds: string[] = [];
        items.forEach((item: any) => {
          item.relationships?.forEach((rel: any) => {
            if (rel.type === 'cover_art') {
              coverIds.push(rel.id);
            }
          });
        });

        // Lấy dữ liệu cover art từ API
        const coverResponse = await fetch(
          `https://api.mangadex.org/cover?limit=100&ids[]=${coverIds.join('&ids[]=')}`
        );
        const coverData = await coverResponse.json();

        // Map cover id -> URL
        const coverMap: Record<string, string> = {};
        coverData.data.forEach((c: any) => {
          coverMap[c.id] = `https://uploads.mangadex.org/covers/${c.relationships.find((r: any) => r.type === 'manga')?.id}/${c.attributes.fileName}`;
        });

        // Map manga với cover image
        const mappedManga: Manga[] = items.map((item: any) => {
          const coverRel = item.relationships.find((r: any) => r.type === 'cover_art');
          const coverImage = coverRel ? coverMap[coverRel.id] : '';
        
        // Tag
        const genres: Genre[] = (item.attributes?.tags || [])
          .filter((t: any) => t.attributes?.group === "genre")
          .map((t: any) => ({
            id: t.id,
            name: t.attributes?.name?.en || "Unknown",
            slug: t.id,
          }));

        const tags: string[] = (item.attributes?.tags || [])
          .map((t: any) => t.attributes?.name?.en?.trim() || "")
          .filter((name: string) => name.length > 0);  

          return {
            id: item.id,
            slug: item.attributes.slug || item.id,
            title:
              item.attributes.altTitles?.find((t: any) => t.vi)?.vi ||
              item.attributes.altTitles?.find((t: any) => t.en)?.en ||
              item.attributes.altTitles?.find((t: any) => t.ja)?.ja ||
              'Unknown',
            status: item.attributes.status === 'completed' ? 'completed' : 'ongoing',
            coverImage,
            genres,
            tags,
            chapters: item.attributes.lastChapter || '...',
            views: item.attributes.views || 19900,
            rating: item.attributes.rating || 4.8,
          };
        });

        setSuggestHomeManga(mappedManga);
        setHeroHomeManga(mappedManga.slice(0, 5));
      } catch (error) {
        console.error('Error fetching home manga:', error);
      }
    };

    fetchData();
  }, []);

  return (
  <div className="min-h-screen flex flex-col">
    <Header />

    <main className="flex-1">
      <div className="container px-4 py-8 space-y-12">
        {/* Hero Section */}
        <HeroSection featuredManga={heroHomeManga} />

        {/* Đề Xuất riêng full width */}
        <MangaGrid manga={suggestHomeManga.slice(0, 6)} title="Đề Xuất Cho Bạn" />

        {/* Layout 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bên trái: Mới cập nhật */}
          <div className="lg:col-span-2">
            <MangaGrid manga={suggestHomeManga} title="Mới Cập Nhật" variant="large" />
          </div>

          {/* Bên phải: Xếp hạng theo tabs */}
          <div className="lg:col-span-1">
            <TopMangaTabs
              topManga={{
                weekly: suggestHomeManga.slice(0, 5),
                monthly: suggestHomeManga.slice(5, 10),
                yearly: suggestHomeManga.slice(10, 14),
              }}
            />
          </div>
        </div>

        {/* Genre Section */}
        <GenreSection genres={mockGenres} />
      </div>
    </main>

    <Footer />
  </div>
);


}
