import React, { useState } from 'react';
import { X, Upload, FileText, Video, Headphones, Image, Plus, Loader2, AlertCircle, CheckCircle2, Trash2, Edit } from 'lucide-react';
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

// Types
type ResourceType = 'video' | 'audio' | 'article' | 'image';
type EmotionCategory = 'self-regulation' | 'self-awareness' | 'motivation' | 'empathy' | 'social-skills' | 'relationship-management' | 'stress-management';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | number;
  marks: number;
  explanation?: string;
}

interface FormData {
  title: string;
  description: string;
  resourceType: ResourceType;
  content: string;
  url: string;
  category: EmotionCategory;
  difficultyLevel: DifficultyLevel;
  tags: string[];
  duration: string;
  hasQuiz: boolean;
  quizTitle: string;
  quizDescription: string;
  passingScore: number;
  questions: QuizQuestion[];
}

interface CreateResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateResourceDialog: React.FC<CreateResourceDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('basic');
  
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    resourceType: 'article',
    content: '',
    url: '',
    category: 'self-awareness',
    difficultyLevel: 'beginner',
    tags: [],
    duration: '',
    hasQuiz: false,
    quizTitle: '',
    quizDescription: '',
    passingScore: 70,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1,
    explanation: ''
  });

  const resourceTypes = [
    { value: 'article', label: 'Article', icon: FileText, color: 'border-blue-200 bg-blue-50 text-blue-700' },
    { value: 'video', label: 'Video', icon: Video, color: 'border-red-200 bg-red-50 text-red-700' },
    { value: 'audio', label: 'Audio', icon: Headphones, color: 'border-green-200 bg-green-50 text-green-700' },
    { value: 'image', label: 'Image', icon: Image, color: 'border-purple-200 bg-purple-50 text-purple-700' }
  ];

  const emotionCategories = [
    { value: 'self-regulation', label: 'Self Regulation' },
    { value: 'self-awareness', label: 'Self Awareness' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'empathy', label: 'Empathy' },
    { value: 'social-skills', label: 'Social Skills' },
    { value: 'relationship-management', label: 'Relationship Management' },
    { value: 'stress-management', label: 'Stress Management' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
  ];

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.hasQuiz) {
      if (!formData.quizTitle.trim()) {
        newErrors.quizTitle = 'Quiz title is required';
      }
      if (formData.questions.length === 0) {
        newErrors.questions = 'At least one question is required for the quiz';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    const trimmedTag = currentTag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question?.trim()) return;

    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: currentQuestion.question,
      type: currentQuestion.type as QuestionType,
      marks: currentQuestion.marks || 1,
      explanation: currentQuestion.explanation || '',
      correctAnswer: currentQuestion.correctAnswer || 0,
      ...(currentQuestion.type === 'multiple-choice' && {
        options: currentQuestion.options?.filter(opt => opt.trim()) || []
      })
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    // Reset current question
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
    setFormData(prev => ({
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
    return formData.questions.reduce((total, question) => total + question.marks, 0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
        return;
      }
      setUploadedFile(file);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      resourceType: 'article',
      content: '',
      url: '',
      category: 'self-awareness',
      difficultyLevel: 'beginner',
      tags: [],
      duration: '',
      hasQuiz: false,
      quizTitle: '',
      quizDescription: '',
      passingScore: 70,
      questions: []
    });
    setCurrentTag('');
    setErrors({});
    setUploadedFile(null);
    setSubmitStatus('idle');
    setActiveTab('basic');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Resource submitted:', formData);
      setSubmitStatus('success');
      
      setTimeout(() => {
        onClose();
        resetForm();
        onSuccess?.();
      }, 1500);
    } catch (error) {
      setSubmitStatus('error');
      setErrors({ submit: 'Failed to create resource. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Learning Resource</DialogTitle>
        </DialogHeader>

        {submitStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Resource created successfully!
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && errors.submit && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errors.submit}
            </AlertDescription>
          </Alert>
        )}

        <div onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content & Media</TabsTrigger>
              <TabsTrigger value="quiz">Assessment Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Resource Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={errors.title ? 'border-red-300' : ''}
                    placeholder="Enter a compelling title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={errors.description ? 'border-red-300' : ''}
                    placeholder="Describe what this resource covers"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <Label>Emotion Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emotionCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 15"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Resource Type *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {resourceTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.resourceType === type.value;
                    return (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-all ${
                          isSelected ? `${type.color} ring-2 ring-blue-500` : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleInputChange('resourceType', type.value)}
                      >
                        <CardContent className="p-4 text-center">
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">{type.label}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Difficulty Level *</Label>
                <div className="flex gap-2">
                  {difficultyLevels.map((level) => (
                    <Button
                      key={level.value}
                      type="button"
                      variant={formData.difficultyLevel === level.value ? "default" : "outline"}
                      onClick={() => handleInputChange('difficultyLevel', level.value)}
                      className={formData.difficultyLevel === level.value ? level.color : ''}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className={errors.content ? 'border-red-300' : ''}
                    placeholder="Enter the main content"
                    rows={8}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-600 mt-1">{errors.content}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">Resource URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                      placeholder="https://example.com/resource"
                    />
                  </div>

                  <Card className="p-6">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      {uploadedFile ? (
                        <div>
                          <p className="text-sm text-green-700 font-medium">File uploaded!</p>
                          <p className="text-xs text-green-600">{uploadedFile.name}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Upload cover image</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="mt-2"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has-quiz"
                  checked={formData.hasQuiz}
                  onCheckedChange={(checked) => handleInputChange('hasQuiz', checked)}
                />
                <Label htmlFor="has-quiz">Include Assessment Quiz</Label>
              </div>

              {formData.hasQuiz && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiz-title">Quiz Title *</Label>
                      <Input
                        id="quiz-title"
                        value={formData.quizTitle}
                        onChange={(e) => handleInputChange('quizTitle', e.target.value)}
                        className={errors.quizTitle ? 'border-red-300' : ''}
                        placeholder="Enter quiz title"
                      />
                      {errors.quizTitle && (
                        <p className="text-sm text-red-600 mt-1">{errors.quizTitle}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="passing-score">Passing Score (%)</Label>
                      <Input
                        id="passing-score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.passingScore}
                        onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                        placeholder="70"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quiz-description">Quiz Description</Label>
                    <Textarea
                      id="quiz-description"
                      value={formData.quizDescription}
                      onChange={(e) => handleInputChange('quizDescription', e.target.value)}
                      placeholder="Describe the quiz purpose and instructions"
                      rows={3}
                    />
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
                              type: value as QuestionType,
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

                  {formData.questions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Quiz Questions ({formData.questions.length})
                          <Badge variant="outline">Total: {getTotalMarks()} marks</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {formData.questions.map((question, index) => (
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
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-6 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResourceDialog;