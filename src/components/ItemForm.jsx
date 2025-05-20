// import React, { useState } from 'react';

// const ItemForm = ({ initialData, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     title: initialData?.title || '',
//     description: initialData?.description || '',
//     category: initialData?.category || 'electronics',
//     location: initialData?.location || '',
//     claimLocation: initialData?.claimLocation || '',
//     foundDate: initialData?.foundDate ? new Date(initialData.foundDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//   });
  
//   const [imageFile, setImageFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const categories = [
//     { value: 'electronics', label: 'Electronics' },
//     { value: 'documents', label: 'Documents' },
//     { value: 'accessories', label: 'Accessories' },
//     { value: 'bottles', label: 'Bottles' },
//     { value: 'stationery', label: 'Stationery' },
//     { value: 'other', label: 'Other' }
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     setImageFile(file);
    
//     // Create a preview URL
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewUrl(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       await onSubmit(formData, imageFile);
//       setIsSubmitting(false);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setIsSubmitting(false);
//       alert("Failed to submit the form. Please try again.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//             Title*
//           </label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
        
//         <div>
//           <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//             Category*
//           </label>
//           <select
//             id="category"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           >
//             {categories.map(category => (
//               <option key={category.value} value={category.value}>
//                 {category.label}