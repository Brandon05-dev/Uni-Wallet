
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Plus, Send, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard = ({ onPageChange }: DashboardProps) => {
  const [showBalance, setShowBalance] = useState(true);
  const { user, signOut } = useAuth();
  const { wallet, transactions, loading } = useWallet();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionIcon = (type: string, fromUserId?: string) => {
    if (type === 'topup') return <ArrowDownRight className="w-4 h-4 text-green-600" />;
    if (type === 'payment') return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    if (type === 'transfer') {
      return fromUserId === user?.id 
        ? <ArrowUpRight className="w-4 h-4 text-red-600" />
        : <ArrowDownRight className="w-4 h-4 text-green-600" />;
    }
    return <Wallet className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="p-4 min-h-screen bg-gradient-to-b from-mint-50 to-white">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-mint-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">
            Good morning! 👋
          </h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          onClick={signOut}
          className="text-gray-600 hover:text-navy-800"
        >
          Sign Out
        </Button>
      </div>

      {/* Wallet Balance Card */}
      <Card className="mb-6 bg-gradient-to-r from-navy-600 to-navy-700 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-navy-200 text-sm">Total Balance</p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">
                  {showBalance ? formatAmount(wallet?.balance || 0) : '••••••'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-navy-500"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-navy-200 text-sm">Wallet ID</p>
              <p className="text-sm font-mono">{wallet?.wallet_id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => onPageChange('topup')}
              className="bg-mint-500 hover:bg-mint-600 text-white flex flex-col items-center gap-1 py-4"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">Top Up</span>
            </Button>
            <Button
              onClick={() => onPageChange('send')}
              className="bg-white/20 hover:bg-white/30 text-white flex flex-col items-center gap-1 py-4"
            >
              <Send className="w-5 h-5" />
              <span className="text-xs">Send</span>
            </Button>
            <Button
              onClick={() => onPageChange('bills')}
              className="bg-white/20 hover:bg-white/30 text-white flex flex-col items-center gap-1 py-4"
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Pay Bills</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onPageChange('savings')}>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-semibold text-navy-800">Save Money</h3>
            <p className="text-sm text-gray-600">Set savings goals</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onPageChange('offers')}>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="font-semibold text-navy-800">Offers & Deals</h3>
            <p className="text-sm text-gray-600">Save with discounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start by topping up your wallet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.transaction_type, transaction.from_user_id)}
                    <div>
                      <p className="font-medium text-navy-800">
                        {transaction.description || transaction.transaction_type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.from_user_id === user?.id ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.from_user_id === user?.id ? '-' : '+'}{formatAmount(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
