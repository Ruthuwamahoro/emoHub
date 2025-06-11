import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getResources, ResourcesQueryParams, ApiResponse } from "@/services/resources/getResources";
import { useSession } from "next-auth/react";

interface UseResourcesOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
}

export const useGetAllResources = (
  params: ResourcesQueryParams = {},
  options: UseResourcesOptions = {}
) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
  } = options;


  const queryParams: ResourcesQueryParams = {
    search: params.search || "",
    page: params.page || 1,
    pageSize: params.pageSize || 8,
    category: params.category || "",
    difficultyLevel: params.difficultyLevel || "",
    sortBy: params.sortBy || 'newest',
  };

  const queryResult: UseQueryResult<ApiResponse, Error> = useQuery({
    queryKey: ["resources", queryParams],
    queryFn: () => getResources(queryParams),
    enabled,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    // Data and state
    data: queryResult.data,
    resources: queryResult.data?.data || [],
    pagination: queryResult.data?.pagination,
    filters: queryResult.data?.filters,

    // Loading states
    isLoading: queryResult.isLoading,
    isPending: queryResult.isPending,
    isFetching: queryResult.isFetching,

    // Error states
    error: queryResult.error,
    isError: queryResult.isError,

    // Status
    status: queryResult.status,

    // Utility functions
    refetch: queryResult.refetch,
  };
};

// Simplified hook for basic usage (backward compatibility)
export const useResources = () => {
  return useGetAllResources();
};