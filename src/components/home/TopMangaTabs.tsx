import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopMangaPeriod } from '@/types/manga';
import { MangaGrid } from '@/components/manga/MangaGrid';

interface TopMangaTabsProps {
  topManga: TopMangaPeriod;
}

export function TopMangaTabs({ topManga }: TopMangaTabsProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Top Manga</h2>
      
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="weekly">Tuần</TabsTrigger>
          <TabsTrigger value="monthly">Tháng</TabsTrigger>
          <TabsTrigger value="yearly">Năm</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="mt-6">
          <MangaGrid manga={topManga.weekly} variant="compact" />
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-6">
          <MangaGrid manga={topManga.monthly} variant="compact" />
        </TabsContent>
        
        <TabsContent value="yearly" className="mt-6">
          <MangaGrid manga={topManga.yearly} variant="compact" />
        </TabsContent>
      </Tabs>
    </section>
  );
}