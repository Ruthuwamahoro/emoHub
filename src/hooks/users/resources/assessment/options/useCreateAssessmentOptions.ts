import { createAssessment } from "@/services/resources/assessment/createAssessment";
import { createAssessmentOptions } from "@/services/resources/assessment/options/createAssessmentOptions";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

export interface QuestionInput {
  question: string;
  score: number;
}

const initialData: QuestionInput = {
  question: "",
  score: 1,
};

export const useCreateAssessmentOptions = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id,questionId, data }: { id: string; questionId: string ; data: QuestionInput }) => 
      createAssessmentOptions(id, questionId, data),
    onSuccess: (response) => {
      console.log('Assessment created successfully:', response);
      showToast(response.message || "Assessment created successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["Assessment"] });
      setFormData(initialData);
      setErrors({});
    },
    onError: (err: unknown) => {
      const error = err as Error;
      const errorMessage = error.message || "An error occurred while creating the assessment";
      showToast(errorMessage, "error");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: id === 'score' ? Number(value) : value 
    }));
    
    if (errors[id]) {
      setErrors(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (id: string, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }
    if (formData.score <= 0) {
      newErrors.score = "Score must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return { success: false, error: "Validation failed" };
    }
    try {
      await mutate({ id, questionId: id, data: formData });
      return { success: true };
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
        return { success: false, error: "Validation failed" };
      }
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      return { success: false, error: errorMessage };
    }
  };

  return { 
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleSubmit,
    mutate,
    isPending 
  };
};