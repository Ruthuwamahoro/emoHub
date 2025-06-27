import { AddChallenge } from "@/services/challenges/postChallenge";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

const initialData = {
    weekNumber: "",
    startDate: "",
    endDate: "",
    theme: ""

}
interface SubmitResult {
    success: boolean;
    error?: string;
  }

export const useCreateChallenge = (groupId?: string) => {
    const [formData, setFormData] = useState(initialData);
    const [ errors, setErrors] = useState<Record<string, string>>({});
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: AddChallenge,
        onSuccess: (response) => {
            console.log('Challenge created successfully:', groupId);
            
            setFormData(initialData); 
            setErrors({});
            showToast(response.message, "success");
            queryClient.invalidateQueries({ queryKey: ["Challenges", groupId] });
        },
        onError: (err: unknown) => {
            const error = err as Error;
            const errorMessage = error.message || "An error occured";
            showToast(errorMessage, "error");
        }

        
    })


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
    
    const handleSubmit = async (e?: React.FormEvent, dataOverride?: typeof formData): Promise<SubmitResult> => {
        if (e) {
          e.preventDefault();
        }
        const dataToUse = dataOverride || formData;

        try {
          await mutate(dataToUse);
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
       isPendingCreateChallenge:isPending,
       handleChange,
       handleSubmit 
    }


}