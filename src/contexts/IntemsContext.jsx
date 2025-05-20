import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Create Context
const ItemsContext = createContext();

// Context Provider Component
export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsQuery = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(itemsQuery);
        
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setItems(fetchedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Get item by ID
  const getItemById = (id) => {
    return items.find(item => item.id === id);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'lost_and_found'); // Set your Cloudinary upload preset

    const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Alternative: Upload image to Firebase Storage
  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `items/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { url: downloadURL, path: storageRef.fullPath };
  };

  // Add a new item
  const addItem = async (itemData, imageFile) => {
    setLoading(true);
    try {
      let imageData = null;
      
      // Choose one of these methods based on your preference
      if (process.env.REACT_APP_USE_CLOUDINARY === 'true') {
        const imageUrl = await uploadImageToCloudinary(imageFile);
        imageData = { url: imageUrl };
      } else {
        imageData = await uploadImageToFirebase(imageFile);
      }
      
      const newItem = {
        ...itemData,
        imageUrl: imageData.url,
        imagePath: imageData.path, // Store the path for Firebase Storage
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'items'), newItem);
      
      const addedItem = {
        id: docRef.id,
        ...newItem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setItems(prevItems => [addedItem, ...prevItems]);
      setLoading(false);
      return addedItem;
    } catch (error) {
      setLoading(false);
      console.error('Error adding item:', error);
      throw error;
    }
  };

  // Update an existing item
  const updateItem = async (id, itemData, imageFile) => {
    setLoading(true);
    try {
      const itemRef = doc(db, 'items', id);
      const itemSnapshot = await getDoc(itemRef);
      
      if (!itemSnapshot.exists()) {
        throw new Error('Item not found');
      }
      
      const oldItem = { id: itemSnapshot.id, ...itemSnapshot.data() };
      let updateData = { ...itemData, updatedAt: serverTimestamp() };
      
      // If a new image is provided, upload it
      if (imageFile) {
        // Delete old image if using Firebase Storage
        if (oldItem.imagePath) {
          try {
            const oldImageRef = ref(storage, oldItem.imagePath);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue with the update even if deleting the old image fails
          }
        }
        
        // Upload new image
        let imageData = null;
        if (process.env.REACT_APP_USE_CLOUDINARY === 'true') {
          const imageUrl = await uploadImageToCloudinary(imageFile);
          imageData = { url: imageUrl };
        } else {
          imageData = await uploadImageToFirebase(imageFile);
        }
        
        updateData.imageUrl = imageData.url;
        updateData.imagePath = imageData.path;
      }
      
      await updateDoc(itemRef, updateData);
      
      // Update local state
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { 
                ...item, 
                ...updateData, 
                updatedAt: new Date().toISOString() 
              } 
            : item
        )
      );
      
      setLoading(false);
      return { id, ...updateData };
    } catch (error) {
      setLoading(false);
      console.error('Error updating item:', error);
      throw error;
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    setLoading(true);
    try {
      const itemRef = doc(db, 'items', id);
      const itemSnapshot = await getDoc(itemRef);
      
      if (!itemSnapshot.exists()) {
        throw new Error('Item not found');
      }
      
      const item = itemSnapshot.data();
      
      // Delete associated image if using Firebase Storage
      if (item.imagePath) {
        try {
          const imageRef = ref(storage, item.imagePath);
          await deleteObject(imageRef);
        } catch (error) {
          console.error('Error deleting image:', error);
          // Continue with the deletion even if deleting the image fails
        }
      }
      
      await deleteDoc(itemRef);
      
      // Update local state
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    items,
    loading,
    getItemById,
    addItem,
    updateItem,
    deleteItem
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to use the items context
export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};