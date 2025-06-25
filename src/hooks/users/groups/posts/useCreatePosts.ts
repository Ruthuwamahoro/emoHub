import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import showToast from "@/utils/showToast";
import { createPostsService } from "@/services/user/groups/posts/createPosts";
import { createPostsInterface } from "@/types/posts";

const initialData: createPostsInterface = {
  title: "",
  contentType: "text",
  textContent: "",
  mediaAlt: "",
  linkUrl: "",
  linkDescription: "",
};

interface FormErrors {
  [key: string]: string;
}

interface ModerationData {
  moderationResult: {
    isAppropriate: boolean;
    riskLevel: "low" | "medium" | "high";
    concerns: string[];
    suggestions: string[];
    emotionalImpact: "positive" | "neutral" | "negative";
    confidence: number;
  };
  suggestions: string[];
  concerns: string[];
  riskLevel: "low" | "medium" | "high";
  emotionalImpact: "positive" | "neutral" | "negative";
  confidence: number;
}

export const useCreatePosts = (groupId: string) => {
  const [formData, setFormData] = useState<createPostsInterface>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [moderationData, setModerationData] = useState<ModerationData | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formDataObj: FormData) => {
      return createPostsService({ data: formDataObj, groupId });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["Posts", groupId] });
      
      // Check if moderation info exists in successful response
      if (response.data?.moderationInfo) {
        console.log("response is my answer: suggestions: ", response.data.moderationInfo.suggestions);
        console.log("response is my answer: emotional impact: ", response.data.moderationInfo.emotionalImpact);
        console.log("response is my answer: risk level: ", response.data.moderationInfo.riskLevel);
      }
      
      setFormData(initialData);
      setErrors({});
      setModerationData(null); // Clear any previous moderation data
      showToast("Post created successfully!", "success");
    },
    onError: (err: unknown) => {
      const error = err as Error & { moderationData?: ModerationData };
      
      // Check if this is a moderation error
      if (error.moderationData) {
        console.log("Moderation error detected:");
        console.log("Suggestions:", error.moderationData.suggestions);
        console.log("Concerns:", error.moderationData.concerns);
        console.log("Risk Level:", error.moderationData.riskLevel);
        console.log("Emotional Impact:", error.moderationData.emotionalImpact);
        console.log("Confidence:", error.moderationData.confidence);
        
        // Store moderation data in state so it can be accessed by the component
        setModerationData(error.moderationData);
        
        // Show a specific toast for moderation errors
        showToast("Your post needs review. Please check the suggestions below.", "error");
      } else {
        // Handle regular errors
        console.log("Regular error:", error);
        const errorMessage = error.message || "Post creation failed";
        showToast(errorMessage, "error");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
    
    // Clear moderation data when user starts editing
    if (moderationData) {
      setModerationData(null);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear moderation data when user starts editing
    if (moderationData) {
      setModerationData(null);
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (formData.contentType === "text" && !formData.textContent?.trim()) {
      newErrors.textContent = "Content is required for text posts";
    }
    
    if (formData.contentType === "link" && !formData.linkUrl?.trim()) {
      newErrors.linkUrl = "URL is required for link posts";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formDataObj?: FormData) => {
    if (!validateForm()) {
      return Promise.reject("Validation failed");
    }
    
    if (formDataObj) {
      return mutation.mutateAsync(formDataObj);
    }
    
    const formDataObj2 = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataObj2.append(key, value.toString());
      }
    });
    
    return mutation.mutateAsync(formDataObj2);
  };

  return {
    formData,
    errors,
    moderationData, // Expose moderation data to the component
    handleChange,
    updateField,
    handleSubmit,
    isPending: mutation.isPending,
  };
};