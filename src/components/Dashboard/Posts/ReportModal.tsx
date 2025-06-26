
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, ExternalLink, Send, MoreHorizontal, Bookmark, Eye, Play, X, ChevronDown, Reply, ThumbsUp, Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


export const PostReportModal = ({ isOpen, onOpenChange, postId, postAuthor }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reportReasons = [
    {
      id: 'spam',
      label: 'Spam or misleading',
      description: 'Repetitive content, fake engagement, or misleading information'
    },
    {
      id: 'harassment',
      label: 'Harassment or bullying',
      description: 'Targeting individuals with harmful content'
    },
    {
      id: 'inappropriate',
      label: 'Inappropriate content',
      description: 'Offensive, disturbing, or inappropriate material'
    },
    {
      id: 'hate-speech',
      label: 'Hate speech',
      description: 'Content that promotes hatred against groups'
    },
    {
      id: 'violence',
      label: 'Violence or dangerous acts',
      description: 'Content showing or promoting violence'
    },
    {
      id: 'impersonation',
      label: 'Impersonation',
      description: 'Pretending to be someone else'
    },
    {
      id: 'intellectual-property',
      label: 'Intellectual property violation',
      description: 'Copyright or trademark infringement'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Report submitted:', {
      postId,
      reason: selectedReason,
      details: additionalDetails,
      reportedBy: 'current-user-id'
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setSelectedReason('');
    setAdditionalDetails('');
    setIsSubmitted(false);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedReason('');
      setAdditionalDetails('');
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden">
        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flag className="w-8 h-8 text-green-500" />
            </div>
            <DialogHeader>
              <DialogTitle>Report Submitted</DialogTitle>
              <DialogDescription>
                Thank you for helping keep our community safe. We'll review this report and take appropriate action.
              </DialogDescription>
            </DialogHeader>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <Flag className="w-5 h-5 text-red-500" />
                </div>
                Report Post
              </DialogTitle>
              <DialogDescription>
                Why are you reporting this post by <span className="font-medium">{postAuthor}</span>?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="max-h-60 overflow-y-auto pr-2">
                <RadioGroup
                  value={selectedReason}
                  onValueChange={setSelectedReason}
                  className="space-y-3"
                >
                  {reportReasons.map((reason) => (
                    <div key={reason.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <RadioGroupItem
                        value={reason.id}
                        id={reason.id}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={reason.id} className="font-medium cursor-pointer">
                          {reason.label}
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-details">Additional details (optional)</Label>
                <Textarea
                  id="additional-details"
                  rows={3}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Provide any additional context that might help us understand the issue..."
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedReason || isSubmitting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Reporting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};