import { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../services/productService';
import { getAllCategories } from '../services/categoryService';
import toast, { Toaster } from 'react-hot-toast';

const ProductForm = ({ editingProduct, onProductSaved, onCancel }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productHeight: '',
    productWidth: '',
    category: '',
    materialUsed: '',
    price: '',
    sku: '',
    stock: '',
    features: ['']
  });

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title || '',
        description: editingProduct.description || '',
        productHeight: editingProduct.productHeight || '',
        productWidth: editingProduct.productWidth || '',
        category: editingProduct.category || '',
        materialUsed: editingProduct.materialUsed || '',
        price: editingProduct.price || '',
        sku: editingProduct.sku || '',
        stock: editingProduct.stock || '',
        features: editingProduct.features || ['']
      });
      setUploadedImages(editingProduct.images || []);
    }
  }, [editingProduct]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (uploadedImages.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name,
          isNew: true
        }]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    const imageIndex = uploadedImages.findIndex(img => img.id === id);
    if (imageIndex !== -1) {
      setUploadedImages(prev => prev.filter(img => img.id !== id));
      if (uploadedImages[imageIndex].isNew) {
        setImageFiles(prev => prev.filter((_, index) => index !== imageIndex));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty features
      const cleanedFeatures = formData.features.filter(feature => feature.trim() !== '');
      
      const productData = {
        ...formData,
        features: cleanedFeatures,
        stock: parseInt(formData.stock) || 0
      };

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, productData, imageFiles);
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        await addProduct(productData, imageFiles);
        toast.success('Product added successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        productHeight: '',
        productWidth: '',
        category: '',
        materialUsed: '',
        price: '',
        sku: '',
        stock: '',
        features: ['']
      });
      setUploadedImages([]);
      setImageFiles([]);

      // Notify parent component
      if (onProductSaved) {
        onProductSaved();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (uploadedImages.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            name: file.name,
            isNew: true
          }]);
          setImageFiles(prev => [...prev, file]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the product details and upload images</p>
          </div>
          {editingProduct && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Photo Upload */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
                
                {/* Photo Preview Area */}
                <div 
                  className="border-2 border-gray-300 border-dashed rounded-xl p-8 bg-gray-50 min-h-80 transition-colors hover:border-blue-400 hover:bg-blue-50"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {uploadedImages.length === 0 ? (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-gray-600 text-lg font-medium mb-2">Upload Product Images</div>
                      <div className="text-gray-500 text-sm">Drag and drop images here, or click to browse</div>
                      <div className="text-gray-400 text-xs mt-2">PNG, JPG, GIF up to 10MB each (max 5 images)</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-32 object-cover rounded-lg border shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 transform hover:scale-110"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                      {uploadedImages.length < 5 && (
                        <div className="border-2 border-gray-300 border-dashed rounded-lg h-32 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer">
                          <div className="text-center">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <div className="text-sm">Add More</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="relative mt-4">
                  <input
                    type="file"
                    id="photo-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadedImages.length >= 5}
                  />
                  <button
                    type="button"
                    className={`w-full py-3 px-4 border-2 border-dashed rounded-lg text-center font-medium transition-all ${
                      uploadedImages.length >= 5
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                        : 'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                    }`}
                    disabled={uploadedImages.length >= 5}
                  >
                    {uploadedImages.length >= 5 
                      ? 'Maximum 5 photos reached' 
                      : `Choose Files (${uploadedImages.length}/5)`
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Describe your product in detail..."
                    required
                  />
                </div>

                

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="productHeight" className="block text-sm font-medium text-gray-700 mb-2">
                      Height
                    </label>
                    <input
                      type="text"
                      id="productHeight"
                      name="productHeight"
                      value={formData.productHeight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="10cm"
                    />
                  </div>

                  <div>
                    <label htmlFor="productWidth" className="block text-sm font-medium text-gray-700 mb-2">
                      Width
                    </label>
                    <input
                      type="text"
                      id="productWidth"
                      name="productWidth"
                      value={formData.productWidth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="15cm"
                    />
                  </div>

                
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="materialUsed" className="block text-sm font-medium text-gray-700 mb-2">
                      Material Used
                    </label>
                    <input
                      type="text"
                      id="materialUsed"
                      name="materialUsed"
                      value={formData.materialUsed}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., Steel, Aluminum"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingProduct ? 'Update Product' : 'Save Product'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductForm;