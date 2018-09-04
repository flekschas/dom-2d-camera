import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';

const config = (file, format, plugins) => ({
  input: 'src/index.js',
  output: {
    name: 'canvasCamera2d',
    format,
    file,
    globals: {
      'camera-2d': 'createCamera2d',
      'gl-matrix': 'glMatrix',
      'key-pressed': 'createKeyPressed',
      'mouse-position': 'createMousePosition',
      'mouse-pressed': 'createMousePressed',
      'scroll-speed': 'createScroll',
    },
  },
  plugins,
  external: [
    'camera-2d',
    'gl-matrix',
    'key-pressed',
    'mouse-position',
    'mouse-pressed',
    'scroll-speed',
  ],
});

export default [
  config('dist/canvas-camera-2d.js', 'umd', [buble()]),
  config('dist/canvas-camera-2d.min.js', 'umd', [buble(), terser()]),
];
