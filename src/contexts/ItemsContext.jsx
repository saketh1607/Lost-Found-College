import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ItemsContext = createContext();

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'items'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const itemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    formData.append('folder', 'lost_found');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error('Error uploading to Cloudinary:', err);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const addItem = async (itemData) => {
    try {
      const { image, ...restData } = itemData;
      let imageUrl = '';
      
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }

      const newItem = {
        ...restData,
        imageUrl,
        date: serverTimestamp(),
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'items'), newItem);
      await fetchItems(); // Refresh the items list
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete item by id
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      await fetchItems();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const value = {
    items,
    loading,
    error,
    addItem,
    deleteItem,
    refreshItems: fetchItems
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}; 