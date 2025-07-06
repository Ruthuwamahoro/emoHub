import axios from "axios";

export const createPostsService = async({ data, groupId } : { data: FormData, groupId: string }) => {
  try {
    const response = await axios.post(
      `/api/groups/${groupId}/posts`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log("just be cascious +++++ )))))))+++++++", response.data)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      
      if (errorData.data && errorData.data.moderationResult) {
        const moderationError = new Error(errorData.message || "Content moderation failed");
        (moderationError as any).moderationData = {
          moderationResult: errorData.data.moderationResult,
          suggestions: errorData.data.moderationResult.suggestions,
          concerns: errorData.data.moderationResult.concerns,
          riskLevel: errorData.data.moderationResult.riskLevel,
          emotionalImpact: errorData.data.moderationResult.emotionalImpact,
          confidence: errorData.data.moderationResult.confidence
        };
        throw moderationError;
      }
      
      // For other API errors, use the response message
      throw new Error(errorData.message || "API request failed");
    }
    
    // For network errors or other non-axios errors
    const err = error instanceof Error ? error.message : "Unexpected error occurred";
    console.log("+++++++", err)
    throw new Error(err);
  }
};