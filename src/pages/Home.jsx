import { useState } from 'react';
import { format } from 'date-fns';
import { useItems } from '../contexts/ItemsContext';
import ItemCard from '../components/ItemCard';

const categories = [
  { value: 'all', label: 'All Items' },
  { value: 'phone', label: 'Phone' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'dress', label: 'Dress' },
  { value: 'bat', label: 'Bat' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'bag', label: 'Bag' },
  { value: 'other', label: 'Other' },
];

const Home = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortNewest, setSortNewest] = useState(false);
  const { items, loading, error } = useItems();

  let filteredItems = items.filter(item => {
    if (filter !== 'all' && item.category !== filter) return false;
    if (search.trim() !== '') {
      const s = search.toLowerCase();
      return (
        (item.title && item.title.toLowerCase().includes(s)) ||
        (item.description && item.description.toLowerCase().includes(s)) ||
        (item.location && item.location.toLowerCase().includes(s))
      );
    }
    return true;
  });

  if (sortNewest) {
    filteredItems = [...filteredItems].sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || a.foundDateTime || a.foundDate);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || b.foundDateTime || b.foundDate);
      return dateB - dateA;
    });
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg font-semibold">Error loading items: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Lost and Found Items</h1>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4 w-full">
          <div className="w-full md:w-1/3">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
            <select
              id="category"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-800 mb-1">Search</label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, description, or location"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div className="w-full md:w-1/3 flex items-end">
            <button
              type="button"
              onClick={() => setSortNewest(s => !s)}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${sortNewest ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
            >
              Sort by Newest
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No items found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Home; 