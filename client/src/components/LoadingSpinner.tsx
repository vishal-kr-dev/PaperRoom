"use client";

import React from "react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "Loading...",
  className = "",
}) => {
  return (
    <div className={`relative flex items-center justify-center h-screen ${className}`}>
      <style jsx>{`
        .wifi-loader {
          --background: #62abff;
          --front-color: #4f29f0;
          --back-color: #c3c8de;
          --text-color: #414856;
          width: 64px;
          height: 64px;
          border-radius: 50px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wifi-loader svg {
          position: absolute;
        }

        .wifi-loader svg circle {
          fill: none;
          stroke-width: 6px;
          stroke-linecap: round;
          stroke-linejoin: round;
          transform: rotate(-100deg);
          transform-origin: center;
        }

        .wifi-loader svg circle.back {
          stroke: var(--back-color);
        }

        .wifi-loader svg circle.front {
          stroke: var(--front-color);
        }

        .wifi-loader svg.circle-outer {
          width: 86px;
          height: 86px;
        }

        .wifi-loader svg.circle-outer circle {
          stroke-dasharray: 62.75 188.25;
        }

        .wifi-loader svg.circle-outer circle.back {
          animation: circle-outer135 1.8s ease infinite 0.3s;
        }

        .wifi-loader svg.circle-outer circle.front {
          animation: circle-outer135 1.8s ease infinite 0.15s;
        }

        .wifi-loader svg.circle-middle {
          width: 60px;
          height: 60px;
        }

        .wifi-loader svg.circle-middle circle {
          stroke-dasharray: 42.5 127.5;
        }

        .wifi-loader svg.circle-middle circle.back {
          animation: circle-middle6123 1.8s ease infinite 0.25s;
        }

        .wifi-loader svg.circle-middle circle.front {
          animation: circle-middle6123 1.8s ease infinite 0.1s;
        }

        .wifi-loader svg.circle-inner {
          width: 34px;
          height: 34px;
        }

        .wifi-loader svg.circle-inner circle {
          stroke-dasharray: 22 66;
        }

        .wifi-loader svg.circle-inner circle.back {
          animation: circle-inner162 1.8s ease infinite 0.2s;
        }

        .wifi-loader svg.circle-inner circle.front {
          animation: circle-inner162 1.8s ease infinite 0.05s;
        }

        .wifi-loader .text {
          position: absolute;
          bottom: -40px;
          font-weight: 500;
          font-size: 14px;
          text-transform: lowercase;
          letter-spacing: 0.2px;
        }

        .wifi-loader .text::before,
        .wifi-loader .text::after {
          content: attr(data-text);
        }

        .wifi-loader .text::before {
          color: var(--text-color);
        }

        .wifi-loader .text::after {
          color: var(--front-color);
          animation: text-animation76 3.6s ease infinite;
          position: absolute;
          left: 0;
        }

        @keyframes circle-outer135 {
          0% {
            stroke-dashoffset: 25;
          }
          25% {
            stroke-dashoffset: 0;
          }
          65% {
            stroke-dashoffset: 301;
          }
          80% {
            stroke-dashoffset: 276;
          }
          100% {
            stroke-dashoffset: 276;
          }
        }

        @keyframes circle-middle6123 {
          0% {
            stroke-dashoffset: 17;
          }
          25% {
            stroke-dashoffset: 0;
          }
          65% {
            stroke-dashoffset: 204;
          }
          80% {
            stroke-dashoffset: 187;
          }
          100% {
            stroke-dashoffset: 187;
          }
        }

        @keyframes circle-inner162 {
          0% {
            stroke-dashoffset: 9;
          }
          25% {
            stroke-dashoffset: 0;
          }
          65% {
            stroke-dashoffset: 106;
          }
          80% {
            stroke-dashoffset: 97;
          }
          100% {
            stroke-dashoffset: 97;
          }
        }

        @keyframes text-animation76 {
          0% {
            clip-path: inset(0 100% 0 0);
          }
          50% {
            clip-path: inset(0);
          }
          100% {
            clip-path: inset(0 0 0 100%);
          }
        }
      `}</style>

      <div className="wifi-loader">
        <svg className="circle-outer" viewBox="0 0 86 86">
          <circle className="back" cx="43" cy="43" r="40" />
          <circle className="front" cx="43" cy="43" r="40" />
        </svg>
        <svg className="circle-middle" viewBox="0 0 60 60">
          <circle className="back" cx="30" cy="30" r="27" />
          <circle className="front" cx="30" cy="30" r="27" />
        </svg>
        <svg className="circle-inner" viewBox="0 0 34 34">
          <circle className="back" cx="17" cy="17" r="14" />
          <circle className="front" cx="17" cy="17" r="14" />
        </svg>
        <div className="text" data-text={text}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
