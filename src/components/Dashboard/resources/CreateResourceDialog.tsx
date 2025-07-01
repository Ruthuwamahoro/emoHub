"use client"
import React, { useEffect, useRef, useState } from 'react';
import { X,  FileText, Video, Image, Plus, Loader2, AlertCircle, CheckCircle2, Trash2, Edit, Link, Type, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { CATEGORY_OPTIONS, DIFFICULTY_LEVEL, DIFFICULTY_OPTIONS, EMOTION_CATEGORY, QUESTION_TYPE, RESOURCE_TYPE } from '@/constants/resources';
import { CreateResourceDialogProps, QuizQuestion } from '@/types/resources';
import { useCreateResource } from '@/hooks/users/resources/useCreateResource';
import { QuestionInput, useCreateAssessment } from '@/hooks/users/resources/assessment/useCreateAssessment';
import { uploadImageToCloudinary } from '@/services/user/profile';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';



interface QuizTabsContentProps {
    extendedFormData: any;
    setExtendedFormData: (fn: (prev: any) => any) => void;
    assessmentFormData: any;
    setAssessmentFormData: (fn: (prev: any) => any) => void;
    assessmentErrors: any;
    handleChangeAssessment: any;
    handleSubmitAssessment: any;
    isAssessmentPending: boolean;
    resourceId: string;
    localErrors: any;
    currentQuestion: any;
    setCurrentQuestion: (fn: (prev: any) => any) => void;
    addQuestion: () => void;
    removeQuestion: (questionId: string) => void;
    getTotalMarks: () => number;
  }

export const CreateResourceDialog: React.FC<CreateResourceDialogProps>=({
    isOpen,
    onClose,
    onSuccess
}) => {
  const { formData: hookFormData, errors: hookErrors, handleChange, handleSubmit, isPending } = useCreateResource();
  const { 
    formData: assessmentFormData,
    setFormData: setAssessmentFormData,
    errors: assessmentErrors,
    setErrors: setAssessmentErrors,
    handleChange: handleChangeAssessment,
    handleSubmit: handleSubmitAssessment,
    mutate: mutateAssessment,
    isPending: isAssessmentPending 
  } = useCreateAssessment();
  const [resourceId, setResourceId] = useState<string>('');


  
  const [currentTag, setCurrentTag] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('basic');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const [extendedFormData, setExtendedFormData] = useState({
    hasQuiz: false,
    quizTitle: '',
    quizDescription: '',
    passingScore: 70,
    maxAttempts: 3, 
    questions: [] as QuizQuestion[]
  });
  
  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    questionText: '',
    questionType: 'multiple-choice' as QUESTION_TYPE,
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ],
    correctAnswer: 0,
    points: 1,
    explanation: ''
  });




  const allErrors = { ...hookErrors, ...localErrors };

  const resourceTypes = [
    { 
      value: 'article', 
      label: 'Article', 
      icon: FileText, 
      color: 'border-purple-200 bg-purple-50 text-purple-700',
      description: 'Written content, blog posts, guides'
    },
    { 
      value: 'video', 
      label: 'Video', 
      icon: Video, 
      color: 'border-red-200 bg-red-50 text-red-700',
      description: 'YouTube, Vimeo, or other video content'
    }
  ];

  const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True/False' },
    { value: 'short_answer', label: 'Short Answer' }
  ];


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCoverImage: boolean) => {
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
  
      if (isCoverImage) {
        handleInputChange('coverImage', cloudinaryUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setImageError('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (isCoverImage && coverImageRef.current) {
        coverImageRef.current.value = '';
      }
    }
  };

  const removeCoverImage = () => {
    handleInputChange('coverImage', '');
    if(coverImageRef.current){
      coverImageRef.current.value = ""
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
  
    // Existing validations...
    if (!hookFormData.title.trim()) {
      newErrors.title = 'Title is required';
    }
  
    if (!hookFormData.description.trim()) {
      newErrors.description = 'Description is required';
    }
  
    if (!hookFormData.content.trim()) {
      newErrors.content = hookFormData.resourceType === 'article' ? 'Content is required for articles' : 'Video description is required';
    }
  
    if (hookFormData.resourceType === 'video' && !hookFormData.url?.trim()) {
      newErrors.url = 'Video URL is required';
    }
  
    // Quiz validations
    if (extendedFormData.hasQuiz) {
      if (!extendedFormData.quizTitle.trim()) {
        newErrors.quizTitle = 'Quiz title is required';
      }
      
      if (extendedFormData.questions.length === 0) {
        newErrors.questions = 'At least one question is required for the quiz';
      }
  
      // Validate each question
      extendedFormData.questions.forEach((question, index) => {
        if (!question.questionText.trim()) {
          newErrors[`question_${index}`] = `Question ${index + 1} text is required`;
        }
        
        if (question.questionType === 'multiple-choice') {
          const validOptions = question.options?.filter(opt => opt.optionText.trim()) || [];
          if (validOptions.length < 2) {
            newErrors[`question_${index}_options`] = `Question ${index + 1} must have at least 2 options`;
          }
          
          const hasCorrectAnswer = question.options?.some(opt => opt.isCorrect);
          if (!hasCorrectAnswer) {
            newErrors[`question_${index}_correct`] = `Question ${index + 1} must have a correct answer selected`;
          }
        }
      });
  
      // Validate passing score
      if (extendedFormData.passingScore < 1 || extendedFormData.passingScore > 100) {
        newErrors.passingScore = 'Passing score must be between 1 and 100';
      }
    }
  
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    if (['title', 'description', 'resourceType', 'content', 'url', 'category', 'difficultyLevel', 'tags', 'hasQuiz', 'coverImage'].includes(field)) {

      const syntheticEvent = {
        target: {
          id: field,
          value: field === 'tags' ? (Array.isArray(value) ? value.join(',') : value) : value.toString()
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(syntheticEvent);
    } else {
      // Handle extended form data
      setExtendedFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear errors
    if (allErrors[field]) {
      setLocalErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResourceTypeChange = (type: RESOURCE_TYPE) => {
    handleInputChange('resourceType', type);
    if (type === 'article') {
      handleInputChange('url', '');
      setExtendedFormData(prev => ({ ...prev, videoDescription: '' }));
    } else if (type === 'video') {
      handleInputChange('content', '');
    }
  };

  const addTag = () => {
    const trimmedTag = currentTag.trim().toLowerCase();
    if(!trimmedTag) return; // Don't add empty tags
    if(!hookFormData?.tags) return ;
    if (trimmedTag && !hookFormData?.tags.includes(trimmedTag)) {
      const newTags = [...hookFormData?.tags, trimmedTag];
      handleInputChange('tags', newTags);
      setCurrentTag('');
    }
  };


  const removeTag = (tagToRemove: string) => {
    if (!hookFormData?.tags) return;
    const newTags = hookFormData.tags.filter(tag => tag !== tagToRemove);
    handleInputChange('tags', newTags);
  };
  
  const addQuestion = () => {
    if (!currentQuestion.questionText?.trim()) return;
  
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      questionText: currentQuestion.questionText,
      questionType: currentQuestion.questionType as QuizQuestion['questionType'],
      points: currentQuestion.points || 1,
      explanation: currentQuestion.explanation || '',
    };
  
    if (currentQuestion.questionType === 'multiple-choice' && currentQuestion.options) {
        newQuestion.options = currentQuestion.options
          .filter(opt => opt.optionText?.trim())
          .map((option, index) => ({
            optionText: option.optionText,
            isCorrect: index === currentQuestion.correctAnswer,
            orderIndex: index
          }));
        newQuestion.correctAnswer = currentQuestion.correctAnswer;
    } else if (currentQuestion.questionType === 'true-false') {
      newQuestion.options = [
        { optionText: 'True', isCorrect: currentQuestion.correctAnswer === 0, orderIndex: 0 },
        { optionText: 'False', isCorrect: currentQuestion.correctAnswer === 1, orderIndex: 1 }
      ];
      newQuestion.correctAnswer = currentQuestion.correctAnswer;
    } else if (currentQuestion.questionType === 'short-answer') {
      newQuestion.correctAnswer = currentQuestion.correctAnswer;
    }
  
    setExtendedFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: [
        { optionText: '', isCorrect: false, orderIndex: 0 },
        { optionText: '', isCorrect: false, orderIndex: 1 },
        { optionText: '', isCorrect: false, orderIndex: 2 },
        { optionText: '', isCorrect: false, orderIndex: 3 }
      ],
      correctAnswer: 0,
      points: 1,
      explanation: ''
    });
  };
  
  const removeQuestion = (questionId: string) => {
    setExtendedFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };
  
  const resetForm = () => {
    setCurrentTag('');
    setLocalErrors({});
    setUploadedFile(null);
    setSubmitStatus('idle');
    setActiveTab('basic');
    setExtendedFormData({
      hasQuiz: false,
      quizTitle: '',
      quizDescription: '',
      passingScore: 70,
      maxAttempts: 1,
      questions: []
    });
  };



  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const syntheticEvent = {
      target: {
        id: e.target.id || 'content', 
        value: e.target.value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };


  const getTotalMarks = (): number => {
    return extendedFormData.questions.reduce((total, question) => total + (question.points || 0), 0);
  };




  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl  bg-slate-500 bg-clip-text text-transparent">
            Create Learning Resource
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Build engaging educational content for your learners
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Basic Info</span>
                <span className="sm:hidden">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Content</span>
                <span className="sm:hidden">Content</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Assessment</span>
                <span className="sm:hidden">Quiz</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-8">
  {/* Resource Type Selection */}
  <div>
    <Label className="text-base font-semibold mb-4 block">Resource Type *</Label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {resourceTypes.map((type) => {
        const IconComponent = type.icon;
        const isSelected = hookFormData.resourceType === type.value;
        return (
          <Card
            key={type.value}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
            )}
            onClick={() => handleResourceTypeChange(type.value as RESOURCE_TYPE)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={cn("p-2 rounded-lg", type.color)}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{type.label}</h3>
                  <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
    {allErrors.resourceType && (
      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {allErrors.resourceType}
      </p>
    )}
  </div>

  {/* Basic Information */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={hookFormData.title}
          onChange={handleChange}
          className={allErrors.title ? 'border-red-300' : ''}
          placeholder="Enter resource title"
        />
        {allErrors.title && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {allErrors.title}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select value={hookFormData.category} onValueChange={(value) => handleInputChange('category', value)}>
          <SelectTrigger className={allErrors.category ? 'border-red-300' : ''}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

            <SelectContent>
                {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                        {category.label} 
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {allErrors.category && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {allErrors.category}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="difficultyLevel">Difficulty Level *</Label>
        <Select value={hookFormData.difficultyLevel} onValueChange={(value) => handleInputChange('difficultyLevel', value)}>
          <SelectTrigger className={allErrors.difficultyLevel ? 'border-red-300' : ''}>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>

            {DIFFICULTY_OPTIONS.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                        {category.label} 
                    </SelectItem>
            ))}

          </SelectContent>
        </Select>
        {allErrors.difficultyLevel && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {allErrors.difficultyLevel}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={hookFormData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
          className={allErrors.description ? 'border-red-300' : ''}
          placeholder="Describe what learners will gain from this resource"
          rows={3}
        />
        {allErrors.description && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {allErrors.description}
          </p>
        )}
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="Add tag..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {hookFormData.tags && hookFormData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hookFormData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Cover Image */}
  <div>
    <Label className="text-base font-semibold mb-4 block">Cover Image</Label>
    <div className="space-y-4">
      {hookFormData.coverImage ? (
        <div className="relative">
          <img
            src={hookFormData.coverImage}
            alt="Cover preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removeCoverImage}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            ref={coverImageRef}
            onChange={(e) => handleImageUpload(e, true)}
            accept="image/*"
            className="hidden"
          />
          <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Click to upload cover image
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => coverImageRef.current?.click()}
            disabled={isUploading}
            className="mt-4"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </>
            )}
          </Button>
        </div>
      )}
      {imageError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {imageError}
        </p>
      )}
    </div>
  </div>
</TabsContent>

<TabsContent value="content" className="space-y-8">
  {/* Video URL (only for video resources) */}
  {hookFormData.resourceType === 'video' && (
    <div>
      <Label htmlFor="url" className="text-base font-semibold mb-4 block">
        Video URL *
      </Label>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="url"
              value={hookFormData.url || ''}
              onChange={handleChange}
              className={allErrors.url ? 'border-red-300' : ''}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            />
            {allErrors.url && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {allErrors.url}
              </p>
            )}
          </div>
          <Button type="button" variant="outline" size="sm" className="shrink-0">
            <Link className="w-4 h-4" />
          </Button>
        </div>
        
        {hookFormData.url && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Play className="w-4 h-4" />
              <span>Video preview will be available after saving</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )}

  {/* Content */}
  <div>
    <Label htmlFor="content" className="text-base font-semibold mb-4 block">
      {hookFormData.resourceType === 'article' ? 'Article Content *' : 'Video Description *'}
    </Label>
    <div className="space-y-4">
      <Textarea
        id="content"
        value={hookFormData.content}
        onChange={handleTextareaChange}     
        className={cn(
          "min-h-[300px] resize-none",
          allErrors.content ? 'border-red-300' : ''
        )}
        placeholder={
          hookFormData.resourceType === 'article'
            ? "Write your article content here... You can use markdown formatting."
            : "Describe what viewers will learn from this video..."
        }
      />
      {allErrors.content && (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {allErrors.content}
        </p>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          {hookFormData.resourceType === 'article' ? 'Markdown supported' : 'Plain text'}
        </span>
        <span>
          {hookFormData.content.length} characters
        </span>
      </div>
    </div>
  </div>

  {/* Content Preview */}
  {hookFormData.content && (
    <div>
      <Label className="text-base font-semibold mb-4 block">Preview</Label>
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none">
            {hookFormData.resourceType === 'article' ? (
              <div className="whitespace-pre-wrap break-words">
                {hookFormData.content}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-sm mb-2">Video Description:</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                      {hookFormData.content}
                    </p>
                  </div>
                </div>
                {hookFormData.url && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">Video Source:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Link className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-600 truncate">{hookFormData.url}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )}
</TabsContent>

            <QuizTabsContent
              extendedFormData={extendedFormData}
              setExtendedFormData={setExtendedFormData}
              assessmentFormData={assessmentFormData}
              setAssessmentFormData={setAssessmentFormData}
              assessmentErrors={assessmentErrors}
              handleChangeAssessment={handleChangeAssessment}
              handleSubmitAssessment={handleSubmitAssessment}
              isAssessmentPending={isAssessmentPending}
              resourceId={resourceId}
              localErrors={localErrors}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
              getTotalMarks={getTotalMarks}
            />

            <div className="flex gap-4 mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Resource...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Resource
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );






};






















function QuizTabsContent({
    extendedFormData,
    setExtendedFormData,
    assessmentFormData,
    setAssessmentFormData,
    assessmentErrors,
    handleChangeAssessment,
    handleSubmitAssessment,
    isAssessmentPending,
    resourceId,
    localErrors,
    currentQuestion,
    setCurrentQuestion,
    addQuestion,
    removeQuestion,
    getTotalMarks
  }: QuizTabsContentProps) {
    return (
      <TabsContent value="quiz" className="space-y-6">
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
          <Switch
            id="has-quiz"
            checked={extendedFormData.hasQuiz}
            onCheckedChange={(checked) => setExtendedFormData(prev => ({ ...prev, hasQuiz: checked }))}
          />
          <Label htmlFor="has-quiz" className="text-base font-medium">Include Assessment Quiz</Label>
          <p className="text-sm text-gray-600 ml-2">Help learners test their understanding</p>
        </div>
  
        {extendedFormData.hasQuiz && (
          <div className="space-y-6">
            {/* Quiz Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quiz-title">Quiz Title *</Label>
                <Input
                  id="quiz-title"
                  value={extendedFormData.quizTitle}
                  onChange={(e) => setExtendedFormData(prev => ({ ...prev, quizTitle: e.target.value }))}
                  className={localErrors.quizTitle ? 'border-red-300' : ''}
                  placeholder="Enter quiz title"
                />
                {localErrors.quizTitle && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {localErrors.quizTitle}
                  </p>
                )}
              </div>
  
              <div>
                <Label htmlFor="quiz-description">Quiz Description</Label>
                <Input
                  id="quiz-description"
                  value={extendedFormData.quizDescription}
                  onChange={(e) => setExtendedFormData(prev => ({ ...prev, quizDescription: e.target.value }))}
                  placeholder="Brief description of the quiz"
                />
              </div>
  
              <div>
                <Label htmlFor="passing-score">Passing Score (%)</Label>
                <Input
                  id="passing-score"
                  type="number"
                  min="0"
                  max="100"
                  value={extendedFormData.passingScore}
                  onChange={(e) => setExtendedFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
                  placeholder="70"
                />
              </div>
  
              <div>
                <Label htmlFor="max-attempts">Max Attempts</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min="1"
                  value={extendedFormData.maxAttempts || 3}
                  onChange={(e) => setExtendedFormData(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) || 3 }))}
                  placeholder="3"
                />
              </div>
            </div>
  
            {/* Add Question Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="question-text">Question *</Label>
                  <Textarea
                    id="question-text"
                    value={currentQuestion.question || ''}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter your question"
                    rows={2}
                  />
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Question Type</Label>
                    <Select 
                      value={currentQuestion.type || 'multiple-choice'} 
                      onValueChange={(value) => {
                        setCurrentQuestion(prev => ({ 
                          ...prev, 
                          type: value,
                          options: value === 'multiple-choice' ? ['', '', '', ''] : 
                                  value === 'true-false' ? ['True', 'False'] : [],
                          correctAnswer: 0
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div>
                    <Label htmlFor="question-points">Points</Label>
                    <Input
                      id="question-points"
                      type="number"
                      min="1"
                      value={currentQuestion.marks || 1}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
  
                {/* Multiple Choice Options */}
                {currentQuestion.type === 'multiple-choice' && (
                  <div>
                    <Label>Options *</Label>
                    <div className="space-y-2">
                    {currentQuestion.options?.map((option: { optionText: string; isCorrect: boolean; orderIndex?: number }, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={typeof option === 'string' ? option : option.optionText}
                            onChange={(e) => {
                              const newOptions = [...(currentQuestion.options || [])];
                              newOptions[index] = e.target.value;
                              setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                            }}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="correct-answer"
                              checked={currentQuestion.correctAnswer === index}
                              onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                              className="text-green-600"
                            />
                            <span className="text-xs text-gray-500">Correct</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {/* True/False Options */}
                {currentQuestion.type === 'true-false' && (
                  <div>
                    <Label>Correct Answer *</Label>
                    <Select 
                      value={currentQuestion.correctAnswer?.toString() || '0'} 
                      onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">True</SelectItem>
                        <SelectItem value="1">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
  
                {/* Short Answer */}
                {currentQuestion.type === 'short-answer' && (
                  <div>
                    <Label htmlFor="correct-answer">Expected Answer *</Label>
                    <Input
                      id="correct-answer"
                      value={currentQuestion.correctAnswer?.toString() || ''}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      placeholder="Enter the expected answer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Short answer questions require manual grading
                    </p>
                  </div>
                )}
  
                <div>
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    value={currentQuestion.explanation || ''}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Explain why this is the correct answer (shown after submission)"
                    rows={2}
                  />
                </div>
  
                <Button 
                  type="button" 
                  onClick={addQuestion} 
                  className="w-full"
                  disabled={!currentQuestion.question?.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>
  
            {/* Questions List */}
            {extendedFormData.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Quiz Questions ({extendedFormData.questions.length})
                    <Badge variant="outline">Total: {getTotalMarks()} points</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                  {extendedFormData.questions.map((question: QuizQuestion, index: number) => (
                      <Card key={question.id || index} className="p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                Q{index + 1}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.questionType?.replace('-', ' ').replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.points} {question.points === 1 ? 'point' : 'points'}
                              </Badge>
                            </div>
                            
                            <p className="font-medium mb-2">{question.questionText}</p>
                            
                            {/* Show options for multiple choice and true/false */}
                            {question.options && question.options.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <div 
                                    key={optIndex} 
                                    className={`text-sm p-2 rounded ${
                                      option.isCorrect 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-white text-gray-600 border border-gray-200'
                                    }`}
                                  >
                                    <span className="font-medium">{optIndex + 1}.</span> {option.optionText}
                                    {option.isCorrect && <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-600" />}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {question.explanation && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                <span className="font-medium text-yellow-800">Explanation:</span>
                                <span className="text-yellow-700 ml-1">{question.explanation}</span>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(question.id || index.toString())}
                            className="ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  {localErrors.questions && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {localErrors.questions}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </TabsContent>
    );
  }
  


















