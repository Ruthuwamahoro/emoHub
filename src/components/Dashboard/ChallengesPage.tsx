import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, CheckCircle2, Circle, ChevronDown, ChevronUp, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usegetChallenges } from '@/hooks/users/groups/challenges/useGetChallenges';

interface Challenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface WeeklyCard {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  theme: string;
  challenges: Challenge[];
}

// Mock session - replace with your actual session logic
interface User {
  id: string;
  name: string;
  role: 'User' | 'Admin' | 'Specialist' | 'SuperAdmin';
}

interface Session {
  user: User;
}






type FilterType = 'all' | 'completed' | 'incomplete';

const WeeklyChallengesCard: React.FC = () => {
  const { data, isPending } = usegetChallenges();
  const { data: session } = useSession();

  // Initialize with empty array to prevent undefined errors
  const [weeklyCards, setWeeklyCards] = useState<WeeklyCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['week-1']));
  const [editingChallenge, setEditingChallenge] = useState<{cardId: string, challengeId: string} | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [isAddingChallenge, setIsAddingChallenge] = useState<string | null>(null);
  const [newChallengeForm, setNewChallengeForm] = useState({ title: '', description: '' });
  const [isAddingWeek, setIsAddingWeek] = useState(false);
  const [newWeekForm, setNewWeekForm] = useState({
    theme: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (data?.data) {
      setWeeklyCards(data.data);
    }
  }, [data]);


  const canCreateResources = ['Admin', 'Specialist', 'SuperAdmin'].includes(session?.user?.role ?? '');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCardProgress = (challenges: Challenge[]) => {
    const completedCount = challenges.filter(c => c.completed).length;
    const totalCount = challenges.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const isCompleted = completedCount === totalCount && totalCount > 0;
    
    return { completedCount, totalCount, progressPercentage, isCompleted };
  };

  const toggleChallenge = (cardId: string, challengeId: string) => {
    setWeeklyCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? {
              ...card,
              challenges: card.challenges.map(challenge =>
                challenge.id === challengeId
                  ? { ...challenge, completed: !challenge.completed }
                  : challenge
              )
            }
          : card
      )
    );
  };

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const startEditingChallenge = (cardId: string, challengeId: string) => {
    const card = weeklyCards.find(c => c.id === cardId);
    const challenge = card?.challenges.find(ch => ch.id === challengeId);
    if (challenge) {
      setEditingChallenge({ cardId, challengeId });
      setEditForm({ title: challenge.title, description: challenge.description });
    }
  };

  const saveEditedChallenge = () => {
    if (!editingChallenge) return;
    
    setWeeklyCards(prev => 
      prev.map(card => 
        card.id === editingChallenge.cardId 
          ? {
              ...card,
              challenges: card.challenges.map(challenge =>
                challenge.id === editingChallenge.challengeId
                  ? { ...challenge, title: editForm.title, description: editForm.description }
                  : challenge
              )
            }
          : card
      )
    );
    
    setEditingChallenge(null);
    setEditForm({ title: '', description: '' });
  };

  const cancelEditing = () => {
    setEditingChallenge(null);
    setEditForm({ title: '', description: '' });
  };

  const deleteChallenge = (cardId: string, challengeId: string) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      setWeeklyCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? {
                ...card,
                challenges: card.challenges.filter(challenge => challenge.id !== challengeId)
              }
            : card
        )
      );
    }
  };

  const startAddingChallenge = (cardId: string) => {
    setIsAddingChallenge(cardId);
    setNewChallengeForm({ title: '', description: '' });
  };

  const saveNewChallenge = () => {
    if (!isAddingChallenge || !newChallengeForm.title.trim()) return;
    
    const newChallenge: Challenge = {
      id: `${isAddingChallenge}-${Date.now()}`,
      title: newChallengeForm.title,
      description: newChallengeForm.description,
      completed: false
    };

    setWeeklyCards(prev => 
      prev.map(card => 
        card.id === isAddingChallenge 
          ? { ...card, challenges: [...card.challenges, newChallenge] }
          : card
      )
    );
    
    setIsAddingChallenge(null);
    setNewChallengeForm({ title: '', description: '' });
  };

  const cancelAddingChallenge = () => {
    setIsAddingChallenge(null);
    setNewChallengeForm({ title: '', description: '' });
  };

  const startAddingWeek = () => {
    setIsAddingWeek(true);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    setNewWeekForm({
      theme: '',
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0]
    });
  };

  const saveNewWeek = () => {
    if (!newWeekForm.theme.trim()) return;
    if (weeklyCards.length === 0) return;
    
    const nextWeekNumber = Math.max(...weeklyCards.map(card => card.weekNumber)) + 1;
    const newWeek: WeeklyCard = {
      id: `week-${nextWeekNumber}`,
      weekNumber: nextWeekNumber,
      startDate: newWeekForm.startDate,
      endDate: newWeekForm.endDate,
      theme: newWeekForm.theme,
      challenges: []
    };

    setWeeklyCards(prev => [...prev, newWeek]);
    setExpandedCards(prev => new Set([...prev, newWeek.id]));
    setIsAddingWeek(false);
    setNewWeekForm({ theme: '', startDate: '', endDate: '' });
  };

  const cancelAddingWeek = () => {
    setIsAddingWeek(false);
    setNewWeekForm({ theme: '', startDate: '', endDate: '' });
  };

  const deleteWeek = (cardId: string) => {
    if (confirm('Are you sure you want to delete this entire week? This will remove all challenges in this week.')) {
      setWeeklyCards(prev => prev.filter(card => card.id !== cardId));
      setExpandedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
    }
  };

  // Filter cards based on search and filter criteria
  const filteredCards = useMemo(() => {
    // Ensure weeklyCards is always an array
    if (!weeklyCards || !Array.isArray(weeklyCards)) {
      return [];
    }

    return weeklyCards.map(card => {
      let filteredChallenges = card.challenges || [];

      // Apply search filter
      if (searchQuery.trim()) {
        filteredChallenges = filteredChallenges.filter(challenge =>
          challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.theme.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (filter === 'completed') {
        filteredChallenges = filteredChallenges.filter(challenge => challenge.completed);
      } else if (filter === 'incomplete') {
        filteredChallenges = filteredChallenges.filter(challenge => !challenge.completed);
      }

      return {
        ...card,
        challenges: filteredChallenges
      };
    }).filter(card => card.challenges.length > 0 || searchQuery.trim() === '');
  }, [weeklyCards, searchQuery, filter]);

  // Overall progress across all weeks
  const overallProgress = useMemo(() => {
    // Ensure weeklyCards is always an array
    if (!weeklyCards || !Array.isArray(weeklyCards)) {
      return { completedCount: 0, totalCount: 0, progressPercentage: 0 };
    }

    const allChallenges = weeklyCards.flatMap(card => card.challenges || []);
    const completedCount = allChallenges.filter(c => c.completed).length;
    const totalCount = allChallenges.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return { completedCount, totalCount, progressPercentage };
  }, [weeklyCards]);

  // Show loading state
  if (isPending) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Overall Progress */}
      <div className="rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Emotional Intelligence Journey</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome, {session?.user?.fullName}</p>
            <p className="text-xs text-gray-500">Role: {session?.user?.role}</p>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="text-sm font-bold text-gray-800">{overallProgress.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600"
              style={{ width: `${overallProgress.progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {overallProgress.completedCount} of {overallProgress.totalCount} challenges completed across all weeks
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search challenges or themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            {(['all', 'completed', 'incomplete'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Add New Week Button */}
          {canCreateResources && (
            <button
              onClick={startAddingWeek}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add New Week
            </button>
          )}
        </div>
      </div>

      {/* Add New Week Form */}
      {canCreateResources && isAddingWeek && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-dashed border-green-300 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Weekly Challenge</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Week Theme <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newWeekForm.theme}
                onChange={(e) => setNewWeekForm({ ...newWeekForm, theme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="e.g., Self-Awareness Foundation"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newWeekForm.startDate}
                  onChange={(e) => setNewWeekForm({ ...newWeekForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newWeekForm.endDate}
                  onChange={(e) => setNewWeekForm({ ...newWeekForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={saveNewWeek}
                disabled={!newWeekForm.theme.trim() || !newWeekForm.startDate || !newWeekForm.endDate}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Create Week
              </button>
              <button
                onClick={cancelAddingWeek}
                className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Cards */}
      {filteredCards.map((card) => {
        const { completedCount, totalCount, progressPercentage, isCompleted } = getCardProgress(card.challenges);
        const isExpanded = expandedCards.has(card.id);
        
        return (
          <div key={card.id} className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Card Header */}
            <div 
              className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCardExpansion(card.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-800">Week {card.weekNumber}</h2>
                    {isCompleted && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </div>
                    )}
                    {canCreateResources && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWeek(card.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete entire week"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium mb-2">{card.theme}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(card.startDate)} - {formatDate(card.endDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {completedCount}/{totalCount} completed
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Card Content */}
            {isExpanded && (
              <div className="p-6">
                <div className="space-y-3">
                  {card.challenges.length > 0 ? (
                    <>
                      {card.challenges.map((challenge) => (
                        <div
                          key={challenge.id}
                          className={`p-4 border rounded-lg transition-all duration-200 ${
                            challenge.completed
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {editingChallenge?.cardId === card.id && editingChallenge?.challengeId === challenge.id ? (
                            // Edit Mode
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Challenge title"
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                rows={3}
                                placeholder="Challenge description"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEditedChallenge}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                  <Save className="w-4 h-4" />
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                >
                                  <X className="w-4 h-4" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="flex items-start gap-3">
                              <div 
                                className="mt-0.5 cursor-pointer"
                                onClick={() => toggleChallenge(card.id, challenge.id)}
                              >
                                {challenge.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className={`font-medium transition-colors ${
                                  challenge.completed 
                                    ? 'text-green-800 line-through' 
                                    : 'text-gray-800'
                                }`}>
                                  {challenge.title}
                                </h3>
                                <p className={`text-sm mt-1 ${
                                  challenge.completed 
                                    ? 'text-green-700' 
                                    : 'text-gray-600'
                                }`}>
                                  {challenge.description}
                                </p>
                              </div>
                              {canCreateResources && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => startEditingChallenge(card.id, challenge.id)}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit challenge"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteChallenge(card.id, challenge.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete challenge"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Add New Challenge Form */}
                      {canCreateResources && isAddingChallenge === card.id && (
                        <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={newChallengeForm.title}
                              onChange={(e) => setNewChallengeForm({ ...newChallengeForm, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Challenge title"
                              autoFocus
                            />
                            <textarea
                              value={newChallengeForm.description}
                              onChange={(e) => setNewChallengeForm({ ...newChallengeForm, description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                              rows={3}
                              placeholder="Challenge description"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={saveNewChallenge}
                                disabled={!newChallengeForm.title.trim()}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                              >
                                <Save className="w-4 h-4" />
                                Add Challenge
                              </button>
                              <button
                                onClick={cancelAddingChallenge}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Add Challenge Button */}
                      {canCreateResources && isAddingChallenge !== card.id && (
                        <button
                          onClick={() => startAddingChallenge(card.id)}
                          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Add New Challenge
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No challenges found matching your criteria for this week.</p>
                      {canCreateResources && (
                        <button
                          onClick={() => startAddingChallenge(card.id)}
                          className="mt-3 flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Add First Challenge
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {filteredCards.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No weekly challenges found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyChallengesCard;