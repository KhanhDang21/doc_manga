import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Eye, 
  BookOpen, 
  Heart, 
  Bell, 
  Clock,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { fetchMangaDetails } from '@/services/api';
import { MangaDetail } from '@/types/manga'; // dùng MangaDetail mới

export default function MangaDetailPage() {
  const { slug } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const OG_IMAGE = "https://img.otruyenapi.com/uploads/comics/";
  
  const [manga, setManga] = useState<MangaDetail | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMangaDetails(slug);

        const item = response?.data?.item;
        const APP_DOMAIN_CDN_IMAGE = response?.data?.APP_DOMAIN_CDN_IMAGE || "";

        if (!item) return;

        const mappedManga: MangaDetail = {
          id: item._id,
          title: item.name,
          slug: item.slug,
          alternativeTitles: item.origin_name || [],
          author: item.author?.[0] || "Unknown",
          artist: item.artist || item.author?.[0] || "",
          coverImage: `${APP_DOMAIN_CDN_IMAGE}/uploads/comics/${item.thumb_url}`,
          description: item.content?.replace(/<[^>]*>?/gm, '') || "", // bỏ tag <p>
          genres: item.category?.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
          })) || [],
          status: item.status,
          releaseYear: new Date(item.updatedAt).getFullYear(),
          lastUpdated: new Date(item.updatedAt),
          rating: item.rating || 0,
          views: item.views || 0,
          follows: item.follows || 0,
          chapters: item.chapters?.[0]?.server_data?.map((ch: any) => ({
            id: ch.chapter_api_data, // bạn có thể lấy `_id` nếu muốn
            chapterNumber: ch.chapter_name,
            title: ch.chapter_title || "",
            views: ch.views || 0,
            releaseDate: new Date(ch.updatedAt || item.updatedAt),
          })) || [],
          tags: item.tags || [],
        };

        setManga(mappedManga);
      } catch (error) {
        console.error("Error fetching manga detail:", error);
      }
    };
    fetchData();
  }, [slug]);


  if (!manga) {
    return <div>Manga not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8">
          {/* Hero Section */}
          <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-8">
            {/* Cover Image */}
            <div className="space-y-4">
              <img
                src={manga.coverImage}
                alt={manga.title}
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg"
              />
              
              {/* Action Buttons */}
              <div className="space-y-2">
                {manga.chapters.length > 0 && (
                  <Link to={`/read/${manga.id}/${manga.chapters[0].id}`}>
                    <Button className="w-full" size="lg">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Đọc Từ Đầu
                    </Button>
                  </Link>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={isFollowing ? "secondary" : "outline"}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {isFollowing ? 'Đang Theo' : 'Theo Dõi'}
                  </Button>
                  
                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Đã Thích' : 'Yêu Thích'}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Manga Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{manga.title}</h1>
                {manga.alternativeTitles?.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    Tên khác: {manga.alternativeTitles.join(', ')}
                  </p>
                )}
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <span className="font-semibold">{manga.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">(1.2k đánh giá)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-5 w-5" />
                  <span>{manga.views.toLocaleString()} lượt xem</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-5 w-5" />
                  <span>{manga.follows.toLocaleString()} theo dõi</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {manga.genres.map(genre => (
                  <Link key={genre.id} to={`/genre/${genre.slug}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {genre.name}
                    </Badge>
                  </Link>
                ))}
              </div>
              
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tác giả:</span>
                    <span className="font-medium">{manga.author}</span>
                  </div>
                  {manga.artist && manga.artist !== manga.author[0] && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Họa sĩ:</span>
                      <span className="font-medium">{manga.artist}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Năm:</span>
                    <span className="font-medium">{manga.releaseYear}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Chapters:</span>
                    <span className="font-medium">{manga.chapters.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span className="font-medium">
                      {new Date(manga.lastUpdated).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={manga.status === 'ongoing' ? 'default' : 'secondary'}>
                      {manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Tóm tắt</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {manga.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs defaultValue="chapters" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="chapters">
                Danh Sách Chapter ({manga.chapters.length})
              </TabsTrigger>
              <TabsTrigger value="comments">
                Bình Luận (128)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chapters" className="mt-6">
              <div className="bg-card rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Tất cả chapters</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {manga.chapters.slice().reverse().map((chapter) => (
                    <Link
                      key={chapter.id}
                      to={`/read/${manga.slug}/${chapter.chapterNumber}`}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          Chapter {chapter.chapterNumber}
                        </span>
                        {chapter.title && (
                          <span className="text-sm text-muted-foreground">
                            {chapter.title}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{chapter.views.toLocaleString()} views</span>
                        <span>
                          {new Date(chapter.releaseDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="mt-6">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-5 w-5" />
                  <p>Tính năng bình luận sẽ được kích hoạt sau khi kết nối với Supabase.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
