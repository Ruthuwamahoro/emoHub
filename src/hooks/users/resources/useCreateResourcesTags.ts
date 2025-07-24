import { getAllResourcesTags } from "@/services/resources/resourcesTags"
import { useQuery } from "@tanstack/react-query"

export const useGetResourcesTags = () => {
    const { data, isLoading} = useQuery({
        queryKey: ['resourcesTags'],
        queryFn: getAllResourcesTags
    })
    return {
        data,
        isLoading
    }
}