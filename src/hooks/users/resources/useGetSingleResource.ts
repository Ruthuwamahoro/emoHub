import { getSingleResource } from "@/services/resources/getSingleResource";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleResource = (id: string) => {
    const { data, isLoading, isPending, isFetching } = useQuery({
      queryKey: ["resources"],
      queryFn: () =>getSingleResource(id),
    });

    console.log("gigigigigigigiig", data)

    return {
      data,
      isLoading,
      isPending,
      isFetching,
    };
};

