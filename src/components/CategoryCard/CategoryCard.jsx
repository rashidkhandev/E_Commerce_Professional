import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link to={`/shop?category=${category.slug}`} className="category-card">
      <div className="category-card-image-box">
        <img
          src={category.image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80'}
          alt={category.name}
          className="category-card-img"
          loading="lazy"
        />
        <div className="category-overlay">
          <div className="category-content">
            <span className="category-badge">{category.productCount || 0} Products</span>
            <h3 className="category-title">{category.name}</h3>
            <span className="category-cta">Explore Now →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
