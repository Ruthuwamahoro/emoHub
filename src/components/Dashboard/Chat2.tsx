"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
  User, Send, Image, Mic, Paperclip, Smile, MoreVertical,
  ThumbsUp, Heart, Bookmark, Reply, Edit, Trash2, Clock,
  CheckCheck
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  reactions?: { emoji: string; count: number }[];
  attachments?: { type: string; url: string; name: string }[];
  isRead: boolean;
}

const ChatMessage: React.FC<{ 
  message: Message; 
  isOwnMessage: boolean;
  onReact: (messageId: string, emoji: string) => void;
}> = ({ message, isOwnMessage, onReact }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className={`group flex items-end gap-2 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="w-8 h-8">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative rounded-2xl px-4 py-2 ${
            isOwnMessage 
              ? 'bg-blue-500 text-white rounded-br-sm' 
              : 'bg-gray-100 rounded-bl-sm'
          }`}
        >
          {/* Message Content */}
          <p className="text-sm">{message.content}</p>

          {/* Attachments Preview */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div 
                  key={index}
                  className="rounded-lg overflow-hidden bg-black/5 p-2 flex items-center gap-2"
                >
                  <Paperclip className="w-4 h-4 opacity-50" />
                  <span className="text-xs truncate">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Message Actions */}
          {showActions && (
            <div 
              className={`absolute ${
                isOwnMessage ? 'right-full mr-2' : 'left-full ml-2'
              } bottom-0 flex items-center gap-1`}
            >
              <div className="bg-white shadow-lg rounded-full p-1 flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-7 h-7 rounded-full hover:bg-gray-100"
                      onClick={() => onReact(message.id, '👍')}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Like</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-7 h-7 rounded-full hover:bg-gray-100"
                      onClick={() => onReact(message.id, '❤️')}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Love</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-7 h-7 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Reply className="w-4 h-4 mr-2" /> Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bookmark className="w-4 h-4 mr-2" /> Save
                    </DropdownMenuItem>
                    {isOwnMessage && (
                      <>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Reactions Display */}
          {message.reactions && message.reactions.length > 0 && (
            <div 
              className={`absolute bottom-0 ${
                isOwnMessage ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
              } translate-y-1/2`}
            >
              <div className="bg-white shadow-md rounded-full px-2 py-1 flex items-center gap-1">
                {message.reactions.map((reaction, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-xs">{reaction.emoji}</span>
                    <span className="text-xs text-gray-500 ml-1">{reaction.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Meta */}
        <div 
          className={`flex items-center gap-2 mt-1 text-xs text-gray-500
            ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
        >
          <span>{format(message.timestamp, 'h:mm a')}</span>
          {isOwnMessage && message.isRead && (
            <CheckCheck className="w-4 h-4 text-blue-500" />
          )}
        </div>
      </div>
    </div>
  );
};

const ChatInput: React.FC<{ onSend: (content: string) => void }> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Paperclip className="w-5 h-5 text-gray-500" />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full resize-none rounded-2xl border border-gray-200 pl-4 pr-12 py-3 max-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
          />
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-2 bottom-2 rounded-full"
          >
            <Smile className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSend}
          className="rounded-full"
          size="icon"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export const EnhancedChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'other',
      content: "Hi there! How are you feeling today?",
      timestamp: new Date(),
      type: 'text',
      isRead: true
    },
    {
      id: '2',
      senderId: 'user',
      content: "I'm doing better, thanks for asking! The exercises you suggested really helped.",
      timestamp: new Date(),
      type: 'text',
      reactions: [{ emoji: '👍', count: 1 }],
      isRead: true
    },
    {
      id: '3',
      senderId: 'other',
      content: "That's great to hear! I've attached some additional resources that might be helpful.",
      timestamp: new Date(),
      type: 'text',
      attachments: [
        { type: 'pdf', url: '#', name: 'Mindfulness_Exercises.pdf' }
      ],
      isRead: true
    }
  ]);

  const handleSend = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      content,
      timestamp: new Date(),
      type: 'text',
      isRead: false
    };
    setMessages([...messages, newMessage]);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions?.find(r => r.emoji === emoji);
        const updatedReactions = message.reactions || [];
        
        if (existingReaction) {
          existingReaction.count += 1;
        } else {
          updatedReactions.push({ emoji, count: 1 });
        }
        
        return { ...message, reactions: updatedReactions };
      }
      return message;
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === 'user'}
            onReact={handleReaction}
          />
        ))}
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
};

