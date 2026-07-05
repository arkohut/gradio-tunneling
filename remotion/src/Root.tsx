import React from 'react';
import {Composition} from 'remotion';
import {ExposePort} from './ExposePort';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ExposePort"
      component={ExposePort}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{publicUrl: 'https://3fc0fbee916e869def.gradio.live'}}
    />
  );
};
