import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Result: React.FC<{publicUrl: string}> = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 60}}>
    Result
  </AbsoluteFill>
);
