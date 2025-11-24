import { ShoppingCart, Search, Users, LogOut, Home } from 'lucide-react';
import { User } from '@/types';

interface MarketplaceNavProps {
  currentUser: User | null;
  onLogout: () => void;
  onGoHome: () => void;
}

export const MarketplaceNav = ({ currentUser, onLogout, onGoHome }: MarketplaceNavProps) => {
  return (
    <nav className="bg-sidebar border-b border-sidebar-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AfriLink</span>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
};
