import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Package, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { StatCard, StatusBadge, LoadingSpinner } from '../components/ui';
import { RevenueBarChart, OrderStatusPieChart } from '../components/charts';
import { formatCurrency, formatDate } from '../utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((r) => setData(r.data.dashboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const { stats = {}, ordersByStatus = {}, monthlySales = [], recentOrders = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} title="Total Orders" value={stats.totalOrders} color="green" />
        <StatCard icon={TrendingUp} title="Total Revenue" value={stats.totalRevenue} prefix="₹" color="gold" />
        <StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard icon={Package} title="Active Products" value={stats.totalProducts} color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-gray-900">Monthly Revenue</h2>
            <span className="text-xs text-gray-400 font-medium">Last {monthlySales.length} months</span>
          </div>
          <RevenueBarChart data={monthlySales} />
          <div className="flex gap-4 mt-3 justify-end">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-green-700" />
              <span className="text-xs text-gray-500">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-green-200" />
              <span className="text-xs text-gray-500">Orders</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Orders by Status</h2>
          <OrderStatusPieChart data={ordersByStatus} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-gray-900">Recent Orders</h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-sm text-green-700 hover:text-green-900 font-semibold flex items-center gap-1"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Order ID</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Payment</th>
                <th className="table-header">Status</th>
                <th className="table-header">Date</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">No recent orders</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell font-mono text-xs text-gray-500">#{String(order._id).slice(-8).toUpperCase()}</td>
                  <td className="table-cell font-medium">{order.user?.name || '—'}</td>
                  <td className="table-cell font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                  <td className="table-cell">
                    <span className="capitalize text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="table-cell"><StatusBadge status={order.status} /></td>
                  <td className="table-cell text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
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
      </div>
    </div>
  );
}
