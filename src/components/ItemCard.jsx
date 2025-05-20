import React from 'react';
import { useChat } from '../contexts/ChatContext';

const ItemCard = ({ item }) => {
  const { startChat, loading, currentChat } = useChat();
  const formattedDate = new Date(item.foundDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between text-black">
      <div>
        <div className="h-48 overflow-hidden text-black">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover text-black
            "
          />
        </div>
        <div className="p-4">
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
            {item.category}
          </span>
          <h3 className="text-lg font-bold mb-1 truncate">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{item.location}</span>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0 flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50"
          onClick={() => startChat(item)}
          disabled={loading}
        >
          {loading && currentChat?.itemId === item.id ? 'Opening Chat...' : 'Chat with Admin'}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;