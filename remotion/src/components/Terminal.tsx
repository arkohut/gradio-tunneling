import React from 'react';
import {theme, monoFont, sansFont} from '../theme';

export const Terminal: React.FC<{title?: string; width?: number; children: React.ReactNode}> = ({
  title = 'bash — gradio-tunneling',
  width = 1280,
  children,
}) => {
  return (
    <div
      style={{
        width,
        borderRadius: 16,
        overflow: 'hidden',
        background: theme.panel,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 40px 100px rgba(0,0,0,0.55)',
      }}
    >
      <div
        style={{
          height: 48,
          background: theme.chrome,
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          gap: 10,
        }}
      >
        <Dot color="#ff5f56" />
        <Dot color="#ffbd2e" />
        <Dot color="#27c93f" />
        <div style={{flex: 1, textAlign: 'center', color: theme.dim, fontSize: 20, fontFamily: sansFont}}>
          {title}
        </div>
        <div style={{width: 60}} />
      </div>
      <div
        style={{
          padding: '30px 36px',
          fontFamily: monoFont,
          fontSize: 30,
          lineHeight: 1.65,
          color: theme.text,
          minHeight: 420,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Dot: React.FC<{color: string}> = ({color}) => (
  <div style={{width: 15, height: 15, borderRadius: 8, background: color}} />
);
