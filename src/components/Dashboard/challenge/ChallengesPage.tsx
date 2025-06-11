import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, CheckCircle2, Circle, ChevronDown, ChevronUp, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usegetChallenges } from '@/hooks/challenges/useGetChallenges';
import { useCreateChallenge } from '@/hooks/challenges/useCreateChallenges';
import { ChallengeElementForm } from './CreateChallengeElement';
import { useDeleteChallengeElement } from '@/hooks/challenges/elements/useDeleteChallengesElement';
import { useDeleteChallenge } from '@/hooks/challenges/useDeleteChallenges';
import { useUpdateChallenge } from '@/hooks/challenges/useUpdateChallenge';
import { useUpdateElementChallenge } from '@/hooks/challenges/elements/useUpdateElement';


export interface Challenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface WeeklyCard {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  theme: string;
  challenges: Challenge[];
}

interface User {
  id: string;
  name: string;
  role: 'User' | 'Admin' | 'Specialist' | 'SuperAdmin';
}



type FilterType = 'all' | 'completed' | 'incomplete';

const WeeklyChallengesCard: React.FC = () => {
  const { data, isPending } = usegetChallenges();
  const { data: session } = useSession();
  const { isPendingCreateChallenge, formData, setFormData, handleChange, handleSubmit } = useCreateChallenge();

  const deleteElementMutation = useDeleteChallengeElement();
  const deleteChallengeMutation = useDeleteChallenge();
  
  const [deletingWeek, setDeletingWeek] = useState<string | null>(null);
  const [deletingElement, setDeletingElement] = useState<string | null>(null);
  const updateWeekMutation = useUpdateChallenge();
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [weekEditForm, setWeekEditForm] = useState({
    weekNumber: '',
    theme: '',
    startDate: '',
    endDate: ''
  });
  const [updatingWeek, setUpdatingWeek] = useState<string | null>(null);
  const updateElementMutation = useUpdateElementChallenge();

  const [updatingElement, setUpdatingElement] = useState<string | null>(null);

  const [weeklyCards, setWeeklyCards] = useState<WeeklyCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['week-1']));
  const [editingChallenge, setEditingChallenge] = useState<{cardId: string, challengeId: string} | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  
  const [isAddingChallenge, setIsAddingChallenge] = useState<string | null>(null);
  
  const [isAddingWeek, setIsAddingWeek] = useState(false);



  const deleteChallenge = async (cardId: string, challengeId: string) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      setDeletingElement(challengeId);
      try {
        await deleteElementMutation.mutate({ challengeId: cardId, elementId: challengeId });
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setDeletingElement(null);
      }
    }
  };
  
  const deleteWeek = async (cardId: string) => {
    if (confirm('Are you sure you want to delete this entire week? This will remove all challenges in this week.')) {
      setDeletingWeek(cardId);
      try {
        await deleteChallengeMutation.mutate({ id: cardId });
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setDeletingWeek(null);
      }
    }
  };

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

  const handleWeekFormSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit(e);
    setTimeout(() => {
      if(result?.success){
        setIsAddingWeek(false);
        setFormData({
          weekNumber: '',
          theme: '',
          startDate: '',
          endDate: ''
        })
      }
    }, 5000)
  };

  const getCardProgress = (challenges: Challenge[]) => {
    const completedCount = challenges.filter(c => c.completed).length;
    const totalCount = challenges.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const isCompleted = completedCount === totalCount && totalCount > 0;
    
    return { completedCount, totalCount, progressPercentage, isCompleted };
  };


  const startEditingWeek = (cardId: string) => {
    const card = weeklyCards.find(c => c.id === cardId);
    if (card) {
      setEditingWeek(cardId);
      setWeekEditForm({
        weekNumber: card.weekNumber.toString(),
        theme: card.theme,
        startDate: card.startDate.split('T')[0],
        endDate: card.endDate.split('T')[0]
      });
    }
  };


  const handleWeekEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setWeekEditForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const saveEditedWeek = async () => {
    if (!editingWeek) return;
    
    setUpdatingWeek(editingWeek);
    
    try {
      const updateData = {
        weekNumber: parseInt(weekEditForm.weekNumber),
        theme: weekEditForm.theme,
        startDate: weekEditForm.startDate,
        endDate: weekEditForm.endDate
      };

      await updateWeekMutation.mutate({
        id: editingWeek,
        data: updateData
      });

      // Update local state optimistically
      setWeeklyCards(prev => 
        prev.map(card => 
          card.id === editingWeek 
            ? { 
                ...card, 
                weekNumber: updateData.weekNumber,
                theme: updateData.theme,
                startDate: updateData.startDate,
                endDate: updateData.endDate
              }
            : card
        )
      );
      
      setEditingWeek(null);
      setWeekEditForm({
        weekNumber: '',
        theme: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      console.error('Update week failed:', error);
    } finally {
      setUpdatingWeek(null);
    }
  };

  const cancelEditingWeek = () => {
    setEditingWeek(null);
    setWeekEditForm({
      weekNumber: '',
      theme: '',
      startDate: '',
      endDate: ''
    });
  };




  const renderCardHeader = (card: WeeklyCard) => {
    const { completedCount, totalCount, progressPercentage, isCompleted } = getCardProgress(card.challenges);
    const isExpanded = expandedCards.has(card.id);
    const isEditingThisWeek = editingWeek === card.id;
    
    return (
      <div className="p-6 border-b border-gray-200">
        {isEditingThisWeek ? (
          // Edit Mode for Week
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="weekNumber"
                  value={weekEditForm.weekNumber}
                  onChange={handleWeekEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="theme"
                  value={weekEditForm.theme}
                  onChange={handleWeekEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={weekEditForm.startDate}
                  onChange={handleWeekEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={weekEditForm.endDate}
                  onChange={handleWeekEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={saveEditedWeek}
                disabled={updatingWeek === card.id}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {updatingWeek === card.id ? 'Updating...' : 'Save Changes'}
              </button>
              <button
                onClick={cancelEditingWeek}
                className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Mode for Week
          <div 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
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
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingWeek(card.id);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit week"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
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
                    </div>
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
        )}
      </div>
    );
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

  const saveEditedChallenge = async () => {
    if (!editingChallenge) return;
    
    setUpdatingElement(editingChallenge.challengeId);
    
    try {
      await updateElementMutation.mutate({
        id: editingChallenge.cardId,
        ids: editingChallenge.challengeId,
        data: {
          title: editForm.title,
          description: editForm.description
        }
      });
      
      // Only update local state if the API call succeeds
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
    } catch (error) {
      console.error('Update challenge failed:', error);
    } finally {
      setUpdatingElement(null);
    }
  };

  const cancelEditing = () => {
    setEditingChallenge(null);
    setEditForm({ title: '', description: '' });
  };


  const startAddingChallenge = (cardId: string) => {
    setIsAddingChallenge(cardId);
  };

  const handleChallengeElementSuccess = () => {
    setIsAddingChallenge(null);
    // The form will automatically refresh the data via query invalidation
  };

  const cancelAddingChallenge = () => {
    setIsAddingChallenge(null);
  };

  const startAddingWeek = () => {
    setIsAddingWeek(true);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    setFormData({
      weekNumber: '',
      theme: '',
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0]
    });
  };

  const cancelAddingWeek = () => {
    setIsAddingWeek(false);
    setFormData({
      weekNumber: '',
      theme: '',
      startDate: '',
      endDate: ''
    });
  };


  const filteredCards = useMemo(() => {
    if (!weeklyCards || !Array.isArray(weeklyCards)) {
      return [];
    }

    return weeklyCards.map(card => {
      let filteredChallenges = card.challenges || [];

      if (searchQuery.trim()) {
        filteredChallenges = filteredChallenges.filter(challenge =>
          challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.theme.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

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

  const overallProgress = useMemo(() => {
    if (!weeklyCards || !Array.isArray(weeklyCards)) {
      return { completedCount: 0, totalCount: 0, progressPercentage: 0 };
    }

    const allChallenges = weeklyCards.flatMap(card => card.challenges || []);
    const completedCount = allChallenges.filter(c => c.completed).length;
    const totalCount = allChallenges.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return { completedCount, totalCount, progressPercentage };
  }, [weeklyCards]);

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
          {[1, 2, 3, 4, 5].map(i => (
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
      <div className="rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Emotional Intelligence Journey</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome, {session?.user?.fullName}</p>
            <p className="text-xs text-gray-500">Role: {session?.user?.role}</p>
          </div>
        </div>
        
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

      {canCreateResources && isAddingWeek && (
        <form onSubmit={handleWeekFormSubmit}>
          <div className="bg-white rounded-xl shadow-lg border-2 border-dashed border-green-300 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Weekly Challenge</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="weekNumber"
                  value={formData.weekNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., 1"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Theme <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., Self-Awareness Foundation"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isPendingCreateChallenge}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isPendingCreateChallenge ? 'Creating...' : 'Create Week'}
                </button>
                <button
                  type="button"
                  onClick={cancelAddingWeek}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {filteredCards.map((card) => {
        const { completedCount, totalCount, progressPercentage, isCompleted } = getCardProgress(card.challenges);
        const isExpanded = expandedCards.has(card.id);
        
        return (
          <div key={card.id} className="bg-white rounded-xl shadow-lg border border-gray-200">
             {renderCardHeader(card)}
             {/* {expandedCards.has(card.id) && (
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
                      <>
                      
                      <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingWeek(card.id);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit week"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
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
                      </>
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
          )} */}


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
                                  disabled={updatingElement === challenge.id}

                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                  <Save className="w-4 h-4" />
                                  {updatingElement === challenge.id ? 'Updating...' : 'Save'}
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
                      
                      {/* Add New Challenge Element Form */}
                      {canCreateResources && isAddingChallenge === card.id && (
                        <ChallengeElementForm
                          challengeId={card.id}
                          onSuccess={handleChallengeElementSuccess}
                          onCancel={cancelAddingChallenge}
                          isFirstChallenge={card.challenges.length === 0}
                          className="mt-4"
                        />
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
                        <ChallengeElementForm
                          challengeId={card.id}
                          onSuccess={handleChallengeElementSuccess}
                          isFirstChallenge={true}
                          className="mt-4"
                        />
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