import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, User } from 'lucide-react';
import useCurrentUser from '../../modules/auth/query/useCurrentUser';
import { useLogout } from '../../modules/auth/mutation/useLogout';
import { colors, serif, mono } from '../landing/tokens';

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
    <header
      className="h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none sticky top-0 z-30 backdrop-blur-md transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        borderBottom: `1px solid ${colors.hairline}`,
      }}
    >
      {/* Left Brand Area */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <button
          onClick={() => navigate('/')}
          className="text-lg sm:text-xl font-bold tracking-tight transition-opacity hover:opacity-80 cursor-pointer shrink-0"
          style={serif}
          title="Back to Landing Page"
        >
          chai<span style={{ color: colors.verified }}>LM</span>
        </button>
        <span
          className="hidden sm:inline-block text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full truncate"
          style={{
            ...mono,
            background: colors.surface2,
            color: colors.slate,
            border: `1px solid ${colors.hairline}`,
          }}
        >
          Workspace Manager
        </span>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <button
          onClick={onOpenCreateModal}
          className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          style={{ background: colors.verified }}
          title="Create New Workspace"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>New Workspace</span>
        </button>

        {user && (
          <div className="flex items-center space-x-1.5 sm:space-x-3 border-l pl-2 sm:pl-3" style={{ borderColor: colors.hairline }}>
            <div
              className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs max-w-[130px] sm:max-w-[200px]"
              style={{
                background: colors.surface2,
                border: `1px solid ${colors.hairline}`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                style={{ background: colors.cobalt }}
              >
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="font-semibold text-[#14171A] truncate text-[11px] sm:text-xs hidden sm:inline">
                {user.fullname}
              </span>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Logout"
              className="p-1.5 sm:p-2 rounded-full text-[#5C6169] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              style={{ border: `1px solid ${colors.hairline}` }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
