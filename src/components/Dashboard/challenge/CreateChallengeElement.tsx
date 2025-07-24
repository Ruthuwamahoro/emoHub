import React from 'react';
import { Save, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateChallengeElement } from '@/hooks/challenges/elements/useCreateElement';

interface ChallengeElementFormProps {
  challengeId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isFirstChallenge?: boolean;
  className?: string;
}

export const ChallengeElementForm: React.FC<ChallengeElementFormProps> = ({
  challengeId,
  onSuccess,
  onCancel,
  isFirstChallenge = false,
  className = ""
}) => {
  const {
    formData,
    errors,
    isPending,
    handleChange,
    handleSubmit,
    resetForm,
  } = useCreateChallengeElement(challengeId);

  const onSubmit = async (e: React.FormEvent) => {
    const result = await handleSubmit(e);
    if (result.success) {
      onSuccess?.();
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <Card className={`border-2 border-dashed border-blue-300 bg-blue-50/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="w-5 h-5 text-blue-600" />
          {isFirstChallenge ? 'Add Your First Challenge' : 'Add New Challenge Element'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-smfont-medium text-gray-700">
              Challenge Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter challenge title (e.g., Practice mindful breathing)"
              className={`${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
              autoFocus
            />
            {errors.title && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-sm">{errors.title}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this challenge involves and how to complete it..."
              rows={4}
              className={`resize-none ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
            />
            {errors.description && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-sm">{errors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending || !formData.title.trim() || !formData.description.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4" />
              {isPending ? 'Creating...' : (isFirstChallenge ? 'Create First Challenge' : 'Add Challenge')}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            )}
          </div>

          {/* Help Text */}
          {isFirstChallenge && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Start with a simple, achievable challenge that you can complete today. 
                You can always add more challenges later!
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};