import { DollarSign, ShoppingCart, Package, Eye, Plus } from 'lucide-react';
import { User, Product, VendorStats } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { StatsCard } from './StatsCard';
import { WalletCard } from './WalletCard';
import { VerificationStatusCard } from './VerificationStatusCard';

interface VendorDashboardProps {
  currentUser: User;
  products: Product[];
  stats: VendorStats;
  onVerify: () => void;
}

export const VendorDashboard = ({ currentUser, products, stats, onVerify }: VendorDashboardProps) => {
  return (
    <>
      <div className="mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {currentUser.name}!</h1>
        <p className="text-muted-foreground">Here's your vendor dashboard overview</p>
      </div>

      <div className="mb-8">
        <VerificationStatusCard onVerify={onVerify} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard icon={DollarSign} value={formatCurrency(stats.revenue)} label="Total Revenue" gradient="from-afrilink-green to-emerald-600" />
        <StatsCard icon={ShoppingCart} value={stats.sales} label="Total Sales" gradient="from-afrilink-blue to-cyan-600" />
        <StatsCard icon={Package} value={stats.products} label="Active Products" gradient="from-afrilink-purple to-afrilink-pink" />
        <StatsCard icon={Eye} value={stats.pending} label="Pending Review" gradient="from-afrilink-amber to-afrilink-orange" />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">Your Products</h2>
          <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold flex items-center space-x-2 hover:shadow-glow transition-all duration-300">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-all duration-200 animate-in fade-in slide-in-from-left-3 duration-500"
              style={{ animationDelay: `${300 + index * 50}ms` }}
            >
              <div className="flex items-center space-x-4">
                <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <div className="font-semibold text-foreground">{product.title}</div>
                  <div className="text-sm text-muted-foreground">{product.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-foreground">{formatCurrency(product.price)}</div>
                <div className="text-sm text-muted-foreground">{product.sales} sales</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WalletCard balance={currentUser.wallet} />
    </>
  );
};
