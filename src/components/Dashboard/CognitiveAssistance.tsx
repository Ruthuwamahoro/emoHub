"use client"
import React, { useState, useEffect } from 'react';

type CognitiveDistortion = {
  id: string;
  name: string;
  description: string;
  examples: string[];
};

type UserThought = {
  id: string;
  content: string;
  date: Date;
  distortions: string[];
  reframe: string;
};

const CognitiveReframingAssistant: React.FC = () => {
  const cognitiveDistortions: CognitiveDistortion[] = [
    {
      id: 'all-or-nothing',
      name: 'All-or-Nothing Thinking',
      description: 'Seeing things in black-and-white categories, with no middle ground.',
      examples: ['I failed at this task, so I\'m a complete failure.', 'If I don\'t do it perfectly, it\'s worthless.']
    },
    {
      id: 'overgeneralization',
      name: 'Overgeneralization',
      description: 'Viewing a negative event as a never-ending pattern of defeat.',
      examples: ['I always mess things up.', 'Nothing ever works out for me.']
    },
    {
      id: 'mental-filter',
      name: 'Mental Filtering',
      description: 'Dwelling on negatives while filtering out positives.',
      examples: ['I got feedback on my presentation, but all I can think about is that one criticism.']
    },
    {
      id: 'disqualifying-positives',
      name: 'Disqualifying the Positive',
      description: 'Rejecting positive experiences by insisting they "don\'t count."',
      examples: ['Sure I did well, but that doesn\'t mean I\'m competent. It was just luck.']
    },
    {
      id: 'jumping-to-conclusions',
      name: 'Jumping to Conclusions',
      description: 'Making negative interpretations without actual evidence.',
      examples: ['They didn\'t reply to my email. They must be angry with me.']
    },
    {
      id: 'catastrophizing',
      name: 'Catastrophizing',
      description: 'Expecting disaster; blowing things way out of proportion.',
      examples: ['If I mess up this presentation, my career is over.']
    },
    {
      id: 'emotional-reasoning',
      name: 'Emotional Reasoning',
      description: 'Believing that what you feel must be true.',
      examples: ['I feel like a failure, so I must be a failure.']
    },
    {
      id: 'should-statements',
      name: 'Should Statements',
      description: 'Having rigid rules about how you or others should behave.',
      examples: ['I should always be productive.', 'They should have known better.']
    },
    {
      id: 'labeling',
      name: 'Labeling',
      description: 'Attaching a negative label to yourself or others instead of describing behavior.',
      examples: ['I\'m a loser.', 'He\'s a jerk.']
    },
    {
      id: 'personalization',
      name: 'Personalization',
      description: 'Seeing yourself as the cause of some negative external event which you were not primarily responsible for.',
      examples: ['The team project failed because of me.']
    }
  ];

  const [currentThought, setCurrentThought] = useState<string>('');
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);
  const [thoughtHistory, setThoughtHistory] = useState<UserThought[]>([]);
  const [reframedThought, setReframedThought] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'input' | 'history'>('input');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<UserThought | null>(null);
  const [userValues, setUserValues] = useState<string[]>([
    'Personal growth', 'Connection', 'Health', 'Creativity', 'Learning'
  ]);
  
  const toggleDistortion = (distortionId: string) => {
    setSelectedDistortions(prev => 
      prev.includes(distortionId) 
        ? prev.filter(id => id !== distortionId) 
        : [...prev, distortionId]
    );
  };

  const generateReframe = () => {
    if (!currentThought.trim() || selectedDistortions.length === 0) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const distortionNames = selectedDistortions.map(id => 
        cognitiveDistortions.find(d => d.id === id)?.name || ''
      );
      
      const randomValue = userValues[Math.floor(Math.random() * userValues.length)];
      
      let reframeText = `I notice I'm engaging in ${distortionNames.join(' and ')}. `;
      
      if (selectedDistortions.includes('all-or-nothing')) {
        reframeText += "There might be a middle ground here that I'm not seeing. ";
      }
      
      if (selectedDistortions.includes('catastrophizing')) {
        reframeText += "I'm focusing on the worst possible outcome, but other outcomes are more likely. ";
      }
      
      if (selectedDistortions.includes('should-statements')) {
        reframeText += "I can replace 'should' with 'could' or 'would like to' to be gentler with myself. ";
      }
      
      reframeText += `Considering my value of ${randomValue}, a more balanced perspective might be: `;
      
      if (selectedDistortions.includes('overgeneralization')) {
        reframeText += "This is one specific situation, not a pattern that defines everything. ";
      } else if (selectedDistortions.includes('emotional-reasoning')) {
        reframeText += "My feelings are real, but they don't always reflect reality accurately. ";
      } else if (selectedDistortions.includes('jumping-to-conclusions')) {
        reframeText += "I don't have all the facts yet, so I should gather more information before drawing conclusions. ";
      } else {
        reframeText += "I can approach this situation with curiosity rather than judgment. ";
      }
      
      setReframedThought(reframeText);
      
      const newThought: UserThought = {
        id: Date.now().toString(),
        content: currentThought,
        date: new Date(),
        distortions: selectedDistortions,
        reframe: reframeText
      };
      
      setThoughtHistory(prev => [newThought, ...prev]);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  const saveValue = (value: string) => {
    if (value.trim() && !userValues.includes(value.trim())) {
      setUserValues(prev => [...prev, value.trim()]);
    }
  };
  
  const removeValue = (value: string) => {
    setUserValues(prev => prev.filter(v => v !== value));
  };
  
  const resetForm = () => {
    setCurrentThought('');
    setSelectedDistortions([]);
    setReframedThought('');
  };
  
  const viewHistoryItem = (item: UserThought) => {
    setSelectedHistoryItem(item);
  };
  
  useEffect(() => {
    const mockHistory: UserThought[] = [
      {
        id: '1',
        content: 'I messed up my presentation today. I\'m terrible at public speaking.',
        date: new Date(Date.now() - 86400000), // yesterday
        distortions: ['overgeneralization', 'labeling'],
        reframe: 'One presentation doesn\'t define my public speaking abilities. I can learn from this experience and improve next time.'
      }
    ];
    
    setThoughtHistory(mockHistory);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Cognitive Reframing Assistant</h1>
            <p className="text-blue-100">
              Identify thought patterns and develop healthier perspectives
            </p>
          </div>
          
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'input' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New Thought
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                setSelectedHistoryItem(null);
              }}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'history' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              History
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'input' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Step 1: What's on your mind?
                  </h2>
                  <textarea
                    value={currentThought}
                    onChange={(e) => setCurrentThought(e.target.value)}
                    placeholder="Describe the situation and your thoughts..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Step 2: Do you notice any thinking patterns?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cognitiveDistortions.map((distortion) => (
                      <div 
                        key={distortion.id}
                        onClick={() => toggleDistortion(distortion.id)}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedDistortions.includes(distortion.id)
                            ? 'bg-indigo-50 border-indigo-300'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedDistortions.includes(distortion.id)}
                            onChange={() => {}}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm font-medium text-gray-700">
                            {distortion.name}
                          </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{distortion.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={generateReframe}
                    disabled={isAnalyzing || !currentThought.trim() || selectedDistortions.length === 0}
                    className={`py-2 px-4 rounded-md font-medium ${
                      isAnalyzing || !currentThought.trim() || selectedDistortions.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Reframe My Thought'}
                  </button>
                </div>
                
                {reframedThought && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="text-lg font-medium text-green-800 mb-2">
                      Alternative Perspective
                    </h3>
                    <p className="text-green-700">{reframedThought}</p>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={resetForm}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Start Over
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    My Values
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Your reframes will be personalized based on what matters most to you.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {userValues.map(value => (
                      <div key={value} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                        {value}
                        <button 
                          onClick={() => removeValue(value)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex">
                    <input
                      type="text"
                      id="new-value"
                      placeholder="Add a new value"
                      className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          saveValue((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('new-value') as HTMLInputElement;
                        saveValue(input.value);
                        input.value = '';
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {selectedHistoryItem ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedHistoryItem(null)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                    >
                      ← Back to history
                    </button>
                    
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(selectedHistoryItem.date).toLocaleDateString()}
                      </div>
                      <p className="text-gray-800 mb-4">{selectedHistoryItem.content}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Identified patterns:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedHistoryItem.distortions.map(id => {
                            const distortion = cognitiveDistortions.find(d => d.id === id);
                            return distortion ? (
                              <span key={id} className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs">
                                {distortion.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <h4 className="text-sm font-medium text-green-800 mb-1">Reframed perspective:</h4>
                        <p className="text-green-700 text-sm">{selectedHistoryItem.reframe}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Your Thought History
                    </h2>
                    
                    {thoughtHistory.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No thoughts recorded yet. Try reframing a thought!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {thoughtHistory.map(item => (
                          <div 
                            key={item.id}
                            onClick={() => viewHistoryItem(item)}
                            className="border border-gray-200 rounded-md p-3 cursor-pointer hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <p className="text-gray-800 line-clamp-2">{item.content}</p>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.distortions.slice(0, 3).map(id => {
                                const distortion = cognitiveDistortions.find(d => d.id === id);
                                return distortion ? (
                                  <span key={id} className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs">
                                    {distortion.name}
                                  </span>
                                ) : null;
                              })}
                              {item.distortions.length > 3 && (
                                <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                  +{item.distortions.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CognitiveReframingAssistant;