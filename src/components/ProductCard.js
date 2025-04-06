import React, { useState } from 'react';
import { addToCart } from '../services/cart';

function ProductCard({ product, userId, onCartUpdate, cart }) {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        const productId = product.id || product._id;
        if (!productId) {
            alert("Product ID is missing");
            return;
        }

        addToCart(userId, productId, quantity)
            .then(() => {
                alert(`${product.name} added to cart!`);
                if (onCartUpdate) onCartUpdate();
            })
            .catch((err) => {
                console.error("Failed to add to cart:", err);

                if (err.response && err.response.status === 400) {
                    alert("Not enough stock for this product");
                } else {
                    alert("Error adding product to cart.");
                }
            });
    };

    const cartItem = cart?.items?.find(item => item.productId === product.id);
    const alreadyInCart = cartItem?.quantity || 0;

    return (
        <div className="card h-100">
            <img
                src={`${process.env.REACT_APP_API_URL}${product.image}`}
                className="card-img-top"
                alt={product.name}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                {product.categories && product.categories.length > 0 && (
                    <p><strong>Categories:</strong> {product.categories.join(', ')}</p>
                )}
                <p><strong>Price:</strong> ${product.price}</p>
                <div className="mb-2">
                    <label htmlFor={`qty-${product.id}`} className="form-label">Quantity:</label>
                    <input
                        id={`qty-${product.id}`}
                        type="number"
                        min="1"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>
                {alreadyInCart > 0 && (
                    <p className="text-success">In cart: {alreadyInCart}</p>
                )}
                <button className="btn btn-sm btn-primary mt-auto" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;