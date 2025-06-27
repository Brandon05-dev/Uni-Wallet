
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';

const TopUp = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mpesa');

  const quickAmounts = [100, 500, 1000, 2000];

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-mint-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <ArrowLeft className="w-6 h-6 text-navy-600 mr-3" />
        <h1 className="text-2xl font-bold text-navy-800">Top Up Wallet</h1>
      </div>

      {/* Current Balance */}
      <Card className="mb-6 bg-gradient-to-r from-navy-600 to-navy-700 border-0 text-white">
        <CardContent className="p-6 text-center">
          <p className="text-navy-200 mb-1">Current Balance</p>
          <h2 className="text-3xl font-bold">KSh 2,540.50</h2>
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
              KSh <input
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
      <Button className="w-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg">
        Top Up KSh {amount || '0'}
      </Button>

      {/* Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Free top-ups:</strong> No fees for M-Pesa transactions above KSh 100
        </p>
      </div>
    </div>
  );
};

export default TopUp;
