import React, { useState } from 'react';
import axios from 'axios';

interface SweetItemProps {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  onPurchase?: (id: string) => void;
}

const SweetItem: React.FC<SweetItemProps> = ({ id, name, category, price, quantity, onPurchase }) => {
  const [loading, setLoading] = useState(false);
  const [currentQty, setCurrentQty] = useState(quantity);

  const handlePurchase = async () => {
    if (currentQty === 0) return;
    setLoading(true);
    try {
      await axios.post(`/api/sweets/${id}/purchase`);
      setCurrentQty(qty => qty - 1);
      if (onPurchase) onPurchase(id);
    } catch (error) {
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col items-start space-y-2 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800">{name}</h2>
      <div className="text-sm text-gray-500">Category: {category}</div>
      <div className="text-sm text-gray-700">Price: ${price.toFixed(2)}</div>
      <div className="text-sm text-gray-700">Quantity: {currentQty}</div>
      <button
        className={`mt-2 px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition`}
        disabled={currentQty === 0 || loading}
        onClick={handlePurchase}
      >
        {currentQty === 0 ? 'Out of Stock' : loading ? 'Purchasing...' : 'Purchase'}
      </button>
    </div>
  );
};

export default SweetItem;
