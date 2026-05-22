import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { SearchBar, StatusBadge, Pagination, ConfirmModal, LoadingSpinner, EmptyState, TableSkeleton } from '../../components/ui';
import { formatCurrency } from '../../utils';
import { useDebounce, usePagination } from '../../hooks';
import { Package } from 'lucide-react';

const CATEGORIES = ['', 'Oil', 'Capsule'];

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { page, goToPage, resetPage } = usePagination();
  const debouncedSearch = useDebounce(search);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      if (isActive !== '') params.isActive = isActive;
      const { data } = await api.get('/admin/products', { params });
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { resetPage(); }, [debouncedSearch, category, isActive]);
  useEffect(() => { fetchProducts(); }, [page, debouncedSearch, category, isActive]);

  const handleToggle = async (id, current) => {
    const prev = [...products];
    setProducts(products.map((p) => p._id === id ? { ...p, isActive: !current } : p));
    try {
      await api.patch(`/admin/products/${id}/toggle`);
      toast.success(`Product ${!current ? 'activated' : 'deactivated'}`);
    } catch {
      setProducts(prev);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/products/${deleteId}`);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input w-36"
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className="form-input w-36"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <button onClick={() => navigate('/products/new')} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="text-sm text-gray-500 font-medium">{total} product{total !== 1 ? 's' : ''}</div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Product</th>
                <th className="table-header">Category</th>
                <th className="table-header">Price</th>
                <th className="table-header">Original</th>
                <th className="table-header">Rating</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><TableSkeleton rows={8} cols={7} /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="No products found" icon={Package} /></td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="bg-green-50 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                  </td>
                  <td className="table-cell font-semibold text-gray-900">{formatCurrency(p.price)}</td>
                  <td className="table-cell text-gray-400 line-through text-sm">{p.originalPrice ? formatCurrency(p.originalPrice) : '—'}</td>
                  <td className="table-cell">
                    <span className="flex items-center gap-1 text-sm">
                      <Star size={13} className="text-yellow-500 fill-yellow-500" />
                      {p.rating?.toFixed(1) || '—'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => handleToggle(p._id, p.isActive)}
                      className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      {p.isActive
                        ? <><ToggleRight size={22} className="text-green-600" /><span className="text-green-700">Active</span></>
                        : <><ToggleLeft size={22} className="text-gray-400" /><span className="text-gray-500">Inactive</span></>
                      }
                    </button>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/products/${p._id}/edit`)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-700 transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(p._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
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
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
