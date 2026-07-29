import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, LogOut, User } from 'lucide-react';
import useCurrentUser from '../../modules/auth/query/useCurrentUser';
import { useLogout } from '../../modules/auth/mutation/useLogout';

export default function LandingHeader() {
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
    <header className="h-16 bg-chailm-panel/80 backdrop-blur-md border-b border-chailm-border sticky top-0 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Link to="/" className="font-semibold text-chailm-textMain text-xl tracking-tight">
          chaiLM
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-xs font-medium text-chailm-textMuted">
        <a href="#features" className="hover:text-chailm-textMain transition-colors">
          Architecture
        </a>
        <a href="#sandbox" className="hover:text-chailm-textMain transition-colors">
          Interactive Demo
        </a>
        <a href="#stack" className="hover:text-chailm-textMain transition-colors">
          Tech Stack
        </a>
      </div>

      <div className="flex items-center space-x-3">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-chailm-card px-3 py-1.5 rounded-full border border-chailm-border text-xs">
              <div className="w-5 h-5 rounded-full bg-chailm-accentBlue/20 border border-chailm-accentBlue/40 flex items-center justify-center text-chailm-accentBlue font-semibold text-[10px]">
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="text-chailm-textMain font-medium max-w-[120px] truncate">
                {user.fullname}
              </span>
            </div>

            <button
              onClick={() => navigate('/workspace')}
              className="flex items-center space-x-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue px-4 py-2 rounded-full text-xs font-medium border border-chailm-accentBlue/30 transition-all cursor-pointer"
            >
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Logout"
              className="p-2 text-chailm-textMuted hover:text-rose-400 hover:bg-rose-500/10 rounded-full border border-chailm-border transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-xs font-medium text-chailm-textMuted hover:text-chailm-textMain transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => navigate('/workspace')}
              className="flex items-center space-x-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue px-4 py-2 rounded-full text-xs font-medium border border-chailm-accentBlue/30 transition-all cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
