
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Send } from 'lucide-react';

const SendMoney = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [splitMode, setSplitMode] = useState(false);

  const quickAmounts = [50, 100, 200, 500];
  const recentContacts = [
    { name: 'Sarah M.', phone: '+254712345678', avatar: 'S' },
    { name: 'John K.', phone: '+254723456789', avatar: 'J' },
    { name: 'Mary W.', phone: '+254734567890', avatar: 'M' },
  ];

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-mint-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <ArrowLeft className="w-6 h-6 text-navy-600 mr-3" />
        <h1 className="text-2xl font-bold text-navy-800">Send Money</h1>
      </div>

      {/* Mode Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setSplitMode(false)}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            !splitMode ? 'bg-white text-mint-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          <Send className="w-4 h-4 inline mr-2" />
          Send Money
        </button>
        <button
          onClick={() => setSplitMode(true)}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            splitMode ? 'bg-white text-mint-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Split Bill
        </button>
      </div>

      {/* Amount Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-navy-800 mb-2">
              KSh <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="inline-block w-32 text-center border-none bg-transparent text-3xl font-bold focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                onClick={() => setAmount(quickAmount.toString())}
                className="py-2 text-mint-600 border-mint-300 hover:bg-mint-50"
              >
                {quickAmount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recipient */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">
            {splitMode ? 'Split With' : 'Send To'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Phone Number</Label>
              <Input
                id="recipient"
                type="tel"
                placeholder="+254712345678"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Recent Contacts</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {recentContacts.map((contact, index) => (
                  <button
                    key={index}
                    onClick={() => setRecipient(contact.phone)}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-mint-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {contact.avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-navy-800">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Label htmlFor="note">Add a note (optional)</Label>
          <Input
            id="note"
            placeholder="What's this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1"
          />
        </CardContent>
      </Card>

      {/* Send Button */}
      <Button className="w-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg">
        {splitMode ? 'Split Bill' : 'Send Money'}
      </Button>
    </div>
  );
};

export default SendMoney;
