import { useState } from 'react';
import { ShoppingCart, Search, Users, LogOut, Home, Menu, X } from 'lucide-react';
import { User } from '@/types';

interface MarketplaceNavProps {
  currentUser: User | null;
  onLogout: () => void;
  onGoHome: () => void;
}

export const MarketplaceNav = ({ currentUser, onLogout, onGoHome }: MarketplaceNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="bg-sidebar border-b border-sidebar-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">AfriLink</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-4">
            <ShoppingCart className="w-6 h-6 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-lg">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
                </div>
                <button onClick={onLogout} className="text-muted-foreground hover:text-foreground transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={onGoHome}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Back to Home</span>
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground"
            >
              <Search className="w-5 h-5" />
            </button>
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="sm:hidden py-3 border-t border-sidebar-border animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 space-y-3 border-t border-sidebar-border animate-in fade-in slide-in-from-top-2 duration-200">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-3 bg-secondary rounded-lg">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center space-x-2 py-3 text-red-400 bg-red-400/10 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => { onGoHome(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-secondary rounded-lg"
              >
                <Home className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">Back to Home</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};