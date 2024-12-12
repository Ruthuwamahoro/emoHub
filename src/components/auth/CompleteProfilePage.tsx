"use client";

import React, { useState } from 'react';
import { MapPin, User, Briefcase, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { useUpdateProfile } from '@/hooks/users/useProfile';

const EXPERTISE_OPTIONS = [
  { value: '', label: 'Select your expertise' },
  { value: 'wildlifeSpecialist', label: 'Wildlife Specialist' },
  { value: 'advisor', label: 'Advisor' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'scientist', label: 'Scientist' },
  { value: 'consultant', label: 'Consultant' }
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const {
    Data,
    setData,
    handleSubmit,
    handleInputChanges,
    isPending,
  } = useUpdateProfile();

  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    setData((prev) => ({ 
      ...prev, 
      profilePicUrl: imageUrl 
    }));
  };

  // Skip profile completion
  const handleSkip = () => {
    router.push('/');
    toast('Profile completion skipped', { 
      icon: '⏩',
      duration: 3000 
    });
  };

  // Form submission handler
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    
    // Basic validation
    const validationErrors: string[] = [];

    if (!Data.expertise) {
      validationErrors.push('Please select an area of expertise');
    }

    if (Data.bio && Data.bio.length < 10) {
      validationErrors.push('Bio must be at least 10 characters');
    }

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex flex-col justify-center p-8">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Complete Profile</h2>
          <p className="text-purple-100 mb-6">
            Take a moment to personalize your professional profile
          </p>
          <div className="space-y-2 text-sm text-purple-200">
            <p>✓ Showcase your expertise</p>
            <p>✓ Connect with professionals</p>
            <p>✓ Enhance your network</p>
          </div>
        </div>

        {/* Main Form */}
        <form 
          onSubmit={onSubmit}
          className="w-2/3 p-8 space-y-6"
        >
          {/* Image Uploader */}
          <div className="flex flex-col items-center space-y-4">
            <ImageUploader 
              onImageUpload={handleImageUpload}
              existingImage={Data.profilePicUrl}
            />
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            {/* Professional Bio */}
            <div>
              <label 
                htmlFor="bio" 
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <User className="mr-2 text-purple-500" />
                Professional Bio
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  name="bio"
                  value={Data.bio}
                  onChange={handleInputChanges}
                  placeholder="Share your professional journey (min 10 characters)"
                  className="w-full p-3 pr-10 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  rows={4}
                  maxLength={500}
                />
                {Data.bio && (
                  <div className="absolute top-2 right-2 text-xs text-gray-500">
                    {Data.bio.length}/500
                  </div>
                )}
              </div>
            </div>

            {/* Expertise Selection */}
            <div>
              <label 
                htmlFor="expertise" 
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <Briefcase className="mr-2 text-purple-500" />
                Area of Expertise
              </label>
              <div className="relative">
                <select
                  id="expertise"
                  name="expertise"
                  value={Data.expertise}
                  onChange={
                    handleInputChanges as React.ChangeEventHandler<
                      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                    >
                  }
                  className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  {EXPERTISE_OPTIONS.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value} 
                      className="text-gray-700"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Location Input */}
            <div>
              <label 
                htmlFor="location" 
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <MapPin className="mr-2 text-purple-500" />
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={Data.location}
                onChange={handleInputChanges}
                placeholder="City, Country"
                className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={handleSkip}
              className="w-1/2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5 mr-2" />
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-1/2 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isPending ? (
                <div className="animate-spin">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 text-white"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Complete Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}