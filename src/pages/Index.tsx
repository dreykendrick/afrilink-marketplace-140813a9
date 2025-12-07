import { useState, useEffect } from 'react';
import { LandingPage } from '@/components/landing/LandingPage';
import { LoginPage } from '@/components/auth/LoginPage';
import { SignupPage } from '@/components/auth/SignupPage';
import { VerificationForm } from '@/components/auth/VerificationForm';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { VendorDashboard } from '@/components/dashboard/VendorDashboard';
import { AffiliateDashboard } from '@/components/dashboard/AffiliateDashboard';
import { MarketplaceNav } from '@/components/marketplace/MarketplaceNav';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ProductModal } from '@/components/marketplace/ProductModal';
import { Notification } from '@/components/Notification';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { User, Product, VendorStats, AffiliateStats } from '@/types';
import { Loader2 } from 'lucide-react';

type View = 'landing' | 'login' | 'signup' | 'verification' | 'dashboard' | 'marketplace';

const Index = () => {
  const { user, loading: authLoading, userRole, signOut } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  
  // Real data states
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<{ full_name: string; wallet_balance: number } | null>(null);
  const [vendorStats, setVendorStats] = useState<VendorStats>({ revenue: 0, sales: 0, products: 0, pending: 0 });
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats>({ commission: 0, clicks: 0, conversions: 0, rate: 0 });
  const [dataLoading, setDataLoading] = useState(false);

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (user && userRole && view !== 'verification') {
      setView('dashboard');
      fetchUserData();
    }
  }, [user, userRole]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setDataLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, wallet_balance')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch products based on role
      if (userRole === 'vendor') {
        // Fetch vendor's own products
        const { data: vendorProducts } = await supabase
          .from('products')
          .select('*')
          .eq('vendor_id', user.id);

        if (vendorProducts) {
          const formattedProducts: Product[] = vendorProducts.map(p => ({
            id: parseInt(p.id.substring(0, 8), 16), // Convert UUID to number for compatibility
            title: p.title,
            description: p.description || '',
            price: p.price,
            commission: p.commission,
            category: p.category,
            image: p.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
            images: p.image_urls || [],
            imageCount: p.image_urls?.length || (p.image_url ? 1 : 0),
            status: p.status as 'approved' | 'pending' | 'rejected',
            sales: p.sales,
          }));
          setProducts(formattedProducts);

          // Calculate vendor stats
          const totalSales = vendorProducts.reduce((sum, p) => sum + p.sales, 0);
          const totalRevenue = vendorProducts.reduce((sum, p) => sum + (p.sales * p.price), 0);
          const pendingCount = vendorProducts.filter(p => p.status === 'pending').length;
          
          setVendorStats({
            revenue: totalRevenue,
            sales: totalSales,
            products: vendorProducts.filter(p => p.status === 'approved').length,
            pending: pendingCount,
          });
        }
      } else {
        // Fetch approved products for affiliates
        const { data: approvedProducts } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'approved');

        if (approvedProducts) {
          const formattedProducts: Product[] = approvedProducts.map(p => ({
            id: parseInt(p.id.substring(0, 8), 16),
            title: p.title,
            description: p.description || '',
            price: p.price,
            commission: p.commission,
            category: p.category,
            image: p.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
            images: p.image_urls || [],
            imageCount: p.image_urls?.length || (p.image_url ? 1 : 0),
            status: p.status as 'approved' | 'pending' | 'rejected',
            sales: p.sales,
          }));
          setProducts(formattedProducts);
        }

        // Set affiliate stats (would come from affiliate_links table when implemented)
        setAffiliateStats({
          commission: profileData?.wallet_balance || 0,
          clicks: 0,
          conversions: 0,
          rate: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchMarketplaceProducts = async () => {
    try {
      const { data: approvedProducts } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'approved');

      if (approvedProducts) {
        const formattedProducts: Product[] = approvedProducts.map(p => ({
          id: parseInt(p.id.substring(0, 8), 16),
          title: p.title,
          description: p.description || '',
          price: p.price,
          commission: p.commission,
          category: p.category,
          image: p.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
          images: p.image_urls || [],
          imageCount: p.image_urls?.length || (p.image_url ? 1 : 0),
          status: p.status as 'approved' | 'pending' | 'rejected',
          sales: p.sales,
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching marketplace products:', error);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const handleLogout = async () => {
    await signOut();
    setView('landing');
    setProfile(null);
    setProducts([]);
    showNotification('Logged out successfully');
  };

  const handleGenerateLink = (productId: number) => {
    showNotification('Affiliate link copied!');
  };

  const handleAddToCart = (productId: number) => {
    showNotification('Added to cart!');
  };

  const handleBuyProduct = () => {
    setSelectedProduct(null);
    showNotification('Product purchased successfully!');
  };

  const handleNavigate = (newView: string) => {
    if (newView === 'marketplace') {
      fetchMarketplaceProducts();
    }
    setView(newView as View);
  };

  // Build current user object from real data
  const currentUser: User | null = user && profile ? {
    id: parseInt(user.id.substring(0, 8), 16),
    name: profile.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    role: userRole || 'vendor',
    wallet: profile.wallet_balance || 0,
  } : null;

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <>
        <LandingPage products={products} onNavigate={handleNavigate} onLogin={() => handleNavigate('login')} />
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </>
    );
  }

  if (view === 'login') {
    return (
      <>
        <LoginPage onNavigate={handleNavigate} />
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </>
    );
  }

  if (view === 'signup') {
    return (
      <>
        <SignupPage
          onNavigate={handleNavigate}
          onSignupSuccess={(userId) => {
            setPendingUserId(userId);
            setView('verification');
          }}
        />
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </>
    );
  }

  if (view === 'verification') {
    const userId = pendingUserId || user?.id;
    if (!userId) {
      setView('login');
      return null;
    }

    return (
      <>
        <VerificationForm
          userId={userId}
          onComplete={() => {
            if (user) {
              showNotification('Verification complete!');
              setView('dashboard');
              fetchUserData();
            } else {
              showNotification('Verification complete! Please log in.');
              setView('login');
              setPendingUserId(null);
            }
          }}
        />
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </>
    );
  }

  if (view === 'dashboard' && currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav currentUser={currentUser} onLogout={handleLogout} />
        <div className="p-4 sm:p-6 lg:p-8">
          {dataLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : userRole === 'vendor' ? (
            <VendorDashboard
              currentUser={currentUser}
              products={products}
              stats={vendorStats}
              onVerify={() => setView('verification')}
              onProductAdded={fetchUserData}
            />
          ) : (
            <AffiliateDashboard
              currentUser={currentUser}
              products={products}
              stats={affiliateStats}
              onGenerateLink={handleGenerateLink}
              onVerify={() => setView('verification')}
            />
          )}
        </div>
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </div>
    );
  }

  if (view === 'marketplace') {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceNav currentUser={currentUser} onLogout={handleLogout} onGoHome={() => handleNavigate('landing')} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onClick={setSelectedProduct}
                index={index}
              />
            ))}
          </div>
        </div>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onBuy={handleBuyProduct} />
        )}
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </div>
    );
  }

  return null;
};

export default Index;