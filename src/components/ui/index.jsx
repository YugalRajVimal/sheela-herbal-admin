// StatCard
export function StatCard({ icon: Icon, title, value, trend, color = 'green', prefix = '' }) {
  const colors = {
    green: 'bg-green-50 text-green-700',
    gold: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <div className="card flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
        {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>}
      </div>
    </div>
  );
}

// StatusBadge
const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  admin: 'bg-purple-100 text-purple-800 border-purple-200',
  user: 'bg-gray-100 text-gray-700 border-gray-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  unpaid: 'bg-red-100 text-red-800 border-red-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-500 border-gray-200',
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} capitalize`}>
      {status}
    </span>
  );
}

// Pagination
export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const pageNums = Array.from({ length: Math.min(pages, 7) }, (_, i) => {
    if (pages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= pages - 3) return pages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center gap-1 justify-end mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
      >
        ←
      </button>
      {pageNums.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            n === page
              ? 'bg-green-700 text-white'
              : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
      >
        →
      </button>
    </div>
  );
}

// SearchBar
import { Search } from 'lucide-react';
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input pl-9 w-64"
      />
    </div>
  );
}

// ConfirmModal
export function ConfirmModal({ title, message, onConfirm, onCancel, danger = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{message}</p>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button
            onClick={onConfirm}
            className={danger ? 'btn-danger' : 'btn-primary'}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// LoadingSpinner
export function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  return <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}

// EmptyState
import { Inbox } from 'lucide-react';
export function EmptyState({ message = 'No data found', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
      <Icon size={40} strokeWidth={1.5} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// TableSkeleton
export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3.5 border-b border-gray-50">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-gray-100 rounded flex-1" style={{ flex: j === 0 ? 2 : 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}
