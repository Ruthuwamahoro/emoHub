import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

export const ResourceSkeleton = () => (
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
  
  export const LearningResourcesPageSkeleton = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-start">
              <div className="max-w-2xl">
                <div className="h-9 bg-gray-200 rounded w-80 mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
                
                
                <div className="mb-6">
                  <div className="relative">
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
  
                <div className="mb-6">
                  <div className="h-5 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                      <div key={item} className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="ml-3 h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
  
               
                <div className="mb-6">
                  <div className="h-5 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="ml-3 h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
  
                <div>
                  <div className="h-5 bg-gray-200 rounded w-16 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[1, 2].map((item) => (
                      <div key={item} className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="ml-3 h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  
            <div className="flex-1">
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
          </div>
        </div>
      </div>
    );
  };