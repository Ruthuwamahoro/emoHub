import { getAllEmotionsTags } from "@/services/emotions/emotionsTags"
import { useQuery } from "@tanstack/react-query"

export const useGetEmotionsTags = () => {
    const { data, isLoading} = useQuery({
        queryKey: ['emotionsTags'],
        queryFn: getAllEmotionsTags
    })
    return {
        data,
        isLoading
    }
}