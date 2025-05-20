import React from 'react';

const AdminItemCard = ({ item, onEdit, onDelete }) => {
  const formattedDate = new Date(item.foundDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/4 h-full">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-40 md:h-full object-cover"
          />
        </div>
        <div className="p-4 md:w-3/4 flex flex-col md:flex-row">
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {item.category}
              </span>
              <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
            <h3 className="text-xl font-bold mt-2">{item.title}</h3>
            <p className="text-gray-600 my-2 line-clamp-2">{item.description}</p>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Found at: {item.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Claim at: {item.claimLocation}</span>
              </div>
            </div>
          </div>
          
          <div className="flex md:flex-col justify-end items-center md:items-end mt-4 md:mt-0 md:ml-4 space-x-2 md:space-x-0 md:space-y-2">
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminItemCard;