"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Eye, Trash2, Brain, Target, Users } from 'lucide-react';

// Types
type MoodType = 'happy' | 'annoyed' | 'angry' | 'tired' | 'neutral' | 'loved';
type UserRole = 'User' | 'Admin' | 'Specialist' | 'SuperAdmin';

interface MoodEntry {
  id: string;
  userId: string;
  userName: string;
  mood: MoodType;
  intensity: number;
  timestamp: Date;
  notes?: string;
  tags?: string[];
}

interface Session {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
}

// Mock data
const mockMoodEntries: MoodEntry[] = [
  {
    id: '1',
    userId: 'alex1',
    userName: 'Alex Thompson',
    mood: 'happy',
    intensity: 80,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    notes: 'Had a wonderful day exploring new concepts at work, felt energized and focused. Feeling grateful for supportive colleagues.',
    tags: ['Work', 'Achievements', 'Gratitude']
  },
  {
    id: '2',
    userId: 'sarah2',
    userName: 'Sarah Johnson',
    mood: 'tired',
    intensity: 70,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    notes: 'Long day with back-to-back meetings. Need some rest.',
    tags: ['Work', 'Meetings', 'Exhaustion']
  },
  {
    id: '3',
    userId: 'mike3',
    userName: 'Mike Davis',
    mood: 'neutral',
    intensity: 60,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    notes: 'Regular day, nothing particularly exciting but stable mood overall.',
    tags: ['Work', 'Routine']
  },
  {
    id: '4',
    userId: 'emma4',
    userName: 'Emma Wilson',
    mood: 'loved',
    intensity: 90,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    notes: 'Spending quality time with family. Feeling blessed and connected.',
    tags: ['Family', 'Love', 'Connection']
  }
];

const EmotionTrackingApp: React.FC = () => {
  // Mock session - in real app this would come from your auth system
  const [session] = useState<Session>({
    user: {
      id: 'alex1',
      name: 'Alex Thompson',
      role: 'Admin' // Change this to 'Admin' to see admin view
    }
  });

  // Role-based access control
  const canAccess = ['Admin', 'Specialist', 'SuperAdmin'].includes(session?.user?.role ?? '');

  // Emotion tracking states
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState([60]);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(mockMoodEntries);

  const moodEmojis: Record<MoodType, string> = {
    happy: '😊',
    annoyed: '😤',
    angry: '😠',
    tired: '😴',
    neutral: '😐',
    loved: '💖'
  };

  const moodLabels: Record<MoodType, string> = {
    happy: 'Happy',
    annoyed: 'Annoyed',
    angry: 'Angry',
    tired: 'Tired',
    neutral: 'Neutral',
    loved: 'Loved'
  };

  const moodColors: Record<MoodType, string> = {
    happy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    annoyed: 'bg-orange-100 text-orange-800 border-orange-200',
    angry: 'bg-red-100 text-red-800 border-red-200',
    tired: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
    loved: 'bg-pink-100 text-pink-800 border-pink-200'
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const saveMoodEntry = () => {
    if (selectedMood && session?.user) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        userId: session.user.id,
        userName: session.user.name,
        mood: selectedMood,
        intensity: intensity[0],
        timestamp: new Date(),
        notes: notes.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined
      };
      setMoodEntries([newEntry, ...moodEntries]);
      
      // Reset form
      setSelectedMood(null);
      setIntensity([60]);
      setNotes('');
      setTags([]);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const EmotionInputForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            How are you feeling today?
          </CardTitle>
          <CardDescription>
            Track your emotions and reflect on your daily experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div>
            <Label className="text-base font-medium">Select your mood</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-3">
              {(Object.entries(moodEmojis) as [MoodType, string][]).map(([mood, emoji]) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${
                    selectedMood === mood ? 'bg-primary' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMood(mood)}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-sm font-medium">{moodLabels[mood]}</span>
                </Button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <>
              <Separator />
              
              {/* Intensity Slider */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{moodEmojis[selectedMood]}</span>
                  <div>
                    <Label className="text-base font-medium">
                      Emotional intensity: {intensity[0]}%
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      How strongly do you feel this emotion?
                    </p>
                  </div>
                </div>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Context & Activities</Label>
                <p className="text-sm text-muted-foreground">
                  Add tags to describe what influenced your mood
                </p>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Work, Family, Exercise"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1"
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Tag
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Notes */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Additional notes</Label>
                <p className="text-sm text-muted-foreground">
                  Describe what happened or why you feel this way
                </p>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Save Button */}
              <Button onClick={saveMoodEntry} className="w-full" size="lg">
                Save Emotion Entry
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries Preview for Users */}
      {moodEntries.filter(entry => entry.userId === session?.user?.id).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Recent Entries
            </CardTitle>
            <CardDescription>
              A quick look at your emotional journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodEntries
                .filter(entry => entry.userId === session?.user?.id)
                .slice(0, 3)
                .map((entry) => (
                <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{moodLabels[entry.mood]}</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.intensity}% intensity
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(entry.timestamp)}
                    </p>
                    {entry.notes && (
                      <p className="text-sm">{entry.notes}</p>
                    )}
                    {entry.tags && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Emotion Records Dashboard
          </CardTitle>
          <CardDescription>
            View and manage all user emotion entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Mood</TableHead>
                  <TableHead>Intensity</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moodEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(entry.userName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{entry.userName}</div>
                          <div className="text-sm text-muted-foreground">{entry.userId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{moodEmojis[entry.mood]}</span>
                        <Badge className={moodColors[entry.mood]}>
                          {moodLabels[entry.mood]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={entry.intensity} className="w-16 h-2" />
                        <span className="text-sm font-medium">{entry.intensity}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDateTime(entry.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {entry.tags?.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {entry.tags && entry.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{entry.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {entry.notes}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moodEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              Emotion records tracked
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(moodEntries.map(entry => entry.userId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Users tracking emotions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Most Common Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-xl">😊</span>
              <div className="text-lg font-bold">Happy</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Across all users
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="gap-3">
              <p className="font-semibold text-2xl">Day Plan And Emotions Inputs</p>
              <p className='text-orange-400 text-lg font-bold'>Start your day with energy</p>
            </div>
            
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {canAccess ? <AdminDashboard /> : <EmotionInputForm />}
      </main>
    </div>
  );
};

export default EmotionTrackingApp;