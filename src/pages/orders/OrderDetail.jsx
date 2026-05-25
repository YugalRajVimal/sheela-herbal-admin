import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, CreditCard, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { StatusBadge, LoadingSpinner } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [togglingPaid, setTogglingPaid] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/admin/orders/${id}`);
      setOrder(data.order);
      setNewStatus(data.order.status);
    } catch {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) { toast('Status unchanged'); return; }
    setUpdating(true);
    try {
      const { data } = await api.patch(`/admin/orders/${id}/status`, { status: newStatus, note });
      setOrder(data.order);
      setNote('');
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleTogglePaid = async () => {
    setTogglingPaid(true);
    try {
      const { data } = await api.patch(`/admin/orders/${id}/payment`, { isPaid: !order.isPaid });
      setOrder((o) => ({ ...o, isPaid: data.isPaid }));
      toast.success(`Marked as ${data.isPaid ? 'Paid' : 'Unpaid'}`);
    } catch {
      toast.error('Failed to update payment');
    } finally {
      setTogglingPaid(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/orders')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Order #{String(order._id).slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={order.status} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800">Order Items</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Product</th>
                  <th className="table-header text-right">Price</th>
                  <th className="table-header text-right">Qty</th>
                  <th className="table-header text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={`${import.meta.env.VITE_UPLOAD_URL?.replace(/\/$/, '') || ''}/${item.image.replace(/^\//, '')}`}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                          />
                        )}
                  
                        <p className="font-medium text-sm">{item.name}</p>
                      </div>
                    </td>
                    <td className="table-cell text-right">{formatCurrency(item.price)}</td>
                    <td className="table-cell text-right">{item.quantity}</td>
                    <td className="table-cell text-right font-semibold">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span><span>{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span><span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">Order Timeline</h2>
            {order.tracking?.length ? (
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100" />
                {order.tracking.map((t, i) => {
                  const Icon = STATUS_ICONS[t.status] || Clock;
                  return (
                    <div key={i} className="relative mb-5 last:mb-0">
                      <div className="absolute -left-4 top-0.5 w-5 h-5 rounded-full bg-green-100 border-2 border-green-700 flex items-center justify-center">
                        <Icon size={10} className="text-green-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={t.status} />
                          <span className="text-xs text-gray-400">{formatDate(t.updatedAt)}</span>
                        </div>
                        {t.note && <p className="text-sm text-gray-500 mt-1">{t.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No tracking info available</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-green-700" />
              <h2 className="font-semibold text-gray-800">Customer</h2>
            </div>
            <p className="font-semibold text-gray-900">{order.user?.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{order.user?.email}</p>
            <p className="text-sm text-gray-500">{order.user?.phone}</p>
          </div>

          {/* Delivery Address */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-green-700" />
              <h2 className="font-semibold text-gray-800">Delivery Address</h2>
            </div>
            <p className="font-semibold text-gray-900">{order.address?.fullName}</p>
            <p className="text-sm text-gray-500">{order.address?.phone}</p>
            <p className="text-sm text-gray-500 mt-1">
              {order.address?.city}, {order.address?.state} — {order.address?.pincode}
            </p>
          </div>

          {/* Payment */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-green-700" />
              <h2 className="font-semibold text-gray-800">Payment</h2>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Method</span>
              <span className="uppercase text-xs font-mono bg-gray-100 px-2 py-0.5 rounded-full">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Status</span>
              <StatusBadge status={order.isPaid ? 'paid' : 'unpaid'} />
            </div>
            <button
              onClick={handleTogglePaid}
              disabled={togglingPaid}
              className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                order.isPaid
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              }`}
            >
              {togglingPaid ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : null}
              {order.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
            </button>
          </div>

          {/* Update Status */}
          <div className="card space-y-3">
            <h2 className="font-semibold text-gray-800">Update Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="form-input"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
              className="form-input"
              rows={2}
            />
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="btn-primary w-full justify-center"
            >
              {updating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
