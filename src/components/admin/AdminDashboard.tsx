import { useState } from 'react';
import { User, Application, AdminStats } from '@/types';
import { AdminStatsSection } from './AdminStats';
import { ApplicationCard } from './ApplicationCard';
import { Users, FileText, Settings as SettingsIcon, Shield } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  applications: Application[];
  stats: AdminStats;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export const AdminDashboard = ({
  currentUser,
  applications,
  stats,
  onApprove,
  onReject,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'users' | 'products' | 'settings'>('applications');

  const tabs = [
    { id: 'applications', label: 'Pending Applications', icon: FileText, count: applications.length },
    { id: 'users', label: 'User Management', icon: Users, count: stats.totalUsers },
    { id: 'products', label: 'Product Review', icon: Shield, count: 0 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, count: 0 },
  ];

  return (
    <>
      <div className="mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser.name}! Manage your platform here.</p>
      </div>

      <AdminStatsSection stats={stats} />

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'applications' && (
            <>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application, index) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onApprove={onApprove}
                      onReject={onReject}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Pending Applications</h3>
                  <p className="text-muted-foreground">All applications have been reviewed.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'users' && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">User Management</h3>
              <p className="text-muted-foreground">View and manage all platform users</p>
              <p className="text-sm text-muted-foreground mt-2">Feature coming soon...</p>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">Product Review</h3>
              <p className="text-muted-foreground">Review and moderate products</p>
              <p className="text-sm text-muted-foreground mt-2">Feature coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <SettingsIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">Platform Settings</h3>
              <p className="text-muted-foreground">Configure platform settings and preferences</p>
              <p className="text-sm text-muted-foreground mt-2">Feature coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
