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

  const { 
    formData, 
    errors, 
    moderationData, // This will contain the moderation info when content is flagged
    handleChange, 
    updateField, 
    handleSubmit, 
    isPending 
  } = useCreatePosts(groupId);

  const handleTabChange = (value: ContentType) => {
    setActiveTab(value);
    updateField('contentType', value);
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

      await handleSubmit(formDataObj);
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
                placeholder="Give your post a title" 
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
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
  <div className="moderation-feedback">
    <h4>Content Review Required</h4>
    <p>Risk Level: {moderationData.riskLevel}</p>
    <p>Emotional Impact: {moderationData.emotionalImpact}</p>
    
    {moderationData.concerns.length > 0 && (
      <div>
        <h5>Concerns:</h5>
        <ul>
          {moderationData.concerns.map((concern, index) => (
            <li key={index}>{concern}</li>
          ))}
        </ul>
      </div>
    )}
    
    {moderationData.suggestions.length > 0 && (
      <div>
        <h5>Suggestions:</h5>
        <ul>
          {moderationData.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;




























// import React, { useState } from 'react';
// import { X, Image, Link, FileText, FileAudio, Video, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { useCreatePosts } from '@/hooks/users/groups/posts/useCreatePosts';

// const Loader: React.FC<{ size?: 'small' | 'default' }> = ({ size = 'default' }) => (
//   <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-red-600 ${
//     size === 'small' ? 'h-4 w-4' : 'h-6 w-6'
//   }`} />
// );

// type ContentType = 'text' | 'image' | 'video' | 'audio' | 'link';

// interface ModerationResult {
//   isAppropriate: boolean;
//   riskLevel: "low" | "medium" | "high";
//   concerns: string[];
//   suggestions: string[];
//   emotionalImpact: "positive" | "negative" | "neutral";
//   confidence: number;
// }

// // Moderation Feedback Component
// const ModerationFeedback: React.FC<{
//   result: ModerationResult;
//   onAccept: () => void;
//   onDismiss: () => void;
// }> = ({ result, onAccept, onDismiss }) => {
//   const getIcon = () => {
//     if (!result.isAppropriate) {
//       return <XCircle className="h-5 w-5 text-red-500" />;
//     }
//     if (result.riskLevel === "medium") {
//       return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
//     }
//     return <CheckCircle className="h-5 w-5 text-green-500" />;
//   };

//   const getTitle = () => {
//     if (!result.isAppropriate) return "Content Flagged";
//     if (result.riskLevel === "medium") return "Content Warning";
//     return "Content Approved";
//   };

//   const getDescription = () => {
//     if (!result.isAppropriate) {
//       return "Your content may negatively impact others. Please review and modify your post.";
//     }
//     if (result.riskLevel === "medium") {
//       return "Your content has some concerns but can be posted. Please consider the suggestions below.";
//     }
//     return "Your content looks good and is ready to be posted!";
//   };

//   return (
//     <Alert className={`my-4 border-l-4 ${
//       !result.isAppropriate 
//         ? 'border-l-red-500 bg-red-50' 
//         : result.riskLevel === "medium" 
//         ? 'border-l-yellow-500 bg-yellow-50' 
//         : 'border-l-green-500 bg-green-50'
//     }`}>
//       <div className="flex items-start space-x-3">
//         {getIcon()}
//         <div className="flex-1">
//           <h4 className="font-semibold text-sm mb-1">{getTitle()}</h4>
//           <AlertDescription className="text-sm mb-3">
//             {getDescription()}
//           </AlertDescription>

//           {result.concerns.length > 0 && (
//             <div className="mb-3">
//               <h5 className="font-medium text-sm mb-1 text-red-700">Concerns:</h5>
//               <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
//                 {result.concerns.map((concern, index) => (
//                   <li key={index}>{concern}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {result.suggestions.length > 0 && (
//             <div className="mb-3">
//               <h5 className="font-medium text-sm mb-1 text-blue-700">Suggestions:</h5>
//               <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
//                 {result.suggestions.map((suggestion, index) => (
//                   <li key={index}>{suggestion}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <div className="flex items-center justify-between mt-4">
//             <div className="text-xs text-gray-500">
//               Risk Level: <span className={`font-medium ${
//                 result.riskLevel === "high" ? "text-red-600" :
//                 result.riskLevel === "medium" ? "text-yellow-600" : 
//                 "text-green-600"
//               }`}>
//                 {result.riskLevel.toUpperCase()}
//               </span>
//               {" | "}
//               Emotional Impact: <span className={`font-medium ${
//                 result.emotionalImpact === "negative" ? "text-red-600" :
//                 result.emotionalImpact === "positive" ? "text-green-600" : 
//                 "text-gray-600"
//               }`}>
//                 {result.emotionalImpact.toUpperCase()}
//               </span>
//             </div>
            
//             <div className="flex space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onDismiss}
//                 className="text-xs"
//               >
//                 Modify Content
//               </Button>
//               {result.isAppropriate && (
//                 <Button
//                   size="sm"
//                   onClick={onAccept}
//                   className="text-xs bg-green-600 hover:bg-green-700 text-white"
//                 >
//                   Proceed Anyway
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Alert>
//   );
// };

// interface CreatePostModalProps {
//   groupId: string;
//   isOpen?: boolean;
//   onClose?: () => void;
// }

// const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
//   groupId,
//   isOpen = true, 
//   onClose = () => {} 
// }) => {
//   // Use your custom hook instead of local state
//   const {
//     formData,
//     errors,
//     moderationFeedback,
//     isContentApproved,
//     handleChange,
//     updateField,
//     handleSubmit,
//     checkContentModeration,
//     dismissModerationFeedback,
//     acceptModerationWarning,
//     isPending
//   } = useCreatePosts(groupId);

//   const [activeTab, setActiveTab] = useState<ContentType>('text');
//   const [mediaPreview, setMediaPreview] = useState<string | null>(null);
//   const [mediaFile, setMediaFile] = useState<File | null>(null);
//   const [linkPreviewImage, setLinkPreviewImage] = useState<string | null>(null);
//   const [linkPreviewImageFile, setLinkPreviewImageFile] = useState<File | null>(null);

//   const handleTabChange = (value: string) => {
//     const contentType = value as ContentType;
//     setActiveTab(contentType);
//     updateField('contentType', contentType);
    
//     // Reset media when changing tabs
//     if (value !== 'image' && value !== 'video' && value !== 'audio') {
//       setMediaPreview(null);
//       setMediaFile(null);
//     }
//     if (value !== 'link') {
//       setLinkPreviewImage(null);
//       setLinkPreviewImageFile(null);
//     }
//   };

//   const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setMediaFile(file);
//     const fileReader = new FileReader();
//     fileReader.onload = (event) => {
//       setMediaPreview(event.target?.result as string);
//     };
//     fileReader.readAsDataURL(file);
//   };

//   const handleLinkPreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLinkPreviewImageFile(file);
//     const fileReader = new FileReader();
//     fileReader.onload = (event) => {
//       setLinkPreviewImage(event.target?.result as string);
//     };
//     fileReader.readAsDataURL(file);
//   };

//   const handleSubmitForm = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       const formDataObj = new FormData();
      
//       // Add basic form data
//       formDataObj.append('title', formData.title);
//       formDataObj.append('contentType', activeTab);
//       formDataObj.append('textContent', formData.textContent || '');
//       formDataObj.append('mediaAlt', formData.mediaAlt || '');
//       formDataObj.append('linkUrl', formData.linkUrl || '');
//       formDataObj.append('linkDescription', formData.linkDescription || '');

//       // Add media file if present
//       if (mediaFile && ['image', 'video', 'audio'].includes(activeTab)) {
//         formDataObj.append('media', mediaFile);
//       }

//       // Add link preview image if present
//       if (linkPreviewImageFile && activeTab === 'link') {
//         formDataObj.append('linkPreviewImage', linkPreviewImageFile);
//       }

//       await handleSubmit(formDataObj);
      
//       // Reset form state on success
//       resetLocalState();
//       onClose();
//     } catch (error) {
//       console.error("Failed to create post:", error);
//     }
//   };

//   const resetLocalState = () => {
//     setMediaPreview(null);
//     setMediaFile(null);
//     setLinkPreviewImage(null);
//     setLinkPreviewImageFile(null);
//     setActiveTab('text');
//   };

//   const handleClose = () => {
//     resetLocalState();
//     onClose();
//   };

//   const canSubmit = isContentApproved && !isPending;

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
//       <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold">Create New Post</DialogTitle>
//           <Button
//             variant="ghost"
//             className="absolute right-4 top-4 rounded-full p-2"
//             onClick={handleClose}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </DialogHeader>
        
//         <div className="p-6">
//           <div className="space-y-4">
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="title">Post Title</Label>
//                 <Input
//                   id="title"
//                   placeholder="Give your post a title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className={errors.title ? 'border-red-500' : ''}
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-sm mt-1">{errors.title}</p>
//                 )}
//               </div>

//               <Tabs value={activeTab} onValueChange={handleTabChange}>
//                 <TabsList>
//                   <TabsTrigger value="text">
//                     <FileText className="h-4 w-4 mr-2" />
//                     Text
//                   </TabsTrigger>
//                   <TabsTrigger value="image">
//                     <Image className="h-4 w-4 mr-2" />
//                     Image
//                   </TabsTrigger>
//                   <TabsTrigger value="video">
//                     <Video className="h-4 w-4 mr-2" />
//                     Video
//                   </TabsTrigger>
//                   <TabsTrigger value="audio">
//                     <FileAudio className="h-4 w-4 mr-2" />
//                     Audio
//                   </TabsTrigger>
//                   <TabsTrigger value="link">
//                     <Link className="h-4 w-4 mr-2" />
//                     Link
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="text">
//                   <div className="space-y-2">
//                     <Label htmlFor="textContent">Content</Label>
//                     <Textarea
//                       id="textContent"
//                       placeholder="Share your thoughts..."
//                       className={`min-h-32 ${errors.textContent ? 'border-red-500' : ''}`}
//                       value={formData.textContent}
//                       onChange={handleChange}
//                     />
//                     {errors.textContent && (
//                       <p className="text-red-500 text-sm mt-1">{errors.textContent}</p>
//                     )}
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="image">
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="imageUpload">Upload Image</Label>
//                       <Input
//                         id="imageUpload"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleMediaChange}
//                       />
//                       {errors.media && (
//                         <p className="text-red-500 text-sm mt-1">{errors.media}</p>
//                       )}
//                     </div>
//                     {mediaPreview && (
//                       <div className="mt-2">
//                         <img
//                           src={mediaPreview}
//                           alt="Preview"
//                           className="max-h-64 rounded-md object-contain"
//                         />
//                       </div>
//                     )}
//                     <div>
//                       <Label htmlFor="mediaAlt">Alt Text</Label>
//                       <Input
//                         id="mediaAlt"
//                         placeholder="Describe the image for accessibility"
//                         value={formData.mediaAlt}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="video">
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="videoUpload">Upload Video</Label>
//                       <Input
//                         id="videoUpload"
//                         type="file"
//                         accept="video/*"
//                         onChange={handleMediaChange}
//                       />
//                       {errors.media && (
//                         <p className="text-red-500 text-sm mt-1">{errors.media}</p>
//                       )}
//                     </div>
//                     {mediaPreview && mediaFile?.type.startsWith('video/') && (
//                       <div className="mt-2">
//                         <video
//                           src={mediaPreview}
//                           controls
//                           className="max-h-64 w-full rounded-md"
//                         />
//                       </div>
//                     )}
//                     <div>
//                       <Label htmlFor="mediaAlt">Description</Label>
//                       <Input
//                         id="mediaAlt"
//                         placeholder="Describe the video for accessibility"
//                         value={formData.mediaAlt}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="audio">
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="audioUpload">Upload Audio</Label>
//                       <Input
//                         id="audioUpload"
//                         type="file"
//                         accept="audio/*"
//                         onChange={handleMediaChange}
//                       />
//                       {errors.media && (
//                         <p className="text-red-500 text-sm mt-1">{errors.media}</p>
//                       )}
//                     </div>
//                     {mediaPreview && mediaFile?.type.startsWith('audio/') && (
//                       <div className="mt-2">
//                         <audio src={mediaPreview} controls className="w-full" />
//                       </div>
//                     )}
//                     <div>
//                       <Label htmlFor="mediaAlt">Description</Label>
//                       <Input
//                         id="mediaAlt"
//                         placeholder="Describe the audio for accessibility"
//                         value={formData.mediaAlt}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="link">
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="linkUrl">Link URL</Label>
//                       <Input
//                         id="linkUrl"
//                         placeholder="https://example.com"
//                         value={formData.linkUrl}
//                         onChange={handleChange}
//                         className={errors.linkUrl ? 'border-red-500' : ''}
//                       />
//                       {errors.linkUrl && (
//                         <p className="text-red-500 text-sm mt-1">{errors.linkUrl}</p>
//                       )}
//                     </div>
//                     <div>
//                       <Label htmlFor="linkDescription">Description</Label>
//                       <Textarea
//                         id="linkDescription"
//                         placeholder="Describe what this link is about"
//                         value={formData.linkDescription}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="linkPreviewUpload">Preview Image (Optional)</Label>
//                       <Input
//                         id="linkPreviewUpload"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleLinkPreviewImageChange}
//                       />
//                       {linkPreviewImage && (
//                         <div className="mt-2">
//                           <img
//                             src={linkPreviewImage}
//                             alt="Link preview"
//                             className="max-h-40 rounded-md object-contain"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </TabsContent>
//               </Tabs>

//               {/* Content Moderation Section */}
//               <div className="border-t pt-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Shield className="h-5 w-5 text-red-600" />
//                     <h3 className="text-sm font-medium">Content Safety Check</h3>
//                   </div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={checkContentModeration}
//                     disabled={moderationFeedback.isChecking || !formData.title.trim()}
//                     className="flex items-center gap-2"
//                   >
//                     {moderationFeedback.isChecking && <Loader size="small" />}
//                     {moderationFeedback.isChecking ? 'Checking...' : 'Check Content'}
//                   </Button>
//                 </div>

//                 {moderationFeedback.isVisible && moderationFeedback.result && (
//                   <ModerationFeedback
//                     result={moderationFeedback.result}
//                     onAccept={acceptModerationWarning}
//                     onDismiss={dismissModerationFeedback}
//                   />
//                 )}

//                 {!isContentApproved && !moderationFeedback.isVisible && (
//                   <Alert className="bg-yellow-50 border border-yellow-200">
//                     <AlertTriangle className="h-4 w-4" />
//                     <AlertDescription className="text-yellow-800">
//                       Please check your content for appropriateness before submitting.
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={handleClose}
//             disabled={isPending}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmitForm}
//             disabled={!canSubmit}
//             className={`flex items-center gap-2 ${
//               !isContentApproved ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {isPending && <Loader size="small" />}
//             {isPending ? 'Creating...' : 'Create Post'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreatePostModal;