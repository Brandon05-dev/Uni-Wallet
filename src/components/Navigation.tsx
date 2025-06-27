
interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'send', label: 'Send', icon: '💸' },
    { id: 'bills', label: 'Pay', icon: '📄' },
    { id: 'savings', label: 'Save', icon: '💰' },
    { id: 'offers', label: 'Offers', icon: '🎁' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                currentPage === item.id
                  ? 'text-mint-600 bg-mint-50'
                  : 'text-gray-500 hover:text-mint-500'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
