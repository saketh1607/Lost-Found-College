// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useItems } from '../contexts/ItemsContext';
// import { format } from 'date-fns';

// const ItemDetailsPage = () => {
//   const { id } = useParams();
//   const { items, loading, error } = useItems();
//   const item = items.find(item => item.id === id);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-500">Error loading item: {error}</p>
//       </div>
//     );
//   }

//   if (!item) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">Item not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-lg shadow-md overflow-hidden ">
//         <img
//           src={item.imageUrl}
//           alt={item.name}
//           className="w-full h-96 object-cover"
//         />
//         <div className="p-6">
//           <h1 className="text-3xl font-bold mb-4 text-gray-900">{item.name}</h1>
//           <div className="space-y-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Description</h2>
//               <p className="text-gray-800">{item.description}</p>
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Location Found</h2>
//               <p className="text-gray-800">{item.location}</p>
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Date Found</h2>
//               <p className="text-gray-800">
//                 {format(item.date.toDate(), 'PPP')}
//               </p>
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Category</h2>
//               <p className="text-gray-800 capitalize">{item.category}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemDetailsPage;
import React from 'react';
import { useParams } from 'react-router-dom';
import { useItems } from '../contexts/ItemsContext';
import { format } from 'date-fns';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const { items, loading, error } = useItems();
  const item = items.find(item => item.id === id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading item: {error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Item not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-auto">
      <div className="w-full flex justify-center items-center bg-gray-100">
  <img
    src={item.imageUrl}
    alt={item.name}
    className="max-h-[500px] w-auto  h-full object-contain"
  />
</div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{item.name}</h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="text-gray-800">{item.description}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Location Found</h2>
              <p className="text-gray-800">{item.location}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Date Found</h2>
              <p className="text-gray-800">
                {format(item.date.toDate(), 'PPP')}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Category</h2>
              <p className="text-gray-800 capitalize">{item.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
