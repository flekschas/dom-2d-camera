# Canvas Wrapper for 2D Camera

[![npm version](https://img.shields.io/npm/v/canvas-camera-2d.svg)](https://www.npmjs.com/package/canvas-camera-2d)
[![node stability](https://img.shields.io/badge/stability-experimental-EC5314.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![build status](https://travis-ci.org/flekschas/canvas-camera-2d.svg?branch=master)](https://travis-ci.org/flekschas/canvas-camera-2d)
[![gzipped size](https://img.shields.io/badge/gzipped%20size-1.2%20KB-6ae3c7.svg)](https://unpkg.com/canvas-camera-2d)
[![code style prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![demo](https://img.shields.io/badge/demo-online-6ae3c7.svg)](https://flekschas.github.io/regl-scatterplot/)

> A wrapper for [camera-2d](https://github.com/flekschas/camera-2d) that supports pan, zoom, and rotate.

Controls are as follows:

- Pan - Left click and hold + mouse move
- Zoom - Scroll or Alt + Left click and hold with vertical mouse move
- Rotate - Right click or Control + Left click

Based on [orbit-camera](http://github.com/mikolalysenko/orbit-camera).

Also see:

- [regl-scatterplot](https://github.com/flekschas/regl-scatterplot) for an application and a [demo](https://flekschas.github.io/regl-scatterplot/).

## Install

```
npm i canvas-camera-2d
```

## API

```javascript
import canvasCamera2d from "canvas-camera-2d";
```

### camera = canvasCamera2d(canvas[, options])

Attaches a modified `camera-2d-simple` instance to the `canvas`, i.e., attaching the required event listeners for interaction.

The following options are available:

- `distance`: initial distance of the camera. [dtype: number, default: `1`]
- `target`: x, y position the camera is looking in GL coordinates. [dtype: array of numbers, default: `[0,0]`]
- `rotation`: rotation in radians around the z axis. [dtype: number, default: `0`]
- `isFixed`: if `true` panning, rotating, and zooming is disabled. [dtype: bool, default: `false`]
- `isPan`: if `true` panning is enabled. [dtype: bool, default: `true`]
- `panSpeed`: initial panning speed. [dtype: number, default: `1`]
- `isRotate`: if `true` rotation is enabled. [dtype: bool, default: `true`]
- `rotateSpeed`: initial panning speed. [dtype: number, default: `1`]
- `isZoom`: if `true` zooming is enabled. [dtype: bool, default: `true`]
- `zoomSpeed`: initial zooming speed. [dtype: number, default: `1`]

**Returns** a new 2D camera object.

The [camera's API](https://github.com/flekschas/camera-2d#api) is augmented with the following additional endpoints:

#### `camera.tick()`

Call this at the beginning of each frame to update the current position of the camera.

#### `camera.refresh()`

Call after the width and height of the related canvas object changed.

_Note: the camera does **not** update the width and height unless you tell it to using this function!_

**Returns** `[relX, relY]` the WebGL position of `x` and `y`.

#### `camera.dispose()`

Unsubscribes all event listeners.

#### `camera.config(options)`

Configure the canvas camera. `options` accepts the following options:

- `isFixed`: if `true` panning, rotating, and zooming is disabled. [default: `false`]
- `isPan`: if `true` panning is enabled. [dtype: bool, default: `true`]
- `panSpeed`: panning speed. [dtype: float, default: `1.0`]
- `isRotate`: if `true` rotation is enabled. [dtype: bool, default: `true`]
- `rotateSpeed`: rotation speed. [dtype: float, default: `1.0`]
- `isZoom`: if `true` zooming is enabled. [dtype: bool, default: `true`]
- `zoomSpeed`: zooming speed. [dtype: float, default: `1.0`]
