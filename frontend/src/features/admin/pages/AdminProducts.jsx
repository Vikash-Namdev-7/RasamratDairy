import React, { useState, useMemo } from 'react';
import { products as initialProducts } from '../../customer/data/products';
import { categories } from '../../customer/data/categories';
import AdminModal from '../components/AdminModal';
import { Search, Plus, X, Star, Trash, Check, CheckCircle } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80";

export const AdminProducts = () => {
  const [productsList, setProductsList] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    categorySlug: categories[0]?.slug || 'doodh',
    price: '',
    unit: '500ml',
    image: '',
    inStock: true,
    badge: '',
    description: ''
  });

  const [validationError, setValidationError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categorySlug === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categorySlug.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    return result;
  }, [productsList, categoryFilter, searchQuery]);

  // Inline Stock Toggle
  const handleToggleStock = (id) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
    showToast('Product stock status update ho gaya!');
  };

  // Delete Product
  const handleDeleteProduct = (product) => {
    if (window.confirm(`Pakka "${product.name}" delete karna hai?`)) {
      setProductsList((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`"${product.name}" list se remove ho gaya.`);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingProductId(null);
    setFormData({
      name: '',
      categorySlug: categories[0]?.slug || 'doodh',
      price: '',
      unit: '500ml',
      image: '',
      inStock: true,
      badge: '',
      description: ''
    });
    setValidationError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setEditingProductId(product.id);
    setFormData({
      name: product.name || '',
      categorySlug: product.categorySlug || 'doodh',
      price: product.price !== undefined ? String(product.price) : '',
      unit: product.unit || '500ml',
      image: product.image || '',
      inStock: product.inStock !== false,
      badge: product.badge || '',
      description: product.description || ''
    });
    setValidationError('');
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim()) {
      setValidationError('Product Ka Naam bharna zaroori hai.');
      return;
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      setValidationError('Kripya valid (non-negative) Price bharein.');
      return;
    }

    if (!formData.unit.trim()) {
      setValidationError('Unit specify karna zaroori hai (e.g. 500ml, 250g).');
      return;
    }

    const numericPrice = Number(formData.price);
    const finalImage = formData.image.trim() || DEFAULT_PRODUCT_IMAGE;

    if (modalMode === 'add') {
      const newProduct = {
        id: `p_${Date.now()}`,
        name: formData.name.trim(),
        categorySlug: formData.categorySlug,
        price: numericPrice,
        unit: formData.unit.trim(),
        image: finalImage,
        gallery: [finalImage],
        rating: 4.8,
        reviewCount: 1,
        inStock: formData.inStock,
        badge: formData.badge.trim() || null,
        description: formData.description.trim() || `${formData.name.trim()} - Fresh farm quality product.`
      };

      setProductsList((prev) => [newProduct, ...prev]);
      showToast('🎉 Naya Product successfully Add ho gaya!');
    } else {
      setProductsList((prev) =>
        prev.map((p) =>
          p.id === editingProductId
            ? {
                ...p,
                name: formData.name.trim(),
                categorySlug: formData.categorySlug,
                price: numericPrice,
                unit: formData.unit.trim(),
                image: finalImage,
                gallery: p.gallery && p.gallery.length > 0 ? [finalImage, ...p.gallery.slice(1)] : [finalImage],
                inStock: formData.inStock,
                badge: formData.badge.trim() || null,
                description: formData.description.trim()
              }
            : p
        )
      );
      showToast('✨ Product details update ho gayi!');
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '3.5rem' }}>
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: 'var(--color-success-bg)',
            border: '1.5px solid var(--color-success-border)',
            color: 'var(--color-success)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.25rem',
            fontWeight: '700',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-sm)',
            animation: 'slideDownFade 0.3s ease'
          }}
        >
          <CheckCircle size={18} color="var(--color-success)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Actions Strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: '1.2' }}>
            Products Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Dairy catalog items, stock availability, pricing aur details manage karein.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          style={{
            padding: '0.65rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={16} color="#FFFFFF" /> Naya Product Add Karein
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        style={{
          backgroundColor: 'var(--color-cream-card)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--color-border)',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-cream)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', minWidth: '260px', flex: 1 }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search product name, badge, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', color: 'var(--color-primary)' }}
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Dropdown Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--color-text-muted)' }}>Category Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-cream)',
              color: 'var(--color-primary)',
              fontWeight: '600',
              fontSize: '0.825rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Categories ({productsList.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                Taaza {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Container */}
      <div
        style={{
          backgroundColor: 'var(--color-cream-card)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--color-border)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}
      >
        {filteredProducts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.75rem', width: '60px' }}>Item</th>
                  <th style={{ padding: '0.75rem' }}>Product Name</th>
                  <th style={{ padding: '0.75rem' }}>Category</th>
                  <th style={{ padding: '0.75rem' }}>Price & Unit</th>
                  <th style={{ padding: '0.75rem' }}>Stock Status</th>
                  <th style={{ padding: '0.75rem' }}>Rating</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {/* Thumbnail */}
                    <td style={{ padding: '0.75rem' }}>
                      <img
                        src={p.image || DEFAULT_PRODUCT_IMAGE}
                        alt={p.name}
                        style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#FAF5EE', border: '1px solid var(--color-border)' }}
                      />
                    </td>

                    {/* Name & Badge */}
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{p.name}</div>
                      {p.badge && (
                        <span className="badge-gold" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem', marginTop: '0.2rem', display: 'inline-block' }}>
                          {p.badge}
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '0.75rem', textTransform: 'capitalize', color: 'var(--color-text-muted)' }}>
                      <span className="badge-wine" style={{ fontSize: '0.7rem' }}>
                        {p.categorySlug}
                      </span>
                    </td>

                    {/* Price & Unit */}
                    <td style={{ padding: '0.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                      {formatCurrency(p.price)}
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '500', display: 'block' }}>
                        per {p.unit}
                      </span>
                    </td>

                    {/* Inline Stock Switch Toggle */}
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          border: p.inStock !== false ? '1px solid var(--color-success-border)' : '1px solid var(--color-error-border)',
                          backgroundColor: p.inStock !== false ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                          color: p.inStock !== false ? 'var(--color-success)' : 'var(--color-error)',
                          fontWeight: '800',
                          fontSize: '0.725rem',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px'
                        }}
                        title="Click to toggle Stock Status"
                      >
                        {p.inStock !== false ? (
                          <>
                            <Check size={12} color="var(--color-success)" /> In Stock
                          </>
                        ) : (
                          <>
                            <X size={12} color="var(--color-error)" /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>

                    {/* Rating */}
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                        <Star size={13} color="var(--color-gold)" fill="var(--color-gold)" />
                        <span>{p.rating || 4.8}</span>
                      </div>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          style={{
                            backgroundColor: 'var(--color-cream)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.775rem',
                            fontWeight: '700',
                            color: 'var(--color-primary)',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p)}
                          style={{
                            backgroundColor: 'var(--color-error-bg)',
                            border: '1px solid var(--color-error-border)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.55rem',
                            color: 'var(--color-error)',
                            cursor: 'pointer'
                          }}
                          title="Delete Product"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
            <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '0.35rem' }}>
              Koi Product Nahi Mila
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Search query ya category filter reset karein ya naya product add karein.
            </p>
            <button
              type="button"
              className="btn btn-gold"
              onClick={handleOpenAddModal}
            >
              <Plus size={16} /> Naya Product Add Karein
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal Form */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? '➕ Naya Product Add Karein' : '✏️ Product Details Edit Karein'}
      >
        {validationError && (
          <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '1rem', fontSize: '0.825rem', fontWeight: '700' }}>
            ⚠️ {validationError}
          </div>
        )}

        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Product Name */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Full Cream Doodh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
            />
          </div>

          {/* Category & Price Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Category *
              </label>
              <select
                value={formData.categorySlug}
                onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none', cursor: 'pointer' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    Taaza {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                placeholder="e.g., 32"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>
          </div>

          {/* Unit & Badge Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Unit Pack *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 500ml / 250g / 1L"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Badge Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Bestseller / Pure Desi"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Image URL (Optional)
            </label>
            <input
              type="text"
              placeholder="/images/products/milk-1.jpg"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Product description and features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* In Stock Toggle Checkbox */}
          <div style={{ paddingTop: '0.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                Product In Stock (Available for Purchase)
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.3rem', fontSize: '0.85rem' }}
            >
              {modalMode === 'add' ? 'Save & Add Product' : 'Update Product'}
            </button>
          </div>

        </form>
      </AdminModal>

    </div>
  );
};

export default AdminProducts;
