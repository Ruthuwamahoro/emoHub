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
import { useUserProgress } from '@/hooks/challenges/useUserProgress';
import { useUpdateElementProgress } from '@/hooks/challenges/elements/useUpdateElementProgress';
import { useQueryClient } from '@tanstack/react-query';
import { Challenge, WeeklyCard } from '@/types/challenges';



type FilterType = 'all' | 'completed' | 'incomplete';

const WeeklyChallengesCard: React.FC = () => {
  const { data, isPending } = usegetChallenges();
  const { data: session } = useSession();
  const { isPendingCreateChallenge, formData, setFormData, handleChange, handleSubmit } = useCreateChallenge();
  const { data: userProgressData, isLoading: isUserProgressLoading } = useUserProgress();
  const updateElementProgressMutation = useUpdateElementProgress();
  const deleteElementMutation = useDeleteChallengeElement();
  const deleteChallengeMutation = useDeleteChallenge();
  const [updatingElements, setUpdatingElements] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient(); 

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
        return error;
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
    
    return { 
      completedCount, 
      totalCount, 
      progressPercentage, 
      isCompleted,
      remainingCount: totalCount - completedCount
    };
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
    const { completedCount, totalCount, progressPercentage, isCompleted, remainingCount } = getCardProgress(card.challenges);
    const isExpanded = expandedCards.has(card.id);
    const isEditingThisWeek = editingWeek === card.id;
    
    return (
      <div className="p-6 border-b border-gray-200">
        {isEditingThisWeek ? (
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
                  <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full text-xs font-medium shadow-lg">
                    <CheckCircle2 className="w-3 h-3" />
                    Week Completed! 🎉
                  </div>
                  )}

                {!isCompleted && totalCount > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <span>{remainingCount} remaining</span>
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
                  <span className="text-green-600 font-bold">{completedCount}</span>
                  <span className="text-gray-400">/</span>
                  <span className="font-bold">{totalCount}</span>
                  <span className="text-gray-500 ml-1">completed</span>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-green-200' 
                        : 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-blue-200'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">
                  {progressPercentage}% complete
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



  const toggleChallenge = async (cardId: string, challengeId: string) => {
    const card = weeklyCards.find(c => c.id === cardId);
    const challenge = card?.challenges.find(c => c.id === challengeId);
    
    if (!challenge) return;
    
    const newCompletedState = !challenge.completed;
    
    setUpdatingElements(prev => new Set(prev).add(challengeId));
    
    setWeeklyCards(prev => 
      prev.map(weekCard => 
        weekCard.id === cardId 
          ? {
              ...weekCard,
              challenges: weekCard.challenges.map(ch =>
                ch.id === challengeId 
                  ? { ...ch, completed: newCompletedState }
                  : ch
              )
            }
          : weekCard
      )
    );
    
    try {
      await updateElementProgressMutation.mutateAsync({
        challengeId: cardId,
        data: {
          elementId: challengeId,
          completed: newCompletedState
        }
      });
      
    } catch (error) {
      console.error('Failed to toggle challenge:', error);
      setWeeklyCards(prev => 
        prev.map(weekCard => 
          weekCard.id === cardId 
            ? {
                ...weekCard,
                challenges: weekCard.challenges.map(ch =>
                  ch.id === challengeId 
                    ? { ...ch, completed: !newCompletedState }
                    : ch
                )
              }
            : weekCard
        )
      );
    } finally {
      // Remove from updating elements
      setUpdatingElements(prev => {
        const newSet = new Set(prev);
        newSet.delete(challengeId);
        return newSet;
      });
    }
  };

useEffect(() => {
  if (updateElementProgressMutation.isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['challenges'] });
    queryClient.invalidateQueries({ queryKey: ['user-progress'] });
  }
}, [updateElementProgressMutation.isSuccess]);

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
    if (userProgressData) {
      return {
        completedCount: userProgressData.completed_challenges,
        totalCount: userProgressData.total_challenges,
        progressPercentage: parseFloat(userProgressData.overall_completion_percentage)
      };
    }
    
    if (!weeklyCards || !Array.isArray(weeklyCards)) {
      return { completedCount: 0, totalCount: 0, progressPercentage: 0 };
    }
  
    const allChallenges = weeklyCards.flatMap(card => card.challenges || []);
    const completedCount = allChallenges.filter(c => c.completed).length;
    const totalCount = allChallenges.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return { completedCount, totalCount, progressPercentage };
  }, [userProgressData, weeklyCards]);

  if (isPending || isUserProgressLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
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
      <div className="rounded-xl shadow-lg border border-gray-200 p-6 bg-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-600"><span className="text-orange-500 font-bold"> Hi {(session?.user?.fullName)?.split(" ")[0]}</span>, <br/> Welcome to Emotional Intelligence Challenges</h1>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="text-sm font-bold text-gray-800">{overallProgress.progressPercentage}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600"
              style={{ width: `${overallProgress.progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {overallProgress.completedCount} of {overallProgress.totalCount} challenges completed across all weeks
          </p>
        </div>
        {userProgressData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{userProgressData.completed_weeks}</div>
              <div className="text-sm text-gray-600">Weeks Completed</div>
              <div className="text-xs text-gray-500">of {userProgressData.total_weeks} total</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{userProgressData.current_streak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{userProgressData.longest_streak}</div>
              <div className="text-sm text-gray-600">Longest Streak</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {userProgressData.overall_completion_percentage}%
              </div>
              <div className="text-sm text-gray-600">Overall Progress</div>
              <div className="text-xs text-gray-500">
                {new Date(userProgressData.last_activity_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

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
            
            {isExpanded && (
              <div className="p-6">
                <div className="space-y-3">
                  {card.challenges.length > 0 ? (
                    <>
                    {card.challenges.map((challenge) => {
                      const isUpdating = updatingElements.has(challenge.id);
                      return (
                        <div
                          key={challenge.id}
                          className={`p-4 border rounded-lg transition-all duration-300 transform ${
                            challenge.completed
                              ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-sm bg-green-50'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:shadow-md'
                          } ${isUpdating ? 'scale-105 ring-2 ring-blue-300' : ''}`}
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
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                            // Enhanced View Mode
                            <div className="flex items-start gap-3">
                              <div 
                                className={`mt-0.5 cursor-pointer transition-all duration-200 ${
                                  isUpdating ? 'animate-pulse' : ''
                                } ${isUpdating ? 'pointer-events-none' : ''}`}
                                onClick={() => !isUpdating && toggleChallenge(card.id, challenge.id)}
                              >
                                {isUpdating ? (
                                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : challenge.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600 drop-shadow-sm" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className={`font-medium transition-all duration-300 ${
                                  challenge.completed 
                                    ? 'text-green-800 line-through decoration-green-600 decoration-2' 
                                    : 'text-gray-800'
                                } ${isUpdating ? 'opacity-60' : ''}`}>
                                  {challenge.title}
                                </h3>
                                <p className={`text-sm mt-1 transition-all duration-300 ${
                                  challenge.completed 
                                    ? 'text-green-700 line-through decoration-green-500' 
                                    : 'text-gray-600'
                                } ${isUpdating ? 'opacity-60' : ''}`}>
                                  {challenge.description}
                                </p>
                                {/* Add completion indicator */}
                                {challenge.completed && !isUpdating && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-green-600 font-medium">Completed</span>
                                    {/* {challenge.completed_at && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        • {new Date(challenge.completed_at).toLocaleDateString()}
                                      </span>
                                    )} */}
                                  </div>
                                )}
                              </div>
                              {canCreateResources && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => startEditingChallenge(card.id, challenge.id)}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit challenge"
                                    disabled={isUpdating}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteChallenge(card.id, challenge.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete challenge"
                                    disabled={isUpdating}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                      
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
          <p className="text-gray-500 text-lg">No weekly challenges found</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyChallengesCard;