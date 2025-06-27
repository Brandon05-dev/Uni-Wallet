
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Gift, Clock, Star, MapPin } from 'lucide-react';

const Offers = () => {
  const [activeTab, setActiveTab] = useState('all');

  const offers = [
    {
      id: 1,
      title: '20% Off at Cafe Java',
      description: 'Get 20% off your entire order',
      discount: '20%',
      validUntil: 'Friday',
      location: 'Student Center',
      category: 'food',
      cashback: 50,
      image: '☕',
      claimed: false
    },
    {
      id: 2,
      title: 'Free Printing (10 pages)',
      description: 'Free black & white printing for new users',
      discount: 'FREE',
      validUntil: '2 days',
      location: 'Library',
      category: 'academic',
      cashback: 25,
      image: '🖨️',
      claimed: false
    },
    {
      id: 3,
      title: 'Buy 1 Get 1 Pizza',
      description: 'BOGO offer on medium pizzas',
      discount: 'BOGO',
      validUntil: 'This weekend',
      location: 'Campus Plaza',
      category: 'food',
      cashback: 100,
      image: '🍕',
      claimed: true
    },
    {
      id: 4,
      title: '15% Cashback on Laundry',
      description: 'Earn cashback on all laundry services',
      discount: '15%',
      validUntil: '1 week',
      location: 'Hostel Block A',
      category: 'services',
      cashback: 30,
      image: '👕',
      claimed: false
    },
  ];

  const filteredOffers = offers.filter(offer => 
    activeTab === 'all' || offer.category === activeTab
  );

  const tabs = [
    { id: 'all', label: 'All Offers', icon: '🎁' },
    { id: 'food', label: 'Food', icon: '🍔' },
    { id: 'academic', label: 'Academic', icon: '📚' },
    { id: 'services', label: 'Services', icon: '⚡' },
  ];

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-gold-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <ArrowLeft className="w-6 h-6 text-navy-600 mr-3" />
        <h1 className="text-2xl font-bold text-navy-800">Offers & Rewards</h1>
      </div>

      {/* Rewards Summary */}
      <Card className="mb-6 bg-gradient-to-r from-gold-400 to-gold-500 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Star className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Reward Points</h2>
              </div>
              <p className="text-3xl font-bold">1,250</p>
              <p className="text-gold-100 text-sm">= KSh 125 cashback</p>
            </div>
            <div className="text-right">
              <Gift className="w-12 h-12 mb-2 opacity-80" />
              <p className="text-sm">Level 2 Member</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gold-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className={`border-0 shadow-md ${offer.claimed ? 'opacity-75' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{offer.image}</div>
                  <div>
                    <h3 className="font-bold text-navy-800 mb-1">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {offer.location}
                      <Clock className="w-3 h-3 ml-3 mr-1" />
                      Valid until {offer.validUntil}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={offer.claimed ? "secondary" : "default"}
                  className={`${
                    offer.claimed 
                      ? 'bg-gray-200 text-gray-600' 
                      : 'bg-gold-500 text-white'
                  } font-bold`}
                >
                  {offer.discount}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-mint-600">
                  <Star className="w-4 h-4 mr-1" />
                  Earn {offer.cashback} points
                </div>
                <Button 
                  size="sm" 
                  disabled={offer.claimed}
                  className={`${
                    offer.claimed 
                      ? 'bg-gray-300 text-gray-500' 
                      : 'bg-gold-500 hover:bg-gold-600 text-white'
                  }`}
                >
                  {offer.claimed ? 'Claimed' : 'Claim Offer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral Bonus */}
      <Card className="mt-6 border-2 border-dashed border-mint-300 bg-mint-50">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="font-bold text-navy-800 mb-2">Refer Friends & Earn</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get KSh 100 for every friend who joins Campus Wallet
          </p>
          <Button className="bg-mint-500 hover:bg-mint-600 text-white">
            Share Referral Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Offers;
