import React from 'react';
import {interpolate} from 'remotion';
import {theme, sansFont, monoFont} from '../theme';

const W = 1600;
const H = 720;
const CY = 360;
const COMP_RIGHT = 360;
const CLOUD_LEFT = 1240;
const WALL_X = 800;
const TUNNEL_Y = CY + 240; // below the firewall
const TUNNEL_D = `M ${COMP_RIGHT} ${CY} L ${COMP_RIGHT} ${TUNNEL_Y} L ${CLOUD_LEFT} ${TUNNEL_Y} L ${CLOUD_LEFT} ${CY}`;
const TUNNEL_LEN = 1360; // 240 + 880 + 240, the length of TUNNEL_D

export const Diagram: React.FC<{connected: boolean; progress?: number}> = ({
  connected,
  progress = 1,
}) => {
  return (
    <div style={{position: 'relative', width: W, height: H}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        {connected ? (
          <path
            d={TUNNEL_D}
            fill="none"
            stroke={theme.green}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={TUNNEL_LEN}
            strokeDashoffset={interpolate(progress, [0, 1], [TUNNEL_LEN, 0])}
          />
        ) : (
          <line
            x1={COMP_RIGHT}
            y1={CY}
            x2={CLOUD_LEFT}
            y2={CY}
            stroke={theme.red}
            strokeWidth={4}
            strokeDasharray="12 10"
            opacity={0.85}
          />
        )}
      </svg>

      <Node x={60} title="Your computer" emoji="🖥️">
        <Badge color={theme.accent}>web app · :8080</Badge>
      </Node>

      <Wall />

      <Node x={W - 360} title="The internet" emoji="🌍">
        <div style={{fontSize: 40, letterSpacing: 8}}>📱 💻 🧑‍💻</div>
      </Node>

      {connected ? (
        <>
          <GradioPill progress={progress} />
          <CheckBadge progress={progress} />
        </>
      ) : (
        <CrossBadge />
      )}
    </div>
  );
};

const Node: React.FC<{x: number; title: string; emoji: string; children: React.ReactNode}> = ({
  x,
  title,
  emoji,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: CY - 150,
      width: 300,
      height: 300,
      background: theme.panel,
      border: `1px solid ${theme.border}`,
      borderRadius: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      fontFamily: sansFont,
    }}
  >
    <div style={{fontSize: 96}}>{emoji}</div>
    <div style={{fontSize: 28, color: theme.text, fontWeight: 600}}>{title}</div>
    {children}
  </div>
);

const Badge: React.FC<{color: string; children: React.ReactNode}> = ({color, children}) => (
  <div
    style={{
      fontFamily: monoFont,
      fontSize: 22,
      color,
      border: `1px solid ${color}`,
      borderRadius: 999,
      padding: '6px 16px',
    }}
  >
    {children}
  </div>
);

const Wall: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: WALL_X - 4,
      top: CY - 200,
      width: 8,
      height: 380,
      background: `repeating-linear-gradient(45deg, ${theme.red}, ${theme.red} 10px, transparent 10px, transparent 22px)`,
      opacity: 0.7,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: -90,
        top: -52,
        width: 180,
        textAlign: 'center',
        color: theme.dim,
        fontSize: 24,
        fontFamily: sansFont,
      }}
    >
      🔒 NAT / firewall
    </div>
  </div>
);

const CrossBadge: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: WALL_X - 28,
      top: CY - 28,
      width: 56,
      height: 56,
      borderRadius: 28,
      background: theme.red,
      color: '#fff',
      fontSize: 34,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 30px ${theme.red}`,
    }}
  >
    ✕
  </div>
);

const GradioPill: React.FC<{progress: number}> = ({progress}) => {
  const opacity = interpolate(progress, [0.35, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: TUNNEL_Y - 30,
        width: W,
        display: 'flex',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: theme.panel,
          border: `1px solid ${theme.green}`,
          borderRadius: 999,
          padding: '8px 22px',
          fontFamily: sansFont,
          fontSize: 24,
          color: theme.green,
        }}
      >
        ☁ gradio tunnel
      </div>
    </div>
  );
};

const CheckBadge: React.FC<{progress: number}> = ({progress}) => {
  const opacity = interpolate(progress, [0.7, 0.95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: CLOUD_LEFT - 90,
        top: CY - 28,
        width: 56,
        height: 56,
        borderRadius: 28,
        background: theme.green,
        color: '#fff',
        fontSize: 32,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 30px ${theme.green}`,
        opacity,
      }}
    >
      ✓
    </div>
  );
};
