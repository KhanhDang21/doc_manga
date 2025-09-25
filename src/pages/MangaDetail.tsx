import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Eye, BookOpen, Heart, Bell, Clock, User, Calendar, MessageSquare, Tags } from 'lucide-react';
import { fetchMangaChapters, fetchMangaDetails, fetchMangaAuthor } from '@/services/api';
import { MangaDetail, Chapter, Genre, MangaStatus } from '@/types/manga';

export default function MangaDetailPage() {
  const { id } = useParams();
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetchMangaDetails(id);
        const item = response.data;
        if (!item) {
          console.warn('No manga data found for id:', id);
          setManga(null);
          return;
        }

        const coverResponse = await fetch(`https://api.mangadex.org/cover?manga[]=${item.id}`);
        const coverData = await coverResponse.json();
        const coverMap: Record<string, string> = {};
        coverData.data.forEach((c: any) => {
          const mangaId = c.relationships.find((r: any) => r.type === 'manga')?.id;
          if (mangaId) coverMap[c.id] = `https://uploads.mangadex.org/covers/${mangaId}/${c.attributes.fileName}`;
        });

        const relationships = item.relationships || [];

        // Author(s)
        const authorRels = relationships.filter((r: any) => r.type === 'author');
        const authorId = authorRels[0].id

        const athorResponse = await fetchMangaAuthor(authorId);
        const authors = athorResponse?.data.attributes.name || authorId;

        // Artist
        const artistRel = relationships.find((r: any) => r.type === 'artist');
        const artist = artistRel?.attributes?.name?.en || artistRel?.attributes?.name?.ja || (authors.length > 0 ? authors[0] : '');

        // Cover
        const coverRel = relationships.find((r: any) => r.type === 'cover_art');
        const coverImage = coverRel && coverMap[coverRel.id] ? coverMap[coverRel.id] : '';

        // Genres (chỉ lấy group = "genre")
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

        // Chapters
        const chaptersResponse = await fetchMangaChapters(item.id);
        const chapters: Chapter[] = [];
        if (chaptersResponse?.volumes) {
          Object.values(chaptersResponse.volumes).forEach((vol: any) => {
            Object.values(vol.chapters).forEach((ch: any) => {
              chapters.push({
                id: ch.id,
                mangaId: item.id,
                chapterNumber: parseFloat(ch.chapter) || 0,
                title: '',
                releaseDate: new Date(item.attributes?.updatedAt),
                views: 0,
                pages: []
              });
            });
          });
        }

        const mapped: MangaDetail = {
          id: item.id,
          title:
              item.attributes.altTitles?.find((t: any) => t.vi)?.vi ||
              item.attributes.altTitles?.find((t: any) => t.en)?.en ||
              item.attributes.altTitles?.find((t: any) => t.ja)?.ja ||
              item.attributes?.title?.vi ||
              item.attributes?.title?.en ||
              item.attributes?.title?.ja ||
              'Unknown',
          slug: item.attributes?.slug || '',
          alternativeTitles: item.attributes?.altTitles?.map((t: any) => t.vi || t.en || t.ja) || [],
          author: authors,
          artist,
          coverImage,
          description: item.attributes?.description?.vi || item.attributes?.description?.en || item.attributes?.description?.ja  || '',
          genres,
          status: (item.attributes?.status as MangaStatus) || MangaStatus.UNKNOWN,
          releaseYear: item.attributes?.year || new Date(item.attributes?.createdAt).getFullYear(),
          lastUpdated: new Date(item.attributes?.updatedAt || Date.now()),
          rating: item.attributes?.rating || 4.8,
          views: item.attributes?.views || 19900,
          follows: item.attributes?.follows || 9999,
          chapters,
          tags
        };

        setManga(mapped);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching manga details:', err);
        setManga(null);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!manga) return <div>Không tìm thấy manga</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-8">
            {/* Cover & Actions */}
            <div className="space-y-4">
              <img src={manga.coverImage} alt={manga.title} className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg" />
              <div className="space-y-2">
                {manga.chapters.length > 0 && (
                  <Link to={`/manga/${manga.title}/${manga.chapters[0]?.id}`}>
                    <Button className="w-full" size="lg">
                      <BookOpen className="h-4 w-4 mr-2" /> Đọc Từ Đầu
                    </Button>
                  </Link>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={isFollowing ? "secondary" : "outline"} onClick={() => setIsFollowing(!isFollowing)}>
                    <Bell className="h-4 w-4 mr-2" /> {isFollowing ? 'Đang Theo' : 'Theo Dõi'}
                  </Button>
                  <Button variant={isFavorite ? "secondary" : "outline"} onClick={() => setIsFavorite(!isFavorite)}>
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} /> {isFavorite ? 'Đã Thích' : 'Yêu Thích'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Manga Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold mb-2">{manga.title}</h1>
              {manga.alternativeTitles.length > 0 && (
                <p className="text-muted-foreground text-sm">Tên khác: {manga.alternativeTitles.join(', ')}</p>
              )}

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1"><Star className="h-5 w-5 text-primary fill-primary" /><span className="font-semibold">{manga.rating.toFixed(1)}</span></div>
                <div className="flex items-center gap-1"><Eye className="h-5 w-5" /><span>{manga.views.toLocaleString()} lượt xem</span></div>
                <div className="flex items-center gap-1"><Heart className="h-5 w-5" /><span>{manga.follows.toLocaleString()} theo dõi</span></div>
              </div>

              <div className="flex flex-wrap gap-2">
                {manga.tags.map((tag, idx) => {
                  const slug = tag.toLowerCase().replace(/\s+/g, '-'); // tạo slug từ tên tag
                  return (
                    <Link key={idx} to={`/genre/${slug}`}>
                      <Badge variant="outline">{tag}</Badge>
                    </Link>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Tác giả:</span> <span className="font-medium">{manga.author}</span></div>
                  {manga.artist && !manga.author.includes(manga.artist) && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Họa sĩ:</span>
                      <span className="font-medium">{manga.artist}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Năm:</span> <span className="font-medium">{manga.releaseYear}</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Chapters:</span> <span className="font-medium">{manga.chapters.length}</span></div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Cập nhật:</span> <span className="font-medium">{manga.lastUpdated.toLocaleDateString('vi-VN')}</span></div>
                  <div className="flex items-center gap-2"><Badge variant={manga.status === 'ongoing' ? 'default' : 'secondary'}>{manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành'}</Badge></div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Tóm tắt</h3>
                <p className="text-muted-foreground">{manga.description}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="chapters">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="chapters">Danh Sách Chapter ({manga.chapters.length})</TabsTrigger>
              <TabsTrigger value="comments">Bình Luận (128)</TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="mt-6">
              <div className="bg-card rounded-lg border max-h-[600px] overflow-y-auto">
                {manga.chapters.slice()
                  .sort((a, b) => a.chapterNumber - b.chapterNumber)
                  .reverse()
                  .map(ch => (
                  <Link
                    key={ch.id}
                    to={`/manga/${manga.title}/${ch.id}`}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Chapter {ch.chapterNumber}</span>
                      {ch.title && <span className="text-sm text-muted-foreground">{ch.title}</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {/* <span>{ch.views.toLocaleString()} views</span>  */}
                      <span>{ch.releaseDate.toLocaleDateString('vi-VN')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <div className="bg-card rounded-lg border p-6 flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-5 w-5" />
                <p>Tính năng bình luận sẽ sớm được cập nhật.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
