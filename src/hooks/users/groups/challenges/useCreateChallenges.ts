import { createChallenges } from "@/services/user/groups/challenges/createChallenge";
import showToast from "@/utils/showToast";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {useState} from "react";
import { z } from "zod";

const initialData = {
    title: "",
    description: "",
    image: "",
    total_points: 0,
    start_date: "",
    end_date: "",
    questions: [
        {
            question: "",
            description: "",
            points: 0,
            order: 0,
            notes: ""
        }
    ]
}
export const useCreateChallenges = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();

    const { mutation, isPending} = useMutation({
        mutationFn: createChallenges,
        onSuccess: (response) => {
            queryClient.invalidateQueries();
            setFormData(initialData);
            setErrors({});
            router.push("/dashboard/community")
        },
        onError: (err: unknown) => {
            const error = err as Error;
            const errorMessage = error.message || "Challenge creation failed";
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
    
        const handleSubmit = () => {
            try {
                mutation(formData);
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
            isPending
        };
}

