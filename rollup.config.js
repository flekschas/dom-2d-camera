import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';

const config = (file, format, plugins) => ({
  input: 'src/index.js',
  output: {
    name: 'canvasCamera2d',
    format,
    file,
    globals: [],
  },
  plugins,
  external: ['gl-matrix'],
});

export default [
  config('dist/canvas-camera-2d.umd.js', 'umd', [buble()]),
  config('dist/canvas-camera-2d.umd.min.js', 'umd', [buble(), terser()]),
];
