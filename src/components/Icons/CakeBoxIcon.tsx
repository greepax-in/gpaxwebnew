import React from 'react';

const CakeBoxIcon = ({ size = 32, fill = '#d7a86e', stroke = '#8b5e3c' }: {
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
    <rect x="12" y="14" width="24" height="20" fill={fill} stroke={stroke} strokeWidth="2" />
    <path
      d="M12 14 L24 8 L36 14 L24 20 Z"
      fill="#e8bf88"
      stroke={stroke}
      strokeWidth="2"
    />
    <path
      d="M36 14 V34 L24 40 V20 Z"
      fill="#c7955b"
      stroke={stroke}
      strokeWidth="2"
    />
  </svg>
);

export default CakeBoxIcon;