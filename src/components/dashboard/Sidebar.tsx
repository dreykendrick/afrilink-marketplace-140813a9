import { BarChart3, Package, Wallet, Settings, LogOut } from 'lucide-react';
import { User } from '@/types';

interface SidebarProps {
  currentUser: User;
  onLogout: () => void;
}

export const Sidebar = ({ currentUser, onLogout }: SidebarProps) => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: Package, label: 'Products', active: false },
    { icon: Wallet, label: 'Wallet', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="w-64 bg-sidebar min-h-screen border-r border-sidebar-border p-4 animate-in slide-in-from-left-5 duration-500">
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 animate-in fade-in slide-in-from-left-4 duration-500 ${
              item.active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-destructive hover:text-destructive/80 hover:bg-sidebar-accent/50 rounded-lg mt-8 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};
