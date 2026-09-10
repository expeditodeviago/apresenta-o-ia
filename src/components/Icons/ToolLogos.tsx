import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const ObsidianLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M50 8L82 28L68 85L50 94L32 85L18 28L50 8Z"
      fill="#7C3AED"
      stroke="#A78BFA"
      strokeWidth="4"
    />
    <path
      d="M50 8L68 85L50 94L32 85L50 8Z"
      fill="#6D28D9"
      stroke="#C4B5FD"
      strokeWidth="2"
    />
    <path
      d="M50 8L82 28L68 85L50 48L50 8Z"
      fill="#8B5CF6"
    />
  </svg>
);

export const NotebookLMLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="15" y="15" width="70" height="70" rx="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="4" />
    <path d="M35 32H65" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
    <path d="M35 48H65" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
    <path d="M35 64H52" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
    <circle cx="68" cy="64" r="7" fill="#38BDF8" />
  </svg>
);

export const PerplexityLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="50" cy="50" r="40" fill="#0F172A" stroke="#22D3EE" strokeWidth="4" />
    <path
      d="M32 50L50 32L68 50L50 68L32 50Z"
      stroke="#22D3EE"
      strokeWidth="4"
      fill="none"
    />
    <path
      d="M50 20V80M20 50H80"
      stroke="#38BDF8"
      strokeWidth="3"
      strokeDasharray="4 4"
    />
  </svg>
);

export const CursorLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="15" y="15" width="70" height="70" rx="16" fill="#09090B" stroke="#60A5FA" strokeWidth="4" />
    <path
      d="M32 30L68 48L48 56L38 72L32 30Z"
      fill="#3B82F6"
      stroke="#93C5FD"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);

export const V0Logo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="15" y="15" width="70" height="70" rx="16" fill="#000000" stroke="#E2E8F0" strokeWidth="4" />
    <text
      x="50"
      y="62"
      fill="#FFFFFF"
      fontSize="36"
      fontWeight="900"
      fontFamily="monospace"
      textAnchor="middle"
    >
      v0
    </text>
  </svg>
);

export const DeepSeekLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="50" cy="50" r="40" fill="#0B132B" stroke="#60A5FA" strokeWidth="4" />
    <path
      d="M30 52C30 40 40 32 52 32C64 32 74 40 74 52C74 64 64 68 52 68C44 68 36 64 30 52Z"
      fill="#1D4ED8"
      stroke="#93C5FD"
      strokeWidth="3"
    />
    <circle cx="44" cy="46" r="3.5" fill="#FFFFFF" />
    <circle cx="58" cy="46" r="3.5" fill="#FFFFFF" />
  </svg>
);
