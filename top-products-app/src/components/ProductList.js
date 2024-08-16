import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/test';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    company: '',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
    availability: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/companies/AMZ/categories/Laptop/products/top-10?minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [filters]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top Products</h1>
      {/* Filter Form */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        {/* Add filter inputs here */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.productName} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{product.productName}</h3>
            <p>Price: ${product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Discount: {product.discount}%</p>
            <p>Availability: {product.availability}</p>
            <Link to={`/product/${product.productName}`} className="text-blue-500">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
