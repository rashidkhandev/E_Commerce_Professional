import './Loader.css';

export const Spinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`spinner-wrapper ${size}`}>
      <div className="spinner-circle"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export const SkeletonProductCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton-pulse"></div>
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-line-sm skeleton-pulse"></div>
        <div className="skeleton-line skeleton-line-title skeleton-pulse"></div>
        <div className="skeleton-line skeleton-line-md skeleton-pulse"></div>
        <div className="skeleton-footer">
          <div className="skeleton-line skeleton-line-price skeleton-pulse"></div>
          <div className="skeleton-btn skeleton-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
};

export default Spinner;
