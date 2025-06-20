import { onBoardingQuestions } from "@/services/user/onBoarding";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

// Define the onboarding data structure based on your backend schema
interface OnboardingFormData {
  impression: string;
  currentEmotions: string;
  expressFellings: string;
  goals: string;
  experienceLevel: string;
}

const initialData: OnboardingFormData = {
  impression: "",
  currentEmotions: "",
  expressFellings: "",
  goals: "",
  experienceLevel: ""
};

interface SubmitResult {
  success: boolean;
  error?: string;
}

export const useOnboardingSubmission = () => {
  const [formData, setFormData] = useState<OnboardingFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: onBoardingQuestions,
    onSuccess: (response) => {
      
      // Reset form data
      setFormData(initialData);
      setErrors({});
      router.push("/dashboard");

      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });

    },
    onError: (err: unknown) => {
      const error = err as Error;
      const errorMessage = error.message || "An error occurred during onboarding";
      showToast(errorMessage, "error");
      console.error('Onboarding submission error:', error);
    }
  });

  const updateFormField = (field: keyof OnboardingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear any existing error for this field
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (): Promise<SubmitResult> => {
    try {
      // Validate required fields
      const requiredFields: (keyof OnboardingFormData)[] = [
        'currentEmotions', 
        'expressFellings', 
        'goals'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        const fieldErrors = missingFields.reduce((acc, field) => {
          acc[field] = `${field} is required`;
          return acc;
        }, {} as Record<string, string>);
        
        setErrors(fieldErrors);
        return { success: false, error: "Please fill in all required fields" };
      }

      // Submit the data
      await mutate(formData);
      return { success: true };
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0] as string] = curr.message;
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

  const isFieldComplete = (field: keyof OnboardingFormData): boolean => {
    return !!formData[field];
  };

  const isFormValid = (): boolean => {
    return !!(formData.currentEmotions && formData.expressFellings && formData.goals);
  };

  return {
    formData,
    setFormData,
    updateFormField,
    errors,
    setErrors,
    handleSubmit,
    isSubmitting: isPending,
    isFieldComplete,
    isFormValid
  };
};