import { useState } from 'react';
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
import { products, users, vendorStats, affiliateStats, applications } from '@/data/mockData';
import { User, Product, Application } from '@/types';

type View = 'landing' | 'login' | 'signup' | 'verification' | 'dashboard' | 'marketplace';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('landing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [pendingApplications, setPendingApplications] = useState<Application[]>(applications);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const handleLogin = (role: 'vendor' | 'affiliate') => {
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

  if (view === 'verification' && pendingUserId) {
    return (
      <>
        <VerificationForm 
          userId={pendingUserId}
          onComplete={() => {
            showNotification('Verification complete! Please log in.');
            setView('login');
            setPendingUserId(null);
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
        <div className="p-8">
          {currentUser.role === 'vendor' ? (
            <VendorDashboard currentUser={currentUser} products={products} stats={vendorStats} />
          ) : (
            <AffiliateDashboard
              currentUser={currentUser}
              products={products}
              stats={affiliateStats}
              onGenerateLink={handleGenerateLink}
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
