import React from 'react';
import { Tag, X, Plus } from 'lucide-react';

/**
 * KeywordTags component displays active keywords with selection and removal functionality
 */
const KeywordTags = ({ 
  keywords = [], 
  selectedKeyword = null, 
  onSelect = () => {}, 
  onRemove = () => {},
  onAdd = () => {}
}) => {
  const hasKeywords = keywords.length > 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-400">Active Keywords</h3>
        {hasKeywords && (
          <button 
            onClick={onAdd}
            className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center"
          >
            <Plus size={14} className="mr-1" />
            Add New
          </button>
        )}
      </div>

      {hasKeywords ? (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <div 
              key={index} 
              className={`group flex items-center px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                selectedKeyword === keyword.value 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => onSelect(keyword.value)}
            >
              <Tag 
                size={14} 
                className={`mr-1.5 ${
                  selectedKeyword === keyword.value
                    ? 'text-black'
                    : 'text-gray-400'
                }`} 
              />
              <span className="text-sm">{keyword.value}</span>
              <button 
                className={`ml-2 opacity-70 hover:opacity-100 ${
                  selectedKeyword === keyword.value
                    ? 'hover:text-gray-800'
                    : 'hover:text-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(keyword.value);
                }}
                aria-label={`Remove ${keyword.value}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center border border-dashed border-gray-700 rounded-md h-16">
          <button 
            onClick={onAdd}
            className="flex items-center text-sm text-gray-400 hover:text-yellow-500"
          >
            <Plus size={16} className="mr-1" />
            Add keyword to track
          </button>
        </div>
      )}
    </div>
  );
};

export default KeywordTags;