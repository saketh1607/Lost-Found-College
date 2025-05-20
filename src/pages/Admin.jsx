import { useState, useEffect } from 'react';
import { useItems } from '../contexts/ItemsContext';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-react';
import { ADMIN_EMAIL, useChat } from '../contexts/ChatContext';
import ChatWindow from '../components/ChatWindow';
import AdminItemCard from '../components/AdminItemCard';

const Admin = () => {
  const { addItem, deleteItem, items, loading: itemsLoading } = useItems();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const { user } = useUser();
  const { startChat, openChatById } = useChat();

  // Add categories and status arrays
  const categories = [
    { value: 'phone', label: 'Phone' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'dress', label: 'Dress' },
    { value: 'bat', label: 'Bat' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'bottle', label: 'Bottle' },
    { value: 'bag', label: 'Bag' },
    { value: 'other', label: 'Other' },
  ];
  const statusOptions = [
    { value: 'lost', label: 'Lost' },
    { value: 'found', label: 'Found' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: categories[0].value,
    status: statusOptions[0].value,
    contact: '',
    foundDate: '',
    foundTime: '',
    image: null
  });
  const [tab, setTab] = useState('items');
  const [chats, setChats] = useState([]);

  // Listen for all chats where admin is the admin
  useEffect(() => {
    if (tab === 'chats' && user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
      const q = query(
        collection(db, 'chats'),
        where('adminId', '==', ADMIN_EMAIL),
        orderBy('createdAt', 'desc')
      );
      const unsub = onSnapshot(q, (snap) => {
        setChats(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsub();
    }
  }, [tab, user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files[0]) {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
      // Create preview URL
      const fileUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(fileUrl);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Combine date and time
      const foundDateTime = formData.foundDate && formData.foundTime 
        ? new Date(`${formData.foundDate}T${formData.foundTime}`).toISOString()
        : new Date().toISOString();

      const itemData = {
        ...formData,
        foundDateTime
      };

      await addItem(itemData);
      setMessage('Item added successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        category: categories[0].value,
        status: statusOptions[0].value,
        contact: '',
        foundDate: '',
        foundTime: '',
        image: null
      });
      setPreviewUrl('');
    } catch (error) {
      setMessage(`Error adding item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add delete handler
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  if (loading || itemsLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 py-8 px-4">
      <div>
        {/* Tab navigation - styled to match the image */}
        <div className="mb-8 bg-gray-100 p-4 rounded-lg flex space-x-4">
          <button
            className={`px-8 py-3 rounded-md font-medium ${tab === 'items' ? 'bg-gray-200 text-gray-700' : 'bg-white text-gray-600 shadow'}`}
            onClick={() => setTab('items')}
          >
            Items
          </button>
          <button
            className={`px-8 py-3 rounded-md font-medium ${tab === 'chats' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow'}`}
            onClick={() => setTab('chats')}
          >
            Chats
          </button>
        </div>
        
        {tab === 'items' && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Item</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Found Date
                  </label>
                  <input
                    type="date"
                    name="foundDate"
                    value={formData.foundDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Found Time
                  </label>
                  <input
                    type="time"
                    name="foundTime"
                    value={formData.foundTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewUrl && (
                  <div className="mt-2 flex justify-center items-center w-full max-w-xs max-h-60 bg-gray-100 border border-gray-300 rounded-lg shadow-md overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>
              {message && (
                <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Adding Item...' : 'Add Item'}
              </button>
            </form>
            {items && items.length > 0 && (
              <div className="grid grid-cols-1 gap-4 mt-8">
                {items.map(item => (
                  <AdminItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => {/* implement edit if needed */}}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {tab === 'chats' && (
          <div className="w-full bg-white shadow rounded-lg p-6">
            {/* Chat list styled to match the image */}
            <div className="space-y-4">
              {chats.length === 0 ? (
                <p className="text-gray-500">No chats yet.</p>
              ) : (
                <ul className="space-y-4">
                  {chats.map(chat => (
                    <li key={chat.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-600">
                          User: {chat.userId || ''}
                        </div>
                        <div className="text-sm text-gray-600">
                          Started: {chat.createdAt?.toDate ? 
                            new Date(chat.createdAt.toDate()).toLocaleDateString() + ', ' + 
                            new Date(chat.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                            ''}
                        </div>
                        <div className="mt-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            onClick={() => openChatById(chat)}
                          >
                            Open Chat
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;