import React from 'react';

const PaperBagsIcon = ({ size = 32, fill = '#1230f2ff', stroke = '#8b5e3c' }: {
  size?: number;
  fill?: string;
  stroke?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="10" y="12" width="28" height="30" rx="2" fill={fill} stroke={stroke} strokeWidth="2" />
    <path
      d="M14 12V8C14 6.9 14.9 6 16 6H32C33.1 6 34 6.9 34 8V12"
      stroke={stroke}
      strokeWidth="2"
    />
    <path d="M18 12L20 6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30 12L28 6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default PaperBagsIcon;
