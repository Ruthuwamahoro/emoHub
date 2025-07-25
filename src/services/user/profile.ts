import { UpdateprofileInterface } from "@/types/user";
import axios from "axios";

interface ExtendedUpdateprofileInterface extends UpdateprofileInterface {
  isAnonymous?: boolean;
}

export const updateProfileData = async (data: ExtendedUpdateprofileInterface): Promise<{ message: string }> => {
    const response = await axios.patch("/api/profile", data)
    return response.data
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append("upload_preset", "default_preset");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/my-cloud-name01/image/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  const response = await axios.get(`/api/users/${id}`)
  return response.data
}