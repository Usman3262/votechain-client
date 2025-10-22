import React from 'react';

interface CandidateCardProps {
  id: number;
  name: string;
  votes?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  id, 
  name, 
  votes, 
  isSelected = false, 
  onSelect, 
  disabled = false 
}) => {
  return (
    <div 
      className={`p-6 border rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">Candidate #{id}</p>
        </div>
        {votes !== undefined && (
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">{votes}</p>
            <p className="text-xs text-gray-500">votes</p>
          </div>
        )}
      </div>
      {onSelect && (
        <div className="mt-4 flex justify-center">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-gray-300'
          }`}>
            {isSelected && (
              <div className="w-3 h-3 rounded-full bg-white"></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;