import buble from "@rollup/plugin-buble";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

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
  config("dist/dom-2d-camera.js", "umd", [buble()]),
  config("dist/dom-2d-camera.min.js", "umd", [buble(), terser()]),
  config("dist/dom-2d-camera.esm.js", "esm")
];
