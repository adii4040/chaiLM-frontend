import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  onOpenCreateModal: () => void;
}

export default function DashboardHeader({ onOpenCreateModal }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-chailm-panel border-b border-chailm-border px-6 flex items-center justify-between shrink-0 select-none sticky top-0 z-20">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/')}
          className="font-semibold text-chailm-textMain text-lg tracking-tight hover:text-chailm-accentBlue transition-colors cursor-pointer"
          title="Back to Landing Page"
        >
          <span>chaiLM</span>
        </button>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-chailm-card text-chailm-textMuted border border-chailm-border">
          Workspace Manager
        </span>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenCreateModal}
          className="flex items-center space-x-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue px-4 py-1.5 rounded-full text-xs font-medium border border-chailm-accentBlue/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Workspace</span>
        </button>
      </div>
    </header>
  );
}
