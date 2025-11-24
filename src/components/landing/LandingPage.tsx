import { ShoppingCart, DollarSign, Link2, Wallet, Package, TrendingUp } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface LandingPageProps {
  products: Product[];
  onNavigate: (view: string) => void;
  onLogin: (role: 'vendor' | 'affiliate' | 'admin') => void;
}

export const LandingPage = ({ products, onNavigate, onLogin }: LandingPageProps) => {
  const features = [
    {
      icon: DollarSign,
      title: 'Automated Splits',
      description: 'Instant payment distribution to vendors, affiliates & platform',
    },
    {
      icon: Link2,
      title: 'Smart Tracking',
      description: 'Track clicks, conversions and commissions in real-time',
    },
    {
      icon: Wallet,
      title: 'Mobile Money',
      description: 'Integrated M-Pesa, Airtel Money & TigoPesa payments',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">AfriLink</span>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Africa's Premier
            <span className="block bg-gradient-to-r from-afrilink-amber to-afrilink-orange bg-clip-text text-transparent">
              Affiliate Marketplace
            </span>
          </h1>
          <p className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Connect vendors, affiliates, and consumers. Automated payment splits with M-Pesa, Airtel Money & TigoPesa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <button
              onClick={() => onLogin('vendor')}
              className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Start Selling</span>
            </button>
            <button
              onClick={() => onLogin('affiliate')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-foreground rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 border border-white/20 group"
            >
              <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Become Affiliate</span>
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-foreground rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 border border-white/20 group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Browse Products</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-7 duration-1000"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-glow">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/60">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:scale-105 transition-all duration-300 hover:shadow-glow animate-in fade-in zoom-in-95 duration-700"
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="text-xs text-primary font-semibold mb-2">{product.category}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{product.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{formatCurrency(product.price)}</span>
                    <span className="text-sm text-afrilink-green font-medium">{product.commission}% commission</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
