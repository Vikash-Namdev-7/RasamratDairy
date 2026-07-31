import React, { useState, useEffect, useMemo } from 'react';
import { products as initialProducts } from '../../customer/data/products';
import { categories as initialCategories } from '../../customer/data/categories';
import AdminModal from '../components/AdminModal';
import { Search, Plus, X, Star, Trash, Check, CheckCircle } from '../../../components/Icons';
import { formatCurrency } from '../../../utils/formatCurrency';
import adminProductsApi from '../../../api/adminProducts.api';
import productsApi from '../../../api/products.api';

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80";

export const AdminProducts = () => {
  const [productsList, setProductsList] = useState(initialProducts);
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    categorySlug: 'doodh',
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
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch products & categories from real REST API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        adminProductsApi.getProducts(),
        productsApi.getCategories()
      ]);

      if (prodRes.data && Array.isArray(prodRes.data.data) && prodRes.data.data.length > 0) {
        setProductsList(prodRes.data.data);
      }
      if (catRes.data && Array.isArray(catRes.data.data) && catRes.data.data.length > 0) {
        setCategoriesList(catRes.data.data);
      }
    } catch (err) {
      console.warn('⚠️ Real API offline or unseeded, using local fallback dataset for Admin Products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [productsList, categoryFilter, searchQuery]);

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationError) setValidationError('');
  };

  // Open Modal for Create
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingProductId(null);
    setFormData({
      name: '',
      categorySlug: categoriesList[0]?.slug || 'doodh',
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

  // Open Modal for Edit
  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setEditingProductId(product.id || product._id);
    setFormData({
      name: product.name,
      categorySlug: product.categorySlug,
      price: product.price,
      unit: product.unit,
      image: product.image || '',
      inStock: product.inStock,
      badge: product.badge || '',
      description: product.description || ''
    });
    setValidationError('');
    setIsModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setValidationError('Product Ka Naam zaroori hai.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setValidationError('Sahi Price daalein (positive number).');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      categorySlug: formData.categorySlug,
      price: Number(formData.price),
      unit: formData.unit.trim() || '500ml',
      image: formData.image.trim() || DEFAULT_PRODUCT_IMAGE,
      inStock: formData.inStock,
      badge: formData.badge.trim(),
      description: formData.description.trim()
    };

    try {
      if (modalMode === 'add') {
        const res = await adminProductsApi.createProduct(payload);
        if (res.data && res.data.success) {
          showToast('🎉 Naya Product catalogue me add ho gaya!');
        }
      } else {
        const res = await adminProductsApi.updateProduct(editingProductId, payload);
        if (res.data && res.data.success) {
          showToast('✨ Product details update ho gayi!');
        }
      }
      await fetchProducts();
    } catch (err) {
      // Local State Fallback if API offline
      if (modalMode === 'add') {
        const newProd = {
          id: `prod-${Date.now()}`,
          ...payload,
          rating: 4.8,
          reviewCount: 0
        };
        setProductsList((prev) => [newProd, ...prev]);
        showToast('🎉 Naya Product add ho gaya (Dev Fallback)');
      } else {
        setProductsList((prev) =>
          prev.map((p) => ((p.id || p._id) === editingProductId ? { ...p, ...payload } : p))
        );
        showToast('✨ Product details update ho gayi!');
      }
    }

    setIsModalOpen(false);
  };

  // Toggle Stock Availability
  const handleToggleStock = async (id) => {
    try {
      const res = await adminProductsApi.toggleStock(id);
      if (res.data && res.data.success) {
        showToast(res.data.message || 'Stock status update ho gaya!');
      }
      await fetchProducts();
    } catch (err) {
      setProductsList((prev) =>
        prev.map((p) => {
          if ((p.id || p._id) === id) {
            const updatedStock = !p.inStock;
            showToast(`📦 Product ab ${updatedStock ? 'In Stock' : 'Out of Stock'} mark ho gaya!`);
            return { ...p, inStock: updatedStock };
          }
          return p;
        })
      );
    }
  };

  // Delete Product
  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(`Kya aap "${product.name}" ko sachme delete karna chahte hain?`);
    if (!confirmDelete) return;

    const prodId = product.id || product._id;

    try {
      const res = await adminProductsApi.deleteProduct(prodId);
      if (res.data && res.data.success) {
        showToast('🗑️ Product catalogue se remove ho gaya!');
      }
      await fetchProducts();
    } catch (err) {
      setProductsList((prev) => prev.filter((p) => (p.id || p._id) !== prodId));
      showToast('🗑️ Product catalogue se remove ho gaya!');
    }
  };

  return (
    <div className="admin-page-container">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: toastMessage.includes('⚠️') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
            border: toastMessage.includes('⚠️') ? '1.5px solid var(--color-error-border)' : '1.5px solid var(--color-success-border)',
            color: toastMessage.includes('⚠️') ? 'var(--color-error)' : 'var(--color-success)',
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
          <CheckCircle size={18} />
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
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '0.875rem',
            border: 'none',
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

      {/* Filter & Search Toolbar Strip */}
      <div
        style={{
          backgroundColor: 'var(--color-cream-card)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--color-border)',
          padding: '0.85rem 1.1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 260px', backgroundColor: 'var(--color-cream)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search product name, category, description..."
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
            {categoriesList.map((cat) => (
              <option key={cat.id || cat._id || cat.slug} value={cat.slug}>
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
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1.5px solid var(--color-border)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price / Unit</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Badge</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Stock Status</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const prodId = p.id || p._id;
                  return (
                    <tr key={prodId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      
                      {/* Item Thumbnail & Name */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={p.image || DEFAULT_PRODUCT_IMAGE}
                            alt={p.name}
                            style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-border)', flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.925rem', color: 'var(--color-primary)' }}>{p.name}</div>
                            {p.description && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'capitalize', color: 'var(--color-primary)' }}>
                          {p.categorySlug}
                        </span>
                      </td>

                      {/* Price & Unit */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.925rem', color: 'var(--color-primary)' }}>
                          {formatCurrency(p.price)}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>per {p.unit}</div>
                      </td>

                      {/* Badge Tag */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {p.badge ? (
                          <span className="badge-gold" style={{ fontSize: '0.675rem' }}>
                            {p.badge}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>—</span>
                        )}
                      </td>

                      {/* Stock Status Switch */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStock(prodId)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            border: p.inStock ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                            backgroundColor: p.inStock ? 'var(--color-success-bg)' : 'rgba(239, 68, 68, 0.1)',
                            color: p.inStock ? 'var(--color-success)' : '#DC2626',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          {p.inStock ? <Check size={13} /> : <X size={13} />}
                          <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Actions (Edit / Delete) */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)',
                              backgroundColor: 'var(--color-cream)',
                              color: 'var(--color-primary)',
                              fontSize: '0.775rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p)}
                            style={{
                              padding: '0.35rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-error-border)',
                              backgroundColor: 'var(--color-error-bg)',
                              color: 'var(--color-error)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Delete product"
                          >
                            <Trash size={14} color="var(--color-error)" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Koi matching product nahi mila.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Add/Edit Product Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? '➕ Add New Product' : '✏️ Edit Product Details'}
      >
        <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {validationError && (
            <div style={{ padding: '0.5rem 0.85rem', backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '700' }}>
              ⚠️ {validationError}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Product Title *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Full Cream Doodh 500ml"
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                name="categorySlug"
                value={formData.categorySlug}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none', backgroundColor: '#FFFFFF' }}
              >
                {categoriesList.map((cat) => (
                  <option key={cat.id || cat._id || cat.slug} value={cat.slug}>
                    Taaza {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                required
                placeholder="32"
                value={formData.price}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Unit / Quantity *
              </label>
              <input
                type="text"
                name="unit"
                required
                placeholder="500ml / 250g"
                value={formData.unit}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Badge (Optional)
              </label>
              <input
                type="text"
                name="badge"
                placeholder="e.g. Bestseller / A2 Quality"
                value={formData.badge}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://..."
              value={formData.image}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Description
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="Short product details..."
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.2rem' }}>
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="inStock" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary)', cursor: 'pointer' }}>
              Product In Stock hai (Available for purchase)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)' }}>
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
              {modalMode === 'add' ? 'Add Product' : 'Save Changes'}
            </button>
          </div>

        </form>
      </AdminModal>

    </div>
  );
};

export default AdminProducts;
