import buble from "@rollup/plugin-buble";
import commonjs from "@rollup/plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";

const config = (file, format, plugins = []) => ({
  input: "src/index.js",
  output: {
    name: "createDom2dCamera",
    format,
    file,
    globals: {
      "gl-matrix/vec2": "glMatrix.vec2"
    }
  },
  plugins: [resolve(), commonjs({ sourceMap: false }), ...plugins],
  external: ["gl-matrix/vec2"]
});

export default [
  config("dist/dom-2d-camera.js", "umd", [buble(), visualizer(), filesize()]),
  config("dist/dom-2d-camera.min.js", "umd", [buble(), terser()]),
  config("dist/dom-2d-camera.esm.js", "esm")
];
