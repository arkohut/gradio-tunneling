import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadSans} from '@remotion/google-fonts/Inter';

export const {fontFamily: monoRaw} = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']});
export const {fontFamily: sansRaw} = loadSans('normal', {weights: ['400', '600', '700', '800'], subsets: ['latin']});

export const monoFont = `${monoRaw}, ui-monospace, monospace`;
export const sansFont = `${sansRaw}, system-ui, sans-serif`;

export const theme = {
  bg: '#0d1117',
  panel: '#161b22',
  chrome: '#21262d',
  border: '#30363d',
  text: '#e6edf3',
  dim: '#8b949e',
  accent: '#ff7c00', // gradio orange
  green: '#3fb950',
  red: '#f85149',
};
