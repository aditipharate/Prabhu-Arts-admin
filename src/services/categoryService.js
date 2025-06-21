import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const categoriesCollection = collection(db, 'categories');

// Add new category
export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(categoriesCollection, {
      ...categoryData,
      createdAt: serverTimestamp(),
      isActive: true
    });
    
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const q = query(categoriesCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: serverTimestamp()
    });
    
    return { id: categoryId, ...categoryData };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};