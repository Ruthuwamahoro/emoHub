import { getGroupsCategory } from "@/services/user/groups/categories/getCategory";
import { useQuery } from "@tanstack/react-query";

export const useGroupsCategories = () => {
    const { data, isPending} =  useQuery({
      queryKey: ["groups"],
      queryFn: getGroupsCategory
    });

    return {
        data,
        isPending
    }
  };