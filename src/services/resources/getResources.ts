import axios from "axios";

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

export interface ResourcesQueryParams {
  search?: string;
  page?: number;
  pageSize?: number;
  category?: string;
  difficultyLevel?: string;
  sortBy?: 'newest' | 'oldest';
}

export const getResources = async (params: ResourcesQueryParams = {}): Promise<ApiResponse> => {
  try {
    const {
      search,
      page = 1,        
      pageSize = 4,    
      category,
      difficultyLevel,
      sortBy
    } = params;

    const queryParams = new URLSearchParams();
    
    if (search && search.trim()) {
      queryParams.append('search', search.trim());
    }
    
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
    
    
    const response = await axios.get<ApiResponse>(url);
    
    
    return response.data;
    
  } catch (error) {
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch resources');
    }
    
    throw new Error('An unexpected error occurred while fetching resources');
  }
};