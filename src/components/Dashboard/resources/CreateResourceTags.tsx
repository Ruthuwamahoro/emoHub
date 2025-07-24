import { useGetResourcesTags } from '@/hooks/users/resources/useCreateResourcesTags';
import React, { useState, useRef, useEffect } from 'react';

interface ResourceTagSelectorProps {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
}

export const ResourceTagSelector: React.FC<ResourceTagSelectorProps> = ({
    selectedTags,
    onTagsChange,
    placeholder = "Search or create resource tags..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: tagsResponse, isLoading } = useGetResourcesTags();
    const availableTags = tagsResponse?.data || [];

    // Filter tags based on search term and exclude already selected ones
    const filteredTags = availableTags.filter((tag: string) => 
        tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTags.includes(tag)
    );

    // Check if the current search term would create a new tag
    const isNewTag = searchTerm.trim() && 
        !availableTags.some((tag: string) => tag.toLowerCase() === searchTerm.toLowerCase()) &&
        !selectedTags.includes(searchTerm.trim());

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setSearchTerm(value);
        setIsOpen(true);
    };

    const handleTagSelect = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            onTagsChange([...selectedTags, tag]);
        }
        // Clear search but keep dropdown open for easier multiple selections
        setSearchTerm('');
        setInputValue('');
        // Keep dropdown open and maintain focus
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleCreateNewTag = () => {
        const newTag = searchTerm.trim();
        if (newTag && !selectedTags.includes(newTag)) {
            onTagsChange([...selectedTags, newTag]);
        }
        // Clear search but keep dropdown open for easier multiple selections
        setSearchTerm('');
        setInputValue('');
        // Keep dropdown open and maintain focus
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleTagRemove = (tagToRemove: string) => {
        onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isNewTag) {
                handleCreateNewTag();
            } else if (filteredTags.length > 0) {
                handleTagSelect(filteredTags[0]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            // Remove last tag when backspace is pressed on empty input
            handleTagRemove(selectedTags[selectedTags.length - 1]);
        } else if (e.key === 'ArrowDown' && isOpen && filteredTags.length > 0) {
            // Optional: Add keyboard navigation
            e.preventDefault();
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Reduced delay and only close if not interacting with dropdown
        setTimeout(() => {
            if (!dropdownRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
                // Don't clear search term on blur - let user continue where they left off
                // setSearchTerm('');
                // setInputValue('');
            }
        }, 100);
    };

    const handleDropdownToggle = () => {
        if (isOpen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
            inputRef.current?.focus();
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Don't clear search when clicking outside - preserve user's work
                // setSearchTerm('');
                // setInputValue('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className='block pb-2 font-semibold text-sm text-gray-700'>
                Tags
            </label>
            
            <div className={`
                relative flex flex-wrap gap-2 p-3 pr-10 border-2 rounded-lg min-h-[48px] bg-white 
                transition-all duration-200 ease-in-out
                ${isOpen 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400 shadow-sm'
                }
                focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:shadow-lg
            `}>
                {selectedTags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-150"
                    >
                        <span className="text-xs">#</span>
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 flex items-center justify-center w-4 h-4 text-blue-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-150 font-bold text-sm leading-none"
                            aria-label={`Remove ${tag} tag`}
                        >
                            ×
                        </button>
                    </span>
                ))}
                
                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={selectedTags.length === 0 ? placeholder : 'Add more...'}
                    className="flex-1 min-w-[140px] outline-none bg-transparent text-sm placeholder:text-gray-400"
                />

                {/* Dropdown Toggle Button */}
                <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className={`
                        absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center 
                        w-6 h-6 rounded-full transition-all duration-200 ease-in-out
                        ${isOpen 
                            ? 'bg-blue-100 text-blue-600 rotate-45' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                        }
                    `}
                    aria-label="Toggle dropdown"
                >
                    <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                    {isLoading ? (
                        <div className="p-4 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading tags...
                        </div>
                    ) : (
                        <>
                            {isNewTag && (
                                <button
                                    type="button"
                                    onClick={handleCreateNewTag}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 border-b border-gray-100 flex items-center gap-3 group transition-colors duration-150"
                                >
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-bold group-hover:bg-green-200 transition-colors duration-150">
                                        +
                                    </span>
                                    <span>Create <strong className="text-green-700">"{searchTerm}"</strong></span>
                                </button>
                            )}

                            {/* Existing Tags */}
                            {filteredTags.length > 0 ? (
                                filteredTags.slice(0, 10).map((tag: string, index: number) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleTagSelect(tag)}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 group transition-colors duration-150"
                                    >
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 rounded-full text-sm group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-150">
                                            #
                                        </span>
                                        <span className="group-hover:text-blue-700 transition-colors duration-150">{tag}</span>
                                    </button>
                                ))
                            ) : !isNewTag && searchTerm ? (
                                <div className="p-4 text-sm text-gray-500 text-center">
                                    <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <path d="m21 21-4.35-4.35"></path>
                                        </svg>
                                    </div>
                                    No tags found matching <strong>"{searchTerm}"</strong>
                                </div>
                            ) : !searchTerm && filteredTags.length === 0 && availableTags.length > 0 ? (
                                <div className="p-4 text-sm text-gray-500 text-center">
                                    <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    All available tags are already selected
                                </div>
                            ) : !searchTerm ? (
                                <div className="p-4 text-sm text-gray-500 text-center">
                                    <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 6L9 17l-5-5"></path>
                                        </svg>
                                    </div>
                                    Start typing to search or create tags
                                </div>
                            ) : null}

                            {!searchTerm && availableTags.length > 0 && filteredTags.length > 0 && (
                                <>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                                        Available Tags
                                    </div>
                                    {availableTags
                                        .filter((tag: string) => !selectedTags.includes(tag))
                                        .slice(0, 8)
                                        .map((tag: string, index: number) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleTagSelect(tag)}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 group transition-colors duration-150"
                                            >
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 rounded-full text-sm group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-150">
                                                    #
                                                </span>
                                                <span className="group-hover:text-blue-700 transition-colors duration-150">{tag}</span>
                                            </button>
                                        ))
                                    }
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};