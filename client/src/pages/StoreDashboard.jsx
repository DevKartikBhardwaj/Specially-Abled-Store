import React, { useState, useEffect } from 'react';
import '../styles/storeDashboard.css';

export default function StoreDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    imageDesc: '',
    title: '',
    description: '',
    category: '',
    mrp: '',
    rating: ''
  });

  useEffect(() => {
    
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setProducts([...products, { ...form, id: Date.now() }]);
    setForm({
      imageDesc: '',
      title: '',
      description: '',
      category: '',
      mrp: '',
      rating: ''
    });
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleEdit = (id) => {
    const toEdit = products.find(p => p.id === id);
    setForm(toEdit);
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="dashboard">

      <form className="product-form" onSubmit={handleSubmit}>
        <input type="text" name="imageDesc" value={form.imageDesc} onChange={handleChange} placeholder="Image Description" required aria-label="Image Description" />
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Product Title" required aria-label="Product Title" />
        <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Product Description" required aria-label="Product Description" />
        <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Product Category" required aria-label="Product Category" />
        <input type="number" name="mrp" value={form.mrp} onChange={handleChange} placeholder="MRP" required aria-label="Product Price" />
        <input type="number" name="rating" value={form.rating} onChange={handleChange} placeholder="Rating" required aria-label="Product Rating" />
        <button type="submit" aria-label="Upload Product">Upload</button>
      </form>

      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card" aria-label={`Product card for ${product.title}`}>
            <div className="product-image" aria-label={`Image description: ${product.imageDesc}`}></div>
            <h3 aria-label={`Product title: ${product.title}`}>{product.title}</h3>
            <p aria-label={`Description: ${product.description}`}>{product.description}</p>
            <span aria-label={`Category: ${product.category}`}>Category: {product.category}</span>
            <span aria-label={`MRP: ${product.mrp}`}>MRP: ₹{product.mrp}</span>
            <span aria-label={`Rating: ${product.rating} stars`}>Rating: {product.rating}</span>
            <div className="card-actions">
              <button onClick={() => handleEdit(product.id)} aria-label="Edit Product">Edit</button>
              <button onClick={() => handleDelete(product.id)} aria-label="Delete Product">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
