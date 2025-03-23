import React from 'react';
import { Tag, X } from 'lucide-react';
import { styles, combineStyles } from '../styles/app-styles';

/**
 * KeywordTags component
 * Displays a list of keyword tags with selection functionality
 */
const KeywordTags = ({ 
  keywords = [], 
  selectedKeyword = null,
  onSelect = () => {},
  onRemove = null
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <h3 className={styles.text.heading4}>
          <Tag size={16} className="inline mr-2" />
          Active Keywords
        </h3>
        <span className="ml-2 text-sm text-[#9CA3AF]">
          {keywords.length} keywords tracked
        </span>
      </div>
      
      {keywords.length === 0 ? (
        <div className="bg-[#1F2937] rounded-md p-4 text-center">
          <p className="text-[#9CA3AF]">No keywords are being tracked</p>
          <p className="text-sm text-[#D1D5DB] mt-1">
            Add keywords using the search bar above
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className={combineStyles(
                "px-3 py-1.5 rounded-md flex items-center cursor-pointer group transition-colors",
                selectedKeyword === keyword.value
                  ? "bg-[#EAB308] text-black"
                  : "bg-[#374151] text-[#D1D5DB] hover:bg-[#4B5563]"
              )}
              onClick={() => onSelect(keyword.value)}
            >
              <Tag size={14} className="mr-1.5" />
              <span className="mr-1">{keyword.value}</span>
              
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(keyword.value);
                  }}
                  className={combineStyles(
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    selectedKeyword === keyword.value 
                      ? "text-black hover:text-[#111827]" 
                      : "text-[#9CA3AF] hover:text-[#F9FAFB]"
                  )}
                  title="Remove keyword"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordTags;