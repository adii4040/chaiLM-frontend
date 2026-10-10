import { useState, type ReactNode, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { colors, serif, mono, EASE } from "./tokens";
import { framerSmoothScrollTo } from "./smoothScroll";
import useCurrentUser from "../../modules/auth/query/useCurrentUser";
import { useLogout } from "../../modules/auth/mutation/useLogout";

function NavLink({ children, href, onClick }: { children: ReactNode; href: string; onClick?: () => void }) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      framerSmoothScrollTo(href, 80);
      if (onClick) onClick();
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: userData } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const user = userData?.user;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/");
        setMobileMenuOpen(false);
      },
    });
  };

  const navLinks = [
    { label: "What is ChaiLM", href: "#what-is-chailm" },
    { label: "How It Works", href: "#how" },
    { label: "Retrieval Pipeline", href: "#pipeline" },
    { label: "Studio", href: "#studio" },
    { label: "Comparison", href: "#compare" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <motion.header
        initial={reducedMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="h-16 w-full px-4 sm:px-6 flex items-center justify-between shrink-0 select-none sticky top-0 z-50 backdrop-blur-md"
        style={{
          background: "rgba(255, 255, 255, 0.94)",
          borderBottom: `1px solid ${colors.hairline}`,
        }}
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight transition-opacity hover:opacity-80 cursor-pointer"
            style={serif}
          >
            chai<span style={{ color: colors.verified }}>LM</span>
          </Link>
        </div>

        {/* Middle: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions matching DashboardHeader */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {user ? (
            <>
              {/* Go to Workspaces Button */}
              <Link
                to="/workspace"
                className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                style={{ background: colors.verified }}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Workspaces</span>
              </Link>

              {/* User Profile & Logout Container matching DashboardHeader */}
              <div className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-3" style={{ borderColor: colors.hairline }}>
                <div
                  className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs max-w-[130px] sm:max-w-[180px]"
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
            </>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-[#5C6169] hover:text-[#14171A] transition-colors px-1"
                style={mono}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                style={{ background: colors.verified }}
              >
                <span>Get Started</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#5C6169] hover:text-[#14171A] hover:bg-[#F5F6F4] rounded-xl transition cursor-pointer lg:hidden ml-1 border border-[#E2E4E1]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="lg:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-xl border-b border-[#E2E4E1] shadow-2xl z-40 p-5 space-y-4"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      framerSmoothScrollTo(link.href, 80);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#14171A] hover:bg-[#F0F1EE] hover:text-[#1F7A5C] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#E2E4E1] flex items-center justify-between gap-3">
              {user ? (
                <Link
                  to="/workspace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm"
                  style={{ background: colors.verified }}
                >
                  <LayoutDashboard size={14} />
                  <span>Open Workspaces</span>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 w-full">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-[#14171A] bg-[#F0F1EE] hover:bg-[#E2E4E1] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm"
                    style={{ background: colors.verified }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
