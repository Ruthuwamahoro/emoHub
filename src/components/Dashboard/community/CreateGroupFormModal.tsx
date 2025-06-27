import { useCreateGroup } from "@/hooks/users/groups/useCreateGroup";
import { useGroupsCategories } from "@/hooks/users/groups/useGetGroupCategories";
import { uploadImageToCloudinary } from "@/services/user/profile";
import { cn } from "@/lib/utils";
import { PlusCircle, Loader2, X, Upload, UploadCloud, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CreateGroupModal({
  onClose,
  onGroupCreated
}: {
  onClose: () => void,
  onGroupCreated: () => void
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);


  const {
    data: categoriesData,
    isPending: isPendingCategories
  } = useGroupsCategories();

  const {
    formData,
    setFormData,
    isPendingEmotions: isPending,
    handleChange,
    handleSubmit: handleGroupFormSubmission,
    errors
  } = useCreateGroup();

  const allErrors = { ...errors, ...localErrors };

  const handleInputChange = (field: string, value: string) => {
    const syntheticEvent = {
      target: {
        id: field,
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
    
    if (allErrors[field]) {
      setLocalErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file');
      return;
    }

    try {
      setIsUploading(true);
      setImageError(null);

      const cloudinaryUrl = await uploadImageToCloudinary(file);
      handleInputChange('image', cloudinaryUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setImageError('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    handleInputChange('image', '');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await handleGroupFormSubmission();
      onGroupCreated();
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Create New Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Group Name */}
          <div className="flex justify-between">
          <div className="">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Group Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter group name"
              className={cn(
                "w-full",
                allErrors.name && "border-red-300 focus-visible:ring-red-200"
              )}
            />
            {allErrors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {allErrors.name}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="">
            <Label className="text-sm font-medium text-gray-700">
              Category *
            </Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => handleInputChange('categoryId', value)}
              disabled={isPendingCategories}
            >
              <SelectTrigger className={cn(
                "w-full",
                allErrors.categoryId && "border-red-300 focus-visible:ring-red-200"
              )}>
                <SelectValue placeholder={
                  isPendingCategories ? "Loading categories..." : "Select a category"
                } />
              </SelectTrigger>
              <SelectContent>
                {isPendingCategories ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading categories...
                    </div>
                  </SelectItem>
                ) : (
                  categoriesData?.data?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {allErrors.categoryId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {allErrors.categoryId}
              </p>
            )}
          </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the purpose of this group"
              rows={4}
              className={cn(
                "w-full resize-none",
                allErrors.description && "border-red-300 focus-visible:ring-red-200"
              )}
            />
            {allErrors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {allErrors.description}
              </p>
            )}
          </div>

          {/* Group Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Group Image (Optional)
            </Label>
            
            {formData.image ? (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Group"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-6 h-6 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <PlusCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Upload group image</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploading}
                      className={cn(
                        "text-sm",
                        imageError && "border-red-500"
                      )}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4 mr-2" />
                          Choose Image
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            )}
            
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {imageError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {imageError}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending || isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || isUploading || isPendingCategories}
            className="min-w-[120px]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Group
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}