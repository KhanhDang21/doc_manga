import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUp, Home, List } from "lucide-react";
import { fetchChapterRaw } from "@/services/api";

export default function ChapterReader() {
  const { manga_title, chapter_id } = useParams(); 
  const navigate = useNavigate();

  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChapter = async () => {
      try {
        setLoading(true);

        const data = await fetchChapterRaw(chapter_id);
        console.log("Fetched chapter data:", data);

        let urls: string[] = [];

        // Lấy RAW link tiếng Việt nếu có
        const mangaRel = data?.data?.relationships?.find((rel: any) => rel.type === "manga");
        const rawViLink = mangaRel?.attributes?.links?.raw; // thường là raw tiếng gốc, nhưng nhiều group dùng link raw việt

        if (data?.data?.attributes?.translatedLanguage === "vi" && rawViLink) {
          urls = [rawViLink];
        } 
        // Nếu có chapter.data thì build URL từng page
        else if (data?.chapter?.data && data?.baseUrl && data?.chapter?.hash) {
          const baseUrl = data.baseUrl;
          const hash = data.chapter.hash;
          urls = data.chapter.data.map((file: string) => `${baseUrl}/data/${hash}/${file}`);
        } 
        else {
          console.warn("Không tìm thấy raw tiếng Việt hoặc chapter.data");
        }

        setPages(urls);
      } catch (err) {
        console.error("Error loading chapter:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [chapter_id]);

  if (loading) return <div>Đang tải chapter...</div>;
  if (pages.length === 0) return <div>Không có nội dung để hiển thị</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur border-b z-50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-medium">Chapter {chapter_id}</span>
          <Link to={`/manga/${manga_title}`}>
            <Button variant="ghost" size="icon">
              <List className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Chapter content */}
      <div className="pt-16 pb-8 max-w-4xl mx-auto">
        {pages.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Page ${i + 1}`}
            className="w-full h-auto mb-2"
            loading="lazy"
            style={{ display: "block", width: "100%", height: "auto", margin: 0 }}
          />
        ))}
      </div>

      {/* Scroll to top */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-8 right-8 rounded-full shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
}
