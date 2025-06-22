"use client";
import React, { useState } from 'react';
import { X, MessageCircle, Users, Clock, AlertCircle } from 'lucide-react';

interface DialogueSession {
  id: string;
  title: string;
  topic: string;
  participants: number;
  maxParticipants: number;
  facilitator: string;
  time: string;
  date: string;
  description?: string;
  guidelines?: string[];
}

interface DialogueJoinModalProps {
  dialogue: DialogueSession;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (intention: string) => void;
}

const DialogueJoinModal: React.FC<DialogueJoinModalProps> = ({
  dialogue,
  isOpen,
  onClose,
  onJoin
}) => {
  const [joinIntention, setJoinIntention] = useState<string>('');
  const [agreed, setAgreed] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onJoin(joinIntention);
    }
  };

  const fullDialogue: DialogueSession = {
    ...dialogue,
    description: dialogue.description || 
      "In this dialogue, we'll explore strategies for managing uncertainty in various aspects of life, including work, relationships, and personal growth. We'll focus on sharing personal experiences and practical approaches rather than theoretical concepts.",
    guidelines: dialogue.guidelines || [
      "Share from personal experience rather than giving advice",
      "Listen actively when others are speaking",
      "Ask curious questions instead of making assumptions",
      "Respect confidentiality of what's shared in the dialogue",
      "Be present and minimize distractions during the session"
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <MessageCircle className="text-indigo-500 mr-2" size={20} />
              Join Dialogue
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {step === 1 ? (
            <>
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-indigo-700 mb-1">{fullDialogue.title}</h3>
                <p className="text-sm text-slate-600">{fullDialogue.topic}</p>
                
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center text-sm text-slate-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{fullDialogue.participants}/{fullDialogue.maxParticipants} Participants</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{fullDialogue.time}, {fullDialogue.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-slate-700 mb-2">About This Dialogue</h3>
                <p className="text-sm text-slate-600">{fullDialogue.description}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-slate-700 mb-2">Dialogue Guidelines</h3>
                <ul className="space-y-2">
                  {(fullDialogue.guidelines ?? []).map((guideline, index) => (
                    <li key={index} className="text-sm text-slate-600 flex">
                      <span className="text-indigo-500 mr-2">•</span>
                      {guideline}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2">Share Your Intention</h3>
                <p className="text-sm text-slate-500 mb-3">
                  What brings you to this dialogue? What do you hope to learn or share?
                </p>
                <textarea 
                  value={joinIntention}
                  onChange={(e) => setJoinIntention(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  placeholder="I'm joining because..."
                ></textarea>
              </div>
              
              <div className="flex items-start mb-6">
                <input 
                  type="checkbox" 
                  id="agree-guidelines"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 mr-3"
                />
                <label htmlFor="agree-guidelines" className="text-sm text-slate-600">
                  I agree to follow the dialogue guidelines and contribute to creating a supportive space for meaningful conversation.
                </label>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={onClose}
                  className="mr-3 py-2 px-4 border border-slate-300 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!joinIntention.trim() || !agreed}
                  className={`py-2 px-6 rounded-md text-sm text-white ${
                    joinIntention.trim() && agreed 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-indigo-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-emerald-700">You're about to join the dialogue</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      The dialogue will begin at {fullDialogue.time}. You'll receive a notification when it's time to join.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-700">Prepare for the dialogue</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Find a quiet space where you can focus without distractions. 
                      Have headphones ready if possible. The session will last approximately 45-60 minutes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2">Your Intention</h3>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600 italic">"{joinIntention}"</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={onClose}
                  className="mr-3 py-2 px-4 border border-slate-300 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md text-sm"
                >
                  Confirm & Join
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogueJoinModal;