import axios from "axios";

// Types for the API response
export interface LearningResource {
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

export interface PaginationInfo {
  pageSize: number;
  currentPage: number;
  totalResources: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterInfo {
  search: string;
  category: string;
  difficultyLevel: string;
  sortBy: string;
}

export interface ApiResponse {
  data: LearningResource[];
  pagination: PaginationInfo;
  filters: FilterInfo;
}

// Query parameters interface
export interface ResourcesQueryParams {
  search?: string;
  page?: number;
  pageSize?: number;
  category?: string;
  difficultyLevel?: string;
  sortBy?: 'newest' | 'oldest';
}

// Service function to fetch resources with query parameters
export const getResources = async (params: ResourcesQueryParams = {}): Promise<ApiResponse> => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    
    if (params.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }
    
    if (params.page && params.page > 0) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.pageSize && params.pageSize > 0) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    
    if (params.category && params.category.trim()) {
      queryParams.append('category', params.category.trim());
    }
    
    if (params.difficultyLevel && params.difficultyLevel.trim()) {
      queryParams.append('difficultyLevel', params.difficultyLevel.trim());
    }
    
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    // Build the URL with query parameters
    const url = `/api/learning-resources${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log('Fetching resources from:', url);
    
    const response = await axios.get<ApiResponse>(url);
    
    console.log('API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    
    // Re-throw the error so React Query can handle it properly
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch resources');
    }
    
    throw new Error('An unexpected error occurred while fetching resources');
  }
};