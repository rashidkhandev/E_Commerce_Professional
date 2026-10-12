import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FaFilter,
  FaTimes,
  FaTh,
  FaList,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import API from '../../services/api.js';
import { fallbackCategories, fallbackProducts } from '../../data/fallbackData.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Shop.css';

const Shop = () => {
  useDocumentTitle('Shop All Products');

  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query State
  const initialCategory = searchParams.get('category') || '';
  const initialKeyword = searchParams.get('keyword') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;

  // Filter States
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(initialSort === 'discount');
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState(['Apple', 'Sony', 'Nike', 'Adidas', 'Logitech', 'Dyson', 'Fossil', 'Zara Studio', 'Pure Skin Botanicals']);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync category or keyword from searchParams if navigated externally
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);

    const kw = searchParams.get('keyword');
    if (kw !== null) setKeyword(kw);

    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data?.success && res.data.data?.length > 0) {
          setCategories(res.data.data);
        } else {
          setCategories(fallbackCategories);
        }
      } catch {
        setCategories(fallbackCategories);
      }
    };
    fetchCats();
  }, []);

  // Fetch products matching all active filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (minPrice) params.append('price[gte]', minPrice);
      if (maxPrice) params.append('price[lte]', maxPrice);
      if (minRating) params.append('minRating', minRating);
      if (inStockOnly) params.append('inStock', 'true');
      if (dealsOnly) params.append('sort', 'discount');
      else if (sortBy) params.append('sort', sortBy);
      params.append('page', currentPage);
      params.append('limit', 12);

      const res = await API.get(`/products?${params.toString()}`);

      if (res.data?.success) {
        setProducts(res.data.data || []);
        setTotalProducts(res.data.pagination?.totalResults || res.data.data.length);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } else {
        throw new Error('API returned failure');
      }
    } catch (err) {
      // Offline fallback filtering
      let filtered = [...fallbackProducts];

      if (keyword) {
        const k = keyword.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(k) ||
            p.brand.toLowerCase().includes(k) ||
            p.description.toLowerCase().includes(k)
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter((p) => p.category?.slug === selectedCategory);
      }

      if (selectedBrand) {
        filtered = filtered.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
      }

      if (minPrice) {
        filtered = filtered.filter((p) => (p.discountPrice || p.price) >= Number(minPrice));
      }

      if (maxPrice) {
        filtered = filtered.filter((p) => (p.discountPrice || p.price) <= Number(maxPrice));
      }

      if (minRating) {
        filtered = filtered.filter((p) => p.rating >= Number(minRating));
      }

      if (inStockOnly) {
        filtered = filtered.filter((p) => p.stock > 0);
      }

      if (dealsOnly) {
        filtered = filtered.filter((p) => p.discountPrice > 0);
      }

      // Sorting
      if (sortBy === 'price-asc') {
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'popular') {
        filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
      }

      setProducts(filtered);
      setTotalProducts(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 12) || 1);
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedCategory, selectedBrand, minPrice, maxPrice, minRating, inStockOnly, dealsOnly, sortBy, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setInStockOnly(false);
    setDealsOnly(false);
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleCategorySelect = (slug) => {
    const nextCat = selectedCategory === slug ? '' : slug;
    setSelectedCategory(nextCat);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (nextCat) newParams.set('category', nextCat);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (minRating ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (dealsOnly ? 1 : 0) +
    (keyword ? 1 : 0);

  return (
    <div className="container shop-page animate-fade-in">
      {/* Shop Header Breadcrumbs & Controls */}
      <div className="shop-header">
        <div>
          <h1 className="shop-title">Shop Collection</h1>
          <p className="shop-subtitle">
            Showing {products.length} of {totalProducts} curated products
            {selectedCategory && ` in "${selectedCategory}"`}
            {keyword && ` matching "${keyword}"`}
          </p>
        </div>

        {/* View Mode & Sorting */}
        <div className="shop-controls-row">
          {/* Mobile Filter Drawer Button */}
          <button
            type="button"
            className="btn btn-outline btn-sm mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <FaFilter /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <div className="shop-sort-group">
            <label htmlFor="shop-sort" className="sort-label">
              Sort by:
            </label>
            <select
              id="shop-sort"
              className="form-select sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Newest Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          <div className="view-toggle-btns">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              <FaTh />
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List View"
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="shop-layout">
        {/* Left Sidebar Filter Section */}
        <aside className={`shop-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            {activeFilterCount > 0 && (
              <button type="button" className="reset-filter-btn" onClick={handleResetFilters}>
                <FaRedo /> Reset All
              </button>
            )}
            <button
              type="button"
              className="sidebar-close-mobile"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* Filter 1: Categories */}
          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <div className="filter-options-list">
              <button
                type="button"
                className={`filter-cat-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => handleCategorySelect('')}
              >
                <span>All Categories</span>
                <span className="count-pill">{categories.reduce((a, c) => a + (c.productCount || 0), 0) || 20}</span>
              </button>

              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat._id || cat.slug}
                  className={`filter-cat-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.slug)}
                >
                  <span>{cat.name}</span>
                  <span className="count-pill">{cat.productCount || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter 2: Price Range */}
          <div className="filter-group">
            <h4 className="filter-title">Price Range ($)</h4>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                className="form-input price-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
              <span className="price-sep">-</span>
              <input
                type="number"
                placeholder="Max"
                className="form-input price-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Filter 3: Brand */}
          <div className="filter-group">
            <h4 className="filter-title">Brand</h4>
            <div className="filter-options-list">
              <select
                className="form-select"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter 4: Rating */}
          <div className="filter-group">
            <h4 className="filter-title">Customer Rating</h4>
            <div className="filter-options-list">
              {[4, 3, 2].map((stars) => (
                <label key={stars} className="filter-checkbox-label">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === String(stars)}
                    onChange={() => setMinRating(minRating === String(stars) ? '' : String(stars))}
                  />
                  <span>{stars} Stars &amp; Above</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter 5: Availability & Deals Switches */}
          <div className="filter-group">
            <h4 className="filter-title">Availability &amp; Offers</h4>
            <div className="filter-switches">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>

              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={dealsOnly}
                  onChange={(e) => setDealsOnly(e.target.checked)}
                />
                <span>Discounted Deals Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop for Sidebar */}
        {isMobileFilterOpen && (
          <div className="mobile-filter-backdrop" onClick={() => setIsMobileFilterOpen(false)}></div>
        )}

        {/* Right Product Grid Area */}
        <section className="shop-products-section">
          <ProductGrid
            products={products}
            loading={loading}
            viewMode={viewMode}
            emptyMessage="No products match your current search and filter settings. Try adjusting your price range or resetting filters."
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <FaChevronLeft /> Prev
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    className={`pagination-num-btn ${currentPage === pg ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pg)}
                  >
                    {pg}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Shop;
