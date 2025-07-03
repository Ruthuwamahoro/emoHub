import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { UpdateprofileInterface } from "@/types/user";
import showToast from "@/utils/showToast";
import { updateProfileData, uploadImageToCloudinary } from "@/services/user/profile";

// Updated interface to include isAnonymous
interface ExtendedUpdateprofileInterface extends UpdateprofileInterface {
  isAnonymous?: boolean;
}

const initialData: ExtendedUpdateprofileInterface = {
  fullName: "",
  username: "",
  gender: "",
  anonymousName: "",
  anonymousAvatar: "",
  expertise: "",
  profilePicUrl: "",
  bio: "",
  location: "",
  isAnonymous: false
};

export const useUpdateProfile = () => {
  const [Data, setData] = useState<ExtendedUpdateprofileInterface>(initialData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: updateProfileData,
    onSuccess: (response: { message: string }) => {
      if (response.message === "Profile Completed successfully") {
        queryClient.invalidateQueries();
        setData(initialData);
        setErrors({});
        setImageFile(null);
        setImagePreview(null);
        showToast(response.message, "success");
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

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setData({ ...Data, profilePicUrl: "" });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      let dataToSubmit = { ...Data };
      
      // Upload image to Cloudinary if there's a new image file
      if (imageFile) {
        try {
          const imageUrl = await uploadImageToCloudinary(imageFile);
          dataToSubmit = {
            ...dataToSubmit,
            profilePicUrl: imageUrl
          };
        } catch (error) {
          showToast("Failed to upload image", "error");
          return;
        }
      }

      updateProfileMutation.mutate(dataToSubmit);
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
    handleImageUpload,
    isPending: updateProfileMutation.isPending,
    handleAddressChange,
    removeImage,
    errors,
    imagePreview,
    imageFile,
    setImageFile,
    setImagePreview,
  };
};