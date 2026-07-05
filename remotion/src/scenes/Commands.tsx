import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme, sansFont, monoFont} from '../theme';
import {Terminal} from '../components/Terminal';
import {TypedLine} from '../components/TypedLine';
import {Reveal} from '../components/Reveal';

const STEPS = ['Install', 'Verify', 'Tunnel :8080'];

export const Commands: React.FC<{publicUrl: string}> = ({publicUrl}) => {
  const frame = useCurrentFrame();
  const termOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const activeStep = frame < 56 ? 0 : frame < 98 ? 1 : 2;

  const urlPulse = 1 + 0.04 * Math.sin(Math.max(0, frame - 140) / 4);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: sansFont}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 48, opacity: termOpacity}}>
        <Terminal>
          <TypedLine text="uv tool install gradio-tunneling" start={6} />
          <Reveal at={40} style={{color: theme.green}}>✓ installed gradio-tunneling (gradio-tun)</Reveal>

          <div style={{height: 14}} />
          <TypedLine text="gradio-tun --help" start={58} />
          <Reveal at={84} style={{color: theme.dim}}>usage: gradio-tun [-h] [-p PORT] [--sd SD] ✓ reachable</Reveal>

          <div style={{height: 14}} />
          <TypedLine text="gradio-tun 8080" start={100} />
          <Reveal at={138}>
            <span style={{color: theme.dim}}>Public URL: </span>
            <span
              style={{
                color: theme.accent,
                fontWeight: 700,
                display: 'inline-block',
                transform: `scale(${urlPulse})`,
                transformOrigin: 'left center',
              }}
            >
              {publicUrl}
            </span>
          </Reveal>
          <Reveal at={150} style={{color: theme.dim, fontSize: 24}}>
            This share link expires in 72 hours.
          </Reveal>
        </Terminal>

        <StepRail active={activeStep} />
      </div>
    </AbsoluteFill>
  );
};

const StepRail: React.FC<{active: number}> = ({active}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
    {STEPS.map((label, i) => {
      const on = i <= active;
      const current = i === active;
      return (
        <div key={label} style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: monoFont,
              fontSize: 22,
              color: on ? '#fff' : theme.dim,
              background: on ? theme.accent : 'transparent',
              border: `2px solid ${on ? theme.accent : theme.border}`,
              boxShadow: current ? `0 0 24px ${theme.accent}` : 'none',
            }}
          >
            {i + 1}
          </div>
          <div style={{fontSize: 30, color: on ? theme.text : theme.dim, fontWeight: current ? 700 : 400}}>
            {label}
          </div>
        </div>
      );
    })}
  </div>
);
