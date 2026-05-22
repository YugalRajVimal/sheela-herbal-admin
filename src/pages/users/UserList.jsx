import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { SearchBar, StatusBadge, Pagination, ConfirmModal, LoadingSpinner, EmptyState, TableSkeleton } from '../../components/ui';
import { formatCurrency, formatDateShort } from '../../utils';
import { useDebounce, usePagination } from '../../hooks';
import { useAuth } from '../../context/AuthContext';

export default function UserList() {
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const { page, goToPage, resetPage } = usePagination();
  const debouncedSearch = useDebounce(search);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (role) params.role = role;
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { resetPage(); }, [debouncedSearch, role]);
  useEffect(() => { fetchUsers(); }, [page, debouncedSearch, role]);

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${deleteId}`);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input w-36">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="text-sm text-gray-500 font-medium">{total} user{total !== 1 ? 's' : ''}</div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">User</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Role</th>
                <th className="table-header text-right">Orders</th>
                <th className="table-header text-right">Total Spent</th>
                <th className="table-header">Joined</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><TableSkeleton rows={8} cols={7} /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="No users found" /></td></tr>
              ) : users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold text-sm shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-sm">{u.phone || '—'}</td>
                  <td className="table-cell"><StatusBadge status={u.role} /></td>
                  <td className="table-cell text-right">{u.orderCount || 0}</td>
                  <td className="table-cell text-right font-semibold">{formatCurrency(u.totalSpent || 0)}</td>
                  <td className="table-cell text-xs text-gray-500">{formatDateShort(u.createdAt)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/users/${u._id}`)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-700 transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      {u._id !== me?._id && (
                        <button
                          onClick={() => setDeleteId(u._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
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

      {deleteId && (
        <ConfirmModal
          title="Delete User"
          message="Are you sure? This will permanently delete the user account."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onSuccess={fetchUsers} />}
    </div>
  );
}

function CreateUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = 'Name required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password min 6 chars';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 className="font-display font-bold text-lg mb-5">Create New User</h3>
        <div className="space-y-4">
          {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'text'], ['password', 'Password', 'password']].map(([k, label, type]) => (
            <div key={k}>
              <label className="form-label">{label}</label>
              <input type={type} className={`form-input ${errors[k] ? 'border-red-400' : ''}`}
                value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
            </div>
          ))}
          <div>
            <label className="form-label">Role</label>
            <select className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}
