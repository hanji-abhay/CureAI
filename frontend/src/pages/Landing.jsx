import { useEffect } from "react";
import "../Landing.css";

const neurons = [
  [4, 18, 1],
  [11, 10, 0.7],
  [16, 27, 1.2],
  [8, 43, 0.8],
  [20, 52, 1],
  [5, 68, 1.1],
  [15, 80, 0.7],
  [25, 14, 0.8],
  [28, 39, 1.2],
  [32, 72, 0.9],
  [38, 8, 0.7],
  [42, 24, 1],
  [37, 48, 0.8],
  [45, 65, 1.1],
  [34, 90, 0.8],
  [55, 12, 1],
  [60, 30, 0.7],
  [52, 48, 1.2],
  [63, 60, 0.8],
  [55, 83, 1],
  [70, 8, 0.8],
  [76, 22, 1.1],
  [68, 40, 0.7],
  [80, 51, 1],
  [72, 73, 1.2],
  [88, 15, 0.8],
  [94, 33, 1],
  [90, 64, 0.7],
  [83, 87, 1],
  [96, 82, 0.9],
];

const connections = [
  [0, 1],
  [0, 3],
  [1, 2],
  [1, 9],
  [2, 3],
  [2, 8],
  [3, 4],
  [4, 5],
  [4, 8],
  [4, 9],
  [5, 6],
  [6, 9],
  [7, 8],
  [7, 10],
  [8, 9],
  [8, 12],
  [9, 13],
  [10, 11],
  [10, 14],
  [11, 12],
  [11, 15],
  [12, 13],
  [12, 17],
  [13, 14],
  [13, 18],
  [14, 19],
  [15, 16],
  [15, 20],
  [16, 17],
  [16, 21],
  [17, 18],
  [17, 22],
  [18, 19],
  [18, 22],
  [19, 24],
  [20, 21],
  [20, 25],
  [21, 22],
  [21, 25],
  [22, 23],
  [22, 26],
  [23, 24],
  [23, 27],
  [24, 28],
  [24, 29],
  [25, 26],
  [26, 27],
  [27, 28],
  [28, 29],
];

function NeuralNetwork() {
  return (
    <svg
      className="neural-network"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className="neural-connections">
        {connections.map(([from, to], index) => (
          <line
            key={index}
            x1={neurons[from][0]}
            y1={neurons[from][1]}
            x2={neurons[to][0]}
            y2={neurons[to][1]}
            style={{ animationDelay: `${(index % 9) * 100}ms` }}
          />
        ))}
      </g>

      <g className="neural-nodes">
        {neurons.map(([x, y, radius], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={radius * 0.32}
            style={{ animationDelay: `${(index % 7) * 180}ms` }}
          />
        ))}
      </g>
    </svg>
  );
}

function TracedC() {
  return (
    <svg
      className="traced-c"
      viewBox="0 0 120 140"
      fill="none"
      aria-label="CureAI"
    >
      <defs>
        <linearGradient id="cureai-stroke" x1="15" y1="8" x2="95" y2="130">
          <stop offset="0%" stopColor="#B8FFE6" />
          <stop offset="55%" stopColor="#64E8C2" />
          <stop offset="100%" stopColor="#24B89C" />
        </linearGradient>

        <filter id="cureai-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        className="c-trace-glow"
        d="M 91 22 C 75 7, 48 7, 29 24 C 7 44, 7 96, 29 116 C 48 133, 75 133, 91 118"
      />

      <path
        className="c-trace-line"
        d="M 91 22 C 75 7, 48 7, 29 24 C 7 44, 7 96, 29 116 C 48 133, 75 133, 91 118"
      />

      <circle className="c-trace-end" cx="91" cy="118" r="3.5" />
    </svg>
  );
}

export default function Landing({ onComplete }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      onComplete?.();
      return;
    }

    let completionTimer;

    const finishTimer = window.setTimeout(() => {
      completionTimer = window.setTimeout(() => {
        onComplete?.();
      }, 650);
    }, 5000);

    return () => {
      window.clearTimeout(finishTimer);

      if (completionTimer !== undefined) {
        window.clearTimeout(completionTimer);
      }
    };
  }, [onComplete]);

  return (
    <div className="landing-intro" aria-label="CureAI introduction">
      <NeuralNetwork />

      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-aura intro-aura--one" />
      <div className="intro-aura intro-aura--two" />

      <div className="intro-brand" aria-hidden="true">
        <div className="intro-c-wrap">
          <TracedC />
        </div>

        <div className="intro-wordmark">
          <span className="intro-wordmark-rest">ureAI</span>
        </div>
      </div>

      <div className="intro-tagline" aria-hidden="true">
        INTELLIGENCE FOR WELLNESS
      </div>

      <div className="intro-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
