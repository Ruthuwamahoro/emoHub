
import { createCategories } from "@/services/user/groups/categories/createCategories";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

const initialData = {
    name: "",
    description: ""
}


export const useCreateGroupCategories = () => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: createCategories,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
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
        data: mutate,
        formData,
        setFormData,
        isPendingEmotions: isPending,
        handleChange,
        handleSubmit,
        errors 
    }
}