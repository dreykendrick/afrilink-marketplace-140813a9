import { DollarSign, Eye, CheckCircle, TrendingUp, Link2 } from 'lucide-react';
import { User, Product, AffiliateStats } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { StatsCard } from './StatsCard';
import { WalletCard } from './WalletCard';
import { VerificationStatusCard } from './VerificationStatusCard';

interface AffiliateDashboardProps {
  currentUser: User;
  products: Product[];
  stats: AffiliateStats;
  onGenerateLink: (productId: number) => void;
  onVerify: () => void;
}

export const AffiliateDashboard = ({ currentUser, products, stats, onGenerateLink, onVerify }: AffiliateDashboardProps) => {
  return (
    <>
      <div className="mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {currentUser.name}!</h1>
        <p className="text-muted-foreground">Here's your affiliate dashboard overview</p>
      </div>

      <div className="mb-8">
        <VerificationStatusCard onVerify={onVerify} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard icon={DollarSign} value={formatCurrency(stats.commission)} label="Total Commission" gradient="from-afrilink-green to-emerald-600" />
        <StatsCard icon={Eye} value={stats.clicks} label="Total Clicks" gradient="from-afrilink-blue to-cyan-600" />
        <StatsCard icon={CheckCircle} value={stats.conversions} label="Conversions" gradient="from-afrilink-purple to-afrilink-pink" />
        <StatsCard icon={TrendingUp} value={`${stats.rate}%`} label="Conversion Rate" gradient="from-afrilink-amber to-afrilink-orange" />
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="text-xl font-bold text-foreground mb-6">Products to Promote</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-secondary/50 rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <img src={product.image} alt={product.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-2">{product.title}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-foreground">{formatCurrency(product.price)}</span>
                  <span className="text-sm text-afrilink-green font-semibold">
                    Earn {formatCurrency((product.price * product.commission) / 100)}
                  </span>
                </div>
                <button
                  onClick={() => onGenerateLink(product.id)}
                  className="w-full py-2 bg-gradient-primary text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-glow transition-all duration-300"
                >
                  <Link2 className="w-4 h-4" />
                  <span>Generate Link</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WalletCard balance={currentUser.wallet} />
    </>
  );
};
