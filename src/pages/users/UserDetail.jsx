import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, ShieldOff, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { StatusBadge, ConfirmModal, LoadingSpinner } from '../../components/ui';
import { formatCurrency, formatDate, formatDateShort } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(({ data }) => {
        setUser(data.user);
        setOrders(data.orders || []);
      })
      .catch(() => toast.error('Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRoleChange = async () => {
    setUpdating(true);
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const { data } = await api.patch(`/admin/users/${id}/role`, { role: newRole });
      setUser(data.user);
      toast.success(`Role updated to ${newRole}`);
      setShowRoleModal(false);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      navigate('/users');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <div className="text-center py-20 text-gray-500">User not found</div>;

  const isSelf = me?._id === id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/users')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display font-bold text-2xl text-gray-900">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card space-y-5">
          <div className="text-center pt-2">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-800 font-bold text-2xl mx-auto mb-3">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="font-semibold text-lg text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
            {user.phone && <p className="text-sm text-gray-500 mt-1">{user.phone}</p>}
            <div className="mt-2"><StatusBadge status={user.role} /></div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Orders</span>
              <span className="font-semibold">{user.orderCount || orders.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Spent</span>
              <span className="font-semibold text-green-700">{formatCurrency(user.totalSpent || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Joined</span>
              <span className="font-semibold">{formatDateShort(user.createdAt)}</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            {!isSelf && (
              <button
                onClick={() => setShowRoleModal(true)}
                className={`w-full py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  user.role === 'admin'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                {user.role === 'admin' ? <><ShieldOff size={15} /> Demote to User</> : <><Shield size={15} /> Promote to Admin</>}
              </button>
            )}
            {!isSelf && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-all"
              >
                <Trash2 size={15} /> Delete User
              </button>
            )}
            {isSelf && <p className="text-xs text-center text-gray-400">You cannot modify your own account here</p>}
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          </div>
          {orders.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No orders yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Order ID</th>
                  <th className="table-header">Items</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Date</th>
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell font-mono text-xs text-gray-500">#{String(o._id).slice(-8).toUpperCase()}</td>
                    <td className="table-cell text-center">{o.items?.length || 0}</td>
                    <td className="table-cell font-semibold">{formatCurrency(o.totalAmount)}</td>
                    <td className="table-cell"><StatusBadge status={o.status} /></td>
                    <td className="table-cell text-xs text-gray-500">{formatDateShort(o.createdAt)}</td>
                    <td className="table-cell">
                      <button onClick={() => navigate(`/orders/${o._id}`)} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-700 transition-colors">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete User"
          message={`Permanently delete "${user.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showRoleModal && (
        <ConfirmModal
          title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
          message={user.role === 'admin'
            ? `Remove admin privileges from ${user.name}?`
            : `Grant admin privileges to ${user.name}? They will have full access to this panel.`
          }
          onConfirm={handleRoleChange}
          onCancel={() => setShowRoleModal(false)}
          danger={false}
        />
      )}
    </div>
  );
}
