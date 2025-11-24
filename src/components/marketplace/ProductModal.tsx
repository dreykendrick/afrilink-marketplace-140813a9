import { Product } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onBuy: () => void;
}

export const ProductModal = ({ product, onClose, onBuy }: ProductModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-2xl w-full p-8 border border-border shadow-card animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={product.image} alt={product.title} className="w-full h-64 object-cover rounded-xl mb-6" />
        <h2 className="text-3xl font-bold text-foreground mb-4">{product.title}</h2>
        <p className="text-muted-foreground mb-6">{product.description}</p>
        <div className="text-4xl font-bold text-foreground mb-6">{formatCurrency(product.price)}</div>
        <button
          onClick={onBuy}
          className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg hover:shadow-glow transition-all duration-300 mb-3"
        >
          Buy Now
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};
