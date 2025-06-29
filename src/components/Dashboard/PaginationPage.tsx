import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
  export function PaginationComponent({
    currentPages,
    totalPages,
    onPageChange,
    disabled
  }: {
    currentPages: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean; 
  }) {
    const handlePageChange = (page: number) => {
      if (disabled) return;
      onPageChange(page);
    };
  
    const generatePaginationItems = () => {
      const items: React.ReactNode[] = [];
      
      if (currentPages > 3) {
        items.push(
          <PaginationItem key="first">
            <PaginationLink 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
              className={disabled ? "pointer-events-none opacity-50" : ""}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        
        if (currentPages > 4) {
          items.push(
            <PaginationItem key="start-ellipsis">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }
  
      const startPage = Math.max(1, currentPages - 1);
      const endPage = Math.min(totalPages, currentPages + 1);
  
      for (let page = startPage; page <= endPage; page++) {
        items.push(
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPages}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page);
              }}
              className={disabled ? "pointer-events-none opacity-50" : ""}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
  
      if (currentPages < totalPages - 2) {
        if (currentPages < totalPages - 3) {
          items.push(
            <PaginationItem key="end-ellipsis">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        
        items.push(
          <PaginationItem key="last">
            <PaginationLink 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
              className={disabled ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
  
      return items;
    };
  
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(Math.max(1, currentPages - 1));
              }}
              className={
                (currentPages === 1 || disabled) 
                  ? "pointer-events-none opacity-50" 
                  : ""
              }
            />
          </PaginationItem>
          
          {generatePaginationItems()}
          
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(Math.min(totalPages, currentPages + 1));
              }}
              className={
                (currentPages === totalPages || disabled) 
                  ? "pointer-events-none opacity-50" 
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }