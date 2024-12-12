"use client";

import React, { useRef, useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Camera, Trash2, UploadCloud } from 'lucide-react';

import { uploadImageToCloudinary } from '@/services/user/profile';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  existingImage?: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  existingImage 
}) => {
  const [localImage, setLocalImage] = useState<string | null>(existingImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a valid image.');
        return;
      }

      setIsUploading(true);
      try {
        const localPreviewUrl = URL.createObjectURL(file);
        setLocalImage(localPreviewUrl);

        const cloudinaryUrl = await uploadImageToCloudinary(file);
        
        onImageUpload(cloudinaryUrl);
        
      } catch (error) {
        toast.error('Failed to upload image');
        setLocalImage(existingImage || null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageRemove = () => {
    setLocalImage(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />
      
      <div className="relative group">
        {localImage ? (
          <>
            <div className="relative">
              <Image 
                src={localImage} 
                alt="Profile" 
                width={160} 
                height={160} 
                className="rounded-full object-cover w-40 h-40 border-4 border-purple-200 shadow-lg"
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full 
                flex items-center justify-center opacity-0 group-hover:opacity-100 
                transition-opacity duration-300">
                <div className="flex space-x-4">
                  <button 
                    onClick={triggerFileInput}
                    className="bg-white p-2 rounded-full hover:bg-gray-100"
                  >
                    <Camera className="text-purple-600" />
                  </button>
                  <button 
                    onClick={handleImageRemove}
                    className="bg-white p-2 rounded-full hover:bg-gray-100"
                  >
                    <Trash2 className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div 
            onClick={triggerFileInput}
            className="w-40 h-40 bg-purple-100 rounded-full 
            flex flex-col items-center justify-center 
            border-2 border-purple-300 cursor-pointer 
            hover:bg-purple-200 transition-colors"
          >
            {isUploading ? (
              <div className="animate-pulse">
                <UploadCloud className="text-purple-500 w-12 h-12" />
              </div>
            ) : (
              <>
                <UploadCloud className="text-purple-500 w-12 h-12 mb-2" />
                <span className="text-purple-600 text-sm">Upload Photo</span>
              </>
            )}
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500">
        {localImage ? 'Change Profile Picture' : 'Upload Profile Picture'}
      </p>
    </div>
  );
};

export default ImageUploader;