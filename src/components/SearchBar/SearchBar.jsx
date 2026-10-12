import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaHistory } from 'react-icons/fa';
import API from '../../services/api.js';
import useDebounce from '../../hooks/useDebounce.js';
import { formatCurrency } from '../../utils/formatters.js';
import './SearchBar.css';

const SearchBar = ({ placeholder = 'Search products, brands, or categories...', onCloseMobile }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('rashid_recent_searches');
      return saved ? JSON.parse(saved) : ['MacBook', 'Headphones', 'Nike', 'Watch'];
    } catch {
      return [];
    }
  });

  const debouncedQuery = useDebounce(query, 350);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch search suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await API.get(`/products/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.data?.success) {
          setSuggestions(res.data.data || []);
        }
      } catch (err) {
        // Fallback filtering if backend is offline
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    const updated = [cleanTerm, ...recentSearches.filter((s) => s.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('rashid_recent_searches', JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    saveRecentSearch(query);
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectSuggestion = (slug) => {
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    navigate(`/product/${slug}`);
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    saveRecentSearch(term);
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    navigate(`/shop?keyword=${encodeURIComponent(term)}`);
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          aria-label="Search"
        />
        {query && (
          <button type="button" className="search-clear-btn" onClick={clearQuery} aria-label="Clear search">
            <FaTimes />
          </button>
        )}
      </form>

      {/* Dropdown Suggestions & Recent Searches */}
      {isOpen && (
        <div className="search-dropdown animate-fade-in">
          {suggestions.length > 0 ? (
            <div className="search-suggestions-list">
              <span className="search-dropdown-label">Matching Products</span>
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  className="search-suggestion-item"
                  onClick={() => handleSelectSuggestion(item.slug)}
                >
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="suggestion-thumb"
                  />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{item.name}</span>
                    <span className="suggestion-meta">
                      {item.brand} • <strong className="suggestion-price">{formatCurrency(item.discountPrice || item.price)}</strong>
                    </span>
                  </div>
                </div>
              ))}
              <div
                className="search-view-all"
                onClick={handleSubmit}
              >
                View all results for &ldquo;{query}&rdquo; →
              </div>
            </div>
          ) : query.length >= 2 ? (
            <div className="search-empty-state">
              <p>No products found for &ldquo;{query}&rdquo;.</p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleSubmit}
              >
                Search In Shop
              </button>
            </div>
          ) : (
            recentSearches.length > 0 && (
              <div className="search-recents-list">
                <span className="search-dropdown-label">
                  <FaHistory /> Recent Searches
                </span>
                <div className="recent-tags-wrapper">
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="recent-tag-btn"
                      onClick={() => handleRecentClick(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
