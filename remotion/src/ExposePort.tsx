import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {theme, sansFont} from './theme';
import {Problem} from './scenes/Problem';
import {Commands} from './scenes/Commands';
import {Result} from './scenes/Result';

export const ExposePort: React.FC<{publicUrl: string}> = ({publicUrl}) => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg, fontFamily: sansFont}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 600px at 50% 12%, rgba(255,124,0,0.12), transparent 60%)`,
        }}
      />
      <Series>
        <Series.Sequence durationInFrames={120}>
          <Problem publicUrl={publicUrl} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <Commands publicUrl={publicUrl} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <Result publicUrl={publicUrl} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
