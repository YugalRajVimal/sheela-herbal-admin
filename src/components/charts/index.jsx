import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Tooltip as PieTooltip
} from 'recharts';
import { formatCurrency } from '../../utils';

const COLORS = {
  pending: '#fbbf24',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#6366f1',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3">
        <p className="text-xs font-bold text-gray-600 mb-1">{label}</p>
        <p className="text-sm font-semibold text-green-700">{formatCurrency(payload[0].value)}</p>
        <p className="text-xs text-gray-500">{payload[1]?.value} orders</p>
      </div>
    );
  }
  return null;
};

export function RevenueBarChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Outfit' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Outfit' }}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Bar dataKey="revenue" fill="#15803d" radius={[6, 6, 0, 0]} />
        <Bar dataKey="orders" fill="#86efac" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const CustomPieLabel = ({ cx, cy, midAngle, outerRadius, value, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (value === 0) return null;
  return (
    <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontFamily="Outfit">
      {value}
    </text>
  );
};

export function OrderStatusPieChart({ data = {} }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={CustomPieLabel}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#94a3b8'} />
          ))}
        </Pie>
        <Legend
          formatter={(value) => <span style={{ fontSize: 11, fontFamily: 'Outfit', color: '#6b7280', textTransform: 'capitalize' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
