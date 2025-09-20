import React, { useState, useEffect } from 'react';
import { Sweet, getSweets, searchSweets, purchaseSweet } from '../services/sweetService';
import { useAuth } from '../context/AuthContext';

const SweetList: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const data = await getSweets();
      setSweets(data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const params: any = {};
      if (searchName) params.name = searchName;
      if (searchCategory) params.category = searchCategory;
      if (minPrice) params.minPrice = parseFloat(minPrice);
      if (maxPrice) params.maxPrice = parseFloat(maxPrice);
      
      const data = await searchSweets(params);
      setSweets(data);
    } catch (error) {
      console.error('Error searching sweets:', error);
    }
  };

  const handlePurchase = async (id: string, quantity: number = 1) => {
    try {
      await purchaseSweet(id, quantity);
      fetchSweets(); // Refresh the list
      alert('Purchase successful!');
    } catch (error) {
      console.error('Error purchasing sweet:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Available Sweets</h2>
      
      <div className="search-filters">
        <div className="form-group">
          <label>🔍 Search by Name</label>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter sweet name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <span className="input-icon">🔍</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>🏷️ Category</label>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
            <span className="input-icon">🏷️</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>💰 Min Price</label>
          <div className="input-container">
            <input
              type="number"
              placeholder="0.00"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />
            <span className="input-icon">💰</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>💎 Max Price</label>
          <div className="input-container">
            <input
              type="number"
              placeholder="999.99"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
            />
            <span className="input-icon">💎</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={handleSearch}>🔍 Search</button>
          <button onClick={fetchSweets}>🔄 Clear</button>
        </div>
      </div>
      
      <div className="sweets-grid">
        {sweets.map((sweet) => (
          <div key={sweet._id} className="sweet-card">
            <h3>{sweet.name}</h3>
            <p>Category: {sweet.category}</p>
            <p>Price: ${sweet.price.toFixed(2)}</p>
            <p>In stock: {sweet.quantity}</p>
            <button
              onClick={() => handlePurchase(sweet._id, 1)}
              disabled={sweet.quantity === 0}
            >
              {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SweetList;