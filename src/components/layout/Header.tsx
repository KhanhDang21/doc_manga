import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, BookOpen, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Độc Manga</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Duyệt Manga
          </Link>
          <Link to="/genres" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Thể Loại
          </Link>
          <Link to="/top" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Top Manga
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Tìm manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[200px] md:w-[300px]"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="default" size="sm" className="font-medium">
              <LogIn className="h-4 w-4 mr-2" />
              Đăng Nhập
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link to="/browse" className="text-lg font-medium hover:text-primary transition-colors">
                  Duyệt Manga
                </Link>
                <Link to="/genres" className="text-lg font-medium hover:text-primary transition-colors">
                  Thể Loại
                </Link>
                <Link to="/top" className="text-lg font-medium hover:text-primary transition-colors">
                  Top Manga
                </Link>
                <div className="border-t pt-4 space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Tài Khoản
                  </Button>
                  <Button variant="default" className="w-full justify-start">
                    <LogIn className="h-4 w-4 mr-2" />
                    Đăng Nhập
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}