import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getResources, ResourcesQueryParams, ApiResponse } from "@/services/resources/getResources";

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
    staleTime = 5 * 60 * 1000, 
    cacheTime = 10 * 60 * 1000, 
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
    data: queryResult.data,
    resources: queryResult.data?.data || [],
    pagination: queryResult.data?.pagination,
    filters: queryResult.data?.filters,

    isLoading: queryResult.isLoading,
    isPending: queryResult.isPending,
    isFetching: queryResult.isFetching,

    error: queryResult.error,
    isError: queryResult.isError,

    status: queryResult.status,

    refetch: queryResult.refetch,
  };
};

export const useResources = () => {
  return useGetAllResources();
};