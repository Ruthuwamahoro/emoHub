export interface createPostsInterface {
    title: string;
    contentType: "text" | "image" | "video" | "audio" | "link";
    textContent?: string;
    mediaUrl?: string;
    mediaAlt?: string;
    linkUrl?: string;
    linkDescription?: string;
    linkPreviewImage?: string;
  }
  
  export interface Post {
    id: string;
    userId: string;
    groupId: string;
    title: string;
    contentType: "text" | "image" | "video" | "audio" | "link";
    textContent: string | null;
    mediaUrl: string | null;
    mediaAlt: string | null;
    linkUrl: string | null;
    linkDescription: string | null;
    linkPreviewImage: string | null;
    createdAt: string;
    updatedAt: string;
  }