import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useItems } from '../contexts/ItemsContext';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';

const HomePage = () => {
  const { items, loading } = useItems();
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    searchTerm: '',
  });

  useEffect(() => {
    if (items.length === 0) return;

    let filtered = [...items];

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const pastDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          pastDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          pastDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          pastDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.foundDate);
        return itemDate >= pastDate && itemDate <= now;
      });
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term)
      );
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.foundDate) - new Date(a.foundDate));

    setFilteredItems(filtered);
  }, [items, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lost & Found Items</h1>
      
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-xl">No items found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id}>
              <ItemCard item={item} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
