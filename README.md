# Canvas Warpper for 2D Camera

> A wrapper for [camera-2d](https://github.com/flekschas/camera-2d) that supports pan, zoom, and rotate.

Controls are as follows:

* Pan - Left click and hold + mouse move
* Zoom - Scroll or Shift + Left click
* Rotate - Right click or Control + Left click

Based heavily on
[orbit-camera](http://github.com/mikolalysenko/orbit-camera).

## API

```javascript
import canvasCamera2d from 'canvas-camera-2d';
```

### camera = canvasCamera2d(canvas[, options])

Attaches a modified `camera-2d-simple` instance to the `canvas`, i.e., attaching the required event listeners for interaction.

The following options are available:

* `distance`: initial distance of the camera. Defaults to `1.0`.
* `target`: x, y position the camera is looking in GL coordinates. Defaults to`[0, 0]`.
* `pan`: if `true` panning is enabled. Defaults to `true`.
* `panSpeed`: initial panning speed. Defaults to `1`.
* `pan`: if `true` panning is enabled. Defaults to `true`.
* `panSpeed`: initial panning speed. Defaults to `1`.
* `zoom`: if `true` zooming is enabled. Defaults to `true`.
* `zoomSpeed`: initial zooming speed. Defaults to `1`.

**Returns** a new 2d camera object.

The [camera's API](https://github.com/flekschas/camera-2d#api) is augmented with the following additional endpoints:

### camera.tick()

Call this at the beginning of each frame to update the current position of the camera.

### camera.getGlPos(x, y, w, h)

Computes the WebGL position of `x` and `y` given the width `w` and height `h` of the canvas object.

* `x`: relative x position in pixel coordinates.
* `y`: relative y position in pixel coordinates.
* `w`: width of the canvas object.
* `h`: height of the canvas object.

**Returns** `[relX, relY]` the WebGL position of `x` and `y`.

### camera.dispose()

Unsubscribes all event listeners.

### camera.isPan

Get and set panning.

### camera.panSpeed

Get and set pan speed.

### camera.isRotate

Get and set rotation.

### camera.rotateSpeed

Get and set rotation speed.

### camera.isZoom

Get and set zooming.

### camera.zoomSpeed

Get and set zoom speed.
