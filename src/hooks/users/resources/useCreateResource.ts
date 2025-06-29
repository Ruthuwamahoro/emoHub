import { createResources } from "@/services/resources/createResource";
import { LearningResource } from "@/types/resources";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

type CreateResourceForm = Omit<LearningResource, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

const initialData: CreateResourceForm = {
  title: "",
  description: "",
  coverImage: "",
  resourceType: "article",
  content: "",
  url: "",
  thumbnailUrl: "",
  duration: 0,
  category: "self-awareness",
  tags: [],
  isSaved: false, 
  difficultyLevel: "beginner",
  hasQuiz: false,
};

export const useCreateResource = () => { 
  const router = useRouter();
  const [formData, setFormData] = useState<CreateResourceForm>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createResources,
    onSuccess: (response) => {
      queryClient.invalidateQueries();
      setFormData(initialData);
      setErrors({});
      showToast(response.message, "success");
    },
    onError: (err: unknown) => {
      const error = err as Error;
      const errorMessage = error.message || "An error occurred";
      showToast(errorMessage, "error");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    setFormData(prev => {
      if (id === 'tags') {
        return { ...prev, [id]: value.split(',').map(tag => tag.trim()) };
      }
      if (id === 'isSaved') {
        return { ...prev, [id]: value === 'true' };
      }
      if (id === 'duration') {
        return { ...prev, [id]: parseInt(value) || 0 };
      }
      
      return { ...prev, [id]: value };
    });

    if (errors[id]) {
      setErrors(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = () => {
    try {
      mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {} as Record<string, string>
        );
        setErrors(fieldErrors);
      }
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isPending,
  };
};