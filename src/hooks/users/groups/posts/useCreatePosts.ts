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

export const useCreatePosts = (groupId: string) => {
  const [formData, setFormData] = useState<createPostsInterface>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formDataObj: FormData) => {
      return createPostsService({ data: formDataObj, groupId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Posts", groupId] });
      setFormData(initialData);
      setErrors({});
      showToast("Post created successfully!", "success");
    },
    onError: (err: unknown) => {
      const error = err as Error;
      const errorMessage = error.message || "Post creation failed";
      showToast(errorMessage, "error");
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
    handleChange,
    updateField,
    handleSubmit,
    isPending: mutation.isPending,
  };
};