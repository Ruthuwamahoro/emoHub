import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  Play, 
  BookOpen, 
  Users, 
  Calendar,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Award,
  FileText,
  Video,
  Pause
} from 'lucide-react';

import { useGetSingleResource } from "@/hooks/users/resources/useGetSingleResource";
import Image from 'next/image';

interface SingleLearningResourcesUIProps {
  id: string;
}

export const SingleLearningResourcesUI = ({ id }: SingleLearningResourcesUIProps) => {
  const { data, isLoading, isPending, isFetching } = useGetSingleResource(id);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const singleData = data?.data;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const renderVideoContent = () => {
    if (!singleData?.url) return null;

    const embedUrl = getYouTubeEmbedUrl(singleData.url);

    if (isVideoPlaying && embedUrl) {
      return (
        <Card className="overflow-hidden">
          <div className="relative">
            <iframe
              src={embedUrl}
              className="w-full h-64 sm:h-80 md:h-96"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={singleData.title}
            />
            <Button 
              variant="secondary"
              size="sm"
              className="absolute top-2 left-2 z-10 bg-white/90 hover:bg-white text-black"
              onClick={() => setIsVideoPlaying(false)}
            >
              ← Back
            </Button>
          </div>
        </Card>
      );
    }

    const videoId = getYouTubeVideoId(singleData.url);
    const youtubeThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

    return (
      <Card className="overflow-hidden">
        <div 
          className="relative h-64 sm:h-80 cursor-pointer group"
          onClick={() => setIsVideoPlaying(true)}
        >
          <img 
            src={youtubeThumbnail || singleData?.thumbnailUrl || singleData?.coverImage || '/api/placeholder/800/400'} 
            alt={singleData?.title || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
            <div className="bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded-full p-4 shadow-lg">
              <svg 
                className="w-8 h-8 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
            <Badge className="bg-black bg-opacity-80 text-white">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(singleData?.duration || 0)}
            </Badge>
          </div>

          <div className="absolute top-4 right-4">
            <Badge className="bg-red-600 text-white font-semibold">
              YouTube
            </Badge>
          </div>
        </div>
      </Card>
    );
  };

  const renderArticleContent = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Article Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {singleData?.content || 'No content available'}
            </div>
          </div>
          {singleData?.url && (
            <div className="mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => window.open(singleData.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Full Article
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading || isPending || isFetching) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-72 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!singleData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resource not found</h3>
              <p className="text-gray-600">The learning resource you're looking for doesn't exist or has been removed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isVideo = singleData.resourceType === 'video';
  const isArticle = singleData.resourceType === 'article';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-white border border-gray-200">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Button 
              variant="secondary"
              size="sm"
              className="top-2 left-2 z-10 bg-slate-600 hover:bg-slate-400 text-white"
              onClick={() => window.location.href = "/dashboard/resources"}
            >
              ← Back
            </Button>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {singleData?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${getDifficultyColor(singleData?.difficultyLevel || 'beginner')}`}
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {singleData?.difficultyLevel || 'beginner'}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    <Users className="h-3 w-3 mr-1" />
                    {singleData?.category?.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    {isVideo ? (
                      <Video className="h-3 w-3 mr-1" />
                    ) : (
                      <FileText className="h-3 w-3 mr-1" />
                    )}
                    {singleData?.resourceType || 'video'}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="ml-4"
              >
                {singleData.isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              {singleData?.description || 'No description available'}
            </p>

            <div className="text-gray-600 text-lg leading-relaxed">
              {isArticle && singleData?.coverImage && (
                <Image
                  src={singleData.coverImage}
                  alt="Cover image"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Dynamic Content Based on Type */}
          {isVideo && renderVideoContent()}
          {isArticle && renderArticleContent()}

          {/* Additional Content Section for Videos */}
          {isVideo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center font-medium text-lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  About This Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {singleData?.content || 'No additional content available'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isVideo ? (
                <>
                  <Button 
                    className="w-full" 
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Video
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => singleData?.url && window.open(singleData.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in YouTube
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="w-full" 
                    onClick={() => singleData?.url && window.open(singleData.url, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Read Article
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => singleData?.url && window.open(singleData.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resource Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isVideo && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(singleData?.duration || 0)}
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Difficulty</span>
                <Badge 
                  variant="outline" 
                  className={`capitalize ${getDifficultyColor(singleData?.difficultyLevel || 'beginner')}`}
                >
                  {singleData.difficultyLevel || 'beginner'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <Badge variant="secondary" className="capitalize">
                  {isVideo ? (
                    <>
                      <Video className="h-3 w-3 mr-1" />
                      Video
                    </>
                  ) : (
                    <>
                      <FileText className="h-3 w-3 mr-1" />
                      Article
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <Badge variant="secondary" className="capitalize">
                  {singleData?.category?.replace('-', ' ')}
                </Badge>
              </div>
              
              {singleData?.hasQuiz && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quiz Available</span>
                  <Badge className="bg-green-100 text-green-800">Yes</Badge>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created: {singleData?.createdAt ? formatDate(singleData.createdAt) : 'Unknown'}
                </div>
                {singleData?.updatedAt && singleData?.createdAt && singleData.updatedAt !== singleData.createdAt && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    Updated: {formatDate(singleData.updatedAt)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {singleData?.tags && singleData.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {singleData.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleLearningResourcesUI;