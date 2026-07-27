import { Search, X } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Search Bar Input */}
      <div className="relative w-full sm:w-96">
        <Search className="w-4 h-4 text-chailm-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search workspaces or sources..."
          className="w-full pl-10 pr-4 py-2 bg-chailm-panel border border-chailm-border rounded-full text-xs text-chailm-textMain placeholder-chailm-textMuted focus:outline-none focus:border-chailm-accentBlue font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-chailm-textMuted hover:text-chailm-textMain cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div className="flex items-center space-x-2 text-xs text-chailm-textMuted w-full sm:w-auto justify-end">
        <span>Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'updatedAt' | 'sources' | 'title')}
          className="bg-chailm-panel border border-chailm-border text-chailm-textMain rounded-xl px-3 py-1.5 focus:outline-none focus:border-chailm-accentBlue text-xs cursor-pointer"
        >
          <option value="updatedAt">Recently Updated</option>
          <option value="sources">Source Count</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
