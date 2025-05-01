import React from 'react';
import { Coordinates } from './NmeaConverter';
import { History, Trash2 } from 'lucide-react';

interface HistoryPanelProps {
  history: Coordinates[];
  onItemClick: (item: Coordinates) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onItemClick, onClear }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-white shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <History className="mr-2 h-5 w-5" />
          Recent Locations
        </h2>
        <button 
          onClick={onClear}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white/100"
          title="Clear history"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {history.map((item, index) => (
          <button
            key={index}
            className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center group"
            onClick={() => onItemClick(item)}
          >
            <div>
              <div className="font-medium">{item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</div>
              <div className="text-xs text-white/60 truncate max-w-[300px]">{item.original}</div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300">
              Use
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;