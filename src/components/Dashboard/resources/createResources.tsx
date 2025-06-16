"use client"
import React, { useEffect, useState } from 'react';
import { X,  FileText, Video, Image, Plus, Loader2, AlertCircle, CheckCircle2, Trash2, Edit, Link, Type, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { CATEGORY_OPTIONS, DIFFICULTY_LEVEL, DIFFICULTY_OPTIONS, EMOTION_CATEGORY, QUESTION_TYPE, RESOURCE_TYPE } from '@/constants/resources';
import { CreateResourceDialogProps, QuizQuestion } from '@/types/resources';
import { useCreateResource } from '@/hooks/users/resources/useCreateResource';
import { useCreateAssessment } from '@/hooks/users/resources/assessment/useCreateAssessment';


const CreateResourceDialog: React.FC<CreateResourceDialogProps> = ({ 
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
  
  const [currentTag, setCurrentTag] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('basic');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  
  // Extended form data for UI-specific fields
  const [extendedFormData, setExtendedFormData] = useState({
    videoDescription: '',
    hasQuiz: false,
    quizTitle: '',
    quizDescription: '',
    passingScore: 70,
    questions: [] as QuizQuestion[]
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    question: '',
    type: 'multiple-choice' as QUESTION_TYPE,
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1,
    explanation: ''
  });

  // Combine errors from hook and local validation
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
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!hookFormData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!hookFormData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (hookFormData.resourceType === 'article' && !hookFormData.content.trim()) {
      newErrors.content = 'Content is required for articles';
    }

    if (hookFormData.resourceType === 'video') {
      if (!hookFormData.url.trim()) {
        newErrors.url = 'Video URL is required';
      } else {
        try {
          new URL(hookFormData.url);
        } catch {
          newErrors.url = 'Please enter a valid URL';
        }
      }
      if (!extendedFormData.videoDescription.trim()) {
        newErrors.videoDescription = 'Video description is required';
      }
    }

    if (extendedFormData.hasQuiz) {
      if (!extendedFormData.quizTitle.trim()) {
        newErrors.quizTitle = 'Quiz title is required';
      }
      if (extendedFormData.questions.length === 0) {
        newErrors.questions = 'At least one question is required for the quiz';
      }
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    // Handle hook form data fields
    if (['title', 'description', 'resourceType', 'content', 'url', 'category', 'difficultyLevel', 'tags', 'hasQuiz'].includes(field)) {

      // Create a synthetic event for the hook
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
    if (trimmedTag && !hookFormData.tags.includes(trimmedTag)) {
      const newTags = [...hookFormData.tags, trimmedTag];
      handleInputChange('tags', newTags);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = hookFormData.tags.filter(tag => tag !== tagToRemove);
    handleInputChange('tags', newTags);
  };

  const addQuestion = () => {
    if (!currentQuestion.question?.trim()) return;

    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: currentQuestion.question,
      type: currentQuestion.type as QUESTION_TYPE,
      marks: currentQuestion.marks || 1,
      explanation: currentQuestion.explanation || '',
      correctAnswer: currentQuestion.correctAnswer || 0,
      ...(currentQuestion.type === 'multiple-choice' && {
        options: currentQuestion.options?.filter(opt => opt.trim()) || []
      })
    };

    setExtendedFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setCurrentQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1,
      explanation: ''
    });
  };

  const removeQuestion = (questionId: string) => {
    setExtendedFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const updateQuestionOption = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt) || []
    }));
  };

  const getTotalMarks = () => {
    return extendedFormData.questions.reduce((total, question) => total + question.marks, 0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setLocalErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
        return;
      }
      setUploadedFile(file);
      setLocalErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const resetForm = () => {
    // Reset hook form data will be handled by the hook itself
    setCurrentTag('');
    setLocalErrors({});
    setUploadedFile(null);
    setSubmitStatus('idle');
    setActiveTab('basic');
    setExtendedFormData({
      videoDescription: '',
      hasQuiz: false,
      quizTitle: '',
      quizDescription: '',
      passingScore: 70,
      questions: []
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitStatus('idle');
    
    try {
      // Convert duration from string to number
      const durationNumber = parseInt(hookFormData.duration.toString()) || 0;
      
      // Update the hook form data with duration as number
      const syntheticEvent = {
        target: {
          id: 'duration',
          value: durationNumber.toString()
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(syntheticEvent);
      
      // Call the hook's handleSubmit
      await handleSubmit();
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        onClose();
        resetForm();
        onSuccess?.();
      }, 1500);
    } catch (error) {
      setSubmitStatus('error');
      setLocalErrors({ submit: 'Failed to create resource. Please try again.' });
    }
  };

  const isVideoDetected = (url: string) => {
    return /(?:youtube|youtu\.be|vimeo|dailymotion|twitch)/i.test(url);
  };

  // Handle successful submission
  useEffect(() => {
    if (!isPending && submitStatus === 'idle' && Object.keys(hookErrors).length === 0) {
      // Check if form was just submitted successfully
      const hasData = hookFormData.title || hookFormData.description;
      if (!hasData) {
        setSubmitStatus('success');
      }
    }
  }, [isPending, hookErrors, hookFormData.title, hookFormData.description, submitStatus]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Learning Resource
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Build engaging educational content for your learners
          </p>
        </DialogHeader>

        {submitStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Resource created successfully! 🎉
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && allErrors.submit && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {allErrors.submit}
            </AlertDescription>
          </Alert>
        )}


        <form onSubmit={handleFormSubmit}>
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
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Choose Resource Type</h3>
                  <p className="text-sm text-gray-600 mb-4">Select the type of content you want to create</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resourceTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = hookFormData.resourceType === type.value;
                    return (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          isSelected 
                            ? `${type.color} ring-2 ring-blue-500 shadow-md transform scale-[1.02]` 
                            : 'hover:bg-gray-50 hover:border-gray-300'
                        }`}
                        onClick={() => handleResourceTypeChange(type.value as RESOURCE_TYPE)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-gray-100'}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{type.label}</h4>
                              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <Label htmlFor="title" className="text-base font-medium">Resource Title *</Label>
                  <Input
                    id="title"
                    value={hookFormData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`mt-2 ${hookErrors.title ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                    placeholder="Enter a compelling and descriptive title"
                  />
                  {hookErrors.title && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {hookErrors.title}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <Label htmlFor="description" className="text-base font-medium">Description *</Label>
                  <Textarea
                    id="description"
                    value={hookFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`mt-2 ${hookErrors.description ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                    placeholder="Describe what learners will gain from this resource..."
                    rows={4}
                  />
                  {hookErrors.description && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {hookErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium">Emotion Category *</Label>
                  <Select value={hookFormData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={hookFormData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 15"
                    min="1"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <Label className="text-base font-medium mb-3 block">Difficulty Level *</Label>
                <div className="flex flex-wrap gap-3">
                  {DIFFICULTY_OPTIONS.map((level) => (
                    <Button
                      key={level.value}
                      type="button"
                      variant={hookFormData.difficultyLevel === level.value ? "default" : "outline"}
                      onClick={() => handleInputChange('difficultyLevel', level.value)}
                      className={`${
                        hookFormData.difficultyLevel === level.value 
                          ? `${level.color} border-2` 
                          : 'hover:bg-gray-50'
                      } transition-all duration-200`}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags" className="text-base font-medium">Tags</Label>
                <p className="text-sm text-gray-600 mb-3">Add relevant keywords to help learners find this resource</p>
                <div className="flex gap-2 mb-3">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag (e.g., mindfulness, productivity)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hookFormData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                      <X 
                        className="w-3 h-3 ml-2 cursor-pointer hover:text-red-500" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Dynamic Content Section */}
                <div className="lg:col-span-2 space-y-6">
                  {hookFormData.resourceType === 'article' ? (
                    /* Article Content */
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Type className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">Article Content *</h3>
                      </div>
                      <Textarea
                        value={hookFormData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        className={`min-h-[300px] ${hookErrors.content ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                        placeholder="Start writing your article content here...

You can use:
• Bullet points for key concepts
• **Bold text** for emphasis
• Headers for organization
• Code blocks for examples

Make it engaging and educational!"
                      />
                      {hookErrors.content && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {hookErrors.content}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Video Content */
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Play className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold">Video Content *</h3>
                      </div>
                      
                      {/* Video URL */}
                      <div>
                        <Label htmlFor="video-url" className="text-base font-medium">Video URL *</Label>
                        <div className="relative mt-2">
                          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="video-url"
                            type="url"
                            value={hookFormData.url}
                            onChange={(e) => handleInputChange('url', e.target.value)}
                            className={`pl-10 ${hookErrors.url ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                          />
                          {hookFormData.url && isVideoDetected(hookFormData.url) && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                          )}
                        </div>
                        {hookErrors.url && (
                          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {hookErrors.url}
                          </p>
                        )}
                        {hookFormData.url && !isVideoDetected(hookFormData.url) && !hookErrors.url && (
                          <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            URL doesn't appear to be from a known video platform
                          </p>
                        )}
                      </div>

                      {/* Video Description */}
                      <div>
                        <Label htmlFor="video-description" className="text-base font-medium">Video Description *</Label>
                        <Textarea
                          id="content"
                          value={hookFormData.content}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                          className={`mt-2 ${hookErrors.content ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                          placeholder="Describe what viewers will learn from this video...

• What topics are covered?
• What will they achieve after watching?
• Any prerequisites or requirements?
• Key takeaways or insights"
                          rows={8}
                        />
                        {hookErrors.videoDescription && (
                          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {hookErrors.videoDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar - Cover Image */}
                <div className="space-y-6">
                  <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="mb-4">
                          {uploadedFile ? (
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {uploadedFile ? (
                          <div>
                            <p className="text-sm text-green-700 font-medium">Cover image uploaded!</p>
                            <p className="text-xs text-green-600 truncate max-w-full">
                              {uploadedFile.name}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setUploadedFile(null)}
                              className="mt-2"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Upload Cover Image</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Make your resource stand out with an engaging cover
                            </p>
                            <p className="text-xs text-gray-500 mb-3">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                        
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="cursor-pointer"
                        />
                        
                        {hookErrors.file && (
                          <p className="text-sm text-red-600 mt-2">{hookErrors.file}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Tips */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Great Content</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {hookFormData.resourceType === 'article' ? (
                          <>
                            <li>• Use clear headings and structure</li>
                            <li>• Include practical examples</li>
                            <li>• Break up text with bullet points</li>
                            <li>• End with actionable takeaways</li>
                          </>
                        ) : (
                          <>
                            <li>• Ensure video is publicly accessible</li>
                            <li>• Include timestamps for key topics</li>
                            <li>• Mention any required materials</li>
                            <li>• Highlight learning outcomes</li>
                          </>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiz-title">Quiz Title *</Label>
                      <Input
                        id="quiz-title"
                        value={extendedFormData.quizTitle}
                        onChange={(e) => setExtendedFormData(prev => ({ ...prev, quizTitle: e.target.value }))}
                        className={allErrors.quizTitle ? 'border-red-300' : ''}
                        placeholder="Enter quiz title"
                      />
                      {allErrors.quizTitle && (
                        <p className="text-sm text-red-600 mt-1">{allErrors.quizTitle}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="passing-score">Passing Score (%)</Label>
                      <Input
                          id="passing-score"
                          type="number"
                          min="0"
                          max="100"
                          value={extendedFormData.passingScore}
                          onChange={(e) => setExtendedFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                          placeholder="70"
                        />
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Add Question</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="question">Question *</Label>
                        <Textarea
                          id="question"
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
                            value={currentQuestion.type} 
                            onValueChange={(value) => setCurrentQuestion(prev => ({ 
                              ...prev, 
                              type: value as QUESTION_TYPE,
                              ...(value === 'true-false' && { options: ['True', 'False'] }),
                              ...(value === 'multiple-choice' && { options: ['', '', '', ''] })
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {questionTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="marks">Marks</Label>
                          <Input
                            id="marks"
                            type="number"
                            min="1"
                            value={currentQuestion.marks || 1}
                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                          />
                        </div>
                      </div>

                      {currentQuestion.type === 'multiple-choice' && (
                        <div>
                          <Label>Options</Label>
                          <div className="space-y-2">
                            {currentQuestion.options?.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateQuestionOption(index, e.target.value)}
                                  placeholder={`Option ${index + 1}`}
                                />
                                <input
                                  type="radio"
                                  name="correct-answer"
                                  checked={currentQuestion.correctAnswer === index}
                                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentQuestion.type === 'true-false' && (
                        <div>
                          <Label>Correct Answer</Label>
                          <Select 
                            value={currentQuestion.correctAnswer?.toString()} 
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

                      {currentQuestion.type === 'short-answer' && (
                        <div>
                          <Label htmlFor="correct-answer">Correct Answer</Label>
                          <Input
                            id="correct-answer"
                            value={currentQuestion.correctAnswer?.toString() || ''}
                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                            placeholder="Enter the correct answer"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="explanation">Explanation (Optional)</Label>
                        <Textarea
                          id="explanation"
                          value={currentQuestion.explanation || ''}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                          placeholder="Explain why this is the correct answer"
                          rows={2}
                        />
                      </div>

                      <Button type="button" onClick={addQuestion} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </CardContent>
                  </Card>

                  {extendedFormData.questions.length > 0 && (                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Quiz Questions ({extendedFormData.questions.length})
                          <Badge variant="outline">Total: {getTotalMarks()} marks</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {extendedFormData.questions.map((question, index) => (
                            <Card key={question.id} className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium">Q{index + 1}: {question.question}</p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Type: {question.type} | Marks: {question.marks}
                                  </p>
                                  {question.options && (
                                    <div className="mt-2 text-sm">
                                      {question.options.map((option, optIndex) => (
                                        <p key={optIndex} className={optIndex === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                          {optIndex + 1}. {option} {optIndex === question.correctAnswer && '✓'}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeQuestion(question.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                        {errors.questions && (
                          <p className="text-sm text-red-600 mt-2">{errors.questions}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
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
          </TabsContent>
        </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResourceDialog;
