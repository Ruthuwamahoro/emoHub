"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, Grid, List, BookOpen, Clock, User, Heart, ChevronDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useGetAllResources } from '@/hooks/users/resources/usegetallresources';
import { PaginationComponent } from '../PaginationPage';
// import CreateResourceDialog from './createResources';

// Move the interface to match your API response
interface LearningResource {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  userId: string;
  resourceType: "video" | "audio" | "article" | "image";
  content: string;
  url?: string;
  thumbnailUrl?: string;
  duration?: number;
  category: 
    | "self-regulation"
    | "self-awareness" 
    | "motivation"
    | "empathy"
    | "social-skills"
    | "relationship-management"
    | "stress-management";
  tags?: string[];
  createdAt: string;
  isSaved: boolean;
  updatedAt: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

type UserRole = 'admin' | 'specialist' | 'superAdmin' | 'user';

interface User {
  id: string;
  name: string;
  role: UserRole;
}

const mockUser: User = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  role: 'specialist'
};

// Updated category options to match your API enum
const categoryOptions = [
  { value: 'self-regulation', label: 'Self Regulation' },
  { value: 'self-awareness', label: 'Self Awareness' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'empathy', label: 'Empathy' },
  { value: 'social-skills', label: 'Social Skills' },
  { value: 'relationship-management', label: 'Relationship Management' },
  { value: 'stress-management', label: 'Stress Management' }
];

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

// Skeleton Component
const ResourceSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 animate-pulse">
    <div className="relative h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

// Error Component
const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <AlertCircle size={48} className="text-red-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
    <p className="text-gray-600 text-center mb-4">
      {error.message || 'Failed to load learning resources. Please try again.'}
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Fixed Pagination Skeleton Component
export function PaginationComponentSkeleton() {
  return (
    <div className="flex items-center justify-center gap-4 opacity-50 pointer-events-none">
      <div className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 animate-pulse">
        <ChevronLeft size={20} />
        <span>Previous</span>
      </div>
      
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ))}
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 animate-pulse">
        <span>Next</span>
        <ChevronRight size={20} />
      </div>
    </div>
  );
}

export default function LearningResourcesUI() {
  const [user] = useState<User>(mockUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Debounced search term to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, selectedDifficulty, sortBy]);

  // Prepare query parameters
  const queryParams = useMemo(() => ({
    search: debouncedSearchTerm,
    page: currentPage, // Make sure this matches the component state
    pageSize: itemsPerPage,
    category: selectedCategory,
    difficultyLevel: selectedDifficulty,
    sortBy,
  }), [debouncedSearchTerm, currentPage, itemsPerPage, selectedCategory, selectedDifficulty, sortBy]);

  // Use the hook with query parameters
  const { 
    resources, 
    pagination, 
    isLoading, 
    isPending, 
    isFetching, 
    error, 
    isError, 
    refetch 
  } = useGetAllResources(queryParams);

  const canCreateResources = ['admin', 'specialist', 'superAdmin'].includes(user.role);

  // Filter saved resources on client side (since API doesn't have this filter)
  // Add null check and default to empty array to prevent hydration errors
  const displayedResources = useMemo(() => {
    const resourcesArray = resources?.data || [];
    if (!showSavedOnly) return resourcesArray;
    return resourcesArray.filter(resource => resource.isSaved);
  }, [resources, showSavedOnly]);

  const toggleSaveResource = (resourceId: string) => {
    // This would typically make an API call to update the saved status
    // For now, we'll just log it
    console.log('Toggle save for resource:', resourceId);
    // After the API call, you would refetch the data or update the cache
    // refetch();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? '' : difficulty);
  };

  const CreateResourceModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'self-awareness',
      resourceType: 'article',
      difficultyLevel: 'beginner'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Creating resource:', formData);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', category: 'self-awareness', resourceType: 'article', difficultyLevel: 'beginner' });
      // After creating, refetch the data
      refetch();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {/* <CreateResourceDialog/> */}
      </div>
    );
  };

  // Calculate saved resources count with null check
  const savedResourcesCount = useMemo(() => {
    if (!resources?.data || !Array.isArray(resources.data)) return 0;
    return resources.data.filter(r => r.isSaved).length;
  }, [resources]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Learning Resources</h1>
              <p className="text-gray-600 leading-relaxed">
                Dive into wealth of articles, blogs, guides, videos, and modules designed to enhance your emotional intelligence and well-being
              </p>
            </div>
            <div className="flex items-center gap-4">
              {canCreateResources && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Create Resource
                </button>
              )}
              <button 
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`relative flex items-center gap-2 px-6 py-2 rounded-lg transition-colors font-medium ${
                    showSavedOnly 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
              >
                <span className="relative">
                    Saved Resources
                    {/* Notification badge */}
                    {savedResourcesCount > 0 && (
                      <span className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {savedResourcesCount}
                      </span>
                    )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-6">Filter Resources</h2>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search Resources"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {isFetching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Category</h3>
                <div className="space-y-3">
                  {categoryOptions.map((category) => (
                    <label key={category.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.value}
                        onChange={() => handleCategoryChange(category.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">{category.label}</span>
                    </label>
                  ))}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear Category Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Difficulty Level Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  Difficulty Level
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </h3>
                <div className="space-y-3">
                  {difficultyOptions.map((difficulty) => (
                    <label key={difficulty.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        checked={selectedDifficulty === difficulty.value}
                        onChange={() => handleDifficultyChange(difficulty.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">{difficulty.label}</span>
                    </label>
                  ))}
                  {selectedDifficulty && (
                    <button
                      onClick={() => setSelectedDifficulty('')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear Difficulty Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  Sort By
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="sortBy"
                      value="newest"
                      checked={sortBy === 'newest'}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Newest</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="sortBy"
                      value="oldest"
                      checked={sortBy === 'oldest'}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Oldest</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {/* Results Summary */}
            {!isLoading && pagination && (
              <div className="mb-6 text-sm text-gray-600">
                Showing {displayedResources.length} of {pagination.totalResources} resources
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </div>
            )}

            {/* Error State */}
            {isError && error && (
              <ErrorState error={error} onRetry={() => refetch()} />
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <ResourceSkeleton />
                  <ResourceSkeleton />
                  <ResourceSkeleton />
                  <ResourceSkeleton />
                </div>
                <PaginationComponentSkeleton />
              </div>
            )}

            {/* Resources Grid */}
            {!isLoading && !isError && displayedResources.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {displayedResources.map((resource: LearningResource) => (
                  <div key={resource.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
                    <div className="relative">
                      <img
                        src={resource.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop'}
                        alt={resource.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => toggleSaveResource(resource.id)}
                        className={`absolute top-4 right-4 p-2 rounded-full ${resource.isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:scale-110 transition-transform shadow-sm`}
                      >
                        <Heart size={16} fill={resource.isSaved ? 'white' : 'none'} />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg leading-tight">{resource.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {categoryOptions.find(c => c.value === resource.category)?.label}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                          {resource.difficultyLevel}
                        </span>
                      </div>
                      <button className="text-red-500 hover:text-red-600 font-medium text-sm uppercase tracking-wide">
                        READ MORE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination - Only show when not loading and has multiple pages */}
            {!isLoading && !isError && pagination && pagination.totalPages > 1 && (
              <PaginationComponent 
                currentPages={pagination.currentPage} // Use pagination.currentPage from API
                totalPages={pagination.totalPages} 
                onPageChange={(page) => setCurrentPage(page)} // This should update component state
                disabled={isLoading || isFetching}
              />
            )}

            {/* No data state */}
            {!isLoading && !isError && displayedResources.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <BookOpen size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 text-center">
                  {showSavedOnly 
                    ? "You haven't saved any resources yet." 
                    : "No learning resources match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {(debouncedSearchTerm || selectedCategory || selectedDifficulty) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSelectedDifficulty('');
                      setSortBy('newest');
                    }}
                    className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {!isLoading && (
              <PaginationComponent
              currentPages={currentPage}
              totalPages={pagination?.totalPages ?? 1}
              onPageChange={(page) => setCurrentPage(page)}
              disabled={isFetching}
            />
      )}


      {/* Create Resource Modal */}
      {showCreateModal && <CreateResourceModal />}
    </div>
  );
}