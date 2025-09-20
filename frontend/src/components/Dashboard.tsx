import React, { useEffect, useState } from 'react';
import { Sweet, getSweets, searchSweets, purchaseSweet } from '../services/sweetService';
import SweetItem from './SweetItem';
import './Dashboard.css';

// Dummy user info for header (replace with real user context if available)
const user = { name: 'Sweet Lover', email: 'sweetlover@example.com' };

const Dashboard: React.FC = () => {
	const [sweets, setSweets] = useState<Sweet[]>([]);
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const fetchSweets = async () => {
		setLoading(true);
		setError('');
		try {
			const data = await getSweets();
			setSweets(data);
		} catch (err: any) {
			setError('Failed to load sweets');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSweets();
	}, []);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			const data = await searchSweets({
				name: search || undefined,
				category: category || undefined,
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
			});
			setSweets(data);
		} catch (err: any) {
			setError('Search failed');
		} finally {
			setLoading(false);
		}
	};

	const handlePurchase = async (id: string) => {
		try {
			const sweet = await purchaseSweet(id, 1);
			setSweets(prev => prev.map(s => s._id === id ? { ...s, quantity: sweet.quantity } : s));
		} catch (err: any) {
			alert('Purchase failed');
		}
	};

	// Unique categories for filter dropdown
	const categories = Array.from(new Set(sweets.map(s => s.category)));

	return (
		<div className="dashboard-bg">
			<header className="dashboard-header">
				<div className="header-left">
									<span className="text-3xl">🍬</span>
					<span className="header-title">Sweet Shop Dashboard</span>
				</div>
				<div className="header-user">
					<span className="text-3xl">👤</span>
					<div>
						<div className="user-name">Welcome, {user.name}!</div>
						<div className="user-email">{user.email}</div>
					</div>
				</div>
			</header>

			<section className="search-section">
				<form onSubmit={handleSearch} className="search-form">
					<div className="search-group">
						<span className="text-xl">🔍</span>
						<input
							type="text"
							placeholder="Search by name"
							className="search-input"
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
					<div className="search-group">
										<span className="text-xl">🏷️</span>
						<select
							className="search-input"
							value={category}
							onChange={e => setCategory(e.target.value)}
						>
							<option value="">All Categories</option>
							{categories.map(cat => (
								<option key={cat} value={cat}>{cat}</option>
							))}
						</select>
					</div>
					<div className="search-group">
						<span className="text-xl">💰</span>
						<input
							type="number"
							placeholder="Min Price"
							className="search-input"
							value={minPrice}
							onChange={e => setMinPrice(e.target.value)}
							min={0}
						/>
					</div>
					<div className="search-group">
						<span className="text-xl">💰</span>
						<input
							type="number"
							placeholder="Max Price"
							className="search-input"
							value={maxPrice}
							onChange={e => setMaxPrice(e.target.value)}
							min={0}
						/>
					</div>
					<button type="submit" className="search-btn primary">🔍 Search</button>
									<button type="button" className="search-btn reset" onClick={fetchSweets}>🔄 Reset</button>
				</form>
			</section>

			<main className="sweet-grid">
				{loading ? (
					<div className="loading">Loading sweets...</div>
				) : error ? (
					<div className="error-msg">{error}</div>
				) : (
					sweets.map(sweet => (
						<SweetItem
							key={sweet._id}
							id={sweet._id}
							name={sweet.name}
							category={sweet.category}
							price={sweet.price}
							quantity={sweet.quantity}
							onPurchase={handlePurchase}
						/>
					))
				)}
			</main>
		</div>
	);
};

export default Dashboard;
