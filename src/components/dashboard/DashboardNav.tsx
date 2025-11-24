import { Menu, Bell, ShoppingCart } from 'lucide-react';
import { User } from '@/types';

interface DashboardNavProps {
  currentUser: User;
  onToggleSidebar: () => void;
}

export const DashboardNav = ({ currentUser, onToggleSidebar }: DashboardNavProps) => {
  return (
    <nav className="bg-sidebar border-b border-sidebar-border sticky top-0 z-40 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">AfriLink</span>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-sidebar-foreground/60 hover:text-sidebar-foreground cursor-pointer transition-colors" />
            <div className="flex items-center space-x-3 px-4 py-2 bg-sidebar-accent rounded-lg">
              <div>
                <div className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</div>
                <div className="text-xs text-sidebar-foreground/60 capitalize">{currentUser.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
