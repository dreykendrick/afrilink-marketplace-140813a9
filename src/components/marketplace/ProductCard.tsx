import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  onClick: (product: Product) => void;
  index: number;
}

export const ProductCard = ({ product, onAddToCart, onClick, index }: ProductCardProps) => {
  return (
    <div
      className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-300 cursor-pointer hover:scale-105 shadow-card animate-in fade-in zoom-in-95 duration-500"
      onClick={() => onClick(product)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="text-xs text-primary font-semibold mb-2">{product.category}</div>
        <h3 className="text-lg font-bold text-foreground mb-2">{product.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-foreground">{formatCurrency(product.price)}</span>
          <span className="text-sm text-muted-foreground">{product.sales} sales</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product.id);
          }}
          className="w-full py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
