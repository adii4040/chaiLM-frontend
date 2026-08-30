import { useRef, type AnchorHTMLAttributes, type ReactNode, type CSSProperties, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { colors, mono } from "./tokens";
import { framerSmoothScrollTo } from "./smoothScroll";

interface MagneticButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  to?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  reducedMotion?: boolean;
}

export function MagneticButton({
  href,
  to,
  children,
  className = "",
  style: styleProp = {},
  reducedMotion,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      framerSmoothScrollTo(href, 80);
    }
  };

  const commonProps = {
    ref,
    onMouseMove,
    onMouseLeave,
    onClick: handleClick,
    className: `inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-transform duration-150 select-none ${className}`,
    style: { willChange: "transform", ...styleProp },
    ...props,
  };

  if (to) {
    return (
      <Link to={to} {...commonProps}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href || "#"} {...commonProps}>
      {children}
    </a>
  );
}

export function Pill({
  children,
  style,
  className = "",
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${className}`}
      style={{
        border: `1px solid ${colors.hairlineStrong}`,
        color: colors.slate,
        background: colors.surface,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function ExhibitStamp({
  children,
  pulse,
  small,
}: {
  children: ReactNode;
  pulse?: boolean;
  small?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] font-semibold exhibit-stamp ${small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
        } ${pulse ? "stamp-in" : ""}`}
      style={{
        ...mono,
        color: colors.verified,
        background: colors.verifiedSoft,
        border: `1px solid ${colors.verifiedBorder}`,
      }}
    >
      <span className="exhibit-notch" aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-xs font-semibold tracking-[0.18em] mb-3"
      style={{ ...mono, color: colors.slateFaint }}
    >
      {children}
    </p>
  );
}
