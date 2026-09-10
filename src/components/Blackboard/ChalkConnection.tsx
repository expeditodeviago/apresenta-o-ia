import React from 'react';
import { ConnectionData, MindMapNodeData, ChalkColor } from '../../types/presentation';
import { CHALK_COLORS, generateChalkArrowPath } from '../../utils/chalkMath';

interface ChalkConnectionProps {
  connection: ConnectionData;
  fromNode: MindMapNodeData;
  toNode: MindMapNodeData;
  isActive: boolean;
  isRevealed: boolean;
}

export const ChalkConnection: React.FC<ChalkConnectionProps> = ({
  connection,
  fromNode,
  toNode,
  isActive,
  isRevealed,
}) => {
  if (!isRevealed) return null;

  // Center coordinates of start and end nodes
  const x1 = fromNode.x + fromNode.width / 2;
  const y1 = fromNode.y + fromNode.height / 2;
  const x2 = toNode.x + toNode.width / 2;
  const y2 = toNode.y + toNode.height / 2;

  const colorMeta = CHALK_COLORS[(connection.color as ChalkColor) || 'cyan'] || CHALK_COLORS.cyan;
  const { path, arrowHead, midX, midY } = generateChalkArrowPath(
    x1,
    y1,
    x2,
    y2,
    connection.curved
  );

  return (
    <g className="transition-opacity duration-700 pointer-events-none animate-fade-in">
      {/* Background soft glow when active */}
      {isActive && (
        <path
          d={path}
          fill="none"
          stroke={colorMeta.hex}
          strokeWidth="8"
          strokeOpacity="0.4"
          filter="blur(6px)"
        />
      )}

      {/* Main sketchy chalk stroke with animated dash if active */}
      <path
        d={path}
        fill="none"
        stroke={colorMeta.hex}
        strokeWidth={isActive ? '3.5' : '2.5'}
        strokeDasharray={connection.dashed ? '8,8' : isActive ? '12,6' : undefined}
        strokeOpacity={isActive ? 1 : 0.65}
        strokeLinecap="round"
        className={isActive ? 'animate-chalk-dash' : ''}
      />

      {/* Chalk Arrowhead */}
      <path
        d={arrowHead}
        fill="none"
        stroke={colorMeta.hex}
        strokeWidth={isActive ? '4' : '2.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={isActive ? 1 : 0.8}
      />

      {/* Label Badge in the middle of the curve */}
      {connection.label && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x={-connection.label.length * 4.5 - 10}
            y="-14"
            width={connection.label.length * 9 + 20}
            height="26"
            rx="8"
            fill="#0f1712"
            stroke={colorMeta.hex}
            strokeWidth="1.5"
            strokeOpacity={isActive ? '0.9' : '0.45'}
            className="shadow-md"
          />
          <text
            x="0"
            y="2"
            fill={colorMeta.hex}
            fontSize="12"
            fontWeight="bold"
            fontFamily='"Patrick Hand", sans-serif'
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={isActive ? 1 : 0.85}
          >
            {connection.label}
          </text>
        </g>
      )}
    </g>
  );
};
