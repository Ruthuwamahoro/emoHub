"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, BookOpen, Heart, ChevronDown, AlertCircle, Play, FileText, Video, Book, Globe, Filter, X } from 'lucide-react';
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
    <p className="text-gray-600 text-center mb-4 px-4">
      {error.message || 'Failed to load learning resources. Please try again.'}
    </p>
    <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
      Try Again
    </Button>
  </div>
);

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
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

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

  const FilterPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
    <Card className={`${isMobile ? 'border-0 shadow-none' : 'sticky top-6'}`}>
      <CardHeader className={isMobile ? 'pb-4' : ''}>
        <CardTitle className="text-lg flex items-center justify-between">
          Filter Resources
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileFilters(false)}
              className="p-1 h-auto"
            >
              <X size={20} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
                  id={`category-${category.value}-${isMobile ? 'mobile' : 'desktop'}`}
                  disabled={isFilteringLoading}
                />
                <Label 
                  htmlFor={`category-${category.value}-${isMobile ? 'mobile' : 'desktop'}`}
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
                  id={`difficulty-${difficulty.value}-${isMobile ? 'mobile' : 'desktop'}`}
                  disabled={isFilteringLoading}
                />
                <Label 
                  htmlFor={`difficulty-${difficulty.value}-${isMobile ? 'mobile' : 'desktop'}`}
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
                id={`sort-newest-${isMobile ? 'mobile' : 'desktop'}`}
                disabled={isFilteringLoading}
              />
              <Label 
                htmlFor={`sort-newest-${isMobile ? 'mobile' : 'desktop'}`}
                className={`cursor-pointer ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}
              >
                Newest
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="oldest" 
                id={`sort-oldest-${isMobile ? 'mobile' : 'desktop'}`}
                disabled={isFilteringLoading}
              />
              <Label 
                htmlFor={`sort-oldest-${isMobile ? 'mobile' : 'desktop'}`}
                className={`cursor-pointer ${isFilteringLoading ? 'text-gray-400' : 'text-gray-700'}`}
              >
                Oldest
              </Label>
            </div>
          </RadioGroup>
        </div>

        {isMobile && (
          <div className="pt-4 border-t">
            <Button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isInitialLoading) {
    return <LearningResourcesPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Learning Resources</h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Dive into wealth of articles, blogs, guides, videos, and modules designed to enhance your emotional intelligence and well-being
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {canCreateResources && (
                <Button
                  onClick={handleOpenCreateModal}
                  className="flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-blue-700 text-sm sm:text-base px-4 py-2"
                >
                  <Plus />
                  <span className="hidden sm:inline">Create Resource</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              )}
              <Button 
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`relative flex items-center justify-center gap-2 font-medium text-sm sm:text-base px-4 py-2 ${
                    showSavedOnly 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
              >
                <span className="relative">
                    <span className="hidden sm:inline">Saved Resources</span>
                    <span className="sm:hidden">Saved</span>
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

      <div className="lg:hidden bg-white border-b px-4 sm:px-6 py-3">
        <Button
          onClick={() => setShowMobileFilters(true)}
          variant="outline"
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Filter size={16} />
          Filters & Search
        </Button>
      </div>

      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="p-4">
              <FilterPanel isMobile={true} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-6 lg:gap-8">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterPanel />
          </div>

          <div className="flex-1 min-w-0">
            {!isFilteringLoading && pagination && (
              <div className="mb-4 sm:mb-6 text-sm text-gray-600 px-1">
                Showing {displayedResources.length} of {pagination.totalResources} resources
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </div>
            )}

            {isError && error && !isFilteringLoading && (
              <ErrorState error={error} onRetry={() => refetch()} />
            )}

            {isFilteringLoading && (
              <div className="space-y-6">
                <div className="mb-4 sm:mb-6">
                  <div className="h-4 bg-gray-200 rounded w-48 sm:w-64 animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <ResourceSkeleton key={item} />
                  ))}
                </div>
                <PaginationComponentSkeleton />
              </div>
            )}

            {!isFilteringLoading && !isError && displayedResources.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {resource.resourceType.toLowerCase() === 'video' && <VideoOverlay />}
                        
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white bg-opacity-90 rounded-full p-1.5 sm:p-2 shadow-sm">
                          <ResourceTypeIcon type={resource.resourceType} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveResource(resource.id);
                          }}
                          className={`absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full ${resource.isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:scale-110 transition-transform shadow-sm`}
                        >
                          <Heart size={14} className="sm:w-4 sm:h-4" fill={resource.isSaved ? 'white' : 'none'} />
                        </button>
                      </div>
                      
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <ResourceTypeIcon type={resource.resourceType} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="text-xs sm:text-sm text-gray-500 capitalize font-medium">
                            {resource.resourceType || 'Article'}
                          </span>
                        </div>
                        <span className="px-2 sm:px-3 py-3 bg-blue-100 text-green-700 rounded-xl text-xs sm:text-sm font-medium capitalize mb-3">
                            Difficulty Level: {resource.difficultyLevel}
                        </span>
                        
                        
                        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-3 flex-grow">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
                            {getCategoryLabel(resource.category)}
                          </span>
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
                            {resource.tags?.join(', ') || ''}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button className="text-orange-600 hover:text-blue-700 font-medium text-xs sm:text-sm uppercase tracking-wide transition-colors">
                            {resource.resourceType?.toLowerCase() === 'video' ? 'WATCH NOW' : 'READ MORE'}
                          </button>
                          
                          {canCreateResources && (
                            <div className="flex items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
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
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <BookOpen size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">No resources found</h3>
                <p className="text-gray-600 text-center mb-4">
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