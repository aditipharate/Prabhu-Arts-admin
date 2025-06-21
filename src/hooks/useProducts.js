import { useState, useEffect } from 'react';
import { ProductService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (productData, images) => {
    try {
      const id = await ProductService.createProduct(productData, images);
      await fetchProducts(); // Refresh the list
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, productData, newImages, existingImages) => {
    try {
      await ProductService.updateProduct(id, productData, newImages, existingImages);
      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id, images) => {
    try {
      await ProductService.deleteProduct(id, images);
      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const searchProducts = async (searchTerm, category) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.searchProducts(searchTerm, category);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    refreshProducts: fetchProducts
  };
};