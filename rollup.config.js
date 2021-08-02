import buble from "@rollup/plugin-buble";
import resolve from "@rollup/plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";

const config = (file, format, plugins = []) => ({
  input: "src/index.js",
  output: {
    name: "createDom2dCamera",
    format,
    file,
    globals: {
      "gl-matrix": "glMatrix"
    }
  },
  plugins: [...plugins],
  external: ["gl-matrix"]
});

export default [
  config("dist/dom-2d-camera.js", "umd", [
    resolve(),
    buble(),
    visualizer(),
    filesize()
  ]),
  config("dist/dom-2d-camera.min.js", "umd", [resolve(), buble(), terser()]),
  config("dist/dom-2d-camera.esm.js", "es", [resolve()])
];
