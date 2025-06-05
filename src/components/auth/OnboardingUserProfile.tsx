"use client";
import React, { useState } from 'react';
import { Heart, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingStep {
  id: number;
  question: string;
  subtitle?: string;
  options: {
    id: string;
    label: string;
  }[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    question: "What brings you to emoHub?",
    subtitle: "Help us understand your journey",
    options: [
      { id: "manage_emotions", label: "Learn to manage my emotions" },
      { id: "relationships", label: "Build stronger relationships" },
      { id: "healing", label: "Heal from past experiences" },
      { id: "community", label: "Find community and connection" },
      { id: "curious", label: "I'm just curious" }
    ]
  },
  {
    id: 2,
    question: "What best describes your current emotional state?",
    subtitle: "There's no right or wrong answer",
    options: [
      { id: "overwhelmed", label: "Overwhelmed" },
      { id: "numb", label: "Numb" },
      { id: "anxious", label: "Anxious" },
      { id: "hopeful", label: "Hopeful" },
      { id: "motivated", label: "Motivated" }
    ]
  },
  {
    id: 3,
    question: "How do you usually express your feelings?",
    subtitle: "Understanding your communication style",
    options: [
      { id: "journaling", label: "Journaling" },
      { id: "talking", label: "Talking to friends" },
      { id: "private", label: "Keeping it to myself" },
      { id: "creative", label: "Art or creativity" },
      { id: "unsure", label: "I'm not sure" }
    ]
  },
  {
    id: 4,
    question: "What do you hope to gain from this app?",
    subtitle: "Let's align with your goals",
    options: [
      { id: "tools", label: "Practical emotional tools" },
      { id: "vent", label: "A place to vent" },
      { id: "accountability", label: "Accountability and growth" },
      { id: "support", label: "Peer support" },
      { id: "motivation", label: "Daily motivation" }
    ]
  },
  {
    id: 5,
    question: "How much time do you want to spend daily on emoHub?",
    subtitle: "We'll personalize your experience accordingly",
    options: [
      { id: "quick", label: "Less than 5 minutes" },
      { id: "brief", label: "5–15 minutes" },
      { id: "moderate", label: "15–30 minutes" },
      { id: "flexible", label: "As long as I need" }
    ]
  }
];

export const EmoHubOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isVisible, setIsVisible] = useState(true);

  const currentStepData = onboardingSteps.find(step => step.id === currentStep);
  const totalSteps = onboardingSteps.length;

  const handleOptionSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('Onboarding complete!', answers);
      setIsVisible(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2">
      <div className="w-full max-w-4xl">

        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            {onboardingSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  step.id === currentStep 
                    ? 'bg-black border-black-600 text-white' 
                    : step.id < currentStep
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'bg-transparent border-black text-black'
                }`}>
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 border-t-2 border-dashed ${
                      step.id < currentStep ? 'border-teal-600' : 'border-black'
                    }`}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center">
            <span className="text-lg font-medium text-black">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        <div className="text-center mb-10">
          {currentStepData && (
            <>
              <h2 className="text-3xl font-bold mb-3 text-black leading-tight max-w-3xl mx-auto">
                {currentStepData.question}
              </h2>
              {currentStepData.subtitle && (
                <p className="text-lg text-black max-w-2xl mx-auto">
                  {currentStepData.subtitle}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mb-10">
          {currentStepData && (
            <div className="max-w-2xl mx-auto space-y-3">
              {currentStepData.options.map((option) => (
                <label 
                  key={option.id}
                  className="flex items-center gap-4 p-3 cursor-pointer hover:bg-white/50 rounded-lg transition-colors duration-200"
                >
                  <div className="relative">
                    <input
                      type="radio"
                      name={`step-${currentStep}`}
                      value={option.id}
                      checked={answers[currentStep] === option.id}
                      onChange={() => handleOptionSelect(option.id)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      answers[currentStep] === option.id
                        ? 'bg-teal-600 border-teal-600'
                        : 'bg-transparent border-black hover:border-gray-700'
                    }`}>
                      {answers[currentStep] === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                  <span className={`text-lg transition-colors duration-200 ${
                    answers[currentStep] === option.id ? 'text-teal-600 font-medium' : 'text-black'
                  }`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all duration-300 border border-black text-black ${
              currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black hover:text-white'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[currentStep]}
            className={`flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-lg transition-all duration-300 ${
              answers[currentStep]
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? 'Complete' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
