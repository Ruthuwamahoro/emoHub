"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, BookOpen, Heart, ChevronDown, AlertCircle } from 'lucide-react';
import { useGetAllResources } from '@/hooks/users/resources/usegetallresources';
import { PaginationComponent } from '../PaginationPage';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { X } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import CreateResourceDialog from './createResources';
import { LearningResource, SingleResource } from '@/types/resources';
import { LearningResourcesPageSkeleton, PaginationComponentSkeleton, ResourceSkeleton } from './resourcesSkeleton';
import { CATEGORY_OPTIONS, DIFFICULTY_OPTIONS } from '@/constants/resources';




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

export default function LearningResourcesUI() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: session } = useSession();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const queryParams = useMemo(() => ({
    search: debouncedSearchTerm,
    page: currentPage,
    pageSize: itemsPerPage,
    category: selectedCategory,
    difficultyLevel: selectedDifficulty,
    sortBy,
  }), [debouncedSearchTerm, currentPage, itemsPerPage, selectedCategory, selectedDifficulty, sortBy]);

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

  useEffect(() => {
    if (!isLoading && !isPending && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isPending, isInitialLoad]);

  const canCreateResources = ['Admin', 'Specialist', 'SuperAdmin'].includes(session?.user?.role ?? '');

  const displayedResources = useMemo(() => {
    const resourcesArray = resources?.data || [];
    if (!showSavedOnly) return resourcesArray;
    return resourcesArray.filter((resource: SingleResource) => resource.isSaved);
  }, [resources, showSavedOnly]);

  const toggleSaveResource = (resourceId: string) => {
    console.log('Toggle save for resource:', resourceId);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? '' : difficulty);
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleResourceCreated = () => {
    refetch();
  };

  const savedResourcesCount = useMemo(() => {
    if (!resources?.data || !Array.isArray(resources.data)) return 0;
    return resources.data.filter(r => r.isSaved).length;
  }, [resources]);

  const isInitialLoading = isInitialLoad && (isLoading || isPending);
  const isFilteringLoading = !isInitialLoad && (isLoading || isFetching);

  if (isInitialLoading) {
    return <LearningResourcesPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  onClick={handleOpenCreateModal}
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
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-6">Filter Resources</h2>
              
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search Resources"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isFilteringLoading}
                  />
                  {isFetching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Category</h3>
                <div className="space-y-3">
                  {CATEGORY_OPTIONS.map((category) => (
                    <label key={category.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.value}
                        onChange={() => handleCategoryChange(category.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={isFilteringLoading}
                      />
                      <span className={`ml-3 ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}>
                        {category.label}
                      </span>
                    </label>
                  ))}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isFilteringLoading}
                    >
                      Clear Category Filter
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  Difficulty Level
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </h3>
                <div className="space-y-3">
                  {DIFFICULTY_OPTIONS.map((difficulty) => (
                    <label key={difficulty.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        checked={selectedDifficulty === difficulty.value}
                        onChange={() => handleDifficultyChange(difficulty.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={isFilteringLoading}
                      />
                      <span className={`ml-3 ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}>
                        {difficulty.label}
                      </span>
                    </label>
                  ))}
                  {selectedDifficulty && (
                    <button
                      onClick={() => setSelectedDifficulty('')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isFilteringLoading}
                    >
                      Clear Difficulty Filter
                    </button>
                  )}
                </div>
              </div>

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
                      disabled={isFilteringLoading}
                    />
                    <span className={`ml-3 ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}>
                      Newest
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="sortBy"
                      value="oldest"
                      checked={sortBy === 'oldest'}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      disabled={isFilteringLoading}
                    />
                    <span className={`ml-3 ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}>
                      Oldest
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {!isFilteringLoading && pagination && (
              <div className="mb-6 text-sm text-gray-600">
                Showing {displayedResources.length} of {pagination.totalResources} resources
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </div>
            )}

            {isError && error && !isFilteringLoading && (
              <ErrorState error={error} onRetry={() => refetch()} />
            )}

            {isFilteringLoading && (
              <div className="space-y-6">
                <div className="mb-6">
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <ResourceSkeleton key={item} />
                  ))}
                </div>
                <PaginationComponentSkeleton />
              </div>
            )}

            {!isFilteringLoading && !isError && displayedResources.length > 0 && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {displayedResources.map((resource: SingleResource) => (
                    <div key={resource.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
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
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg leading-tight line-clamp-2">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {CATEGORY_OPTIONS.find(c => c.value === resource.category)?.label}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                            {resource.difficultyLevel}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button className="text-orange-600 hover:text-blue-700 font-medium text-sm uppercase tracking-wide transition-colors">
                            READ MORE
                          </button>
                          
                          {canCreateResources && (
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                  <DropdownMenuItem>
                                    <X className="w-4 h-4 mr-2" />
                                    Unpublish
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <PaginationComponent 
                    currentPages={pagination.currentPage}
                    totalPages={pagination.totalPages} 
                    onPageChange={(page) => setCurrentPage(page)}
                    disabled={isFilteringLoading}
                  />
                )}
              </>
            )}

            {!isFilteringLoading && !isError && displayedResources.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <BookOpen size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 text-center">
                  {showSavedOnly 
                    ? "You haven't saved any resources yet." 
                    : "Try adjusting your search or filter criteria."
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

      <CreateResourceDialog
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleResourceCreated}
      />
    </div>
  );
}