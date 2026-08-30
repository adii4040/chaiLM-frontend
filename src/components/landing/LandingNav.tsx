import { type ReactNode, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { colors, serif, EASE } from "./tokens";
import { MagneticButton } from "./SharedAtoms";
import { framerSmoothScrollTo } from "./smoothScroll";

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
      className="relative group py-1 text-sm font-medium cursor-pointer"
      style={{ color: colors.slate }}
    >
      <span className="group-hover:text-[#14171A] transition-colors">{children}</span>
      <span
        className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: colors.cobalt }}
      />
    </a>
  );
}

export function LandingNav({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.header
      initial={reducedMotion ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ background: "rgba(245,246,244,0.88)", borderBottom: `1px solid ${colors.hairline}` }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight" style={serif}>
          chai<span style={{ color: colors.verified }}>LM</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="#how">How It Works</NavLink>
          <NavLink href="#pipeline">Retrieval Pipeline</NavLink>
          <NavLink href="#compare">Comparison</NavLink>
          <NavLink href="#demo">Workspaces</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium hidden sm:inline text-[#5C6169] hover:text-[#14171A] transition-colors"
          >
            Sign In
          </Link>
          <MagneticButton
            to="/signup"
            reducedMotion={reducedMotion}
            style={{ background: colors.cobalt, color: "#fff", padding: "0.55rem 1.25rem", fontSize: "0.875rem" }}
          >
            Get Started <ArrowRight size={14} />
          </MagneticButton>
        </div>
      </div>
    </motion.header>
  );
}
