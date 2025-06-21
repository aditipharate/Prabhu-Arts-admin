import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Video, Users, Building, Car, Clock, Eye, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { getAllProducts, getProductsByCategory } from '../services/productService';
import { getAllCategories } from '../services/categoryService';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default categories with icons (fallback if no categories in Firebase)
  const defaultCategories = [
    { id: 'all', name: 'All Services', icon: Shield },
    { id: 'guards', name: 'Security Guards', icon: Users },
    { id: 'surveillance', name: 'Surveillance', icon: Video },
    { id: 'systems', name: 'Security Systems', icon: Lock },
    { id: 'mobile', name: 'Mobile Patrols', icon: Car }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories from Firebase
      const categoriesData = await getAllCategories();
      
      // Combine default categories with Firebase categories
      const allCategories = [
        { id: 'all', name: 'All Services', icon: Shield },
        ...categoriesData.map(cat => ({
          ...cat,
          icon: getIconForCategory(cat.name) // Helper function to map icons
        }))
      ];
      
      setCategories(allCategories);
      
      // Load initial products
      await loadProducts();
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to default categories
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      let productsData;
      
      if (activeCategory === 'all') {
        productsData = await getAllProducts();
      } else {
        productsData = await getProductsByCategory(activeCategory);
      }
      
      // Filter only active products for public display
      const activeProducts = productsData.filter(product => product.isActive);
      setProducts(activeProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  // Helper function to map category names to icons
  const getIconForCategory = (categoryName) => {
    const iconMap = {
      'Security Guards': Users,
      'Surveillance': Video,
      'Security Systems': Lock,
      'Mobile Patrols': Car,
      'Access Control': Building,
      'Monitoring': Eye,
      'Emergency': Shield
    };
    
    return iconMap[categoryName] || Shield;
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-primary-900 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white opacity-90 max-w-3xl mx-auto"
            >
              Comprehensive security services and systems designed to protect your assets, people, and peace of mind
            </motion.p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {activeCategory === 'all' 
                  ? 'No products are currently available.' 
                  : 'No products found in this category.'
                }
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {product.price && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {product.price}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {product.features.slice(0, 4).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 group">
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;