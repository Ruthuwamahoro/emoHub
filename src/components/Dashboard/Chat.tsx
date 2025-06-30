"use client"
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Send, Image, Mic, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'image' | 'emergency';
  sentiment?: 'neutral' | 'distressed' | 'positive';
  isRead: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  role: 'user' | 'specialist' | 'peer';
  isOnline: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
}

interface Props {
  currentUser: ChatUser;
  recipient: ChatUser;
}

export const MentalHealthChat: React.FC<Props> = ({ currentUser, recipient }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  const sampleMessages: Message[] = [
    {
      id: '1',
      senderId: recipient.id,
      content: "Hi, how are you feeling today?",
      timestamp: new Date(),
      type: 'text',
      sentiment: 'neutral',
      isRead: true
    },
    {
      id: '2',
      senderId: currentUser.id,
      content: "I'm feeling quite anxious today...",
      timestamp: new Date(),
      type: 'text',
      sentiment: 'distressed',
      isRead: true
    }
  ];

  useEffect(() => {
    setMessages(sampleMessages);
  }, []);

  const analyzeSentiment = (content: string): 'neutral' | 'distressed' | 'positive' => {
    const distressWords = ['anxiety', 'anxious', 'depressed', 'sad', 'suicidal', 'hopeless'];
    const positiveWords = ['happy', 'better', 'grateful', 'thankful', 'hopeful'];
    
    const lowerContent = content.toLowerCase();
    
    if (distressWords.some(word => lowerContent.includes(word))) {
      return 'distressed';
    }
    if (positiveWords.some(word => lowerContent.includes(word))) {
      return 'positive';
    }
    return 'neutral';
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const sentiment = analyzeSentiment(newMessage);
    
    if (sentiment === 'distressed') {
      setShowEmergencyAlert(true);
    }

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      sentiment: sentiment,
      isRead: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <Card className="mb-4">
        <CardContent className="flex items-center p-4">
          <User className="w-8 h-8 mr-2" />
          <div>
            <h3 className="font-semibold">{recipient.name}</h3>
            <p className="text-sm text-gray-500">
              {recipient.role === 'specialist' ? 'Mental Health Specialist' : 'Peer Support'}
              {recipient.isOnline ? ' · Online' : ' · Offline'}
            </p>
          </div>
        </CardContent>
      </Card>

      {showEmergencyAlert && (
        <Alert className="mb-4 bg-red-50">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            It seems you might be going through a difficult time. Would you like to:
            <div className="mt-2">
              <Button variant="destructive" className="mr-2">
                Contact Crisis Support
              </Button>
              <Button variant="outline" onClick={() => setShowEmergencyAlert(false)}>
                Continue Chat
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === currentUser.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-auto">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Image className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Mic className="w-4 h-4" />
            </Button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* <div>
       <EnhancedChat /> 
      </div> */}
    </div>
  );
};

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'image' | 'emergency';
  sentiment?: 'neutral' | 'distressed' | 'positive';
  isRead: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  role: 'user' | 'specialist' | 'peer';
  isOnline: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
  avatar?: string;
  unreadCount?: number;
  lastMessage?: Message;
}

interface ConversationListProps {
  conversations: ChatUser[];
  currentUser: ChatUser;
  onSelectUser: (user: ChatUser) => void;
  selectedUserId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectUser,
  selectedUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    setFilteredConversations(
      conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, conversations]);

  return (
    <div className="w-80 border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedUserId === user.id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <User className="w-10 h-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{user.name}</h3>
                  {user.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {new Date(user.lastMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage?.content || 'No messages yet'}
                  </p>
                  {user.unreadCount ? (
                    <Badge variant="destructive" className="ml-2">
                      {user.unreadCount}
                    </Badge>
                  ) : null}
                </div>
                <span className="text-xs text-gray-400">
                  {user.role === 'specialist' ? 'Mental Health Specialist' : 'Peer Support'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full">
          <Bell className="w-4 h-4 mr-2" />
          Notification Settings
        </Button>
      </div>
    </div>
  );
};

export const MentalHealthChatLayout: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  
  const currentUser: ChatUser = {
    id: '1',
    name: 'John Doe',
    role: 'user',
    isOnline: true,
  };

  const sampleConversations: ChatUser[] = [
    {
      id: '2',
      name: 'Dr. Sarah Smith',
      role: 'specialist',
      isOnline: true,
      unreadCount: 2,
      lastMessage: {
        id: '1',
        senderId: '2',
        content: 'How are you feeling today?',
        timestamp: new Date(),
        type: 'text',
        isRead: false,
      },
    },
    {
      id: '3',
      name: 'Support Group A',
      role: 'peer',
      isOnline: true,
      unreadCount: 5,
      lastMessage: {
        id: '2',
        senderId: '3',
        content: 'Thank you for sharing your experience...',
        timestamp: new Date(),
        type: 'text',
        isRead: false,
      },
    },
    {
      id: '4',
      name: 'Mike Johnson',
      role: 'peer',
      isOnline: false,
      lastMessage: {
        id: '3',
        senderId: '4',
        content: 'I understand how you feel...',
        timestamp: new Date(),
        type: 'text',
        isRead: true,
      },
    },
  ];

  return (
    <div className="flex h-screen">
      <ConversationList
        conversations={sampleConversations}
        currentUser={currentUser}
        onSelectUser={setSelectedUser}
        selectedUserId={selectedUser?.id}
      />

      {selectedUser ? (
        <div className="flex-1">
          <MentalHealthChat currentUser={currentUser} recipient={selectedUser} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600">
              Select a conversation to start messaging
            </h2>
            <p className="text-gray-500 mt-2">
              Choose from your existing conversations or start a new one
            </p>
          </div>
        </div>
      )}
    </div>
  );
};



