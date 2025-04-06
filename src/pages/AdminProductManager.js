import React, {useEffect, useState} from 'react';
import api from '../services/api';

function AdminProductManager() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        amountLeft: 0,
        categories: []
    });
    const [image, setImage] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);

    const categoryOptions = ['home', 'gift', 'mugs', 'clothing', 'accessories', 'hoodies'];

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleCreate = () => {
        api.post('/products', newProduct)
            .then(res => {
                if (image) {
                    const formData = new FormData();
                    formData.append("file", image);
                    return api.post(`/products/${res.data.id}/upload`, formData, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    });
                }
                return res;
            })
            .then(() => window.location.reload())
            .catch(err => alert("Create failed"));
    };

    const handleUpdate = () => {
        api.put(`/products/${editingProduct.id}`, editingProduct)
            .then(() => {
                if (image) {
                    const formData = new FormData();
                    formData.append("file", image);
                    return api.post(`/products/${editingProduct.id}/upload`, formData, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    });
                }
            })
            .then(() => window.location.reload())
            .catch(err => alert("Update failed"));
    };

    const handleDelete = (id) => {
        api.delete(`/products/${id}`)
            .then(() => setProducts(products.filter(p => p.id !== id)))
            .catch(err => alert("Delete failed"));
    };

    const handleToggleAvailability = (productId, available) => {
        api.put(`/products/${productId}/availability`, null, {
            params: { available }
        })
            .then(() => {
                setProducts(prev =>
                    prev.map(p =>
                        p.id === productId ? { ...p, available } : p
                    )
                );
            })
            .catch(err => {
                alert("Failed to update availability");
                console.error(err);
            });
    };

    return (
        <div className="container mt-4">
            <h2>Admin Product Manager</h2>

            <div className="card p-3 my-3">
                <h4>Add New Product</h4>
                <input className="form-control my-1" placeholder="Name"
                       onChange={e => setNewProduct({...newProduct, name: e.target.value})}/>
                <input className="form-control my-1" placeholder="Description"
                       onChange={e => setNewProduct({...newProduct, description: e.target.value})}/>
                <input className="form-control my-1" type="number" placeholder="Price"
                       onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}/>
                <input className="form-control my-1" type="number" placeholder="Amount Left"
                       onChange={e => setNewProduct({...newProduct, amountLeft: parseInt(e.target.value)})}/>
                <select className="form-control my-1" multiple onChange={e => setNewProduct({
                    ...newProduct,
                    categories: Array.from(e.target.selectedOptions).map(o => o.value)
                })}>
                    {categoryOptions.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                    ))}
                </select>
                <input className="form-control my-1" type="file" onChange={e => setImage(e.target.files[0])}/>
                <button className="btn btn-success mt-2" onClick={handleCreate}>Create</button>
            </div>

            {editingProduct && (
                <div className="card p-3 my-3">
                    <h4>Edit Product</h4>
                    <input className="form-control my-1" value={editingProduct.name}
                           onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}/>
                    <input className="form-control my-1" value={editingProduct.description}
                           onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}/>
                    <input className="form-control my-1" type="number" value={editingProduct.price}
                           onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}/>
                    <input className="form-control my-1" type="number" value={editingProduct.amountLeft}
                           onChange={e => setEditingProduct({
                               ...editingProduct,
                               amountLeft: parseInt(e.target.value)
                           })}/>
                    <select className="form-control my-1" multiple value={editingProduct.categories}
                            onChange={e => setEditingProduct({
                                ...editingProduct,
                                categories: Array.from(e.target.selectedOptions).map(o => o.value)
                            })}>
                        {categoryOptions.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input className="form-control my-1" type="file" onChange={e => setImage(e.target.files[0])}/>
                    <button className="btn btn-primary mt-2" onClick={handleUpdate}>Save</button>
                    <button className="btn btn-secondary mt-2 ms-2" onClick={() => setEditingProduct(null)}>Cancel</button>
                </div>
            )}

            <ul className="list-group">
                {products.map(product => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={product.id}>
                        <div style={{ cursor: 'pointer' }} onClick={() => setEditingProduct(product)}>
                            {product.name} (${product.price})
                        </div>

                        <div className="d-flex align-items-center">
                            <label className="me-3 mb-0">
                                <input
                                    type="checkbox"
                                    checked={product.available}
                                    onChange={(e) => handleToggleAvailability(product.id, e.target.checked)}
                                    className="form-check-input me-1"
                                />
                                {product.available ? "Available" : "Unavailable"}
                            </label>

                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(product.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminProductManager;
