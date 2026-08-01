import React, { useState, useEffect } from 'react';
import { categories as initialCategories } from '../../customer/data/categories';
import { products } from '../../customer/data/products';
import AdminModal from '../components/AdminModal';
import { Plus, Trash, CheckCircle } from '../../../components/Icons';
import adminCategoriesApi from '../../../api/adminCategories.api';

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80";

export const AdminCategories = () => {
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    tagline: ''
  });

  const [validationError, setValidationError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch Categories from Real REST API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminCategoriesApi.getCategories();
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setCategoriesList(res.data.data);
      }
    } catch (err) {
      console.warn('Real API offline, using local fallback dataset for Admin Categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Compute Live Product Counts
  const categoryCounts = categoriesList.reduce((acc, cat) => {
    acc[cat.slug] = products.filter((p) => p.categorySlug === cat.slug).length;
    return acc;
  }, {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && modalMode === 'add') {
        updated.slug = value.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      }
      return updated;
    });
    if (validationError) setValidationError('');
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingCategoryId(null);
    setFormData({ name: '', slug: '', image: '', tagline: '' });
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setModalMode('edit');
    setEditingCategoryId(cat.id || cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      tagline: cat.tagline || ''
    });
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setValidationError('Category Name zaroori hai.');
      return;
    }
    if (!formData.slug.trim()) {
      setValidationError('Slug zaroori hai.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      image: formData.image.trim() || DEFAULT_CATEGORY_IMAGE,
      tagline: formData.tagline.trim()
    };

    try {
      if (modalMode === 'add') {
        const res = await adminCategoriesApi.createCategory(payload);
        if (res.data && res.data.success) {
          showToast('Nayi Dairy Category add ho gayi!');
        }
      } else {
        const res = await adminCategoriesApi.updateCategory(editingCategoryId, payload);
        if (res.data && res.data.success) {
          showToast('Category details update ho gayi!');
        }
      }
      await fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Category save nahi ho paayi.';
      showToast(msg);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (cat) => {
    const catId = cat.id || cat._id;
    const confirmDelete = window.confirm(`Kya aap "${cat.name}" category delete karna chahte hain?`);
    if (!confirmDelete) return;

    try {
      const res = await adminCategoriesApi.deleteCategory(catId);
      if (res.data && res.data.success) {
        showToast('Category delete ho gayi!');
      }
      await fetchCategories();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Category delete nahi ho paayi.';
      showToast(errorMsg);
    }
  };

  return (
    <div className="admin-page-container">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: toastMessage.toLowerCase().includes('delete') || toastMessage.toLowerCase().includes('nahi') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
            border: toastMessage.toLowerCase().includes('delete') || toastMessage.toLowerCase().includes('nahi') ? '1.5px solid var(--color-error-border)' : '1.5px solid var(--color-success-border)',
            color: toastMessage.toLowerCase().includes('delete') || toastMessage.toLowerCase().includes('nahi') ? 'var(--color-error)' : 'var(--color-success)',
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

      {/* Header Strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: '1.2' }}>
            Categories Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Doodh, Dahi, Paneer, Desi Ghee aur Makhan categories aur unke banners manage karein.
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
          <Plus size={16} color="#FFFFFF" /> Nayi Category Add Karein
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {categoriesList.map((cat) => {
          const catId = cat.id || cat._id;
          const liveProductCount = categoryCounts[cat.slug] || cat.productCount || 0;
          return (
            <div
              key={catId}
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img
                    src={cat.image || DEFAULT_CATEGORY_IMAGE}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(28, 43, 74, 0.85)',
                      color: 'var(--color-gold)',
                      fontWeight: '800',
                      fontSize: '0.725rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {liveProductCount} Items
                  </span>
                </div>

                <h3 className="font-display" style={{ fontSize: '1.15rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: 1.2 }}>
                  Taaza {cat.name}
                </h3>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-gold-hover)', fontWeight: '700', textTransform: 'lowercase', marginTop: '0.15rem' }}>
                  slug: {cat.slug}
                </div>
                {cat.tagline && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', lineHeight: 1.35 }}>
                    {cat.tagline}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(cat)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-primary)',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Edit Category
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat)}
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
                  title="Delete Category"
                >
                  <Trash size={14} color="var(--color-error)" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Admin Add/Edit Category Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New Dairy Category' : 'Edit Category Details'}
      >
        <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {validationError && (
            <div style={{ padding: '0.5rem 0.85rem', backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '700' }}>
              {validationError}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Lassi / Rabri"
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              required
              placeholder="e.g. lassi"
              value={formData.slug}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
            />
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
              Tagline / Subtitle
            </label>
            <input
              type="text"
              name="tagline"
              placeholder="e.g. Thandi mithi lassi & rabri"
              value={formData.tagline}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
            />
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
              {modalMode === 'add' ? 'Add Category' : 'Save Changes'}
            </button>
          </div>

        </form>
      </AdminModal>

    </div>
  );
};

export default AdminCategories;
