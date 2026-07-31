import React, { useState, useMemo } from 'react';
import { categories as initialCategories } from '../../customer/data/categories';
import { products } from '../../customer/data/products';
import AdminModal from '../components/AdminModal';
import { Plus, Upload, Trash, CheckCircle, X, ChevronRight } from '../../../components/Icons';

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1527153857715-3908f2bf5bf8?auto=format&fit=crop&w=400&q=80";

export const AdminCategories = ({ onNavigate }) => {
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    tagline: ''
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Compute live product counts per category
  const categoryCounts = useMemo(() => {
    const countsMap = {};
    products.forEach((p) => {
      if (p.categorySlug) {
        countsMap[p.categorySlug] = (countsMap[p.categorySlug] || 0) + 1;
      }
    });
    return countsMap;
  }, []);

  // Name Change auto-slug helper
  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    if (modalMode === 'add') {
      const generatedSlug = nameVal.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData({ ...formData, name: nameVal, slug: generatedSlug });
    } else {
      setFormData({ ...formData, name: nameVal });
    }
  };

  // Image File Picker Change Handler
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      setFormData((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  // Delete Protection Handler
  const handleDeleteCategory = (cat) => {
    const pCount = categoryCounts[cat.slug] || 0;
    if (pCount > 0) {
      alert(`⚠️ Delete Blocked: Is category ("${cat.name}") me ${pCount} products hain. Pehle un products ko kisi aur category me move ya delete karein!`);
      return;
    }

    if (window.confirm(`Pakka "${cat.name}" category delete karna hai?`)) {
      setCategoriesList((prev) => prev.filter((c) => c.id !== cat.id));
      showToast(`Category "${cat.name}" delete ho gayi.`);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingCategoryId(null);
    setFormData({
      name: '',
      slug: '',
      image: '',
      tagline: ''
    });
    setImagePreviewUrl('');
    setValidationError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat) => {
    setModalMode('edit');
    setEditingCategoryId(cat.id);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      image: cat.image || '',
      tagline: cat.tagline || ''
    });
    setImagePreviewUrl(cat.image || '');
    setValidationError('');
    setIsModalOpen(true);
  };

  // Form Submit
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim()) {
      setValidationError('Category Name bharna zaroori hai.');
      return;
    }

    if (!formData.slug.trim()) {
      setValidationError('Category Slug zaroori hai.');
      return;
    }

    const finalImage = formData.image.trim() || imagePreviewUrl || DEFAULT_CATEGORY_IMAGE;

    if (!finalImage) {
      setValidationError('Category ke liye image upload ya select karein.');
      return;
    }

    if (modalMode === 'add') {
      const newCat = {
        id: `c_${Date.now()}`,
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
        image: finalImage,
        tagline: formData.tagline.trim() || 'Farm fresh dairy category.',
        productCount: 0
      };

      setCategoriesList((prev) => [...prev, newCat]);
      showToast('🎉 Nayi Category successfully Add ho gayi!');
    } else {
      setCategoriesList((prev) =>
        prev.map((c) =>
          c.id === editingCategoryId
            ? {
                ...c,
                name: formData.name.trim(),
                slug: formData.slug.trim().toLowerCase(),
                image: finalImage,
                tagline: formData.tagline.trim()
              }
            : c
        )
      );
      showToast('✨ Category details & image update ho gayi!');
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

      {/* Page Header Strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-primary)', fontWeight: '800', lineHeight: '1.2' }}>
            Categories Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Dairy product categories, banners aur image assets update karein.
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
          <Plus size={16} color="#FFFFFF" /> Nayi Category Add Karein
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {categoriesList.map((cat) => {
          const liveProductCount = categoryCounts[cat.slug] || cat.productCount || 0;
          return (
            <div
              key={cat.id}
              style={{
                backgroundColor: 'var(--color-cream-card)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease'
              }}
              className="category-admin-card"
            >
              {/* Category Image Circle */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '0.85rem',
                  border: '2px solid var(--color-gold)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  backgroundColor: '#FAF5EE'
                }}
              >
                <img
                  src={cat.image || DEFAULT_CATEGORY_IMAGE}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Title & Slug */}
              <h3 className="font-display" style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: '800', marginBottom: '0.15rem' }}>
                {cat.name}
              </h3>
              <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginBottom: '0.5rem', display: 'block' }}>
                slug: /{cat.slug}
              </span>

              {/* Tagline */}
              <p style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', lineHeight: '1.4', marginBottom: '0.85rem', height: '2.8em', overflow: 'hidden' }}>
                {cat.tagline || 'Fresh organic dairy items.'}
              </p>

              {/* Live Product Count Badge */}
              <div style={{ marginBottom: '1rem' }}>
                <span className="badge-wine" style={{ fontSize: '0.725rem', padding: '0.2rem 0.6rem' }}>
                  {liveProductCount} {liveProductCount === 1 ? 'Product' : 'Products'} Active
                </span>
              </div>

              {/* Actions Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', paddingTop: '0.75rem', borderTop: '1px dashed var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(cat)}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--color-cream)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Edit Image & Details
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat)}
                  style={{
                    backgroundColor: 'var(--color-error-bg)',
                    border: '1px solid var(--color-error-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem 0.6rem',
                    color: 'var(--color-error)',
                    cursor: 'pointer'
                  }}
                  title="Delete Category"
                >
                  <Trash size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal Form */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? '➕ Nayi Category Add Karein' : '✏️ Category Image & Details Edit Karein'}
      >
        {validationError && (
          <div style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '1rem', fontSize: '0.825rem', fontWeight: '700' }}>
            ⚠️ {validationError}
          </div>
        )}

        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Name & Slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Makhan / Ghee"
                value={formData.name}
                onChange={handleNameChange}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                URL Slug *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., makhan"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          {/* Image Upload Box with Instant File Preview */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Category Image Asset *
            </label>

            <div
              style={{
                border: '2px dashed var(--color-gold)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-cream)',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />

              {imagePreviewUrl || formData.image ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={imagePreviewUrl || formData.image}
                    alt="Category Preview"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  />
                  <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                    ✓ Nayi Image Selected! (Click to change)
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <Upload size={24} color="var(--color-gold-hover)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                    Image Upload Karein (Click or Drag & Drop)
                  </span>
                  <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                    PNG / JPG / WEBP format (Recommended size 400x400px)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Category Tagline
            </label>
            <input
              type="text"
              placeholder="e.g., Roz subah farm se seedha packed taaza doodh"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', backgroundColor: 'var(--color-cream)', outline: 'none' }}
            />
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
              {modalMode === 'add' ? 'Save & Add Category' : 'Update Category'}
            </button>
          </div>

        </form>
      </AdminModal>

    </div>
  );
};

export default AdminCategories;
