import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './dashboards.css';
import './BuyerMarketPlace.css';
import {
  IconCart, IconSearch, IconHeart, IconTag, IconLeaf, IconWheat,
  IconUser, IconSmartphone, IconBuilding, IconBanknote, IconTruck
} from './Icons';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../components/ProfileModal';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices'];

const DEMO_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
];

export default function BuyerMarketplace() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Buyer';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedFlash, setAddedFlash] = useState(null);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState(DEMO_BANKS[0]);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const r = localStorage.getItem('role');
    if (r !== 'Buyer') {
      if (r === 'Farmer') {
        alert("Access Denied: You are a Farmer. Redirecting to your dashboard.");
        window.location.href = '/farmer-dashboard';
      } else {
        alert("Access Denied: Your role is different. You cannot access the Buyer Marketplace.");
        window.location.href = '/';
      }
      return;
    }
    fetchProducts();
    
    // Poll for new products every 5 seconds
    const interval = setInterval(fetchProducts, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setProducts([]);
      });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.productName?.toLowerCase().includes(q) || p.farmerName?.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
    }
    if (sortBy === 'price-low') result.sort((a, b) => (a.pricePerUnit || 0) - (b.pricePerUnit || 0));
    else if (sortBy === 'price-high') result.sort((a, b) => (b.pricePerUnit || 0) - (a.pricePerUnit || 0));
    else if (sortBy === 'name') result.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
    return result;
  }, [products, searchQuery, activeCategory, sortBy]);

  // Cart helpers
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.qty * (i.pricePerUnit || 0), 0), [cart]);

  const addToCart = useCallback((product) => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('userName');
    const userRole = localStorage.getItem('role');
    
    if (!isLoggedIn) {
      alert('Please login to add items to cart');
      window.location.href = '/auth';
      return;
    }
    
    if (userRole !== 'Buyer') {
      alert('Only buyers can add items to cart. Please login as a buyer.');
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedFlash(product.id);
    setTimeout(() => setAddedFlash(null), 700);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev =>
      prev
        .map(i => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter(i => i.qty > 0)
    );
  }, []);
  const handlePay = async () => {
  setProcessing(true);
  
  const orderId = `HA${Date.now().toString().slice(-8)}`;

  setTimeout(async () => {
    setProcessing(false);
    setCheckoutOpen(false);
    setPaymentSuccess(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          total: cartTotal,
          paymentMethod,
          orderId: orderId,
          buyerName: localStorage.getItem('userName') || 'Valued Customer'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error("Invoice Download Failed:", err);
    }
  }, 2200);
};

  const handlePaymentDone = () => {
    setPaymentSuccess(false);
    setCart([]);
    setPaymentMethod('upi');
    setUpiId('');
    setSelectedBank(DEMO_BANKS[0]);
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="dashboard-container buyer-theme">
        <div className="marketplace-hero">
          <h1><IconCart size={30} /> Fresh Marketplace</h1>
          <p>Farm-fresh produce delivered straight to you</p>
        </div>
        <div className="marketplace-loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line w60" />
                <div className="skeleton-line w80" />
                <div className="skeleton-line w40" />
                <div className="skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container buyer-theme">
      {/* Hero with Navigation */}
      <div className="marketplace-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <h1><IconCart size={30} /> Fresh Marketplace</h1>
            <p>Farm-fresh produce delivered straight to you</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.location.href = '/'} 
              style={{
                padding: '10px 20px',
                background: 'white',
                color: '#1e293b',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
              onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#e2e8f0'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </button>

            <div className="nav-profile-container"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <div className="nav-profile" style={{
                width: '40px', height: '40px', background: '#e2e8f0', color: '#0f172a',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.2rem', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="profile-dropdown" style={{
                  position: 'absolute', top: '100%', right: '0', background: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '8px 0',
                  minWidth: '150px', zIndex: 10
                }}>
                  <button onClick={() => setIsProfileOpen(true)} style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#1e293b' }} onMouseOver={(e) => e.target.style.background = '#f1f5f9'} onMouseOut={(e) => e.target.style.background = 'none'}>My Profile</button>
                  <button onClick={() => {
                     localStorage.clear();
                     navigate('/auth');
                  }} style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} onMouseOver={(e) => e.target.style.background = '#fee2e2'} onMouseOut={(e) => e.target.style.background = 'none'}>Log Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="marketplace-toolbar">
        <div className="search-filter-bar">
          <div className="search-input-wrap">
            <span className="search-icon"><IconSearch size={18} /></span>
            <input
              type="text"
              placeholder="Search products or farmers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Chips */}
      <div className="category-chips">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`chip ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="results-bar">
        <div className="results-count">
          Showing <span>{filteredProducts.length}</span>{' '}
          {filteredProducts.length === 1 ? 'product' : 'products'}
        </div>
      </div>

      {/* Product Grid / Empty */}
      {filteredProducts.length === 0 ? (
        <div className="marketplace-empty">
          <span className="empty-icon"><IconWheat size={56} /></span>
          <h3>No products found</h3>
          <p>
            {searchQuery || activeCategory !== 'All'
              ? 'Try adjusting your search or filters to find what you need.'
              : "Farmers have not listed any produce yet. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="buyer-product-grid">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id || index}
              className={`buyer-product-card ${addedFlash === product.id ? 'card-added-flash' : ''}`}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="buyer-card-image" style={product.imageUrl ? { backgroundImage: `url(${getImageUrl(product.imageUrl)})` } : {}}>
                {!product.imageUrl && <span className="buyer-card-placeholder-icon"><IconLeaf size={40} /></span>}
                <span className="buyer-price-badge">&#8377;{product.pricePerUnit}/{product.unit || 'kg'}</span>
              </div>

              <div className="buyer-card-body">
                <h3>{product.productName}</h3>
                <div className="buyer-card-meta">
                  <IconUser size={15} className="meta-icon" />
                  Sold by {product.farmerName || 'Local Farmer'}
                </div>
                {product.category && (
                  <div className="buyer-card-meta">
                    <IconTag size={15} className="meta-icon" />
                    {product.category}
                  </div>
                )}
              </div>

              <div className="buyer-card-footer">
                <button className="btn-buyer-primary" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
                <button className="btn-buyer-secondary" title="Save for later">
                  <IconHeart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Cart FAB */}
      <button className="cart-fab" onClick={() => setCartOpen(true)} title="View Cart">
        <span className="cart-fab-icon"><IconCart size={24} /></span>
        {cartCount > 0 && <span className="cart-fab-badge">{cartCount}</span>}
      </button>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-drawer-header">
              <h2>Your Cart</h2>
              <button className="drawer-close" onClick={() => setCartOpen(false)}>&times;</button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty-icon"><IconCart size={48} /></span>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-thumb" style={item.imageUrl ? { backgroundImage: `url(${getImageUrl(item.imageUrl)})` } : { background: '#e2e8f0' }} />
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.productName}</div>
                        <div className="cart-item-price">&#8377;{item.pricePerUnit}/{item.unit || 'kg'}</div>
                      </div>
                      <div className="cart-item-qty">
                        <button onClick={() => updateQty(item.id, -1)}>&#8722;</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} title="Remove">&times;</button>
                    </div>
                  ))}
                </div>

                <div className="cart-drawer-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <span className="cart-total-amount">&#8377;{cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="btn-checkout" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <>
          <div className="modal-backdrop" onClick={() => !processing && setCheckoutOpen(false)} />
          <div className="checkout-modal">
            <button className="modal-close" onClick={() => !processing && setCheckoutOpen(false)}>&times;</button>

            <h2 className="checkout-title">Checkout</h2>

            {/* Order Summary */}
            <div className="order-summary">
              <h4>Order Summary</h4>
              {cart.map(item => (
                <div className="order-row" key={item.id}>
                  <span>{item.productName} &times; {item.qty}</span>
                  <span>&#8377;{(item.pricePerUnit * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-row order-total-row">
                <span>Total</span>
                <span>&#8377;{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <h4 className="pay-method-title">Payment Method</h4>
            <div className="pay-method-tabs">
              {[
                { key: 'upi', label: 'UPI', icon: <IconSmartphone size={22} /> },
                { key: 'netbanking', label: 'Net Banking', icon: <IconBuilding size={22} /> },
                { key: 'cod', label: 'Cash on Delivery', icon: <IconBanknote size={22} /> },
              ].map(m => (
                <button key={m.key} className={`pay-tab ${paymentMethod === m.key ? 'active' : ''}`} onClick={() => setPaymentMethod(m.key)} disabled={processing}>
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>

            {/* Payment Form */}
            <div className="pay-form">
              {paymentMethod === 'upi' && (
                <div className="pay-field">
                  <label>UPI ID</label>
                  <input type="text" placeholder="e.g. priya.sharma@upi" value={upiId} onChange={e => setUpiId(e.target.value)} disabled={processing} />
                </div>
              )}
              {paymentMethod === 'netbanking' && (
                <div className="pay-field">
                  <label>Select Bank</label>
                  <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} disabled={processing}>
                    {DEMO_BANKS.map(b => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
              )}
              {paymentMethod === 'cod' && (
                <div className="pay-cod-info">
                  <span className="cod-icon"><IconTruck size={36} /></span>
                  <p>Pay with cash when your order is delivered. No advance payment required.</p>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              className={`btn-pay ${processing ? 'paying' : ''}`}
              onClick={handlePay}
              disabled={processing || (paymentMethod === 'upi' && !upiId.trim())}
            >
              {processing ? (
                <span className="pay-spinner-wrap">
                  <span className="pay-spinner" />
                  Processing...
                </span>
              ) : (
                `Pay \u20B9${cartTotal.toFixed(2)}`
              )}
            </button>
          </div>
        </>
      )}

      {/* Payment Success Overlay */}
      {paymentSuccess && (
        <div className="success-overlay">
          <div className="confetti-container">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                backgroundColor: ['#2563eb', '#059669', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
              }} />
            ))}
          </div>

          <div className="success-card">
            <div className="success-checkmark">
              <svg viewBox="0 0 52 52" className="checkmark-svg">
                <circle className="checkmark-circle" cx="26" cy="26" r="24" fill="none" />
                <path className="checkmark-check" fill="none" d="M14 27l8 8 16-16" />
              </svg>
            </div>

            <h2>Payment Successful!</h2>
            <p className="success-amount">&#8377;{cartTotal.toFixed(2)} paid via {
              paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery'
            }</p>
            <p className="success-sub">Your order has been placed successfully. Thank you for shopping with us!</p>

            <div className="success-order-id">
              Order ID: <strong>#HA{Date.now().toString().slice(-8)}</strong>
            </div>

            <button className="btn-back-shopping" onClick={handlePaymentDone}>
              Back to Shopping
            </button>
          </div>
        </div>
      )}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}