import { Search, X } from 'lucide-react';
import { colors, mono } from '../landing/tokens';

interface DashboardControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'updatedAt' | 'sources' | 'title';
  onSortChange: (sort: 'updatedAt' | 'sources' | 'title') => void;
}

export default function DashboardControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: DashboardControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Bar Input */}
      <div className="relative w-full sm:w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93968F]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search workspaces or sources..."
          className="w-full pl-10 pr-9 py-2.5 bg-white rounded-full text-xs text-[#14171A] placeholder:text-[#93968F] focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 transition-all font-sans shadow-xs"
          style={{ border: `1px solid ${colors.hairlineStrong}` }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#93968F] hover:text-[#14171A] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div className="flex items-center space-x-2 text-xs text-[#5C6169] w-full sm:w-auto justify-end">
        <span style={mono} className="font-semibold text-[11px] uppercase tracking-wider">
          Sort by:
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'updatedAt' | 'sources' | 'title')}
          className="bg-white rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 text-xs text-[#14171A] font-medium cursor-pointer shadow-xs"
          style={{ border: `1px solid ${colors.hairlineStrong}` }}
        >
          <option value="updatedAt">Recently Updated</option>
          <option value="sources">Source Count</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
