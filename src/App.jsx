import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

// Core Shell Components
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { Spinner } from './components/Loader/Loader.jsx';

// Lazy Loaded Pages for performance code-splitting
const Home = lazy(() => import('./pages/Home/Home.jsx'));
const Shop = lazy(() => import('./pages/Shop/Shop.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails.jsx'));
const Cart = lazy(() => import('./pages/Cart/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout.jsx'));
const Login = lazy(() => import('./pages/Login/Login.jsx'));
const Register = lazy(() => import('./pages/Register/Register.jsx'));
const Profile = lazy(() => import('./pages/Profile/Profile.jsx'));
const Orders = lazy(() => import('./pages/Orders/Orders.jsx'));
const OrderDetails = lazy(() => import('./pages/Orders/OrderDetails.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist.jsx'));
const About = lazy(() => import('./pages/About/About.jsx'));
const Contact = lazy(() => import('./pages/Contact/Contact.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/Policies/PrivacyPolicy.jsx'));
const TermsAndConditions = lazy(() => import('./pages/Policies/TermsAndConditions.jsx'));
const ShippingPolicy = lazy(() => import('./pages/Policies/ShippingPolicy.jsx'));
const ReturnPolicy = lazy(() => import('./pages/Policies/ReturnPolicy.jsx'));
const Admin = lazy(() => import('./pages/Admin/Admin.jsx'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'));

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <Navbar />
            <main>
              <Suspense
                fallback={
                  <div className="container py-5 flex-center" style={{ minHeight: '60vh' }}>
                    <Spinner size="large" text="Loading E-Commerce..." />
                  </div>
                }
              >
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Policies */}
                  <Route path="/policies/privacy" element={<PrivacyPolicy />} />
                  <Route path="/policies/terms" element={<TermsAndConditions />} />
                  <Route path="/policies/shipping" element={<ShippingPolicy />} />
                  <Route path="/policies/returns" element={<ReturnPolicy />} />

                  {/* Authentication Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Customer Authenticated Protected Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Management Protected Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
