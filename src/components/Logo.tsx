type Props = {
  size?: number;
  className?: string;
  title?: string;
};

export function Logo({ size = 24, className, title }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      <defs>
        <linearGradient id="fj-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d="M8 32 C 16 14, 38 14, 46 28 L 58 18 L 54 32 L 58 46 L 46 36 C 38 50, 16 50, 8 32 Z"
        fill="url(#fj-body)"
      />
      <circle cx="18" cy="28" r="2.4" fill="white" />
      <path
        d="M30 32 q 4 -4 10 -4"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
