import React from 'react';
import { X } from 'lucide-react';

const KeywordTags = ({ 
  keywords = ["carbon insetting", "sustainable logistics", "scope 3 emissions"],
  selectedKeyword,
  onSelect,
  onRemove
}) => {
  
  const handleKeywordClick = (keyword) => {
    if (onSelect) {
      onSelect(keyword);
    }
  };
  
  const handleRemoveClick = (e, keyword) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    if (onRemove) {
      onRemove(keyword);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-400">Tracked Keywords</h2>
        <span className="text-xs text-gray-500">{keywords.length} keywords</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            onClick={() => handleKeywordClick(keyword)}
            className={`
              flex items-center px-3 py-1.5 rounded-full cursor-pointer transition-colors
              ${selectedKeyword === keyword 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'}
            `}
          >
            <span className="text-sm">{keyword}</span>
            <button
              onClick={(e) => handleRemoveClick(e, keyword)}
              className={`ml-2 p-0.5 rounded-full hover:bg-opacity-20 ${
                selectedKeyword === keyword ? 'hover:bg-black' : 'hover:bg-white'
              }`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordTags;