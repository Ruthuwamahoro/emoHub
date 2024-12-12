import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { profileData } from "@/services/user/profile";
import { UpdateprofileInterface } from "@/types/user";
import showToast from "@/utils/showToast";

const initialData: UpdateprofileInterface = {
  expertise: "",
  profilePicUrl: "",
  bio: "",
  location: ""
};

export const useUpdateProfile = () => {
  const [Data, setData] = useState<UpdateprofileInterface>(initialData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const updateProfileMutation = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: profileData,
    onSuccess: (response: { message: string }) => {
      if (response.message === "Profile Completed successfully") {
        queryClient.invalidateQueries();
        setData(initialData);
        setErrors({});
        showToast(response.message, "success");
        router.push("/");
      } else {
        showToast(response.message, "error");
      }
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.data && Array.isArray(errorData.data)) {
          showToast(errorData.data.join(", "), "error");
        } else {
          showToast("An unexpected error occurred.", "error");
        }
      } else {
        showToast("An unexpected error occurred.", "error");
      }
    },
  });

  const handleInputChanges = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const removeImage = () => {
    setData({ ...Data, profilePicUrl: "" });
    setImagePreview(null);
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setData((prevState) => ({
      ...prevState,
    }));
  };

  const handleSubmit = () => {
    try {
      updateProfileMutation.mutate(Data);
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
    Data,
    setData,
    handleSubmit,
    handleInputChanges,
    isPending: updateProfileMutation.isPending,
    handleAddressChange,
    removeImage,
    errors,
  };
};
