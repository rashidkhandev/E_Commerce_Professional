import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaBolt,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaUndo,
  FaPaperPlane,
  FaStar,
  FaTag,
} from 'react-icons/fa';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import CategoryCard from '../../components/CategoryCard/CategoryCard.jsx';
import { SkeletonGrid } from '../../components/Loader/Loader.jsx';
import API from '../../services/api.js';
import { fallbackCategories, fallbackProducts } from '../../data/fallbackData.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Home.css';

const Home = () => {
  useDocumentTitle('Home - Modern E-Commerce Platform');

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Flash sale countdown state (e.g. 14 hours, 32 minutes, 19 seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [catRes, featRes, trendRes, flashRes, newRes] = await Promise.allSettled([
          API.get('/categories'),
          API.get('/products/collections/featured'),
          API.get('/products/collections/trending'),
          API.get('/products/collections/flash-deals'),
          API.get('/products/collections/new-arrivals'),
        ]);

        if (catRes.status === 'fulfilled' && catRes.value.data?.data?.length > 0) {
          setCategories(catRes.value.data.data);
        } else {
          setCategories(fallbackCategories);
        }

        if (featRes.status === 'fulfilled' && featRes.value.data?.data?.length > 0) {
          setFeaturedProducts(featRes.value.data.data);
        } else {
          setFeaturedProducts(fallbackProducts.filter((p) => p.featured));
        }

        if (trendRes.status === 'fulfilled' && trendRes.value.data?.data?.length > 0) {
          setTrendingProducts(trendRes.value.data.data);
        } else {
          setTrendingProducts(fallbackProducts.filter((p) => p.bestseller));
        }

        if (flashRes.status === 'fulfilled' && flashRes.value.data?.data?.length > 0) {
          setFlashDeals(flashRes.value.data.data);
        } else {
          setFlashDeals(fallbackProducts.filter((p) => p.discountPrice > 0));
        }

        if (newRes.status === 'fulfilled' && newRes.value.data?.data?.length > 0) {
          setNewArrivals(newRes.value.data.data);
        } else {
          setNewArrivals(fallbackProducts.filter((p) => p.newArrival));
        }
      } catch (err) {
        // Fallback to static offline data seamlessly
        setCategories(fallbackCategories);
        setFeaturedProducts(fallbackProducts.filter((p) => p.featured));
        setTrendingProducts(fallbackProducts.filter((p) => p.bestseller));
        setFlashDeals(fallbackProducts.filter((p) => p.discountPrice > 0));
        setNewArrivals(fallbackProducts.filter((p) => p.newArrival));
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  return (
    <div className="home-page animate-fade-in">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge animate-slide-up">
              <span className="badge-pulse"></span>
              <span>E-Commerce • Curated Collection 2026</span>
            </div>

            <h1 className="hero-headline animate-slide-up">
              Shop Smarter. <br />
              <span className="hero-highlight">Live Better.</span>
            </h1>

            <p className="hero-subheading animate-slide-up">
              Discover quality products, exclusive deals and a seamless shopping experience at E-Commerce.
              Engineered with modern aesthetics and lightning-fast checkout.
            </p>

            <div className="hero-cta-group animate-slide-up">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Shop Now <FaArrowRight />
              </Link>
              <Link to="/shop?sort=discount" className="btn btn-outline btn-lg">
                Explore Deals
              </Link>
            </div>

            <div className="hero-trust-row">
              <div className="trust-pill">
                <FaTruck /> <span>Free Shipping &gt;$75</span>
              </div>
              <div className="trust-pill">
                <FaShieldAlt /> <span>Verified Authenticity</span>
              </div>
              <div className="trust-pill">
                <FaStar /> <span>4.9 / 5 Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
                alt="E-Commerce Premium Headphones"
                className="hero-main-img"
              />
              <div className="hero-floating-card top-card">
                <FaBolt className="card-floating-icon" />
                <div>
                  <span className="floating-title">Special Offer</span>
                  <span className="floating-desc">Save up to 30% Off</span>
                </div>
              </div>
              <div className="hero-floating-card bottom-card">
                <FaShieldAlt className="card-floating-icon text-success" />
                <div>
                  <span className="floating-title">Safe Delivery</span>
                  <span className="floating-desc">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Customer Benefits Strip */}
      <section className="benefits-section">
        <div className="container benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon-box">
              <FaTruck />
            </div>
            <div>
              <h4>Fast &amp; Free Shipping</h4>
              <p>Free standard delivery on orders above $75.</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon-box">
              <FaShieldAlt />
            </div>
            <div>
              <h4>Guaranteed Authenticity</h4>
              <p>100% genuine products directly from trusted sources.</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon-box">
              <FaUndo />
            </div>
            <div>
              <h4>30-Day Effortless Return</h4>
              <p>Hassle-free return policy if you change your mind.</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon-box">
              <FaHeadset />
            </div>
            <div>
              <h4>24/7 Dedicated Support</h4>
              <p>WhatsApp &amp; email assistance anytime you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="home-section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">BROWSE COLLECTIONS</span>
              <h2 className="section-title">Shop By Category</h2>
            </div>
            <Link to="/shop" className="section-link">
              View All Categories <FaArrowRight />
            </Link>
          </div>

          <div className="categories-grid">
            {categories.slice(0, 6).map((cat) => (
              <CategoryCard key={cat._id || cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Flash Sale / Limited Time Deals Banner */}
      <section className="flash-sale-section">
        <div className="container">
          <div className="flash-sale-banner">
            <div className="flash-info">
              <span className="badge badge-discount">
                <FaBolt /> LIMITED TIME DEAL
              </span>
              <h2>Flash Sale Countdown</h2>
              <p>
                Grab our highest-rated items at steep discounts before stocks run out. Deals refresh periodically.
              </p>
              <div className="countdown-timer">
                <div className="timer-box">
                  <span className="timer-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="timer-lbl">Hours</span>
                </div>
                <span className="timer-sep">:</span>
                <div className="timer-box">
                  <span className="timer-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="timer-lbl">Mins</span>
                </div>
                <span className="timer-sep">:</span>
                <div className="timer-box">
                  <span className="timer-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="timer-lbl">Secs</span>
                </div>
              </div>
              <Link to="/shop?sort=discount" className="btn btn-primary mt-4">
                Explore All Deals <FaArrowRight />
              </Link>
            </div>

            <div className="flash-products-preview">
              <div className="flash-cards-grid">
                {flashDeals.slice(0, 2).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending / Bestsellers */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">POPULAR PICKS</span>
              <h2 className="section-title">Trending &amp; Best Sellers</h2>
            </div>
            <Link to="/shop?sort=popular" className="section-link">
              Explore Best Sellers <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="products-grid-wrapper">
              {trendingProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Promotional Banner Strip */}
      <section className="promo-banner-section">
        <div className="container">
          <div className="promo-banner-card">
            <div className="promo-banner-content">
              <span className="promo-tag">
                <FaTag /> SPOTLIGHT COLLECTION
              </span>
              <h3>High Performance Audio &amp; Wearables</h3>
              <p>
                Experience ultra-low latency, studio-quality acoustics, and comfortable ergonomic craftsmanship.
              </p>
              <Link to="/shop?category=electronics" className="btn btn-secondary">
                Shop Electronics <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">FRESH DROPS</span>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/shop?sort=newest" className="section-link">
              View All New Drops <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="products-grid-wrapper">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. Verified Store Testimonials / Feedback */}
      <section className="home-section testimonials-section">
        <div className="container">
          <div className="section-header text-center-header">
            <span className="section-eyebrow">STORE HIGHLIGHTS</span>
            <h2 className="section-title">What Customers Experience</h2>
            <p className="section-subtitle">
              Sample feedback from verified store shoppers testing our platform.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                &ldquo;The ordering process was smooth and the product arrived in pristine condition.
                The Cash on Delivery option gave me complete peace of mind.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AM</div>
                <div>
                  <strong>Ahmed Malik</strong>
                  <span>Verified Purchase • Islamabad</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                &ldquo;Customer support over WhatsApp answered my sizing questions in minutes.
                The website is blazing fast even on mobile. Five stars!&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SK</div>
                <div>
                  <strong>Sara Khan</strong>
                  <span>Verified Purchase • Lahore</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                &ldquo;Authentic headphones with zero noise leakage. The real-time order tracking
                timeline kept me informed at every single stage.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">BR</div>
                <div>
                  <strong>Bilal Raza</strong>
                  <span>Verified Purchase • Rawalpindi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Newsletter Subscription */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-box">
            <div className="newsletter-text">
              <h2>Join E-Commerce Insider</h2>
              <p>Subscribe to receive early drops, VIP promo codes, and special seasonal sales.</p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="newsletter-input"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary newsletter-btn">
                Subscribe <FaPaperPlane />
              </button>
            </form>

            {newsletterSubmitted && (
              <p className="newsletter-success animate-fade-in">
                Thank you for subscribing! We&rsquo;ll keep you posted on upcoming exclusive arrivals.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
