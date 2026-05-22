import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Leaf, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/users', icon: Users, label: 'Users' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-green-900 z-40 flex flex-col
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Brand */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-green-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-green-700 rounded-lg p-1.5">
              <Leaf size={18} className="text-yellow-400" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">Sheela Herbal</p>
              <p className="text-green-400 text-[10px] font-medium tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-green-400 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-green-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-green-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-green-300 hover:text-white hover:bg-red-900/40 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
