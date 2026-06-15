interface HeaderLogoProps {
  className?: string;
}

/** public/images/logo/jw-logo.svg — fill은 Header color(currentColor) 상속 */
export default function HeaderLogo({ className }: HeaderLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <text
        x="68"
        y="116"
        fill="currentColor"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: '112px',
          fontWeight: 400,
          letterSpacing: '-0.09em',
        }}
      >
        jw
      </text>
    </svg>
  );
}
