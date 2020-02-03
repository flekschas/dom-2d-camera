import buble from "@rollup/plugin-buble";
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
      "gl-matrix": "glMatrix",
      "camera-2d-simple": "createCamera2d"
    }
  },
  plugins: [...plugins],
  external: ["gl-matrix", "camera-2d-simple"]
});

export default [
  config("dist/dom-2d-camera.js", "umd", [buble(), visualizer(), filesize()]),
  config("dist/dom-2d-camera.min.js", "umd", [buble(), terser()]),
  config("dist/dom-2d-camera.esm.js", "es")
];
