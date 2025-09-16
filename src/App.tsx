  import { Toaster } from "@/components/ui/toaster";
  import { Toaster as Sonner } from "@/components/ui/sonner";
  import { TooltipProvider } from "@/components/ui/tooltip";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import Index from "./pages/Index";
  import MangaDetail from "./pages/MangaDetail";
  import ChapterReader from "./pages/ChapterReader";
  import NotFound from "./pages/NotFound";

  const queryClient = new QueryClient();

  const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manga/:slug" element={<MangaDetail />} />
            <Route path="/read/:manga_slug/:chapter_number" element={<ChapterReader />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  export default App;
