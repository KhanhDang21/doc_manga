import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Độc Manga</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Đọc manga online miễn phí với giao diện tối giản
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Khám Phá</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tất Cả Manga
                </Link>
              </li>
              <li>
                <Link to="/top" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Top Manga
                </Link>
              </li>
              <li>
                <Link to="/new" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mới Cập Nhật
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="font-semibold mb-3">Thể Loại Phổ Biến</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/genre/action" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link to="/genre/romance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Romance
                </Link>
              </li>
              <li>
                <Link to="/genre/comedy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Comedy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-3">Kết Nối</h3>
            <div className="flex space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Độc Manga. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}