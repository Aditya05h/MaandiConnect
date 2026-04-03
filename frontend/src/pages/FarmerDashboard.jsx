import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboards.css';
import './FarmerDashboard.css';
import { auth } from '../firebase';
import {
  IconWheat, IconLeaf, IconSprout,
  IconPackage, IconTrendingUp, IconCalendar, IconUser,
  IconEdit, IconTrash, IconRocket, IconPlus, IconX
} from './Icons';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ProfileModal from '../components/ProfileModal';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Farmer';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    harvestDate: '',
    image: '',
    category: 'Vegetables'
  });

  // Chatbot states
  const chatEndRef = useRef(null);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your MandiConnect AI Assistant. How can I help with your harvest today?' }
  ]);

  useEffect(() => {
    const r = localStorage.getItem('role');
    if (r !== 'Farmer') {
      if (r === 'Buyer') {
        alert("Access Denied: You are a Buyer. Redirecting to your dashboard.");
        navigate('/buyer-marketplace');
      } else {
        alert("Access Denied: Your role is different. You cannot access the Farmer Dashboard.");
        navigate('/');
      }
      return;
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (chatEndRef.current && messages.length > 1) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Check if user is logged in and is a farmer
    const isLoggedIn = !!localStorage.getItem('userName');
    const userRole = localStorage.getItem('role');

    if (!isLoggedIn) {
      alert('Please login to add products');
      navigate('/auth');
      return;
    }

    if (userRole !== 'Farmer') {
      alert('Only farmers can add products. Please login as a farmer.');
      return;
    }

    if (!newProduct.name || !newProduct.price || !newProduct.harvestDate) return;

    const formData = new FormData();
    formData.append('productName', newProduct.name);
    formData.append('pricePerUnit', newProduct.price);
    formData.append('farmerName', userName);
    formData.append('category', newProduct.category);
    formData.append('quantity', 100); // Default quantity
    formData.append('unit', 'kg'); // Default unit
    formData.append('location', 'Local Farm'); // Default location
    formData.append('contactNumber', localStorage.getItem('userPhone') || '0000000000');
    formData.append('description', `Harvested on ${newProduct.harvestDate}`);

    if (selectedFile) {
      formData.append('productImage', selectedFile);
    } else if (newProduct.image) {
      formData.append('imageUrl', newProduct.image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        fetchProducts(); // Refresh the list
        setNewProduct({ name: '', price: '', harvestDate: '', image: '', category: 'Vegetables' });
        setSelectedFile(null);
        setFilePreview(null);
        setShowAddForm(false);
      } else {
        console.error("Error adding product:", data.message);
        alert(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (response.ok) {
        // Remove from local state
        setProducts(products.filter(p => p.id !== id));
        alert('Product deleted successfully');
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.productName,
      price: product.pricePerUnit,
      harvestDate: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : '',
      image: product.imageUrl || '',
      category: product.category
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const formData = new FormData();
    formData.append('productName', newProduct.name);
    formData.append('pricePerUnit', newProduct.price);
    formData.append('farmerName', userName);
    formData.append('category', newProduct.category);
    formData.append('quantity', 100);
    formData.append('unit', 'kg');
    formData.append('location', 'Local Farm');
    formData.append('contactNumber', localStorage.getItem('userPhone') || '0000000000');
    formData.append('description', `Updated on ${new Date().toLocaleDateString()}`);

    if (selectedFile) {
      formData.append('productImage', selectedFile);
    } else if (newProduct.image) {
      formData.append('imageUrl', newProduct.image);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        fetchProducts();
        setNewProduct({ name: '', price: '', harvestDate: '', image: '', category: 'Vegetables' });
        setSelectedFile(null);
        setFilePreview(null);
        setShowAddForm(false);
        setEditingProduct(null);
        alert('Product updated successfully');
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({ name: '', price: '', harvestDate: '', image: '', category: 'Vegetables' });
    setSelectedFile(null);
    setFilePreview(null);
    setShowAddForm(false);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '';
    e.target.style.display = 'none';
    e.target.parentElement.classList.add('img-fallback');
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.clear();
      navigate('/auth');
    }).catch((error) => {
      console.error("Logout error:", error);
      localStorage.clear();
      navigate('/auth');
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', text: chatInput };
    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyBWc3x_x-MhQZQd8TzjYKgVdgFaRpIgZKk");  // Placeholder - replace with real key
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: "You are the MandiConnect AI Assistant. You help farmers with crop health, market prices, and farming advice. Keep responses concise and professional."
      });

      // FIX: Filter out the initial 'bot' greeting so history starts with 'user'
      const apiHistory = messages
        .filter((m, index) => !(index === 0 && m.role === 'bot'))
        .map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));

      const chat = model.startChat({ history: apiHistory });
      const result = await chat.sendMessage(chatInput);
      const response = await result.response;
      const botText = response.text();

      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="dashboard-container farmer-theme">
      {/* Navigation */}
      <nav className="premium-navbar farmer-nav">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <IconWheat size={26} />
          MandiConnect Farmer
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/')}
            className="btn-back-custom"
            style={{ marginBottom: 0 }}
          >
            <svg className="back-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </button>
          <div className="nav-profile-container"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}>
            <div className="nav-profile">
              {userName.charAt(0).toUpperCase()}
            </div>
            {dropdownOpen && (
              <div className="profile-dropdown">
                <button onClick={() => setIsProfileOpen(true)} className="dropdown-item">My Profile</button>
                <button onClick={handleLogout} className="dropdown-item">Log Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Header */}
        <div className="farmer-header">
          <div className="farmer-header-text">
            <h1>Welcome back, {userName}</h1>
            <p>Manage your farm produce and reach more buyers.</p>
          </div>
          <button
            className={`farmer-btn-add ${showAddForm ? 'cancel' : ''}`}
            onClick={() => {
              if (showAddForm) {
                handleCancelEdit();
              } else {
                setShowAddForm(true);
              }
            }}
          >
            {showAddForm ? (
              <><IconX size={18} /> Cancel</>
            ) : (
              <><IconPlus size={18} /> Add Harvest</>
            )}
          </button>
        </div>

        {/* Stats Strip */}
        <div className="farmer-stats">
          <div className="stat-card">
            <span className="stat-icon"><IconPackage size={24} /></span>
            <div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Listed Products</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><IconTrendingUp size={24} /></span>
            <div>
              <div className="stat-value">&#8377;{products.reduce((s, p) => s + Number(p.price || 0), 0)}</div>
              <div className="stat-label">Total Value</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><IconSprout size={24} /></span>
            <div>
              <div className="stat-value">Active</div>
              <div className="stat-label">Farm Status</div>
            </div>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="farmer-add-card slide-down">
            <h3><IconLeaf size={22} /> {editingProduct ? 'Edit Product' : 'List a New Harvest'}</h3>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="farmer-form">
              <div className="farmer-form-grid">
                <div className="farmer-field">
                  <label>Product Name</label>
                  <input type="text" placeholder="e.g. Organic Carrots" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                </div>
                <div className="farmer-field">
                  <label>Price (&#8377;/kg)</label>
                  <input type="number" placeholder="Enter price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                </div>
                <div className="farmer-field">
                  <label>Harvest Date</label>
                  <input type="date" value={newProduct.harvestDate} onChange={e => setNewProduct({ ...newProduct, harvestDate: e.target.value })} required />
                </div>
              </div>
              <div className="farmer-field">
                <label>Crop Category</label>
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="farmer-input-select"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Spices">Spices</option>
                </select>
              </div>
              <div className="farmer-field">
                <label>Product Image</label>
                {/* File input for local device uploads */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    if (file) {
                      setFilePreview(URL.createObjectURL(file));
                    } else {
                      setFilePreview(null);
                    }
                  }}
                  style={{ marginBottom: '10px' }}
                />

                <p style={{ fontSize: '0.8rem', color: '#666' }}>OR paste an image URL</p>
                <label>Image URL (Optional)</label>
                <input type="url" placeholder="Paste an image URL of your crop" value={newProduct.image} onChange={e => {
                  setNewProduct({ ...newProduct, image: e.target.value });
                  setFilePreview(null); // Clear file preview if text URL is modified
                }} />
              </div>
              {(filePreview || newProduct.image) && (
                <div className="farmer-img-preview">
                  <img src={filePreview || getImageUrl(newProduct.image)} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              <button type="submit" className="farmer-btn-submit">
                <IconRocket size={18} /> {editingProduct ? 'Update Product' : 'Publish Product'}
              </button>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="farmer-listings">
          <h2 className="farmer-section-title">Your Current Listings</h2>

          {products.length === 0 ? (
            <div className="farmer-empty">
              <span className="farmer-empty-icon"><IconWheat size={56} /></span>
              <h3>No products listed yet</h3>
              <p>Add your first harvest to start reaching buyers!</p>
            </div>
          ) : (
            <div className="farmer-grid">
              {products.map((product, index) => (
                <div key={product.id || index} className="farmer-product-card" style={{ animationDelay: `${index * 0.06}s` }}>
                  {/* Image */}
                  <div className="farmer-card-img-wrap">
                    {product.imageUrl ? (
                      <img src={getImageUrl(product.imageUrl)} alt={product.productName} className="farmer-card-img" onError={handleImageError} loading="lazy" />
                    ) : (
                      <div className="farmer-card-img-placeholder">
                        <IconLeaf size={48} />
                      </div>
                    )}
                    <div className="farmer-card-price">&#8377;{product.pricePerUnit}/{product.unit || 'kg'}</div>
                  </div>

                  {/* Body */}
                  <div className="farmer-card-body">
                    <h4>{product.productName}</h4>
                    {product.createdAt && (
                      <p className="farmer-card-date">
                        <IconCalendar size={15} /> Listed: {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {product.farmerName && (
                      <p className="farmer-card-by">
                        <IconUser size={15} /> By: {product.farmerName}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="farmer-card-actions">
                    <button className="farmer-btn-edit" onClick={() => handleEditProduct(product)}>
                      <IconEdit size={15} /> Edit
                    </button>
                    <button className="farmer-btn-delete" onClick={() => handleDeleteProduct(product.id)}>
                      <IconTrash size={15} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <section className="integrated-ai-section">
          <div className="ai-container-header">
            <div className="ai-branding">
              <div className="ai-glow-dot"></div>
              <h3>MandiConnect AI Assistant</h3>
            </div>
            <p>Ask about crop diseases, market trends, or weather impacts.</p>
          </div>

          <div className="ai-chat-window">
            <div className="ai-chat-messages">
              {/* The '&&' checks if messages exists before trying to show them */}
              {messages && messages.map((msg, i) => (
                <div key={i} className={`ai-bubble-wrap ${msg.role}`}>
                  <div className="ai-bubble">
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form className="ai-chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your farming query here..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="ai-send-btn">
                <IconRocket size={20} />
              </button>
            </form>
          </div>
        </section>
      </main>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>

  );
}