
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, QrCode, Printer, Wifi, Coffee, Car } from 'lucide-react';

const BillPayments = () => {
  const [selectedService, setSelectedService] = useState('');
  const [amount, setAmount] = useState('');

  const services = [
    { id: 'printing', name: 'Printing Services', icon: Printer, color: 'bg-blue-100 text-blue-600' },
    { id: 'laundry', name: 'Laundry', icon: Car, color: 'bg-purple-100 text-purple-600' },
    { id: 'wifi', name: 'Wi-Fi Top-up', icon: Wifi, color: 'bg-green-100 text-green-600' },
    { id: 'cafeteria', name: 'Cafeteria', icon: Coffee, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-mint-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <ArrowLeft className="w-6 h-6 text-navy-600 mr-3" />
        <h1 className="text-2xl font-bold text-navy-800">Pay Bills</h1>
      </div>

      {/* QR Code Scanner */}
      <Card className="mb-6 border-2 border-dashed border-mint-300 bg-mint-50">
        <CardContent className="p-6 text-center">
          <QrCode className="w-12 h-12 text-mint-600 mx-auto mb-3" />
          <h3 className="font-semibold text-navy-800 mb-2">Scan to Pay</h3>
          <p className="text-sm text-gray-600 mb-4">
            Scan QR codes at campus vendors for instant payments
          </p>
          <Button className="bg-mint-500 hover:bg-mint-600 text-white">
            Open Scanner
          </Button>
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">Campus Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedService === service.id
                      ? 'border-mint-500 bg-mint-50'
                      : 'border-gray-200 bg-white hover:border-mint-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mx-auto mb-2`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-navy-800 text-sm">{service.name}</h3>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Amount Input */}
      {selectedService && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-navy-800">Amount to Pay</CardTitle>
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
            
            <div className="space-y-3">
              <Input
                placeholder="Service details (optional)"
                className="text-center"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Bills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { service: 'Print Shop', amount: 75, time: '2 days ago', status: 'completed' },
              { service: 'Campus Laundry', amount: 150, time: '5 days ago', status: 'completed' },
              { service: 'Wi-Fi Bundle', amount: 200, time: '1 week ago', status: 'completed' },
            ].map((bill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-navy-800">{bill.service}</p>
                  <p className="text-sm text-gray-600">{bill.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-navy-800">KSh {bill.amount}</p>
                  <p className="text-xs text-green-600">✓ Paid</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pay Button */}
      {selectedService && amount && (
        <div className="fixed bottom-20 left-0 right-0 p-4">
          <Button className="w-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg">
            Pay KSh {amount}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BillPayments;
