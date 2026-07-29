import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, User } from 'lucide-react';
import useCurrentUser from '../../modules/auth/query/useCurrentUser';
import { useLogout } from '../../modules/auth/mutation/useLogout';

interface DashboardHeaderProps {
  onOpenCreateModal: () => void;
}

export default function DashboardHeader({ onOpenCreateModal }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { data: userData } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const user = userData?.user;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

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

        {user && (
          <div className="flex items-center space-x-3 border-l border-chailm-border pl-3">
            <div className="flex items-center space-x-2 bg-chailm-card px-2.5 py-1 rounded-full border border-chailm-border text-xs">
              <div className="w-5 h-5 rounded-full bg-chailm-accentBlue/20 border border-chailm-accentBlue/40 flex items-center justify-center text-chailm-accentBlue font-semibold text-[10px]">
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="text-chailm-textMain font-medium max-w-[120px] truncate">
                {user.fullname}
              </span>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Logout"
              className="p-1.5 text-chailm-textMuted hover:text-rose-400 hover:bg-rose-500/10 rounded-full border border-chailm-border transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
