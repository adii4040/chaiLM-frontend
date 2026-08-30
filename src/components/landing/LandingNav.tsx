import { type ReactNode, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, LogOut, LayoutDashboard } from "lucide-react";
import { colors, serif, mono, EASE } from "./tokens";
import { framerSmoothScrollTo } from "./smoothScroll";
import useCurrentUser from "../../modules/auth/query/useCurrentUser";
import { useLogout } from "../../modules/auth/mutation/useLogout";

function NavLink({ children, href }: { children: ReactNode; href: string }) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      framerSmoothScrollTo(href, 80);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="relative group py-1 text-xs md:text-sm font-medium cursor-pointer"
      style={{ color: colors.slate }}
    >
      <span className="group-hover:text-[#14171A] transition-colors">{children}</span>
      <span
        className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: colors.verified }}
      />
    </a>
  );
}

export function LandingNav({ reducedMotion }: { reducedMotion: boolean }) {
  const navigate = useNavigate();
  const { data: userData } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const user = userData?.user;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <motion.header
      initial={reducedMotion ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="h-16 w-full px-6 flex items-center justify-between shrink-0 select-none sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        borderBottom: `1px solid ${colors.hairline}`,
      }}
    >
      {/* Left: Brand Logo */}
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80 cursor-pointer"
          style={serif}
        >
          chai<span style={{ color: colors.verified }}>LM</span>
        </Link>
      </div>

      {/* Middle: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-7">
        <NavLink href="#what-is-chailm">What is ChaiLM</NavLink>
        <NavLink href="#how">How It Works</NavLink>
        <NavLink href="#pipeline">Retrieval Pipeline</NavLink>
        <NavLink href="#studio">Studio</NavLink>
        <NavLink href="#compare">Comparison</NavLink>
        <NavLink href="#faq">FAQ</NavLink>
      </nav>

      {/* Right: Actions matching DashboardHeader */}
      <div className="flex items-center space-x-3">
        {user ? (
          <>
            {/* Go to Workspaces Button */}
            <Link
              to="/workspaces"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{ background: colors.verified }}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Workspaces</span>
            </Link>

            {/* User Profile & Logout Container matching DashboardHeader */}
            <div className="flex items-center space-x-3 border-l pl-3" style={{ borderColor: colors.hairline }}>
              <div
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: colors.surface2,
                  border: `1px solid ${colors.hairline}`,
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                  style={{ background: colors.cobalt }}
                >
                  {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                </div>
                <span className="font-semibold text-[#14171A] max-w-[140px] truncate hidden sm:inline">
                  {user.fullname}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Logout"
                className="p-2 rounded-full text-[#5C6169] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                style={{ border: `1px solid ${colors.hairline}` }}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-xs md:text-sm font-semibold text-[#5C6169] hover:text-[#14171A] transition-colors"
              style={mono}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{ background: colors.verified }}
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </motion.header>
  );
}
