import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home,
  List,
  Settings,
  MessageSquare,
  ArrowUp
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchMangaDetails, fetchChapter } from '@/services/api';

export default function ChapterReader() {
  const { manga_slug, chapter_number } = useParams();
  const navigate = useNavigate();

  const [manga, setManga] = useState<any>(null);
  const [currentChapter, setCurrentChapter] = useState<any>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mangaData = await fetchMangaDetails(manga_slug!);
        const mangaInfo = mangaData.data.item;
        setManga(mangaInfo);

        const chapters = mangaInfo.chapters[0]?.server_data || [];
        const current = chapters.find(
          (ch: any) => ch.chapter_name === chapter_number
        );
        setCurrentChapter(current);

        if (current) {
          const chapterData = await fetchChapter(current.chapter_api_data);
          const images = chapterData.data.item?.chapter_image || [];
          const domain = chapterData.data.domain_cdn;
          const path = chapterData.data.item?.chapter_path;

          setPages(images.map((img: any) => `${domain}/${path}/${img.image_file}`));
        }
      } catch (err) {
        console.error("Error loading chapter data:", err);
      }
    };

    loadData();
  }, [manga_slug, chapter_number]);

  if (!manga || !currentChapter) {
    return <div>Đang tải...</div>;
  }

  const chapters = manga.chapters[0]?.server_data || [];
  const currentIndex = chapters.findIndex(
    (ch: any) => ch.chapter_name === chapter_number
  );
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const handleChapterChange = (name: string) => {
    navigate(`/read/${manga_slug}/${name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container px-4 py-3 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link to={`/manga/${manga_slug}`}>
                <span className="font-medium hover:text-primary transition-colors">
                  {manga.name}
                </span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">
                Chapter {currentChapter.chapter_name}
              </span>
            </div>
          </div>

          {/* Center Section - Chapter Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => prevChapter && handleChapterChange(prevChapter.chapter_name)}
              disabled={!prevChapter}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Select value={chapter_number} onValueChange={handleChapterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((ch: any) => (
                  <SelectItem key={ch.chapter_api_data} value={ch.chapter_name}>
                    Chapter {ch.chapter_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => nextChapter && handleChapterChange(nextChapter.chapter_name)}
              disabled={!nextChapter}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Link to={`/manga/${manga_slug}`}>
              <Button variant="ghost" size="icon">
                <List className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Chapter Title */}
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold mb-2">{manga.name}</h1>
            <p className="text-muted-foreground">
              Chapter {currentChapter.chapter_name}
            </p>
          </div>

          {/* Pages */}
          <div className="space-y-2">
            {pages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Page ${i + 1}`}
                className="w-full h-auto"
                loading="lazy"
              />
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="mt-8 p-4 bg-card rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant={prevChapter ? "default" : "outline"}
                onClick={() => prevChapter && handleChapterChange(prevChapter.chapter_name)}
                disabled={!prevChapter}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Chapter Trước
              </Button>

              <Link to={`/manga/${manga_slug}`}>
                <Button variant="outline">
                  <List className="h-4 w-4 mr-2" />
                  Danh Sách Chapter
                </Button>
              </Link>

              <Button
                variant={nextChapter ? "default" : "outline"}
                onClick={() => nextChapter && handleChapterChange(nextChapter.chapter_name)}
                disabled={!nextChapter}
              >
                Chapter Sau
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Sidebar */}
      {isCommentsOpen && (
        <div className="fixed right-0 top-16 bottom-0 w-96 bg-card border-l z-40 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Bình luận</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCommentsOpen(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Tính năng bình luận sẽ được kích hoạt sau khi kết nối với Supabase.</p>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-8 right-8 rounded-full shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
}
