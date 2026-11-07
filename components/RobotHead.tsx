// Tiny robot head: blinking LED eyes + pulsing antenna (animated in globals.css).
export function RobotHead({ className = "af-bot", color = "#09090b" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="12" y1="2.6" x2="12" y2="6.4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle className="af-ant" cx="12" cy="2.6" r="1.7" fill="#ff3b2f" />
      <rect x="3.5" y="6.4" width="17" height="14" rx="4" fill={color} />
      <rect className="af-led" x="7.2" y="11" width="3.4" height="4.2" rx="1.2" fill="#67e8f9" />
      <rect className="af-led" x="13.4" y="11" width="3.4" height="4.2" rx="1.2" fill="#67e8f9" />
      <rect x="9.2" y="17.2" width="5.6" height="1.2" rx="0.6" fill="#71717a" />
    </svg>
  );
}
