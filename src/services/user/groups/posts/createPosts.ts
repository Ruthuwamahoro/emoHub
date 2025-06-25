import { createPostsInterface } from "@/types/posts";
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
    // Check if it's an axios error with a response (like your moderation error)
    if (axios.isAxiosError(error) && error.response) {
      // This is the case where the server returns a structured error response
      const errorData = error.response.data;
      
      // If it's a moderation error, throw the structured data instead of just the message
      if (errorData.data && errorData.data.moderationResult) {
        const moderationError = new Error(errorData.message || "Content moderation failed");
        // Attach the moderation data to the error object
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