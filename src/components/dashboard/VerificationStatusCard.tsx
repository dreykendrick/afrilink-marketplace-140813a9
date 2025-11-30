import { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Camera, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VerificationStatusCardProps {
  onVerify: () => void;
}

interface VerificationStatus {
  email_verified: boolean;
  phone_verified: boolean;
  photo_verified: boolean;
  verification_status: string;
}

export const VerificationStatusCard = ({ onVerify }: VerificationStatusCardProps) => {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('email_verified, phone_verified, photo_verified, verification_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setStatus(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <p className="text-muted-foreground text-sm">Loading verification status...</p>
        </CardContent>
      </Card>
    );
  }

  const isFullyVerified = status?.email_verified && status?.phone_verified && status?.photo_verified;
  const verificationSteps = [
    { label: 'Email', verified: status?.email_verified, icon: Mail },
    { label: 'Phone', verified: status?.phone_verified, icon: Phone },
    { label: 'Photo ID', verified: status?.photo_verified, icon: Camera },
  ];

  return (
    <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
              isFullyVerified 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-amber-100 dark:bg-amber-900/20'
            }`}>
              {isFullyVerified ? (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Account Verification</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {isFullyVerified 
                  ? 'Your account is fully verified' 
                  : 'Complete verification to access all features'}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {verificationSteps.map((step) => (
            <div
              key={step.label}
              className={`p-2 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                step.verified
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <step.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  step.verified 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-400 dark:text-gray-600'
                }`} />
                <span className="text-xs sm:text-sm font-medium">{step.label}</span>
                {step.verified ? (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {!isFullyVerified && (
          <div className="pt-2">
            <Button onClick={onVerify} className="w-full" size="lg">
              <Shield className="w-4 h-4 mr-2" />
              Complete Verification
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Verification is required to access payment features
            </p>
          </div>
        )}

        {isFullyVerified && (
          <div className="flex items-start sm:items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs sm:text-sm text-green-900 dark:text-green-100">
              Your account has been verified and you have access to all platform features
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};