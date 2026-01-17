import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
            Hi 👋 Welcome to AfriLink — Africa’s first homegrown affiliate marketplace.
          </h1>
          <p className="text-sm sm:text-lg text-foreground/70">
            Sell. Promote. Earn — powered by Africa.
          </p>
        </div>
        <Button
          onClick={onContinue}
          size="lg"
          className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg rounded-xl shadow-glow"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
