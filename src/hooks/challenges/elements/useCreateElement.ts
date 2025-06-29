import { CreateElement, CreateElementChallengeData } from "@/services/challenges/questions/createElement";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

const challengeElementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  completed: z.boolean().optional().default(false),
});

const initialData: CreateElementChallengeData = {
  title: "",
  description: "",
  completed: false,
};

interface SubmitResult {
  success: boolean;
  error?: string;
}

export const useCreateChallengeElement = (challengeId: string) => {
  const [formData, setFormData] = useState<CreateElementChallengeData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateElementChallengeData) => CreateElement({ id: challengeId, data }),
    onSuccess: (response) => {
      console.log('Challenge element created successfully:', response);
      setFormData(initialData);
      setErrors({});
      showToast(response.message || "Challenge element created successfully", "success");
      
      queryClient.invalidateQueries({ queryKey: ["Challenges"] });
      queryClient.invalidateQueries({ queryKey: ["Challenge", challengeId] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      const errorMessage = error.message || "An error occurred while creating the challenge element";
      showToast(errorMessage, "error");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    if (errors[id]) {
      setErrors(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent): Promise<SubmitResult> => {
    if (e) {
      e.preventDefault();
    }
    try {
      const validatedData = challengeElementSchema.parse(formData);
      setErrors({});
      await mutate(validatedData);
      
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc, curr) => {
            const fieldName = curr.path[0] as string;
            acc[fieldName] = curr.message;
            return acc;
          },
          {} as Record<string, string>
        );
        setErrors(fieldErrors);
        return { success: false, error: "Please fix the validation errors" };
      }
      
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      return { success: false, error: errorMessage };
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    isPending,
    handleChange,
    handleSubmit,
    resetForm,
  };
};