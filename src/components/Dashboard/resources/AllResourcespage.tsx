"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, BookOpen, Heart, ChevronDown, AlertCircle, Play, FileText, Video, Book, Globe } from 'lucide-react';
import { useGetAllResources } from '@/hooks/users/resources/usegetallresources';
import { PaginationComponent } from '../PaginationPage';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit } from 'lucide-react';
import { Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { X } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { SingleResource } from '@/types/resources';
import { LearningResourcesPageSkeleton, PaginationComponentSkeleton, ResourceSkeleton } from './resourcesSkeleton';
import { CATEGORY_OPTIONS, DIFFICULTY_OPTIONS } from '@/constants/resources';
import {CreateResourceDialog }from "./CreateResourceDialog";
import { useRouter } from 'next/navigation';

interface QueryParams {
  search: string;
  page: number;
  pageSize: number;
  category: string;
  difficultyLevel: string;
  sortBy: 'newest' | 'oldest';
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalResources: number;
}

interface ResourcesResponse {
  data: SingleResource[];
  pagination?: PaginationData;
}

interface UseGetAllResourcesReturn {
  resources: ResourcesResponse | undefined;
  pagination: PaginationData | undefined;
  isLoading: boolean;
  isPending: boolean;
  isFetching: boolean;
  error: Error | null;
  isError: boolean;
  refetch: () => void;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface DifficultyOption {
  value: string;
  label: string;
}

const ErrorState: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <AlertCircle size={48} className="text-red-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
    <p className="text-gray-600 text-center mb-4">
      {error.message || 'Failed to load learning resources. Please try again.'}
    </p>
    <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
      Try Again
    </Button>
  </div>
);

// Resource type icon component
const ResourceTypeIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-5 h-5" }) => {
  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Video className={className} />;
      case 'article':
        return <FileText className={className} />;
      case 'blog':
        return <FileText className={className} />;
      case 'guide':
        return <Book className={className} />;
      case 'module':
        return <BookOpen className={className} />;
      case 'website':
      case 'link':
        return <Globe className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  return getIcon();
};

// Video overlay component
const VideoOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
    <div className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
      <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
    </div>
  </div>
);

const LearningResourcesUI: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const { data: session } = useSession();
  const router = useRouter();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const queryParams: QueryParams = useMemo(() => ({
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
  } = useGetAllResources(queryParams) as unknown as UseGetAllResourcesReturn;

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

  const toggleSaveResource = (resourceId: string): void => {
    console.log('Toggle save for resource:', resourceId);
  };

  const handleCategoryChange = (category: string): void => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleDifficultyChange = (difficulty: string): void => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? '' : difficulty);
  };

  const handleOpenCreateModal = (): void => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = (): void => {
    setShowCreateModal(false);
  };

  const handleResourceCreated = (): void => {
    refetch();
  };

  const handleResourceClick = (resourceId: string): void => {
    router.push(`/dashboard/resources/${resourceId}`);
  };

  const savedResourcesCount = useMemo(() => {
    if (!resources?.data || !Array.isArray(resources.data)) return 0;
    return resources.data.filter((r: SingleResource) => r.isSaved).length;
  }, [resources]);

  const isInitialLoading = isInitialLoad && (isLoading || isPending);
  const isFilteringLoading = !isInitialLoad && (isLoading || isFetching);

  const handleSortByChange = (value: string): void => {
    setSortBy(value as 'newest' | 'oldest');
  };

  const handleClearAllFilters = (): void => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSortBy('newest');
  };

  const getCategoryLabel = (categoryValue: string): string => {
    const category = (CATEGORY_OPTIONS as CategoryOption[]).find(c => c.value === categoryValue);
    return category?.label || categoryValue;
  };

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
                <Button
                  onClick={handleOpenCreateModal}
                  className="flex items-center gap-2 bg-orange-500 text-white hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Create Resource
                </Button>
              )}
              <Button 
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`relative flex items-center gap-2 font-medium ${
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
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Filter Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Section */}
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="text"
                      placeholder="Search Resources"
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      disabled={isFilteringLoading}
                    />
                    {isFetching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base text-gray-900 mb-4 block">Category</Label>
                  <RadioGroup 
                    value={selectedCategory} 
                    onValueChange={handleCategoryChange}
                    disabled={isFilteringLoading}
                    className="space-y-3"
                  >
                    {(CATEGORY_OPTIONS as CategoryOption[]).map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={category.value} 
                          id={`category-${category.value}`}
                          disabled={isFilteringLoading}
                        />
                        <Label 
                          htmlFor={`category-${category.value}`}
                          className={`cursor-pointer ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {selectedCategory && (
                    <Button
                      variant="link"
                      onClick={() => setSelectedCategory('')}
                      className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto mt-2"
                      disabled={isFilteringLoading}
                    >
                      Clear Category Filter
                    </Button>
                  )}
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium text-gray-900 mb-4 flex items-center">
                    Difficulty Level
                    <ChevronDown size={16} className="ml-2 text-gray-500" />
                  </Label>
                  <RadioGroup 
                    value={selectedDifficulty} 
                    onValueChange={handleDifficultyChange}
                    disabled={isFilteringLoading}
                    className="space-y-3"
                  >
                    {(DIFFICULTY_OPTIONS as DifficultyOption[]).map((difficulty) => (
                      <div key={difficulty.value} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={difficulty.value} 
                          id={`difficulty-${difficulty.value}`}
                          disabled={isFilteringLoading}
                        />
                        <Label 
                          htmlFor={`difficulty-${difficulty.value}`}
                          className={`cursor-pointer ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                          {difficulty.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {selectedDifficulty && (
                    <Button
                      variant="link"
                      onClick={() => setSelectedDifficulty('')}
                      className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto mt-2"
                      disabled={isFilteringLoading}
                    >
                      Clear Difficulty Filter
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Sort By Section */}
                <div>
                  <Label className="text-base font-medium text-gray-900 mb-4 flex items-center">
                    Sort By
                    <ChevronDown size={16} className="ml-2 text-gray-500" />
                  </Label>
                  <RadioGroup 
                    value={sortBy} 
                    onValueChange={handleSortByChange}
                    disabled={isFilteringLoading}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="newest" 
                        id="sort-newest"
                        disabled={isFilteringLoading}
                      />
                      <Label 
                        htmlFor="sort-newest"
                        className={`cursor-pointer ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}
                      >
                        Newest
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="oldest" 
                        id="sort-oldest"
                        disabled={isFilteringLoading}
                      />
                      <Label 
                        htmlFor="sort-oldest"
                        className={`cursor-pointer ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}
                      >
                        Oldest
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
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
                    <div 
                      key={resource.id} 
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full cursor-pointer group"
                      onClick={() => handleResourceClick(resource.id)}
                    >
                      <div className="relative">
                        <img
                          src={resource?.thumbnailUrl || resource?.coverImage}
                          alt={resource.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Video overlay for video resources */}
                        {resource.resourceType.toLowerCase() === 'video' && <VideoOverlay />}
                        
                        {/* Resource type indicator in top-left */}
                        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full p-2 shadow-sm">
                          <ResourceTypeIcon type={resource.resourceType} className="w-4 h-4 text-gray-700" />
                        </div>
                        
                        {/* Save button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveResource(resource.id);
                          }}
                          className={`absolute top-4 right-4 p-2 rounded-full ${resource.isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:scale-110 transition-transform shadow-sm`}
                        >
                          <Heart size={16} fill={resource.isSaved ? 'white' : 'none'} />
                        </button>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <ResourceTypeIcon type={resource.resourceType} className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500 capitalize font-medium">
                            {resource.resourceType || 'Article'}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {getCategoryLabel(resource.category)}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                            {resource.difficultyLevel}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button className="text-orange-600 hover:text-blue-700 font-medium text-sm uppercase tracking-wide transition-colors">
                            {resource.resourceType?.toLowerCase() === 'video' ? 'WATCH NOW' : 'READ MORE'}
                          </button>
                          
                          {canCreateResources && (
                            <div className="flex items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
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
                    onPageChange={(page: number) => setCurrentPage(page)}
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
                  <Button
                    variant="link"
                    onClick={handleClearAllFilters}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    Clear all filters
                  </Button>
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
};

export default LearningResourcesUI;