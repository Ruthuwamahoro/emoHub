import { createEmotions } from "@/services/emotions/emotionsCheckins";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

const initialData = {
    feelings: "", 
    emotionIntensity: 60, 
    activities: [],
    notes: ""
}

interface SubmitResult {
    success: boolean;
    error?: string;
}

export const useCreateEmotionCheckins = () => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: createEmotions,
        onSuccess: (response) => {
            
            setFormData(initialData); 
            setErrors({});
            showToast(response.message, "success");
            queryClient.invalidateQueries();
        },
        onError: (err: unknown) => {
            const error = err as Error;
            const errorMessage = error.message || "An error occurred";
            showToast(errorMessage, "error");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'emotionIntensity') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name]) {
            setErrors(prev => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => {
                const { [field]: _, ...rest } = prev;
                return rest;
            });
        }
    };
    
    const handleSubmit = async (e?: React.FormEvent): Promise<SubmitResult> => {
        if (e) {
            e.preventDefault();
        }
        
        if (!formData.feelings) {
            setErrors({ feelings: "Please select an emotion" });
            return { success: false, error: "Please select an emotion" };
        }
        
        try {
            mutate(formData);
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
        data: mutate,
        formData,
        setFormData,
        updateFormData, // New helper function
        isPendingEmotions: isPending,
        handleChange,
        handleSubmit,
        errors // Return errors for display
    }
}