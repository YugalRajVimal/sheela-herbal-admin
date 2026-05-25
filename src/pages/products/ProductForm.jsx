// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Plus, Trash2, ArrowLeft, Save, Loader } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../../api/axios';
// import { generateSlug } from '../../utils';

// const EMPTY_FORM = {
//   name: '', slug: '', category: 'Oil', price: '', originalPrice: '',
//   tagline: '', badge: '', usage: '',
//   shortDescription: '', description: '',
//   rating: '', reviewCount: '',
//   isActive: true,
//   benefits: [''],
//   ingredients: [{ name: '', desc: '' }],
//   images: [''],
// };

// export default function ProductForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(isEdit);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (!isEdit) return;
//     api.get(`/admin/products/${id}`)
//       .then(({ data }) => {
//         const p = data.product;
//         setForm({
//           name: p.name || '',
//           slug: p.slug || '',
//           category: p.category || 'Oil',
//           price: p.price || '',
//           originalPrice: p.originalPrice || '',
//           tagline: p.tagline || '',
//           badge: p.badge || '',
//           usage: p.usage || '',
//           shortDescription: p.shortDescription || '',
//           description: p.description || '',
//           rating: p.rating || '',
//           reviewCount: p.reviewCount || '',
//           isActive: p.isActive !== false,
//           benefits: p.benefits?.length ? p.benefits : [''],
//           ingredients: p.ingredients?.length ? p.ingredients : [{ name: '', desc: '' }],
//           images: p.images?.length ? p.images : [''],
//         });
//       })
//       .catch(() => toast.error('Failed to load product'))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

//   const handleNameChange = (val) => {
//     setForm((f) => ({ ...f, name: val, slug: generateSlug(val) }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name || form.name.length < 2) e.name = 'Name required (min 2 chars)';
//     if (!form.slug || !/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Slug: lowercase letters, numbers, hyphens only';
//     if (!form.price || Number(form.price) <= 0) e.price = 'Price must be a positive number';
//     if (!form.category) e.category = 'Category is required';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     setSaving(true);
//     const payload = {
//       ...form,
//       price: Number(form.price),
//       originalPrice: Number(form.originalPrice) || undefined,
//       rating: Number(form.rating) || undefined,
//       reviewCount: Number(form.reviewCount) || undefined,
//       benefits: form.benefits.filter(Boolean),
//       ingredients: form.ingredients.filter((i) => i.name),
//       images: form.images.filter(Boolean),
//     };
//     try {
//       if (isEdit) {
//         await api.put(`/admin/products/${id}`, payload);
//         toast.success('Product updated successfully');
//       } else {
//         await api.post('/admin/products', payload);
//         toast.success('Product created successfully');
//       }
//       navigate('/products');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Save failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Dynamic list helpers
//   const addBenefit = () => set('benefits', [...form.benefits, '']);
//   const removeBenefit = (i) => set('benefits', form.benefits.filter((_, idx) => idx !== i));
//   const updateBenefit = (i, val) => set('benefits', form.benefits.map((b, idx) => idx === i ? val : b));

//   const addIngredient = () => set('ingredients', [...form.ingredients, { name: '', desc: '' }]);
//   const removeIngredient = (i) => set('ingredients', form.ingredients.filter((_, idx) => idx !== i));
//   const updateIngredient = (i, key, val) =>
//     set('ingredients', form.ingredients.map((ing, idx) => idx === i ? { ...ing, [key]: val } : ing));

//   const addImage = () => set('images', [...form.images, '']);
//   const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));
//   const updateImage = (i, val) => set('images', form.images.map((img, idx) => idx === i ? val : img));

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <Loader size={28} className="animate-spin text-green-700" />
//     </div>
//   );

//   const Field = ({ label, error, children }) => (
//     <div>
//       <label className="form-label">{label}</label>
//       {children}
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div className="flex items-center gap-3">
//         <button onClick={() => navigate('/products')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
//           <ArrowLeft size={18} />
//         </button>
//         <h1 className="font-display font-bold text-2xl text-gray-900">{isEdit ? 'Edit Product' : 'New Product'}</h1>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main column */}
//         <div className="lg:col-span-2 space-y-5">
//           {/* Basic Info */}
//           <div className="card space-y-4">
//             <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Basic Information</h2>
//             <Field label="Product Name *" error={errors.name}>
//               <input className={`form-input ${errors.name ? 'border-red-400' : ''}`} value={form.name}
//                 onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Herbal Hair Oil" />
//             </Field>
//             <Field label="Slug *" error={errors.slug}>
//               <input className={`form-input font-mono text-sm ${errors.slug ? 'border-red-400' : ''}`}
//                 value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="herbal-hair-oil" />
//             </Field>
//             <Field label="Tagline">
//               <input className="form-input" value={form.tagline} onChange={(e) => set('tagline', e.target.value)}
//                 placeholder="Short catchy tagline" />
//             </Field>
//             <Field label="Short Description">
//               <textarea className="form-input" rows={2} value={form.shortDescription}
//                 onChange={(e) => set('shortDescription', e.target.value)} />
//             </Field>
//             <Field label="Full Description">
//               <textarea className="form-input" rows={5} value={form.description}
//                 onChange={(e) => set('description', e.target.value)} />
//             </Field>
//             <Field label="Usage Instructions">
//               <textarea className="form-input" rows={3} value={form.usage}
//                 onChange={(e) => set('usage', e.target.value)} />
//             </Field>
//           </div>

//           {/* Benefits */}
//           <div className="card space-y-3">
//             <div className="flex items-center justify-between border-b border-gray-100 pb-3">
//               <h2 className="font-semibold text-gray-800">Benefits</h2>
//               <button onClick={addBenefit} className="btn-secondary text-xs py-1 px-2.5">
//                 <Plus size={13} /> Add
//               </button>
//             </div>
//             {form.benefits.map((b, i) => (
//               <div key={i} className="flex gap-2">
//                 <input className="form-input flex-1" value={b} onChange={(e) => updateBenefit(i, e.target.value)}
//                   placeholder={`Benefit ${i + 1}`} />
//                 <button onClick={() => removeBenefit(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
//                   <Trash2 size={15} />
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Ingredients */}
//           <div className="card space-y-3">
//             <div className="flex items-center justify-between border-b border-gray-100 pb-3">
//               <h2 className="font-semibold text-gray-800">Ingredients</h2>
//               <button onClick={addIngredient} className="btn-secondary text-xs py-1 px-2.5">
//                 <Plus size={13} /> Add
//               </button>
//             </div>
//             {form.ingredients.map((ing, i) => (
//               <div key={i} className="flex gap-2 items-start">
//                 <div className="flex-1 grid grid-cols-2 gap-2">
//                   <input className="form-input" value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)}
//                     placeholder="Ingredient name" />
//                   <input className="form-input" value={ing.desc} onChange={(e) => updateIngredient(i, 'desc', e.target.value)}
//                     placeholder="Description" />
//                 </div>
//                 <button onClick={() => removeIngredient(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-0.5">
//                   <Trash2 size={15} />
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Images */}
//           <div className="card space-y-3">
//             <div className="flex items-center justify-between border-b border-gray-100 pb-3">
//               <h2 className="font-semibold text-gray-800">Image URLs</h2>
//               <button onClick={addImage} className="btn-secondary text-xs py-1 px-2.5">
//                 <Plus size={13} /> Add
//               </button>
//             </div>
//             {form.images.map((img, i) => (
//               <div key={i} className="flex gap-2 items-center">
//                 {img && <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" onError={(e) => e.target.style.display='none'} />}
//                 <input className="form-input flex-1" value={img} onChange={(e) => updateImage(i, e.target.value)}
//                   placeholder="https://example.com/image.jpg" />
//                 <button onClick={() => removeImage(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
//                   <Trash2 size={15} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Side column */}
//         <div className="space-y-5">
//           <div className="card space-y-4">
//             <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Pricing</h2>
//             <Field label="Selling Price (₹) *" error={errors.price}>
//               <input type="number" className={`form-input ${errors.price ? 'border-red-400' : ''}`}
//                 value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="499" min="0" />
//             </Field>
//             <Field label="Original Price (₹)">
//               <input type="number" className="form-input" value={form.originalPrice}
//                 onChange={(e) => set('originalPrice', e.target.value)} placeholder="699" min="0" />
//             </Field>
//           </div>

//           <div className="card space-y-4">
//             <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Details</h2>
//             <Field label="Category *" error={errors.category}>
//               <select className={`form-input ${errors.category ? 'border-red-400' : ''}`}
//                 value={form.category} onChange={(e) => set('category', e.target.value)}>
//                 <option value="Oil">Oil</option>
//                 <option value="Capsule">Capsule</option>
//               </select>
//             </Field>
//             <Field label="Badge">
//               <input className="form-input" value={form.badge} onChange={(e) => set('badge', e.target.value)}
//                 placeholder="Bestseller, New, etc." />
//             </Field>
//             <Field label="Rating">
//               <input type="number" className="form-input" value={form.rating}
//                 onChange={(e) => set('rating', e.target.value)} placeholder="4.5" min="0" max="5" step="0.1" />
//             </Field>
//             <Field label="Review Count">
//               <input type="number" className="form-input" value={form.reviewCount}
//                 onChange={(e) => set('reviewCount', e.target.value)} placeholder="120" min="0" />
//             </Field>
//             <Field label="Status">
//               <select className="form-input" value={form.isActive ? 'true' : 'false'}
//                 onChange={(e) => set('isActive', e.target.value === 'true')}>
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </Field>
//           </div>

//           <button onClick={handleSubmit} disabled={saving} className="btn-primary w-full justify-center py-3">
//             {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save size={16} /> {isEdit ? 'Update Product' : 'Create Product'}</>}
//           </button>
//           <button onClick={() => navigate('/products')} className="btn-secondary w-full justify-center py-3">
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Loader, ImagePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { generateSlug } from '../../utils';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const EMPTY_FORM = {
  name: '', slug: '', category: 'Oil', price: '', originalPrice: '',
  tagline: '', badge: '', usage: '',
  shortDescription: '', description: '',
  rating: '', reviewCount: '',
  isActive: true,
  benefits: [''],
  ingredients: [{ name: '', desc: '' }],
};

export default function ProductForm() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEdit    = Boolean(id);
  const fileRef   = useRef(null);

  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(isEdit);
  const [saving, setSaving]       = useState(false);

  // Existing image paths already stored in DB (edit mode)
  const [existingImages, setExistingImages] = useState([]);
  // New File objects chosen by the user (not yet saved)
  const [newFiles, setNewFiles]             = useState([]);
  // Preview URLs for newFiles (for display only)
  const [previews, setPreviews]             = useState([]);

  // ── Load product for edit ──────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/admin/products/${id}`)
      .then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name || '',
          slug: p.slug || '',
          category: p.category || 'Oil',
          price: p.price || '',
          originalPrice: p.originalPrice || '',
          tagline: p.tagline || '',
          badge: p.badge || '',
          usage: p.usage || '',
          shortDescription: p.shortDescription || '',
          description: p.description || '',
          rating: p.rating || '',
          reviewCount: p.reviewCount || '',
          isActive: p.isActive !== false,
          benefits: p.benefits?.length    ? p.benefits    : [''],
          ingredients: p.ingredients?.length ? p.ingredients : [{ name: '', desc: '' }],
        });
        setExistingImages(p.images || []);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Revoke object URLs when component unmounts or previews change ──
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleNameChange = (val) => {
    setForm((f) => ({ ...f, name: val, slug: generateSlug(val) }));
  };

  // ── File picker ────────────────────────────────────────────
  const handleFilePick = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    // Revoke old preview URLs before replacing
    previews.forEach((url) => URL.revokeObjectURL(url));

    setNewFiles(picked);
    setPreviews(picked.map((f) => URL.createObjectURL(f)));

    // Reset input so re-selecting the same file fires onChange again
    e.target.value = '';
  };

  const removeNewFile = (i) => {
    URL.revokeObjectURL(previews[i]);
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Remove an already-saved image (edit mode).
  // The image will be removed from DB on save (we simply don't include it).
  const removeExistingImage = (i) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ── Validation ─────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = 'Name required (min 2 chars)';
    if (!form.slug || !/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Slug: lowercase letters, numbers, hyphens only';
    if (!form.price || Number(form.price) <= 0) e.price = 'Price must be a positive number';
    if (!form.category) e.category = 'Category is required';

    // In create mode, at least one image is required
    if (!isEdit && newFiles.length === 0) e.images = 'Please upload at least one image';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      // Build FormData — backend expects multipart/form-data
      const fd = new FormData();

      // Scalar fields
      const scalar = [
        'name','slug','category','price','originalPrice',
        'tagline','badge','usage','shortDescription','description',
        'rating','reviewCount',
      ];
      scalar.forEach((k) => {
        if (form[k] !== '' && form[k] !== undefined) fd.append(k, form[k]);
      });
      fd.append('isActive', String(form.isActive));

      // Array fields as JSON strings (backend calls parseSafe)
      fd.append('benefits',    JSON.stringify(form.benefits.filter(Boolean)));
      fd.append('ingredients', JSON.stringify(form.ingredients.filter((i) => i.name)));

      // In edit mode, send which existing images to keep
      // (if the user removed some, they won't be in this list)
      if (isEdit) {
        fd.append('keepImages', JSON.stringify(existingImages));
      }

      // Attach new image files under the field name "images"
      newFiles.forEach((file) => fd.append('images', file));

      if (isEdit) {
        await api.put(`/admin/products/${id}`, fd); // axios sets Content-Type automatically
        toast.success('Product updated successfully');
      } else {
        await api.post('/admin/products', fd);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Dynamic list helpers ───────────────────────────────────
  const addBenefit     = () => set('benefits', [...form.benefits, '']);
  const removeBenefit  = (i) => set('benefits', form.benefits.filter((_, idx) => idx !== i));
  const updateBenefit  = (i, val) => set('benefits', form.benefits.map((b, idx) => idx === i ? val : b));

  const addIngredient    = () => set('ingredients', [...form.ingredients, { name: '', desc: '' }]);
  const removeIngredient = (i) => set('ingredients', form.ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i, key, val) =>
    set('ingredients', form.ingredients.map((ing, idx) => idx === i ? { ...ing, [key]: val } : ing));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader size={28} className="animate-spin text-green-700" />
    </div>
  );

  const Field = ({ label, error, children }) => (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/products')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display font-bold text-2xl text-gray-900">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Basic Info */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Basic Information</h2>
            <Field label="Product Name *" error={errors.name}>
              <input className={`form-input ${errors.name ? 'border-red-400' : ''}`} value={form.name}
                onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Herbal Hair Oil" />
            </Field>
            <Field label="Slug *" error={errors.slug}>
              <input className={`form-input font-mono text-sm ${errors.slug ? 'border-red-400' : ''}`}
                value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="herbal-hair-oil" />
            </Field>
            <Field label="Tagline">
              <input className="form-input" value={form.tagline} onChange={(e) => set('tagline', e.target.value)}
                placeholder="Short catchy tagline" />
            </Field>
            <Field label="Short Description">
              <textarea className="form-input" rows={2} value={form.shortDescription}
                onChange={(e) => set('shortDescription', e.target.value)} />
            </Field>
            <Field label="Full Description">
              <textarea className="form-input" rows={5} value={form.description}
                onChange={(e) => set('description', e.target.value)} />
            </Field>
            <Field label="Usage Instructions">
              <textarea className="form-input" rows={3} value={form.usage}
                onChange={(e) => set('usage', e.target.value)} />
            </Field>
          </div>

          {/* Benefits */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-gray-800">Benefits</h2>
              <button onClick={addBenefit} className="btn-secondary text-xs py-1 px-2.5">
                <Plus size={13} /> Add
              </button>
            </div>
            {form.benefits.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input className="form-input flex-1" value={b} onChange={(e) => updateBenefit(i, e.target.value)}
                  placeholder={`Benefit ${i + 1}`} />
                <button onClick={() => removeBenefit(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-gray-800">Ingredients</h2>
              <button onClick={addIngredient} className="btn-secondary text-xs py-1 px-2.5">
                <Plus size={13} /> Add
              </button>
            </div>
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input className="form-input" value={ing.name}
                    onChange={(e) => updateIngredient(i, 'name', e.target.value)} placeholder="Ingredient name" />
                  <input className="form-input" value={ing.desc}
                    onChange={(e) => updateIngredient(i, 'desc', e.target.value)} placeholder="Description" />
                </div>
                <button onClick={() => removeIngredient(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-0.5">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* ── Images ── */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-gray-800">Product Images</h2>
            </div>

            {/* Already-saved images (edit mode) */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Current images (click × to remove)</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((src, i) => (
                    <div key={i} className="relative group w-20 h-20 shrink-0">
                      <img
                        src={`${BASE_URL}${src}`}
                        alt={`Product ${i + 1}`}
                        className="w-full h-full rounded-lg object-cover border border-gray-200"
                      />
                      <button
                        onClick={() => removeExistingImage(i)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image picker */}
            <div>
              {existingImages.length > 0 && (
                <p className="text-xs text-gray-500 mb-2">
                  Upload new images to <strong>replace all current images</strong>, or leave empty to keep them.
                </p>
              )}

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFilePick}
              />

              <button
                onClick={() => fileRef.current?.click()}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <ImagePlus size={15} />
                {newFiles.length > 0 ? `${newFiles.length} file(s) selected — click to change` : 'Choose images…'}
              </button>

              {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}

              {/* Previews for newly picked files */}
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group w-20 h-20 shrink-0">
                      <img src={src} alt="" className="w-full h-full rounded-lg object-cover border border-gray-200" />
                      <button
                        onClick={() => removeNewFile(i)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Side column ── */}
        <div className="space-y-5">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Pricing</h2>
            <Field label="Selling Price (₹) *" error={errors.price}>
              <input type="number" className={`form-input ${errors.price ? 'border-red-400' : ''}`}
                value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="499" min="0" />
            </Field>
            <Field label="Original Price (₹)">
              <input type="number" className="form-input" value={form.originalPrice}
                onChange={(e) => set('originalPrice', e.target.value)} placeholder="699" min="0" />
            </Field>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Details</h2>
            <Field label="Category *" error={errors.category}>
              <select className={`form-input ${errors.category ? 'border-red-400' : ''}`}
                value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="Oil">Oil</option>
                <option value="Capsule">Capsule</option>
              </select>
            </Field>
            <Field label="Badge">
              <input className="form-input" value={form.badge} onChange={(e) => set('badge', e.target.value)}
                placeholder="Bestseller, New, etc." />
            </Field>
            <Field label="Rating">
              <input type="number" className="form-input" value={form.rating}
                onChange={(e) => set('rating', e.target.value)} placeholder="4.5" min="0" max="5" step="0.1" />
            </Field>
            <Field label="Review Count">
              <input type="number" className="form-input" value={form.reviewCount}
                onChange={(e) => set('reviewCount', e.target.value)} placeholder="120" min="0" />
            </Field>
            <Field label="Status">
              <select className="form-input" value={form.isActive ? 'true' : 'false'}
                onChange={(e) => set('isActive', e.target.value === 'true')}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </Field>
          </div>

          <button onClick={handleSubmit} disabled={saving} className="btn-primary w-full justify-center py-3">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save size={16} /> {isEdit ? 'Update Product' : 'Create Product'}</>
            }
          </button>
          <button onClick={() => navigate('/products')} className="btn-secondary w-full justify-center py-3">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}