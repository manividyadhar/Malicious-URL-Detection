import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="URL Detector Logo"
            role="img"
        >
            <title>URL Detector - Security Shield Logo</title>
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#4352b9" />
                </linearGradient>
            </defs>
            {/* Shield Base */}
            <path
                d="M20 2C13 4.5 10 7 6 7.5V18C6 26.5 12 32.5 20 38C28 32.5 34 26.5 34 18V7.5C30 7 27 4.5 20 2Z"
                fill="url(#logo-gradient)"
                stroke="white"
                strokeWidth="1"
            />
            {/* Link Chain Icon */}
            <g transform="translate(10, 12) scale(0.8)">
                <path
                    d="M10.5 13H15M8 10V16C8 18.2091 9.79086 20 12 20H18C20.2091 20 22 18.2091 22 16V10C22 7.79086 20.2091 6 18 6H12C9.79086 6 8 7.79086 8 10ZM3 10V16C3 18.2091 4.79086 20 7 20H8V22H7C3.68629 22 1 19.3137 1 16V10C1 6.68629 3.68629 4 7 4H8V6H7C4.79086 6 3 7.79086 3 10ZM17 4H18C21.3137 4 24 6.68629 24 10V16C24 19.3137 21.3137 22 18 22H17V20H18C20.2091 20 22 18.2091 22 16V10C22 7.79086 20.2091 6 18 6H17V4Z"
                    fill="white"
                />
            </g>
        </svg>
    );
};

export default Logo;
