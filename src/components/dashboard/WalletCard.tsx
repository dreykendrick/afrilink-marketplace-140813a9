import { Wallet, Download } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface WalletCardProps {
  balance: number;
}

export const WalletCard = ({ balance }: WalletCardProps) => {
  return (
    <div className="bg-gradient-primary rounded-2xl p-6 text-white shadow-glow animate-in fade-in slide-in-from-bottom-5 duration-500 delay-300">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm opacity-90 mb-2">Available Balance</div>
          <div className="text-4xl font-bold mb-4">{formatCurrency(balance)}</div>
          <button className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
        <Wallet className="w-16 h-16 opacity-30" />
      </div>
    </div>
  );
};
