import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './Rating.css';

const Rating = ({ value = 0, count, interactive = false, onRate, size = 16 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (interactive) {
      stars.push(
        <button
          type="button"
          key={i}
          className={`rating-star-btn ${i <= value ? 'active' : ''}`}
          onClick={() => onRate && onRate(i)}
          aria-label={`Rate ${i} out of 5 stars`}
        >
          <FaStar size={size} />
        </button>
      );
    } else {
      if (value >= i) {
        stars.push(<FaStar key={i} className="star-filled" size={size} />);
      } else if (value >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="star-half" size={size} />);
      } else {
        stars.push(<FaRegStar key={i} className="star-empty" size={size} />);
      }
    }
  }

  return (
    <div className="rating-container">
      <div className="rating-stars" role="img" aria-label={`Rating: ${value} out of 5 stars`}>
        {stars}
      </div>
      {value > 0 && !interactive && <span className="rating-score">{Number(value).toFixed(1)}</span>}
      {count !== undefined && <span className="rating-count">({count})</span>}
    </div>
  );
};

export default Rating;
