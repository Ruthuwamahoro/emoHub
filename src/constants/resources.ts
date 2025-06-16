export const CATEGORY_OPTIONS = [
    { value: 'self-regulation', label: 'Self Regulation' },
    { value: 'self-awareness', label: 'Self Awareness' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'empathy', label: 'Empathy' },
    { value: 'social-skills', label: 'Social Skills' },
    { value: 'relationship-management', label: 'Relationship Management' },
    { value: 'stress-management', label: 'Stress Management' }
  ];
  
export const DIFFICULTY_OPTIONS = [
    { value: 'beginner', label: 'Beginner' ,color: 'bg-green-100 text-green-800 border-green-200'},
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'advanced', label: 'Advanced' , color: 'bg-red-100 text-red-800 border-red-200'}
 ];
export type RESOURCE_TYPE = 'video' | 'article';
export type EMOTION_CATEGORY = 'self-regulation' | 'self-awareness' | 'motivation' | 'empathy' | 'social-skills' | 'relationship-management' | 'stress-management';
export type DIFFICULTY_LEVEL = 'beginner' | 'intermediate' | 'advanced';
export type QUESTION_TYPE = 'multiple-choice' | 'true-false' | 'short-answer';

