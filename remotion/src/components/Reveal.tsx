import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const Reveal: React.FC<{
  at: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, dur = 8, children, style}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <div style={{opacity, ...style}}>{children}</div>;
};
