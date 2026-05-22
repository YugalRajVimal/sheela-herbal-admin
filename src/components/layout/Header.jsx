import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/products/new': 'New Product',
  '/orders': 'Orders',
  '/users': 'Users',
};

export default function Header({ onMenuClick }) {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (PAGE_TITLES[path]) return PAGE_TITLES[path];
    if (path.includes('/products/') && path.includes('/edit')) return 'Edit Product';
    if (path.includes('/orders/')) return 'Order Detail';
    if (path.includes('/users/')) return 'User Detail';
    return 'Admin';
  };

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display font-semibold text-lg text-gray-900">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
