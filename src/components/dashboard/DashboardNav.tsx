import { Bell, ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '@/types';

interface DashboardNavProps {
  currentUser: User;
  onLogout: () => void;
}

export const DashboardNav = ({ currentUser, onLogout }: DashboardNavProps) => {

  return (
    <nav className="bg-sidebar border-b border-sidebar-border sticky top-0 z-40 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-sidebar-foreground">AfriLink</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center space-x-4">
            <Bell className="w-6 h-6 text-sidebar-foreground/60 hover:text-sidebar-foreground cursor-pointer transition-colors" />
            <div className="flex items-center space-x-3 px-4 py-2 bg-sidebar-accent rounded-lg">
              <div>
                <div className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</div>
                <div className="text-xs text-sidebar-foreground/60 capitalize">{currentUser.role}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-sidebar-foreground/60 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-3">
            <Bell className="w-5 h-5 text-sidebar-foreground/60" />
            <button
              onClick={onLogout}
              className="p-2 text-sidebar-foreground/60 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <UserIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
