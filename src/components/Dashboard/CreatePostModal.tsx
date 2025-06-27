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

interface ModerationData {
  riskLevel?: 'low' | 'medium' | 'high';
  emotionalImpact?: 'positive' | 'negative' | 'neutral';
  contentQuality?: 'spam' | 'low' | 'high';
  meaningfulnessScore?: number;
  concerns?: string[];
  suggestions?: string[];
  message?: string;
  savedForReview?: boolean;
  moderatedContentId?: string;
  confidence?: number;
}

interface CreatePostModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface PostFormData {
  title: string;
  contentType: ContentType;
  textContent?: string;
  mediaAlt?: string;
  linkUrl?: string;
  linkDescription?: string;
}

interface FormErrors {
  title?: string;
  textContent?: string;
  linkUrl?: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ groupId, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<ContentType>('text');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [linkPreviewImageFile, setLinkPreviewImageFile] = useState<File | null>(null);
  const [linkPreviewImage, setLinkPreviewImage] = useState<string | null>(null);

  const { 
    formData, 
    errors, 
    moderationData,
    handleChange, 
    updateField, 
    handleSubmit, 
    isPending 
  }: {
    formData: PostFormData;  
    errors: FormErrors;
    moderationData: ModerationData | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    updateField: (field: string, value: any) => void;
    handleSubmit: (formData: FormData) => Promise<void>;  
    isPending: boolean;
  } = useCreatePosts(groupId);

  const handleTabChange = (value: string) => {
    const contentType = value as ContentType;
    setActiveTab(contentType);
    updateField('contentType', contentType);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      if (event.target?.result) {
        setMediaPreview(event.target.result as string);
      }
    };
    fileReader.readAsDataURL(file);
  };

  const handleLinkPreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLinkPreviewImageFile(file);
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      if (event.target?.result) {
        setLinkPreviewImage(event.target.result as string);
      }
    };
    fileReader.readAsDataURL(file);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const formDataObj = new FormData();
      
      // Add basic fields
      formDataObj.append('title', formData.title);
      formDataObj.append('contentType', activeTab);
      
      // Add content based on type
      switch (activeTab) {
        case 'text':
          formDataObj.append('textContent', formData.textContent || '');
          break;
        case 'image':
        case 'video':
        case 'audio':
          if (mediaFile) {
            formDataObj.append('media', mediaFile);
          }
          formDataObj.append('mediaAlt', formData.mediaAlt || '');
          break;
        case 'link':
          formDataObj.append('linkUrl', formData.linkUrl || '');
          formDataObj.append('linkDescription', formData.linkDescription || '');
          if (linkPreviewImageFile) {
            formDataObj.append('linkPreviewImage', linkPreviewImageFile);
          }
          break;
      }

      await handleSubmit(formDataObj as any);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const resetForm = () => {
    setMediaPreview(null);
    setMediaFile(null);
    setLinkPreviewImage(null);
    setLinkPreviewImageFile(null);
    setActiveTab('text');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Post</DialogTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4 rounded-full p-2" 
            onClick={handleClose}
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
                name="title"
                placeholder="Give your post a title" 
                value={formData.title || ''}
                onChange={handleChange}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
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
                    name="textContent"
                    placeholder="Share your thoughts..." 
                    className={`min-h-32 ${errors.textContent ? 'border-red-500' : ''}`}
                    value={formData.textContent || ''}
                    onChange={handleChange}
                  />
                  {errors.textContent && (
                    <p className="text-red-500 text-sm mt-1">{errors.textContent}</p>
                  )}
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
                    {!mediaFile && activeTab === 'image' && (
                      <p className="text-red-500 text-sm mt-1">Image file is required</p>
                    )}
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
                      name="mediaAlt"
                      placeholder="Describe the image for accessibility"
                      value={formData.mediaAlt || ''}
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
                    {!mediaFile && activeTab === 'video' && (
                      <p className="text-red-500 text-sm mt-1">Video file is required</p>
                    )}
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
                      name="mediaAlt"
                      placeholder="Describe the video for accessibility"
                      value={formData.mediaAlt || ''}
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
                    {!mediaFile && activeTab === 'audio' && (
                      <p className="text-red-500 text-sm mt-1">Audio file is required</p>
                    )}
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
                      name="mediaAlt"
                      placeholder="Describe the audio for accessibility"
                      value={formData.mediaAlt || ''}
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
                      name="linkUrl"
                      placeholder="https://example.com" 
                      value={formData.linkUrl || ''}
                      onChange={handleChange}
                      className={errors.linkUrl ? 'border-red-500' : ''}
                    />
                    {errors.linkUrl && (
                      <p className="text-red-500 text-sm mt-1">{errors.linkUrl}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="linkDescription">Description</Label>
                    <Textarea 
                      id="linkDescription" 
                      name="linkDescription"
                      placeholder="Describe what this link is about" 
                      value={formData.linkDescription || ''}
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
              onClick={handleClose}
              disabled={isPending}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending && <Loader size="small" />}
              {isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </DialogFooter>
        </form>
        
        {moderationData && (
          <div className="mt-4 p-3 border border-rose-200 rounded-lg bg-rose-50">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 mb-2">
                  Content Review Required
                </h4>
                
                {/* Compact status indicators */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {moderationData.riskLevel && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      moderationData.riskLevel === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : moderationData.riskLevel === 'medium'
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Risk: {moderationData.riskLevel}
                    </span>
                  )}
                  
                  {moderationData.emotionalImpact && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      moderationData.emotionalImpact === 'negative'
                        ? 'bg-red-100 text-red-700'
                        : moderationData.emotionalImpact === 'positive'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Impact: {moderationData.emotionalImpact}
                    </span>
                  )}

                  {moderationData.contentQuality && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      moderationData.contentQuality === 'spam'
                        ? 'bg-red-100 text-red-700'
                        : moderationData.contentQuality === 'low'
                        ? 'bg-rose-100 text-rose-700'
                        : moderationData.contentQuality === 'high'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Quality: {moderationData.contentQuality}
                    </span>
                  )}

                  {moderationData.meaningfulnessScore !== undefined && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      moderationData.meaningfulnessScore < 0.3
                        ? 'bg-red-100 text-red-700'
                        : moderationData.meaningfulnessScore < 0.6
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Score: {(moderationData.meaningfulnessScore * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                {/* Compact concerns and suggestions */}
                <div className="space-y-2">
                  {moderationData.concerns && moderationData.concerns.length > 0 && (
                    <div className="bg-red-50 rounded p-2 border border-red-100">
                      <p className="text-xs font-medium text-red-800 mb-1">Issues:</p>
                      <ul className="text-xs text-red-700 space-y-0.5">
                        {moderationData.concerns.slice(0, 2).map((concern, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {concern}
                          </li>
                        ))}
                        {moderationData.concerns.length > 2 && (
                          <li className="text-red-600 font-medium">
                            +{moderationData.concerns.length - 2} more concerns
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {moderationData.suggestions && moderationData.suggestions.length > 0 && (
                    <div className="bg-slate-50 rounded p-2 border border-slate-200">
                      <p className="text-xs font-medium text-slate-800 mb-1">Suggestions:</p>
                      <ul className="text-xs text-slate-700 space-y-0.5">
                        {moderationData.suggestions.slice(0, 2).map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1 h-1 bg-slate-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {suggestion}
                          </li>
                        ))}
                        {moderationData.suggestions.length > 2 && (
                          <li className="text-slate-600 font-medium">
                            +{moderationData.suggestions.length - 2} more suggestions
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action required or additional info */}
                {moderationData.message && (
                  <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded">
                    <p className="text-xs text-rose-800 font-medium">
                      {moderationData.message}
                    </p>
                  </div>
                )}

                {moderationData.savedForReview && (
                  <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded">
                    <p className="text-xs text-slate-700">
                      <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Content saved for moderator review
                      {moderationData.moderatedContentId && (
                        <span className="ml-1 text-slate-500">
                          (ID: {moderationData.moderatedContentId.slice(-8)})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Confidence indicator if available */}
                {moderationData.confidence !== undefined && (
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>Confidence:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${moderationData.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span>{(moderationData.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;