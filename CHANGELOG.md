## v2.2.3

- Fix a bug preventing rotation in certain edge cases.

## v2.2.2

- Fix incorrect default value of `isPanInverted` introduced in [v2.2.0](#v2.2.0) to be backward compatible

## v2.2.1

- Make sure that `camera.tick()` only returns `true` when the user effectively panned or rotated

## v2.2.0

- Allow inverting the horizontal and vertical panning direction via `isPanInverted: [false, true]`. This can be useful in conjunction with WebGL.
- Fix a glitch during panning when the mouse cursor leaves the `<canvas />` element.

## v2.1.0

- Make sure that `tick()` returns `true` when the `camera` has been changed programmatically

## v2.0.3

- Hotfix for v2.0.2!

## v2.0.2

- Fix incorrect mouse position when zooming without having focus the browser window.

**Important:**

- Revert the deprecation of `refresh()`. Please call `camera.refresh()` when the `canvas` element was resized. This allows speeding up mouseMove and wheel event handler by avoiding an expensive `getBoundingClientRect()` call.

## v2.0.1

- Fix _laggy_ drag behavior, which was caused by incorrect updates of `previousMouseX` and `previousMouseY`

## v2.0.0

- Support x and y independent panning and zooming via `isPan: [isPanX, isPanY]` and `isZoom: [isZoomX, isZoomY]`

**Breaking Changes:**

- New major version due to `camera-2d-simple` being bumped to `v3`. For details see [the change log](https://github.com/flekschas/camera-2d/blob/master/CHANGELOG.md#v300).

## v1.2.3

- Avoid calling `refresh` internally as it's not needed.

## v1.2.2

- Fix an issue with zooming in situations with nested scroll bars. Note, this change makes `refresh()` irrelevant. You do not need to call it anymore.

## v1.2.1

- Fix an issue in switching between `defaultMouseDownMoveAction`
- Fix an issue with the zoom center when the page is scrolled

## v1.2.0

- Change panning and rotating modification behavior:
  - The default bahvior on mouse down + move is now defined via `defaultMouseDownMoveAction`, which is `pan` by default and can also be `rotate`
  - To dynamically switch the behavior to `rotate` or `pan` via a modifier key, `rotateKey` is now renamed to `mouseDownMoveModKey`, which is by default `alt`

## v1.1.0

- Allow changing the modifier key for rotating the camera via `rotateKey`. Valid keys are `alt`, `shift`, `ctrl`, and `cmd`

## v1.0.2

- Fix incorrect default parameters for `viewCenter` and `scaleBounds`

## v1.0.1

- Add `scaleBounds` option to the constructor for limiting the scale extent

## v1.0.0

**Important**

- Rename this package from `canvas-camera-2d` to `dom-2d-camera`

- Add `isNdc` option, which is set to `true` by default. If set to `false` the
  camera is working in pixel coordinates
- Add `viewCenter` option to the constructor for working in pixel coordinates
- Add the following options for event handlers to be fired after the camera has updated:
  - `onKeyDown`
  - `onKeyUp`
  - `onMouseDown`
  - `onMouseUp`
  - `onMouseMove`
  - `onWheel`
- Decrease dependencies on 3rd-party packages

## v0.5.5

- Update _camera-2d_ to `v2.0`

## v0.5.4

- Replace `key-pressed` with `is-key-down`

## v0.5.3

- Fix regression regarding `config()`

## v0.5.2

- Remove `camera.getGlPos()` as the base application should handle this since it typically involves a projection + model transformation

## v0.5.1

- Adjust mouse coordinates by aspect ration to support typical projection view model setups.

## v0.5.0

- Update camera-2d-simple to `v2` and adjust code
- Allow setting the rotation on create

## v0.4.0

- Add rotation by ALT + mouse dragging
- Remove zoom by ALT + mouse dragging

## v0.3.0

- **[Breaking change]** the camera must now be configured using `camera.config({ ... })`.
- Change to prettier code style.

## v0.2.0

- Allow fixing the camera position when `camera.isFixed === true`.

## v0.1.0

- First working version with pan and zoom. Note that rotation doesn't work yet.
