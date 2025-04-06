import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

function ProductList({ userId, onCartUpdate, cart }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filter, setFilter] = useState({ category: '', minPrice: '', maxPrice: '' });
    const [categories, setCategories] = useState(['home', 'gift', 'mugs', 'clothing', 'accessories']);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get('/products/available')
            .then(res => {
                setProducts(res.data);
                setFilteredProducts(res.data);
            })
            .catch(err => {
                if (err.response?.status === 403 || err.response?.status === 401) {
                    setError("Please log in to view the product catalog");
                } else {
                    setError("Failed to load products");
                }
                console.error(err);
            });
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    const applyFilter = () => {
        let result = [...products];
        if (filter.category) {
            result = result.filter(p =>
                p.categories && p.categories.some(c => c.toLowerCase() === filter.category.toLowerCase())
            );
        }
        if (filter.minPrice) {
            result = result.filter(p => p.price >= parseFloat(filter.minPrice));
        }
        if (filter.maxPrice) {
            result = result.filter(p => p.price <= parseFloat(filter.maxPrice));
        }
        setFilteredProducts(result);
    };

    return (
        <div className="container mt-4">
            <h2>Product Catalog</h2>

            <div className="card p-3 mb-4">
                <h4>Filter Products</h4>
                <div className="row">
                    <div className="col-md-3">
                        <label>Category</label>
                        <select name="category" className="form-control" onChange={handleFilterChange}>
                            <option value="">All</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label>Min Price</label>
                        <input type="number" name="minPrice" className="form-control" onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-3">
                        <label>Max Price</label>
                        <input type="number" name="maxPrice" className="form-control" onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={applyFilter}>Apply</button>
                    </div>
                </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {filteredProducts.map(product => (
                    <div className="col" key={product.id}>
                        <ProductCard
                            product={product}
                            userId={userId}
                            onCartUpdate={onCartUpdate}
                            cart={cart}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;