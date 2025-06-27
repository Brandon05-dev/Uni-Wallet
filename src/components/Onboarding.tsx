
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingProps {
  onComplete: () => void;
  onLogin: () => void;
}

const Onboarding = ({ onComplete, onLogin }: OnboardingProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Campus Wallet",
      description: "Your complete financial companion for campus life",
      icon: "🎓",
      content: "Manage your money, pay for services, and split costs with friends - all in one secure app."
    },
    {
      title: "Top Up",
      description: "Add money to your wallet instantly",
      icon: "💳",
      content: "Link your M-Pesa account or bank card to top up your Campus Wallet anytime, anywhere."
    },
    {
      title: "Spend",
      description: "Pay for campus services with ease",
      icon: "🛒",
      content: "Pay for printing, laundry, Wi-Fi, meals, and more with just a tap. Scan QR codes for instant payments."
    },
    {
      title: "Save",
      description: "Build healthy financial habits",
      icon: "💰",
      content: "Set savings goals, track spending, and watch your money grow with our budgeting tools."
    },
    {
      title: "Reward",
      description: "Earn as you spend",
      icon: "🎁",
      content: "Get cashback, discounts, and exclusive offers from your favorite campus spots."
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="text-6xl mb-4 animate-bounce">{currentStep.icon}</div>
            <CardTitle className="text-2xl font-bold text-navy-800 mb-2">
              {currentStep.title}
            </CardTitle>
            <CardDescription className="text-lg text-mint-600 font-medium">
              {currentStep.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 leading-relaxed">
              {currentStep.content}
            </p>
            
            <div className="flex justify-center space-x-2 py-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === step ? 'bg-mint-500 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {step === steps.length - 1 ? (
              <div className="space-y-3">
                <Button 
                  onClick={onLogin}
                  className="w-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold py-6 text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={onComplete}
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-navy-800"
                >
                  Skip for now
                </Button>
              </div>
            ) : (
              <Button 
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold py-6 text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200"
              >
                Continue
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
