import React, { useState } from 'react';
import { useItems } from '../contexts/ItemsContext';
import ItemForm from '../components/ItemForm';
import AdminItemCard from '../components/AdminItemCard';

const AdminPage = () => {
  const { items, loading, addItem, updateItem, deleteItem } = useItems();
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddClick = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = async (itemData, imageFile) => {
    if (editingItem) {
      await updateItem(editingItem.id, itemData, imageFile);
    } else {
      await addItem(itemData, imageFile);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  // Sort items by date (most recent first)
  const sortedItems = [...items].sort((a, b) => 
    new Date(b.foundDate) - new Date(a.foundDate)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Item
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <ItemForm 
            initialData={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Items</h2>
        {sortedItems.length === 0 ? (
          <p className="text-gray-500">No items have been added yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedItems.map(item => (
              <AdminItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEditClick(item)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
