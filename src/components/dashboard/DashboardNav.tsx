import { Bell, ShoppingCart, LogOut, User as UserIcon, Settings, ShieldCheck, ChevronDown } from 'lucide-react';
import { User } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface DashboardNavProps {
  currentUser: User;
  onLogout: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToVerification?: () => void;
}

export const DashboardNav = ({ 
  currentUser, 
  onLogout,
  onNavigateToSettings,
  onNavigateToVerification 
}: DashboardNavProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-3 px-4 py-2 bg-sidebar-accent rounded-lg hover:bg-sidebar-accent/80 transition-colors cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</div>
                  <div className="text-xs text-sidebar-foreground/60 capitalize">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-popover border border-border z-50">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {currentUser.role}
                      </Badge>
                      {currentUser.verified ? (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">Verified</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">Unverified</Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onNavigateToVerification}
                  className="cursor-pointer"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>Verification Status</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onNavigateToSettings}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="cursor-pointer text-red-400 focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="flex sm:hidden items-center space-x-3">
            <Bell className="w-5 h-5 text-sidebar-foreground/60" />
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-popover border border-border z-50">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {currentUser.role}
                      </Badge>
                      {currentUser.verified ? (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">Verified</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">Unverified</Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onNavigateToVerification}
                  className="cursor-pointer"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>Verification Status</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onNavigateToSettings}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="cursor-pointer text-red-400 focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
