
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Target, TrendingUp, PiggyBank } from 'lucide-react';

const Savings = () => {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');

  const savingsGoals = [
    { id: 1, name: 'New Headphones', target: 5000, current: 3200, color: 'mint' },
    { id: 2, name: 'Semester Books', target: 8000, current: 4500, color: 'gold' },
    { id: 3, name: 'Emergency Fund', target: 10000, current: 1800, color: 'navy' },
  ];

  const getProgress = (current: number, target: number) => (current / target) * 100;

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-mint-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <ArrowLeft className="w-6 h-6 text-navy-600 mr-3" />
        <h1 className="text-2xl font-bold text-navy-800">Savings</h1>
      </div>

      {/* Total Savings */}
      <Card className="mb-6 bg-gradient-to-r from-mint-500 to-mint-600 border-0 text-white">
        <CardContent className="p-6 text-center">
          <PiggyBank className="w-12 h-12 mx-auto mb-3 text-white" />
          <p className="text-mint-100 mb-1">Total Saved</p>
          <h2 className="text-3xl font-bold">KSh 9,500</h2>
          <p className="text-mint-100 text-sm mt-2">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +12% this month
          </p>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-navy-800 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Savings Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savingsGoals.map((goal) => (
            <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-navy-800">{goal.name}</h3>
                <span className="text-sm text-gray-600">
                  {Math.round(getProgress(goal.current, goal.target))}%
                </span>
              </div>
              <Progress 
                value={getProgress(goal.current, goal.target)} 
                className="mb-2"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">KSh {goal.current.toLocaleString()}</span>
                <span className="text-gray-600">KSh {goal.target.toLocaleString()}</span>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" className="bg-mint-500 hover:bg-mint-600 text-white flex-1">
                  Add Money
                </Button>
                <Button size="sm" variant="outline" className="text-mint-600 border-mint-300">
                  Withdraw
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Create New Goal */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">Create New Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Goal name (e.g., New Laptop)"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Target amount (KSh)"
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(e.target.value)}
          />
          <Button className="w-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white">
            Create Goal
          </Button>
        </CardContent>
      </Card>

      {/* Spending Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-navy-800">This Week's Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { category: 'Food & Drinks', amount: 450, percentage: 35 },
              { category: 'Transport', amount: 200, percentage: 15 },
              { category: 'Academic', amount: 300, percentage: 25 },
              { category: 'Entertainment', amount: 150, percentage: 12 },
              { category: 'Others', amount: 180, percentage: 13 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-navy-800">{item.category}</span>
                    <span className="text-sm text-gray-600">KSh {item.amount}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-mint-50 rounded-lg">
            <p className="text-sm text-mint-700">
              💡 <strong>Tip:</strong> You're spending 15% less on food this week! Keep it up to reach your savings goals faster.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Savings;
