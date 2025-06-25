import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ModerationResult {
  isAppropriate: boolean;
  riskLevel: "low" | "medium" | "high";
  concerns: string[];
  suggestions: string[];
  emotionalImpact: "positive" | "neutral" | "negative";
  confidence: number;
}

interface ModerationFeedbackProps {
  result: ModerationResult;
  onAccept: () => void;
  onDismiss: () => void;
}

const ModerationFeedback: React.FC<ModerationFeedbackProps> = ({
  result,
  onAccept,
  onDismiss
}) => {
  const getIcon = () => {
    if (!result.isAppropriate) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (result.riskLevel === "medium") {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getAlertVariant = () => {
    if (!result.isAppropriate) return "destructive";
    if (result.riskLevel === "medium") return "default";
    return "default";
  };

  const getTitle = () => {
    if (!result.isAppropriate) return "Content Flagged";
    if (result.riskLevel === "medium") return "Content Warning";
    return "Content Approved";
  };

  const getDescription = () => {
    if (!result.isAppropriate) {
      return "Your content may negatively impact others. Please review and modify your post.";
    }
    if (result.riskLevel === "medium") {
      return "Your content has some concerns but can be posted. Please consider the suggestions below.";
    }
    return "Your content looks good and is ready to be posted!";
  };

  return (
    <Alert className={`my-4 border-l-4 ${
      !result.isAppropriate 
        ? 'border-l-red-500 bg-red-50' 
        : result.riskLevel === "medium" 
        ? 'border-l-yellow-500 bg-yellow-50' 
        : 'border-l-green-500 bg-green-50'
    }`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{getTitle()}</h4>
          <AlertDescription className="text-sm mb-3">
            {getDescription()}
          </AlertDescription>

          {result.concerns.length > 0 && (
            <div className="mb-3">
              <h5 className="font-medium text-sm mb-1 text-red-700">Concerns:</h5>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                {result.concerns.map((concern, index) => (
                  <li key={index}>{concern}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div className="mb-3">
              <h5 className="font-medium text-sm mb-1 text-blue-700">Suggestions:</h5>
              <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">
              Risk Level: <span className={`font-medium ${
                result.riskLevel === "high" ? "text-red-600" :
                result.riskLevel === "medium" ? "text-yellow-600" : 
                "text-green-600"
              }`}>
                {result.riskLevel.toUpperCase()}
              </span>
              {" | "}
              Emotional Impact: <span className={`font-medium ${
                result.emotionalImpact === "negative" ? "text-red-600" :
                result.emotionalImpact === "positive" ? "text-green-600" : 
                "text-gray-600"
              }`}>
                {result.emotionalImpact.toUpperCase()}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDismiss}
                className="text-xs"
              >
                Modify Content
              </Button>
              {result.isAppropriate && (
                <Button
                  size="sm"
                  onClick={onAccept}
                  className="text-xs bg-green-600 hover:bg-green-700"
                >
                  Proceed Anyway
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default ModerationFeedback;