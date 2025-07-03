"use client"
import React, { useState, useEffect } from 'react';
import {
  Eye, EyeOff, Edit2, Camera, MapPin, CheckCircle,
  AlertCircle, Clock, Save, X, Shuffle, User, Mail, Globe, Shield, Upload
} from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetUserById } from '@/hooks/users/useGetSingleUser';
import { useSession } from 'next-auth/react';
import { useUpdateProfile } from '@/hooks/users/useProfile';

interface FormErrors {
  fullName?: string;
  anonymousName?: string;
  bio?: string;
  location?: string;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  username: string;
  profilePicUrl: string;
  createdAt: string;
  isActive: boolean;
  isAnonymous: boolean;
  role: { name: string };
  anonymousName?: string;
  bio?: string;
  location?: string;
  visibility?: string;
  anonymousAvatar?: string;
  expertise?: string;
  gender?: string;
}

// Anonymous name generators
const adjectives = [
  'Serene', 'Mystic', 'Gentle', 'Brave', 'Wise', 'Calm', 'Swift', 'Noble', 'Quiet', 'Bright',
  'Silent', 'Peaceful', 'Strong', 'Kind', 'Bold', 'Free', 'Pure', 'Wild', 'Graceful', 'Clever'
];

const nouns = [
  'Butterfly', 'Eagle', 'Wolf', 'Dolphin', 'Phoenix', 'Tiger', 'Owl', 'Fox', 'Raven', 'Deer',
  'Lion', 'Hawk', 'Bear', 'Swan', 'Falcon', 'Panda', 'Lynx', 'Otter', 'Whale', 'Crane'
];

const avatarOptions = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=2',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=3',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=5',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=6',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=7',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=8',
];

const generateAnonymousName = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${adjective}_${noun}_${number}`;
};

// Skeleton Components
const ProfileSkeleton = () => (
  <div className="min-h-screen animate-pulse">
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="relative mb-6">
        <div className="h-48 bg-gray-200 rounded-t-xl" />
        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full" />
          <div className="mb-8 space-y-3">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="mt-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-32" />
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function UserProfile() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: session } = useSession();
  const {
    Data,
    setData,
    handleSubmit,
    handleInputChanges,
    isPending,
    errors,
    removeImage
  } = useUpdateProfile();

  const {
    data,
    isPending: isUserDataPending,
    isFetching,
  } = useGetUserById(session?.user?.id as string);

  useEffect(() => {
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      const user = data.data[0];

      console.log("user data fffffffffff=+++++++++++++++++++++++", user)
      
      const transformedUser: UserData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        profilePicUrl: user.profilePicUrl,
        createdAt: user.createdAt,
        isActive: user.isActive,
        isAnonymous: user.isAnonymous || false,
        role: user.role,
        anonymousName: user.anonymousName || generateAnonymousName(),
        bio: user.bio || '',
        location: user.location || '',
        visibility: user.visibility || 'public',
        anonymousAvatar: user.anonymousAvatar || avatarOptions[0],
        expertise: user.expertise || '',
        gender: user.gender || '',
      };
      
      setUserData(transformedUser);
      setIsAnonymous(transformedUser.isAnonymous);
      
      // Update the form data with user data
      setData({
        fullName: transformedUser.fullName,
        username: transformedUser.username,
        gender: transformedUser.gender as string,
        anonymousName: transformedUser.anonymousName || '',
        anonymousAvatar: transformedUser.anonymousAvatar || avatarOptions[0],
        expertise: transformedUser.expertise || '',
        profilePicUrl: transformedUser.profilePicUrl,
        bio: transformedUser.bio || '',
        location: transformedUser.location || '',
        isAnonymous: transformedUser.isAnonymous,
      });
    }
  }, [data, setData]);

  // Show skeleton while loading
  if (isUserDataPending || isFetching || !userData) {
    return <ProfileSkeleton />;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setData(prev => ({
          ...prev,
          [isAnonymous ? 'anonymousAvatar' : 'profilePicUrl']: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };




  const handleImageUploadLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file as any);
      // Update the preview URL in the Data state
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setData(prev => ({
          ...prev,
          [isAnonymous ? 'anonymousAvatar' : 'profilePicUrl']: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Update the data with current isAnonymous state
    setData(prev => ({
      ...prev,
      isAnonymous
    }));
    
    // Call the submit function from the hook
    await handleSubmit();
    
    // Exit edit mode on successful save
    setEditMode(false);
  };

  const handleCancel = () => {
    if (userData) {
      setData({
        fullName: userData.fullName,
        username: userData.username,
        gender: userData.gender as string,
        anonymousName: userData.anonymousName || '',
        anonymousAvatar: userData.anonymousAvatar || avatarOptions[0],
        expertise: userData.expertise || '',
        profilePicUrl: userData.profilePicUrl,
        bio: userData.bio || '',
        location: userData.location || '',
        isAnonymous: userData.isAnonymous,
      });
      setIsAnonymous(userData.isAnonymous);
    }
    setEditMode(false);
    setShowAvatarSelector(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const generateNewAnonymousName = () => {
    const newName = generateAnonymousName();
    setData(prev => ({
      ...prev,
      anonymousName: newName
    }));
  };

  const selectAvatar = (avatarUrl: string) => {
    setData(prev => ({
      ...prev,
      [isAnonymous ? 'anonymousAvatar' : 'profilePicUrl']: avatarUrl
    }));
    setShowAvatarSelector(false);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  
const AvatarSelector = () => (
  showAvatarSelector && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Choose Avatar</h3>
          <button
            onClick={() => setShowAvatarSelector(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          {avatarOptions.map((avatar, index) => (
            <button
              key={index}
              onClick={() => selectAvatar(avatar)}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors"
            >
              <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Or upload custom image</h4>
          <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUploadLocal}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  )
);

  const ProfileHeader = () => (
    <div className="relative mb-6">
      <div className="h-48 bg-gradient-to-r from-slate-500 to-amber-500 rounded-t-xl" />
      
      <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-white shadow-lg rounded-full overflow-hidden bg-gray-200">
            <img 
              src={isAnonymous ? Data.anonymousAvatar : Data.profilePicUrl || userData.profilePicUrl}
              alt={isAnonymous ? Data.anonymousName : userData.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          {editMode && (
            <button 
              onClick={() => setShowAvatarSelector(true)}
              className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white">
              {isAnonymous ? Data.anonymousName : userData.fullName}
            </h1>
            <div className="flex items-center space-x-2">
              {isAnonymous && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Anonymous Mode
                </span>
              )}
              <span className="inline-flex items-center px-2 py-1 text-xs bg-white/20 text-black rounded-full border border-white/30">
                <Clock className="w-3 h-3 mr-1" />
                Member since {formatJoinDate(userData.createdAt)}
              </span>
            </div>
          </div>
          
          {Data.location && (
            <div className="flex items-center text-black mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {Data.location}
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute top-4 right-4 flex space-x-2">
        {editMode ? (
          <>
            <button
              onClick={handleCancel}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="p-2 bg-green-600 rounded-full shadow-md hover:bg-green-700 disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-white" />
              )}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
        )}
        <button
          onClick={() => setIsAnonymous(!isAnonymous)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
          title={isAnonymous ? "Switch to real identity" : "Switch to anonymous"}
        >
          {isAnonymous ? (
            <Eye className="w-4 h-4 text-gray-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );

  const EditableOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <User className="w-4 h-4 inline mr-2" />
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={Data.fullName}
            onChange={handleInputChanges}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Shield className="w-4 h-4 inline mr-2" />
            Anonymous Name <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              id="anonymousName"
              type="text"
              value={Data.anonymousName}
              onChange={handleInputChanges}
              className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.anonymousName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your anonymous identity"
            />
            <button
              type="button"
              onClick={generateNewAnonymousName}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Generate new anonymous name"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
          {errors.anonymousName && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.anonymousName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={userData.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Globe className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <input
            id="location"
            type="text"
            value={Data.location}
            onChange={handleInputChanges}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your location"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={Data.username}
            onChange={handleInputChanges}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your username"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={Data.gender}
            onChange={(e) => setData(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Expertise
        </label>
        <input
          id="expertise"
          type="text"
          value={Data.expertise}
          onChange={handleInputChanges}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your area of expertise"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          About Me
        </label>
        <textarea
          id="bio"
          value={Data.bio}
          onChange={handleInputChanges}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.bio ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Tell us about yourself..."
        />
        <div className="flex justify-between items-center">
          {errors.bio && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.bio}
            </p>
          )}
          <p className="text-xs text-gray-500 ml-auto">
            {Data.bio.length}/500 characters
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Anonymous Mode
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="anonymousMode"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymousMode" className="text-sm text-gray-700">
            Enable anonymous mode for this profile
          </label>
        </div>
        <p className="text-xs text-gray-500">
          When enabled, others will see your anonymous name and avatar instead of your real identity
        </p>
      </div>
    </div>
  );

  const ReadOnlyOverview = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Identity Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-500">Real Name</p>
              <p className="font-medium">{userData.fullName}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{userData.username}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{userData.gender || 'Not specified'}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-500">Anonymous Name</p>
              <p className="font-medium">{Data.anonymousName || 'Not set'}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{Data.location || 'Not specified'}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium">{userData.role.name}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-500">Expertise</p>
              <p className="font-medium">{Data.expertise || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">About Me</h3>
        <p className="text-gray-700 leading-relaxed">{Data.bio || 'No bio provided yet.'}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Mode</span>
            <span className={`font-medium ${isAnonymous ? 'text-orange-600' : 'text-green-600'}`}>
              {isAnonymous ? 'Anonymous' : 'Real Identity'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Account Status</span>
            <span className={`font-medium ${userData.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {userData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <AvatarSelector />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader />
        
        <div className="mt-20">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'overview' && (
                editMode ? <EditableOverview /> : <ReadOnlyOverview />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}