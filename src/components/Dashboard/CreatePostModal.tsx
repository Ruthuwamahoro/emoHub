"use client";

import React, { useState } from 'react';
import { X, Image, Link, FileText, FileAudio, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useCreatePosts } from '@/hooks/users/groups/posts/useCreatePosts';
import { Loader } from "@/components/ui/loader";

type ContentType = 'text' | 'image' | 'video' | 'audio' | 'link';

interface CreatePostModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ groupId, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<ContentType>('text');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [linkPreviewImageFile, setLinkPreviewImageFile] = useState<File | null>(null);
  const [linkPreviewImage, setLinkPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, isPending } = useCreatePosts(groupId);
  const [formValues, setFormValues] = useState({
    title: '',
    textContent: '',
    mediaAlt: '',
    linkUrl: '',
    linkDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTabChange = (value: ContentType) => {
    setActiveTab(value);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setMediaPreview(event.target?.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const handleLinkPreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLinkPreviewImageFile(file);
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setLinkPreviewImage(event.target?.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      if (!formValues.title) {
        throw new Error("Title is required");
      }
      
      formData.append('title', formValues.title);
      formData.append('contentType', activeTab);
      
      switch (activeTab) {
        case 'text':
          if (!formValues.textContent) {
            throw new Error("Content is required");
          }
          formData.append('textContent', formValues.textContent);
          break;
        case 'image':
        case 'video':
        case 'audio':
          if (!mediaFile) {
            throw new Error(`${activeTab} file is required`);
          }
          formData.append('media', mediaFile);
          formData.append('mediaAlt', formValues.mediaAlt);
          break;
        case 'link':
          if (!formValues.linkUrl) {
            throw new Error("URL is required");
          }
          formData.append('linkUrl', formValues.linkUrl);
          formData.append('linkDescription', formValues.linkDescription);
          if (linkPreviewImageFile) {
            formData.append('linkPreviewImage', linkPreviewImageFile);
          }
          break;
      }

      await handleSubmit(formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMediaPreview(null);
    setMediaFile(null);
    setLinkPreviewImage(null);
    setLinkPreviewImageFile(null);
    setFormValues({
      title: '',
      textContent: '',
      mediaAlt: '',
      linkUrl: '',
      linkDescription: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Post</DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-full p-2" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Post Title</Label>
              <Input 
                id="title" 
                placeholder="Give your post a title" 
                value={formValues.title}
                onChange={handleChange}
              />
            </div>

            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as ContentType)}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Text
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Image className="h-4 w-4" /> Image
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" /> Video
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <FileAudio className="h-4 w-4" /> Audio
                </TabsTrigger>
                <TabsTrigger value="link" className="flex items-center gap-2">
                  <Link className="h-4 w-4" /> Link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="textContent">Content</Label>
                  <Textarea 
                    id="textContent" 
                    placeholder="Share your thoughts..." 
                    className="min-h-32"
                    value={formValues.textContent}
                    onChange={handleChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUpload">Upload Image</Label>
                    <Input 
                      id="imageUpload" 
                      type="file" 
                      accept="image/*"
                      onChange={handleMediaChange}
                    />
                  </div>
                  
                  {mediaPreview && (
                    <div className="mt-2">
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="max-h-64 rounded-md object-contain"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="mediaAlt">Alt Text</Label>
                    <Input 
                      id="mediaAlt" 
                      placeholder="Describe the image for accessibility"
                      value={formValues.mediaAlt}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="videoUpload">Upload Video</Label>
                    <Input 
                      id="videoUpload" 
                      type="file" 
                      accept="video/*"
                      onChange={handleMediaChange}
                    />
                  </div>
                  
                  {mediaPreview && mediaFile?.type.startsWith('video/') && (
                    <div className="mt-2">
                      <video 
                        src={mediaPreview} 
                        controls 
                        className="max-h-64 w-full rounded-md"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="mediaAlt">Description</Label>
                    <Input 
                      id="mediaAlt" 
                      placeholder="Describe the video for accessibility"
                      value={formValues.mediaAlt}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audio" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="audioUpload">Upload Audio</Label>
                    <Input 
                      id="audioUpload" 
                      type="file" 
                      accept="audio/*"
                      onChange={handleMediaChange}
                    />
                  </div>
                  
                  {mediaPreview && mediaFile?.type.startsWith('audio/') && (
                    <div className="mt-2">
                      <audio 
                        src={mediaPreview} 
                        controls 
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="mediaAlt">Description</Label>
                    <Input 
                      id="mediaAlt" 
                      placeholder="Describe the audio for accessibility"
                      value={formValues.mediaAlt}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="link" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="linkUrl">Link URL</Label>
                    <Input 
                      id="linkUrl" 
                      placeholder="https://example.com" 
                      value={formValues.linkUrl}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="linkDescription">Description</Label>
                    <Textarea 
                      id="linkDescription" 
                      placeholder="Describe what this link is about" 
                      value={formValues.linkDescription}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="linkPreviewUpload">Preview Image (Optional)</Label>
                    <Input 
                      id="linkPreviewUpload" 
                      type="file" 
                      accept="image/*"
                      onChange={handleLinkPreviewImageChange}
                    />
                    
                    {linkPreviewImage && (
                      <div className="mt-2">
                        <img 
                          src={linkPreviewImage} 
                          alt="Link preview" 
                          className="max-h-40 rounded-md object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting && <Loader size="small" />}
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;