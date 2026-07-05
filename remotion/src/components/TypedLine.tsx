import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const TypedLine: React.FC<{
  text: string;
  start: number;
  cps?: number;
  prompt?: string;
  color?: string;
  cursor?: boolean;
}> = ({text, start, cps = 45, prompt = '$ ', color = theme.text, cursor = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const elapsed = Math.max(0, frame - start);
  const charsPerFrame = cps / fps;
  const shown = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const done = shown >= text.length;
  const started = frame >= start;
  const showCursor = cursor && started && !done;

  if (!started) {
    return <div style={{color, whiteSpace: 'pre-wrap'}}>{prompt ? <Prompt>{prompt}</Prompt> : null}</div>;
  }

  return (
    <div style={{color, whiteSpace: 'pre-wrap'}}>
      {prompt ? <Prompt>{prompt}</Prompt> : null}
      {text.slice(0, shown)}
      {showCursor ? <span style={{color: theme.dim}}>▋</span> : null}
    </div>
  );
};

const Prompt: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: theme.green}}>{children}</span>
);
