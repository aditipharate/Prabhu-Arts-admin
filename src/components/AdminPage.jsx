import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeItem, setActiveItem] = useState('dashboard'); // NEW

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveItem('dashboard'); // switch to form
  };

  const handleProductSaved = () => {
    setEditingProduct(null);
    setRefreshTrigger(prev => prev + 1);
    setActiveItem('products'); // after saving, go to list
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                  <p className="mt-2 text-gray-600">Add and manage your product catalog</p>
                </div>
              </div>
            </div>

            {/* Conditional Rendering */}
            {activeItem === 'dashboard' && (
              <div className="mb-8">
                <ProductForm
                  editingProduct={editingProduct}
                  onProductSaved={handleProductSaved}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            {activeItem === 'products' && (
              <ProductList
                onEditProduct={handleEditProduct}
                refreshTrigger={refreshTrigger}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
