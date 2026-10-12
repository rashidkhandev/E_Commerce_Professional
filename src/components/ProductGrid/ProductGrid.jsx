import ProductCard from '../ProductCard/ProductCard.jsx';
import { SkeletonGrid } from '../Loader/Loader.jsx';
import { FaBoxOpen } from 'react-icons/fa';
import './ProductGrid.css';

const ProductGrid = ({ products = [], loading = false, viewMode = 'grid', emptyMessage = 'No products found matching your criteria.' }) => {
  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <FaBoxOpen className="empty-icon" />
        <h3>No Products Found</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`product-grid-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
