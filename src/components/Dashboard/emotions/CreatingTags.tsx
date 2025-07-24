import React, { useState, useRef, useEffect } from 'react';
import { useGetEmotionsTags } from '@/hooks/emotions/useGetEmotionsTags';

interface TagSelectorProps {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
    selectedTags,
    onTagsChange,
    placeholder = "Search or create tags..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: tagsResponse, isLoading } = useGetEmotionsTags();
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
        setSearchTerm('');
        setInputValue('');
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleCreateNewTag = () => {
        const newTag = searchTerm.trim();
        if (newTag && !selectedTags.includes(newTag)) {
            onTagsChange([...selectedTags, newTag]);
        }
        setSearchTerm('');
        setInputValue('');
        setIsOpen(false);
        inputRef.current?.focus();
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
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Delay closing to allow for dropdown clicks
        setTimeout(() => {
            if (!dropdownRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
                setSearchTerm('');
                setInputValue('');
            }
        }, 150);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
                setInputValue('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Input Container with Selected Tags */}
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                {/* Selected Tags */}
                {selectedTags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800 font-bold text-sm leading-none"
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
                    placeholder={selectedTags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-3 text-sm text-gray-500 text-center">
                            Loading tags...
                        </div>
                    ) : (
                        <>
                            {/* Create New Tag Option */}
                            {isNewTag && (
                                <button
                                    type="button"
                                    onClick={handleCreateNewTag}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                                >
                                    <span className="inline-flex items-center justify-center w-4 h-4 bg-green-100 text-green-600 rounded text-xs font-bold">
                                        +
                                    </span>
                                    Create <strong>"{searchTerm}"</strong>
                                </button>
                            )}

                            {/* Existing Tags */}
                            {filteredTags.length > 0 ? (
                                filteredTags.slice(0, 10).map((tag: string, index: number) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleTagSelect(tag)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <span className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 text-gray-600 rounded text-xs">
                                            #
                                        </span>
                                        {tag}
                                    </button>
                                ))
                            ) : !isNewTag && searchTerm ? (
                                <div className="p-3 text-sm text-gray-500 text-center">
                                    No tags found matching "{searchTerm}"
                                </div>
                            ) : !searchTerm && filteredTags.length === 0 && availableTags.length > 0 ? (
                                <div className="p-3 text-sm text-gray-500 text-center">
                                    All available tags are already selected
                                </div>
                            ) : !searchTerm ? (
                                <div className="p-3 text-sm text-gray-500 text-center">
                                    Start typing to search or create tags
                                </div>
                            ) : null}

                            {/* Show available tags when no search term */}
                            {!searchTerm && availableTags.length > 0 && filteredTags.length > 0 && (
                                <>
                                    <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
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
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <span className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 text-gray-600 rounded text-xs">
                                                    #
                                                </span>
                                                {tag}
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