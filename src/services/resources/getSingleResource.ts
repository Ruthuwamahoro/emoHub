import axios from "axios";




export const getSingleResource = async (id:string) => {
  try {

    const url = `/api/learning-resources/${id}`;
    
    
    const response = await axios.get(url);

    console.log("response.dataaaaaa", response.data)
    
    
    return response.data;
    
  } catch (error) {
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch resources');
    }
    
    throw new Error('An unexpected error occurred while fetching resources');
  }
}