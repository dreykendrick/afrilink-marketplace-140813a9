import { useState } from 'react';
import { LandingPage } from '@/components/landing/LandingPage';
import { LoginPage } from '@/components/auth/LoginPage';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { VendorDashboard } from '@/components/dashboard/VendorDashboard';
import { AffiliateDashboard } from '@/components/dashboard/AffiliateDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { MarketplaceNav } from '@/components/marketplace/MarketplaceNav';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ProductModal } from '@/components/marketplace/ProductModal';
import { Notification } from '@/components/Notification';
import { products, users, vendorStats, affiliateStats, applications, adminStats } from '@/data/mockData';
import { User, Product, Application } from '@/types';

type View = 'landing' | 'login' | 'dashboard' | 'marketplace';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [pendingApplications, setPendingApplications] = useState<Application[]>(applications);

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const handleLogin = (role: 'vendor' | 'affiliate' | 'admin') => {
    setCurrentUser(users[role]);
    setView('dashboard');
    showNotification(`Welcome back, ${users[role].name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
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
    setView(newView as View);
  };

  const handleApproveApplication = (id: number) => {
    setPendingApplications((prev) => prev.filter((app) => app.id !== id));
    showNotification('Application approved successfully!');
  };

  const handleRejectApplication = (id: number) => {
    setPendingApplications((prev) => prev.filter((app) => app.id !== id));
    showNotification('Application rejected.');
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage products={products} onNavigate={handleNavigate} onLogin={handleLogin} />
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </>
    );
  }

  if (view === 'login') {
    return (
      <>
        <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </>
    );
  }

  if (view === 'dashboard' && currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav currentUser={currentUser} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          {sidebarOpen && <Sidebar currentUser={currentUser} onLogout={handleLogout} />}
          <div className="flex-1 p-8">
            {currentUser.role === 'vendor' ? (
              <VendorDashboard currentUser={currentUser} products={products} stats={vendorStats} />
            ) : currentUser.role === 'affiliate' ? (
              <AffiliateDashboard
                currentUser={currentUser}
                products={products}
                stats={affiliateStats}
                onGenerateLink={handleGenerateLink}
              />
            ) : (
              <AdminDashboard
                currentUser={currentUser}
                applications={pendingApplications}
                stats={adminStats}
                onApprove={handleApproveApplication}
                onReject={handleRejectApplication}
              />
            )}
          </div>
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
