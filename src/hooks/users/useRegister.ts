"use client"
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUser } from "@/services/user/userRegister";
import { RegisterSchema, registerSchema } from "@/utils/validation/registerFieldValidation";
import showToast from "@/utils/showToast";
import { useRouter } from "next/navigation";
import { z } from "zod";

const initialData = {
    fullName: "",
    username: "",
    email: "",
    password_hash: ""
};

export const useAddUsers = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<RegisterSchema>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: addUser,
        onSuccess: (response) => {
            queryClient.invalidateQueries();
            setFormData(initialData);
            setErrors({});
            showToast(response.message, "success");
            setTimeout(() => {
                router.push("/login")

            }, 3000)
        },
        onError: (err: unknown) => {
            const error = err as Error;
            const errorMessage = error.message || "Registration failed";
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
            registerSchema.parse(formData);
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
        isPending
    };
};