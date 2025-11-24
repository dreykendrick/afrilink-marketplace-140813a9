import { Users, Package, TrendingUp, Clock, DollarSign, ArrowUpRight } from 'lucide-react';
import { AdminStats } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface AdminStatsProps {
  stats: AdminStats;
}

export const AdminStatsSection = ({ stats }: AdminStatsProps) => {
  const statCards = [
    {
      icon: Users,
      value: stats.totalUsers,
      label: 'Total Users',
      gradient: 'from-afrilink-blue to-cyan-600',
    },
    {
      icon: Package,
      value: stats.totalVendors,
      label: 'Active Vendors',
      gradient: 'from-afrilink-green to-emerald-600',
    },
    {
      icon: TrendingUp,
      value: stats.totalAffiliates,
      label: 'Active Affiliates',
      gradient: 'from-afrilink-purple to-afrilink-pink',
    },
    {
      icon: Clock,
      value: stats.pendingApplications,
      label: 'Pending Applications',
      gradient: 'from-afrilink-amber to-afrilink-orange',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-card hover:scale-105 transition-transform duration-300 animate-in fade-in zoom-in-95 duration-500`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <stat.icon className="w-8 h-8 mb-4" />
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
              <div className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</div>
            </div>
            <div className="w-12 h-12 bg-afrilink-green/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-afrilink-green" />
            </div>
          </div>
          <div className="flex items-center text-sm text-afrilink-green">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>All time earnings</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-card animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Monthly Revenue</div>
              <div className="text-3xl font-bold text-foreground">{formatCurrency(stats.monthlyRevenue)}</div>
            </div>
            <div className="w-12 h-12 bg-afrilink-blue/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-afrilink-blue" />
            </div>
          </div>
          <div className="flex items-center text-sm text-afrilink-blue">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>This month's earnings</span>
          </div>
        </div>
      </div>
    </>
  );
};
