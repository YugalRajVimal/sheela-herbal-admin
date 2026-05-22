import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { SearchBar, StatusBadge, Pagination, LoadingSpinner, EmptyState, TableSkeleton } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils';
import { useDebounce, usePagination } from '../../hooks';

const STATUSES = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_METHODS = ['', 'cod', 'razorpay', 'upi'];

export default function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const { page, goToPage, resetPage } = usePagination();
  const debouncedSearch = useDebounce(search);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;
      if (paymentMethod) params.paymentMethod = paymentMethod;
      const { data } = await api.get('/admin/orders', { params });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { resetPage(); }, [debouncedSearch, status, paymentMethod]);
  useEffect(() => { fetchOrders(); }, [page, debouncedSearch, status, paymentMethod]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customer..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input w-40">
          <option value="">All Status</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="form-input w-40">
          <option value="">All Payments</option>
          {PAYMENT_METHODS.filter(Boolean).map((m) => (
            <option key={m} value={m} className="uppercase">{m.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-500 font-medium">{total} order{total !== 1 ? 's' : ''}</div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Order ID</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Items</th>
                <th className="table-header">Total</th>
                <th className="table-header">Payment</th>
                <th className="table-header">Paid</th>
                <th className="table-header">Status</th>
                <th className="table-header">Date</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9}><TableSkeleton rows={8} cols={9} /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="No orders found" /></td></tr>
              ) : orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell font-mono text-xs text-gray-500">#{String(o._id).slice(-8).toUpperCase()}</td>
                  <td className="table-cell">
                    <div>
                      <p className="font-semibold text-sm">{o.user?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{o.user?.email}</p>
                    </div>
                  </td>
                  <td className="table-cell text-center">{o.items?.length || 0}</td>
                  <td className="table-cell font-semibold">{formatCurrency(o.totalAmount)}</td>
                  <td className="table-cell">
                    <span className="uppercase text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-mono">{o.paymentMethod}</span>
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={o.isPaid ? 'paid' : 'unpaid'} />
                  </td>
                  <td className="table-cell"><StatusBadge status={o.status} /></td>
                  <td className="table-cell text-xs text-gray-500">{formatDate(o.createdAt)}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => navigate(`/orders/${o._id}`)}
                      className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-700 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination page={page} pages={pages} onPageChange={goToPage} />
        </div>
      </div>
    </div>
  );
}
