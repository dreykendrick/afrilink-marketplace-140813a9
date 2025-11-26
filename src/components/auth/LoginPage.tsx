import { ShoppingCart, Package, TrendingUp } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'vendor' | 'affiliate') => void;
  onNavigate: (view: string) => void;
}

export const LoginPage = ({ onLogin, onNavigate }: LoginPageProps) => {
  const roles = [
    {
      role: 'vendor' as const,
      icon: Package,
      label: 'Login as Vendor',
      gradient: 'from-afrilink-blue to-cyan-600',
    },
    {
      role: 'affiliate' as const,
      icon: TrendingUp,
      label: 'Login as Affiliate',
      gradient: 'from-afrilink-purple to-afrilink-pink',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-card backdrop-blur-lg rounded-2xl p-8 border border-border shadow-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Choose your role to continue</p>
          </div>

          <div className="space-y-3">
            {roles.map((item, index) => (
              <button
                key={item.role}
                onClick={() => onLogin(item.role)}
                className={`w-full py-4 bg-gradient-to-r ${item.gradient} text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 animate-in fade-in slide-in-from-bottom-3 duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => onNavigate('landing')}
              className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all duration-300 mt-4"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
