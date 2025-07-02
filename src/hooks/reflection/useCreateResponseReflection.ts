"use client"
import { createResponseReflection } from "@/services/reflection/createResponse";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { z } from "zod";

interface ResponseFormat {
  response: string;
}

const initialData: ResponseFormat = {
  response: "",
};

interface SubmitResult {
  success: boolean;
  error?: string;
}

export const useCreateResponseReflection = (ReflectionId: string) => {
  const [formData, setFormData] = useState<ResponseFormat>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ResponseFormat) => createResponseReflection(ReflectionId, data),
    onSuccess: async (response) => {
      setFormData(initialData);
      setErrors({});
      showToast(response.message || "Reflection saved successfully", "success");
      
      await queryClient.invalidateQueries({ queryKey: ["ReflectionsSummary"] });
      await queryClient.refetchQueries({ queryKey: ["ReflectionsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["Reflection"] });

    },
    onError: (err: unknown) => {
      const error = err as Error;
      const errorMessage = error.message || "An error occurred while saving the reflection";
      showToast(errorMessage, "error");
    }
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldName = name || 'response';
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    if (errors[fieldName]) {
      setErrors(prev => {
        const { [fieldName]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback((e?: React.FormEvent): Promise<SubmitResult> => {
    if (e) {
      e.preventDefault();
    }

    return new Promise((resolve) => {
      try {
        if (!formData.response.trim()) {
          const error = "Please write your reflection before saving.";
          setErrors({ response: error });
          showToast(error, "error");
          resolve({ success: false, error });
          return;
        }

        mutate(formData, {
          onSuccess: () => {
            resolve({ success: true });
          },
          onError: (error) => {
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
              resolve({ success: false, error: "Please fix the validation errors" });
            } else {
              const errorMessage = error instanceof Error ? error.message : "An error occurred";
              resolve({ success: false, error: errorMessage });
            }
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        resolve({ success: false, error: errorMessage });
      }
    });
  }, [formData, mutate]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, []);

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