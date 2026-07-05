import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme, sansFont, monoFont} from '../theme';
import {Diagram} from '../components/Diagram';
import {Reveal} from '../components/Reveal';

export const Result: React.FC<{publicUrl: string}> = ({publicUrl}) => {
  const frame = useCurrentFrame();
  const diagramOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const progress = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: sansFont}}>
      <div style={{opacity: diagramOpacity, transform: 'scale(0.92) translateY(-40px)'}}>
        <Diagram connected progress={progress} />
      </div>

      <Reveal
        at={60}
        style={{position: 'absolute', top: 120, textAlign: 'center', width: '100%'}}
      >
        <div style={{fontSize: 36, color: theme.text}}>
          Now anyone with the link reaches your local service
        </div>
        <div style={{fontFamily: monoFont, fontSize: 30, color: theme.green, marginTop: 10}}>
          {publicUrl}
        </div>
      </Reveal>

      <Reveal at={92} style={{position: 'absolute', bottom: 90, textAlign: 'center', width: '100%'}}>
        <div style={{fontFamily: monoFont, fontSize: 38, color: theme.accent, fontWeight: 700}}>
          gradio-tun 8080
        </div>
        <div style={{fontSize: 26, color: theme.dim, marginTop: 12}}>
          pip install gradio-tunneling · github.com/arkohut/gradio-tunneling
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
