import React from 'react';

const PaperCoversIcon = ({ size = 32, fill = '#0a3ee8ff', stroke = '#b0885c' }: {
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
    <rect x="10" y="10" width="28" height="20" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
    <path
      d="M10 30 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2"
      stroke={stroke}
      strokeWidth="1.2"
      fill="none"
    />
    <path
      d="M12 12 l24 0 l0 16"
      stroke="#d6b27c"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

export default PaperCoversIcon;
