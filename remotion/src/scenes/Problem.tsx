import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme, sansFont} from '../theme';
import {Diagram} from '../components/Diagram';

export const Problem: React.FC<{publicUrl: string}> = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Title flash (0-34), then diagram + caption.
  const titleIn = spring({frame, fps, config: {damping: 200}});
  const titleOut = interpolate(frame, [24, 36], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOpacity = Math.min(titleIn, titleOut);

  const diagramOpacity = interpolate(frame, [26, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionOpacity = interpolate(frame, [46, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: sansFont}}>
      {frame < 40 ? (
        <div
          style={{
            position: 'absolute',
            textAlign: 'center',
            opacity: titleOpacity,
            transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)`,
          }}
        >
          <div style={{fontSize: 96, fontWeight: 800, color: theme.text}}>
            gradio<span style={{color: theme.accent}}>-tunneling</span>
          </div>
          <div style={{fontSize: 34, color: theme.dim, marginTop: 12}}>
            Expose any local port to the internet — in one command
          </div>
        </div>
      ) : null}

      <div style={{opacity: diagramOpacity, transform: 'scale(0.92)'}}>
        <Diagram connected={false} />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 96,
          fontSize: 40,
          color: theme.text,
          opacity: captionOpacity,
        }}
      >
        <span style={{fontFamily: sansFont}}>A service on </span>
        <span style={{color: theme.accent, fontWeight: 700}}>localhost:8080</span>
        <span> — only you can reach it</span>
      </div>
    </AbsoluteFill>
  );
};
