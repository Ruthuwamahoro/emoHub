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
    // Set default values for pagination
    const {
      search,
      page = 1,        // Default to page 1
      pageSize = 4,    // Default to pageSize 4
      category,
      difficultyLevel,
      sortBy
    } = params;

    // Build query string from parameters
    const queryParams = new URLSearchParams();
    
    if (search && search.trim()) {
      queryParams.append('search', search.trim());
    }
    
    // Always append page and pageSize (with defaults if not provided)
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());
    
    if (category && category.trim()) {
      queryParams.append('category', category.trim());
    }
    
    if (difficultyLevel && difficultyLevel.trim()) {
      queryParams.append('difficultyLevel', difficultyLevel.trim());
    }
    
    if (sortBy) {
      queryParams.append('sortBy', sortBy);
    }

    const url = `/api/learning-resources?${queryParams.toString()}`;
    
    console.log('Fetching resources from:', url);
    
    const response = await axios.get<ApiResponse>(url);
    
    console.log('API Response:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error('Error fetching resources:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch resources');
    }
    
    throw new Error('An unexpected error occurred while fetching resources');
  }
};