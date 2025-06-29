import { createAssessment } from "@/services/resources/assessment/createAssessment";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

export interface QuestionInput {
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'short-answer';
  points: number;
  explanation?: string;
  options?: {
    optionText: string;
    isCorrect: boolean;
    orderIndex: number
  }[];
}

export interface AssessmentData {
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts?: number;
  questions: QuestionInput[];
}

const initialData: AssessmentData = {
  title: "",
  description: "",
  passingScore: 70,
  maxAttempts: 3,
  questions: [{
    questionText: "",
    questionType: 'multiple-choice',
    points: 1,
    explanation: "",
    options: [{
      optionText: "",
      isCorrect: false,
      orderIndex: 0
    }]
  }]
}

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<AssessmentData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssessmentData }) =>
      createAssessment(id, data),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'passingScore' || id === 'maxAttempts' ? Number(value) : value
    }));
        
    if (errors[id]) {
      setErrors(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (id: string, e?: React.FormEvent): Promise<{ success: boolean; error?: string; data?: any }> => {
    if (e) {
      e.preventDefault();
    }
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.passingScore <= 0 || formData.passingScore > 100) {
      newErrors.passingScore = "Passing score must be between 1 and 100";
    }
    if (formData.questions.length === 0) {
      newErrors.questions = "At least one question is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return { success: false, error: "Validation failed" };
    }

    return new Promise((resolve) => {
      mutate({ id, data: formData }, {
        onSuccess: (data) => {
          resolve({ success: true, data });
        },
        onError: (error) => {
          if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce(
              (acc, curr) => {
                acc[curr.path[0]] = curr.message;
                return acc;
              },
              {} as Record<string, string>
            );
            setErrors(fieldErrors);
            resolve({ success: false, error: "Validation failed" });
          } else {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            resolve({ success: false, error: errorMessage });
          }
        }
      });
    });
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