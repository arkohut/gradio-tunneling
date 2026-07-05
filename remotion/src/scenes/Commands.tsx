import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Commands: React.FC<{publicUrl: string}> = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 60}}>
    Commands
  </AbsoluteFill>
);
