import React from "react";
import { Meteors } from "../ui/meteors";
import { FaHeart, FaComment, FaShare, FaBookmark } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import { RiMentalHealthFill } from "react-icons/ri";
import { formatDistanceToNow } from 'date-fns';

export function MeteorsDemo() {
  const postDate = new Date('2024-03-18T10:30:00');
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });

  return (
    <div className="w-full flex items-center pl-5 pr-10 py-5">
      <div className="w-full relative">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-100 to-blue-100 transform scale-[0.80] rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-6 h-full overflow-hidden rounded-2xl flex flex-col">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4 relative z-50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold">Sarah Johnson</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">@mindfuljourney</span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{timeAgo}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RiMentalHealthFill className="text-purple-400 h-5 w-5" />
              <BsThreeDots className="text-gray-400 h-5 w-5 cursor-pointer" />
            </div>
          </div>

          {/* Content Section */}
          <div className="mb-6 relative z-50">
            <h1 className="font-bold text-xl text-white mb-4">
              Finding Peace in the Chaos: My Mental Health Journey
            </h1>
            <p className="font-normal text-base text-gray-300 leading-relaxed">
              Today marks a significant milestone in my mental health journey. I've learned that it's okay not to be okay, and seeking help is a sign of strength, not weakness. Through therapy, mindfulness, and self-care practices, I'm discovering new ways to cope with anxiety and stress. Remember, your mental health matters, and you're never alone in this journey. 🌱✨
            </p>
          </div>

          {/* Footer Section */}
          <div className="flex justify-between items-center relative z-50">
            <div className="flex gap-6">
              <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
                <FaHeart className="h-5 w-5" />
                <span className="text-sm">2.4K</span>
              </button>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <FaComment className="h-5 w-5" />
                <span className="text-sm">156</span>
              </button>
              <button className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                <FaShare className="h-5 w-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>
            <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
              <FaBookmark className="h-5 w-5" />
            </button>
          </div>

          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}

