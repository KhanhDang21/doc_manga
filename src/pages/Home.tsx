import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { TopMangaTabs } from '@/components/home/TopMangaTabs';
import { GenreSection } from '@/components/home/GenreSection';
import { mockMangaData, mockGenres, mockTopManga } from '@/data/mockData';

import { useEffect, useState } from 'react';
import { fetchHomeManga } from '@/services/api';
import { Manga } from '@/types/manga';

export default function Home() {
  const [suggestHomeManga, setSuggestHomeManga] = useState<Manga[]>([]);
  const [heroHomeManga, setHeroHomeManga] = useState<Manga[]>([]);

  const OG_IMAGE = "https://img.otruyenapi.com/uploads/comics/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHomeManga();

        // giả sử response.data.data.items là mảng truyện
        const items = response?.data?.items || [];

        const mappedManga: Manga[] = items.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          title: item.name,
          status: item.status,
          coverImage: OG_IMAGE + item.thumb_url, // nhớ fix đường dẫn nếu cần
          genres: item.category?.map((c: any) => ({ id: c.id, name: c.name })) || [],
          chapters: item.chaptersLatest[0].chapter_name,
          views: item.views || 0,
          rating: item.rating || 0,
        }));

        setSuggestHomeManga(mappedManga);

        setHeroHomeManga(mappedManga.slice(0, 3));
      } catch (error) {
        console.error("Error fetching home manga:", error);
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
          
          {/* Recommended Manga */}
          <MangaGrid 
            manga={suggestHomeManga}
            title="Đề Xuất Cho Bạn"
          />
          
          {/* Top Manga Tabs */}
          <TopMangaTabs 
            topManga={{ weekly: suggestHomeManga.slice(0, 6), monthly: suggestHomeManga.slice(6, 12), yearly: suggestHomeManga.slice(12, 18) }} 
          />
          
          {/* Latest Updates */}
          <MangaGrid 
            manga={suggestHomeManga.slice(0, 6)} 
            title="Mới Cập Nhật"
          />
          
          {/* Genre Section */}
          <GenreSection genres={mockGenres} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
