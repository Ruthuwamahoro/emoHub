// import React, { useState } from 'react';
// import { X, Upload, FileText, Video, Headphones, Image, Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

// // Types based on your schema
// type ResourceType = 'video' | 'audio' | 'article' | 'image';
// type EmotionCategory = 'self-regulation' | 'self-awareness' | 'motivation' | 'empathy' | 'social-skills' | 'relationship-management' | 'stress-management';
// type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// interface FormData {
//   title: string;
//   description: string;
//   resourceType: ResourceType;
//   content: string;
//   url: string;
//   category: EmotionCategory;
//   difficultyLevel: DifficultyLevel;
//   tags: string[];
//   duration: string;
// }

// interface CreateResourceDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// const CreateResourceDialog: React.FC<CreateResourceDialogProps> = ({ 
//   isOpen, 
//   onClose, 
//   onSuccess 
// }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentTag, setCurrentTag] = useState('');
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
//   const [formData, setFormData] = useState<FormData>({
//     title: '',
//     description: '',
//     resourceType: 'article',
//     content: '',
//     url: '',
//     category: 'self-awareness',
//     difficultyLevel: 'beginner',
//     tags: [],
//     duration: ''
//   });

//   const resourceTypes = [
//     { value: 'article', label: 'Article', icon: FileText, color: 'bg-blue-100 text-blue-600 border-blue-200' },
//     { value: 'video', label: 'Video', icon: Video, color: 'bg-red-100 text-red-600 border-red-200' },
//     { value: 'audio', label: 'Audio', icon: Headphones, color: 'bg-green-100 text-green-600 border-green-200' },
//     { value: 'image', label: 'Image', icon: Image, color: 'bg-purple-100 text-purple-600 border-purple-200' }
//   ];

//   const emotionCategories = [
//     { value: 'self-regulation', label: 'Self Regulation' },
//     { value: 'self-awareness', label: 'Self Awareness' },
//     { value: 'motivation', label: 'Motivation' },
//     { value: 'empathy', label: 'Empathy' },
//     { value: 'social-skills', label: 'Social Skills' },
//     { value: 'relationship-management', label: 'Relationship Management' },
//     { value: 'stress-management', label: 'Stress Management' }
//   ];

//   const difficultyLevels = [
//     { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800 border-green-200' },
//     { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
//     { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800 border-red-200' }
//   ];

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required';
//     } else if (formData.title.length < 3) {
//       newErrors.title = 'Title must be at least 3 characters long';
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Description is required';
//     } else if (formData.description.length < 10) {
//       newErrors.description = 'Description must be at least 10 characters long';
//     }

//     if (!formData.content.trim()) {
//       newErrors.content = 'Content is required';
//     } else if (formData.content.length < 20) {
//       newErrors.content = 'Content must be at least 20 characters long';
//     }

//     if (formData.url && !isValidUrl(formData.url)) {
//       newErrors.url = 'Please enter a valid URL';
//     }

//     if (formData.duration && (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0)) {
//       newErrors.duration = 'Duration must be a positive number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const isValidUrl = (url: string): boolean => {
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const addTag = () => {
//     const trimmedTag = currentTag.trim().toLowerCase();
//     if (trimmedTag && !formData.tags.includes(trimmedTag)) {
//       setFormData(prev => ({
//         ...prev,
//         tags: [...prev.tags, trimmedTag]
//       }));
//       setCurrentTag('');
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Validate file size (10MB limit)
//       if (file.size > 10 * 1024 * 1024) {
//         setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
//         return;
//       }
      
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         setErrors(prev => ({ ...prev, file: 'Please upload an image file' }));
//         return;
//       }

//       setUploadedFile(file);
//       setErrors(prev => ({ ...prev, file: '' }));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       resourceType: 'article',
//       content: '',
//       url: '',
//       category: 'self-awareness',
//       difficultyLevel: 'beginner',
//       tags: [],
//       duration: ''
//     });
//     setCurrentTag('');
//     setErrors({});
//     setUploadedFile(null);
//     setSubmitStatus('idle');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setSubmitStatus('idle');
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Random success/failure for demo
//       if (Math.random() > 0.2) {
//         console.log('Resource submitted:', formData);
//         setSubmitStatus('success');
        
//         // Auto-close after success
//         setTimeout(() => {
//           onClose();
//           resetForm();
//           onSuccess?.();
//         }, 1500);
//       } else {
//         throw new Error('Failed to create resource');
//       }
//     } catch (error) {
//       setSubmitStatus('error');
//       setErrors({ submit: 'Failed to create resource. Please try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClose = () => {
//     if (!isLoading) {
//       onClose();
//       resetForm();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Create Learning Resource</h2>
//             <p className="text-gray-600 mt-1">Share knowledge to help others learn and grow</p>
//           </div>
//           <button
//             onClick={handleClose}
//             disabled={isLoading}
//             className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Success/Error Messages */}
//         {submitStatus === 'success' && (
//           <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
//             <CheckCircle2 className="w-5 h-5 text-green-600" />
//             <span className="text-green-800 font-medium">Resource created successfully!</span>
//           </div>
//         )}

//         {submitStatus === 'error' && errors.submit && (
//           <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//             <span className="text-red-800">{errors.submit}</span>
//           </div>
//         )}

//         <div onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Resource Title *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
//                   errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter a compelling title for your resource"
//               />
//               {errors.title && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.title}
//                 </p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 required
//                 rows={4}
//                 value={formData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors ${
//                   errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 placeholder="Describe what this resource covers and who it's for"
//               />
//               {errors.description && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.description}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Resource Type Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Resource Type *
//             </label>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               {resourceTypes.map((type) => {
//                 const Icon = type.icon;
//                 const isSelected = formData.resourceType === type.value;
//                 return (
//                   <button
//                     key={type.value}
//                     type="button"
//                     onClick={() => handleInputChange('resourceType', type.value as ResourceType)}
//                     className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
//                       isSelected
//                         ? `border-indigo-500 bg-indigo-50 shadow-md ${type.color}`
//                         : 'border-gray-200 hover:border-gray-300 bg-white'
//                     }`}
//                   >
//                     <div className={`p-2 rounded-lg ${isSelected ? type.color : 'bg-gray-100 text-gray-600'}`}>
//                       <Icon className="w-6 h-6" />
//                     </div>
//                     <span className={`font-medium text-sm ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
//                       {type.label}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Content and URL */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Content *
//               </label>
//               <textarea
//                 required
//                 rows={6}
//                 value={formData.content}
//                 onChange={(e) => handleInputChange('content', e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors ${
//                   errors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter the main content or body text"
//               />
//               {errors.content && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.content}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Resource URL
//               </label>
//               <input
//                 type="url"
//                 value={formData.url}
//                 onChange={(e) => handleInputChange('url', e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4 transition-colors ${
//                   errors.url ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 placeholder="https://example.com/resource"
//               />
//               {errors.url && (
//                 <p className="mb-4 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.url}
//                 </p>
//               )}

//               {/* File Upload Area */}
//               <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                 uploadedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
//               }`}>
//                 <Upload className={`w-8 h-8 mx-auto mb-2 ${uploadedFile ? 'text-green-600' : 'text-gray-400'}`} />
//                 {uploadedFile ? (
//                   <div>
//                     <p className="text-sm text-green-700 font-medium mb-1">File uploaded successfully!</p>
//                     <p className="text-xs text-green-600">{uploadedFile.name}</p>
//                   </div>
//                 ) : (
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Upload cover image or thumbnail</p>
//                     <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
//                   </div>
//                 )}
//                 <input 
//                   type="file" 
//                   className="hidden" 
//                   accept="image/*"
//                   onChange={handleFileUpload}
//                   id="file-upload"
//                 />
//                 <label 
//                   htmlFor="file-upload"
//                   className="inline-block mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm font-medium transition-colors"
//                 >
//                   Choose File
//                 </label>
//               </div>
//               {errors.file && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.file}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Category and Difficulty */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Emotion Category *
//               </label>
//               <select
//                 required
//                 value={formData.category}
//                 onChange={(e) => handleInputChange('category', e.target.value as EmotionCategory)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 {emotionCategories.map((category) => (
//                   <option key={category.value} value={category.value}>
//                     {category.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Difficulty Level *
//               </label>
//               <div className="flex gap-2">
//                 {difficultyLevels.map((level) => {
//                   const isSelected = formData.difficultyLevel === level.value;
//                   return (
//                     <button
//                       key={level.value}
//                       type="button"
//                       onClick={() => handleInputChange('difficultyLevel', level.value as DifficultyLevel)}
//                       className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
//                         isSelected
//                           ? `${level.color} ring-2 ring-offset-2 ring-indigo-500 shadow-md`
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
//                       }`}
//                     >
//                       {level.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Duration and Tags */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Duration (minutes)
//               </label>
//               <input
//                 type="number"
//                 value={formData.duration}
//                 onChange={(e) => handleInputChange('duration', e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
//                   errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 placeholder="e.g., 15"
//                 min="1"
//               />
//               {errors.duration && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.duration}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags
//               </label>
//               <div className="flex gap-2 mb-2">
//                 <input
//                   type="text"
//                   value={currentTag}
//                   onChange={(e) => setCurrentTag(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault();
//                       addTag();
//                     }
//                   }}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Add a tag"
//                 />
//                 <button
//                   type="button"
//                   onClick={addTag}
//                   className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors font-medium"
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {formData.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={() => removeTag(tag)}
//                       className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Dialog Actions */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={isLoading}
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Creating Resource...
//                 </>
//               ) : (
//                 <>
//                   <Plus className="w-5 h-5" />
//                   Create Resource
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateResourceDialog;