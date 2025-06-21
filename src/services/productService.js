import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Products Collection Reference
const productsCollection = collection(db, 'products');

// Upload image to Firebase Storage
export const uploadProductImage = async (file, productId) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const imageRef = ref(storage, `product-images/${productId}/${fileName}`);
    
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      name: fileName,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete image from Firebase Storage
export const deleteProductImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData, imageFiles = []) => {
  try {
    // Remove sku, stock, price if included
    const { sku, stock, price, ...cleanedData } = productData;

    // First create the product document to get an ID
    const docRef = await addDoc(productsCollection, {
      ...cleanedData,
      images: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    });

    // Upload images if any
    const uploadedImages = [];
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const imageData = await uploadProductImage(imageFiles[i], docRef.id);
        uploadedImages.push({
          ...imageData,
          isPrimary: i === 0
        });
      }

      // Update the product with image URLs
      await updateDoc(docRef, {
        images: uploadedImages,
        updatedAt: serverTimestamp()
      });
    }

    return { id: docRef.id, ...cleanedData, images: uploadedImages };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      productsCollection, 
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

// Get single product
export const getProduct = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData, newImageFiles = [], imagesToDelete = []) => {
  try {
    const docRef = doc(db, 'products', productId);

    const { sku, stock, price, ...cleanedData } = productData;

    for (const imagePath of imagesToDelete) {
      await deleteProductImage(imagePath);
    }

    const uploadedImages = [];
    if (newImageFiles.length > 0) {
      for (let i = 0; i < newImageFiles.length; i++) {
        const imageData = await uploadProductImage(newImageFiles[i], productId);
        uploadedImages.push({
          ...imageData,
          isPrimary: i === 0 && (!productData.images || productData.images.length === 0)
        });
      }
    }

    const existingImages = productData.images || [];
    const allImages = [...existingImages, ...uploadedImages];

    await updateDoc(docRef, {
      ...cleanedData,
      images: allImages,
      updatedAt: serverTimestamp()
    });

    return { id: productId, ...cleanedData, images: allImages };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const product = await getProduct(productId);
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        await deleteProductImage(image.path);
      }
    }

    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Toggle product active status
export const toggleProductStatus = async (productId, isActive) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }
};
