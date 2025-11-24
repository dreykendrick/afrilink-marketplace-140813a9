import { CheckCircle, XCircle, Clock, Package, TrendingUp } from 'lucide-react';
import { Application } from '@/types';

interface ApplicationCardProps {
  application: Application;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  index: number;
}

export const ApplicationCard = ({ application, onApprove, onReject, index }: ApplicationCardProps) => {
  const isVendor = application.role === 'vendor';
  const RoleIcon = isVendor ? Package : TrendingUp;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isVendor ? 'bg-afrilink-blue/10' : 'bg-afrilink-purple/10'
          }`}>
            <RoleIcon className={`w-6 h-6 ${
              isVendor ? 'text-afrilink-blue' : 'text-afrilink-purple'
            }`} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{application.userName}</h3>
            <p className="text-sm text-muted-foreground">{application.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-afrilink-amber/10 rounded-lg">
          <Clock className="w-4 h-4 text-afrilink-amber" />
          <span className="text-sm font-medium text-afrilink-amber capitalize">{application.status}</span>
        </div>
      </div>

      {application.businessName && (
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Business Name</div>
          <div className="text-sm font-medium text-foreground">{application.businessName}</div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-1">Description</div>
        <p className="text-sm text-foreground">{application.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Applied: {formatDate(application.appliedAt)}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onReject(application.id)}
            className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive/20 transition-all duration-200 flex items-center space-x-2"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>
          <button
            onClick={() => onApprove(application.id)}
            className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-glow transition-all duration-200 flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve</span>
          </button>
        </div>
      </div>
    </div>
  );
};
