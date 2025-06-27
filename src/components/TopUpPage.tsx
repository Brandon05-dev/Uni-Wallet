
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/components/ui/use-toast';

interface TopUpPageProps {
  onBack: () => void;
}

const TopUpPage = ({ onBack }: TopUpPageProps) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const { wallet, createTransaction } = useWallet();
  const { toast } = useToast();

  const quickAmounts = [100, 500, 1000, 2000];

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to top up.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await createTransaction(
        parseFloat(amount),
        'topup',
        `Wallet top-up via ${method.toUpperCase()}`
      );

      if (result?.error) {
        toast({
          title: "Top-up Failed",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Top-up Successful!",
          description: `Your wallet has been topped up with KSh ${amount}`,
        });
        setAmount('');
        onBack();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process top-up. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-mint-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-3 text-navy-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold text-navy-800">Top Up Wallet</h1>
      </div>

      {/* Current Balance */}
      <Card className="mb-6 bg-gradient-to-r from-navy-600 to-navy-700 border-0 text-white">
        <CardContent className="p-6 text-center">
          <p className="text-navy-200 mb-1">Current Balance</p>
          <h2 className="text-3xl font-bold">{formatAmount(wallet?.balance || 0)}</h2>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <button
              onClick={() => setMethod('mpesa')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                method === 'mpesa'
                  ? 'border-mint-500 bg-mint-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center">
                <Smartphone className="w-8 h-8 text-green-600 mr-3" />
                <div className="text-left">
                  <h3 className="font-semibold text-navy-800">M-Pesa</h3>
                  <p className="text-sm text-gray-600">Pay with your mobile money</p>
                </div>
                {method === 'mpesa' && (
                  <div className="ml-auto w-5 h-5 bg-mint-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => setMethod('card')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                method === 'card'
                  ? 'border-mint-500 bg-mint-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
                <div className="text-left">
                  <h3 className="font-semibold text-navy-800">Debit/Credit Card</h3>
                  <p className="text-sm text-gray-600">Link your bank card</p>
                </div>
                {method === 'card' && (
                  <div className="ml-auto w-5 h-5 bg-mint-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Amount Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">Top Up Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-navy-800 mb-4">
              KSh <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="inline-block w-32 text-center border-none bg-transparent text-3xl font-bold focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                onClick={() => setAmount(quickAmount.toString())}
                className="py-3 text-mint-600 border-mint-300 hover:bg-mint-50"
              >
                KSh {quickAmount.toLocaleString()}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Up Button */}
      <Button 
        onClick={handleTopUp}
        disabled={loading || !amount}
        className="w-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg"
      >
        {loading ? 'Processing...' : `Top Up KSh ${amount || '0'}`}
      </Button>

      {/* Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Demo Mode:</strong> This is a demonstration. In production, this would integrate with real payment gateways.
        </p>
      </div>
    </div>
  );
};

export default TopUpPage;
