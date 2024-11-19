"use client";
import React, { useState } from "react";
import { MeteorsDemo } from "./Posts";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-lg transition-colors",
      active 
        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
        : "text-gray-400 hover:text-white"
    )}
  >
    {children}
  </button>
);

export function  Dashboard(){
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("new");
  const postsPerPage = 3;

  // Sample posts data for each tab
  const posts = {
    new: Array(15).fill(null),
    popular: Array(12).fill(null),
    trending: Array(18).fill(null)
  };

  const tabs = [
    { id: "new", label: "New Posts" },
    { id: "popular", label: "Popular" },
    { id: "trending", label: "Trending" }
  ];

  // Calculate total pages based on active tab's post count
  const totalPosts = posts[activeTab].length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Calculate current page's posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts[activeTab].slice(indexOfFirstPost, indexOfLastPost);

  // Calculate the range of pages to show
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="w-full flex flex-col gap-6">
        {/* Tabs Navigation */}
        <div className="flex gap-4 px-8">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1); // Reset to first page when changing tabs
              }}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="space-y-6 mb-12">
          {currentPosts.map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MeteorsDemo />
            </motion.div>
          ))}
        </div>

        {/* Pagination Container */}
        <div className="flex justify-center items-center mt-10">
          <div className="bg-gray-900/50 p-4 rounded-xl backdrop-blur-lg border border-gray-700 shadow-2xl">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-2 rounded-lg",
                  currentPage === 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-gray-700"
                )}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="text-gray-500 px-3">...</span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(page)}
                        className="relative w-10 h-10 rounded-lg font-medium transition-all duration-200"
                      >
                        {currentPage === page && (
                          <motion.div
                            layoutId="activePage"
                            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"
                            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                          />
                        )}
                        <span className={cn(
                          "relative z-10",
                          currentPage === page
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        )}>
                          {page}
                        </span>
                      </motion.button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-2 rounded-lg",
                  currentPage === totalPages
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-gray-700"
                )}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};