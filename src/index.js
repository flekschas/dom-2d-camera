import createCamera from "camera-2d-simple";
import { vec2, vec4, mat4 } from "gl-matrix";
import isKeyPressed from "key-pressed";
import createMousePosition from "mouse-position";
import createMousePressed from "mouse-pressed";
import createScroll from "scroll-speed";

const canvas2dCamera = (
  canvas,
  {
    distance = 1.0,
    target = [0, 0],
    rotation = 0,
    isFixed = false,
    isPan = true,
    panSpeed = 1,
    isRotate = true,
    rotateSpeed = 1,
    isZoom = true,
    zoomSpeed = 1
  } = {}
) => {
  const scratch = new Float32Array(16);

  let camera = createCamera(target, distance, rotation);
  let isChanged = false;
  let mousePosition = createMousePosition(canvas);
  let mousePressed = createMousePressed(canvas);
  let scroll = createScroll(canvas, isZoom);

  let height = canvas.height / window.devicePixelRatio;
  let width = canvas.width / window.devicePixelRatio;

  let isAlt = false;

  const getGlPos = (x, y, w, h) => {
    // Get relative WebGL position
    const relX = -1 + (x / w) * 2;
    const relY = 1 + (y / h) * -2;
    // Homogeneous vector
    const v = [relX, relY, 1, 1];
    // Compute inverse view matrix
    const viewInv = mat4.invert(scratch, camera.view);
    // Translate vector
    vec4.transformMat4(v, v, viewInv);
    return v.slice(0, 2);
  };

  const tick = () => {
    if (isFixed) return false;

    isAlt = isKeyPressed("<alt>");
    isChanged = false;

    if (isPan && mousePressed.left && !isAlt) {
      // To pan 1:1 we need to half the width and height because the uniform
      // coordinate system goes from -1 to 1.
      camera.pan([
        ((panSpeed * (mousePosition[0] - mousePosition.prev[0])) / width) * 2,
        ((panSpeed * (mousePosition.prev[1] - mousePosition[1])) / height) * 2
      ]);
      isChanged = true;
    }

    if (isZoom && scroll[1]) {
      const dZ = zoomSpeed * Math.exp(scroll[1] / height);

      // Get normalized device coordinates (NDC)
      const xNdc = -1 + (mousePosition[0] / width) * 2;
      const yNdc = 1 + (mousePosition[1] / height) * -2;

      camera.scale(1 / dZ, [xNdc, yNdc]);

      isChanged = true;
    }

    if (isRotate && (mousePressed.left && isAlt)) {
      const wh = width / 2;
      const hh = height / 2;
      const x1 = mousePosition.prev[0] - wh;
      const y1 = hh - mousePosition.prev[1];
      const x2 = mousePosition[0] - wh;
      const y2 = hh - mousePosition[1];
      // Angle between the start and end mouse position with respect to the
      // viewport center
      const radians = vec2.angle([x1, y1], [x2, y2]);
      // Determine the orientation
      const cross = x1 * y2 - x2 * y1;

      camera.rotate(rotateSpeed * radians * Math.sign(cross));

      isChanged = true;
    }

    scroll.flush();
    mousePosition.flush();

    return isChanged;
  };

  const dispose = () => {
    scroll.dispose();
    mousePressed.dispose();
    mousePosition.dispose();
    camera = undefined;
    scroll = undefined;
    mousePressed = undefined;
    mousePosition = undefined;
  };

  const config = ({
    isFixed: newIsFixed,
    isPan: newIsPan,
    isRotate: newIsRotate,
    isZoom: newIsZoom,
    panSpeed: newPanSpeed,
    rotateSpeed: newRotateSpeed,
    zoomSpeed: newZoomSpeed
  } = {}) => {
    isFixed = newIsFixed || isFixed;
    isPan = newIsPan || isPan;
    isRotate = newIsRotate || isRotate;
    isZoom = newIsZoom || isZoom;
    panSpeed = +newPanSpeed > 0 ? newPanSpeed : panSpeed;
    rotateSpeed = +newRotateSpeed > 0 ? newRotateSpeed : rotateSpeed;
    zoomSpeed = +newZoomSpeed > 0 ? newZoomSpeed : zoomSpeed;
  };

  const refresh = () => {
    height = canvas.height / window.devicePixelRatio;
    width = canvas.width / window.devicePixelRatio;
  };

  camera.config = config;
  camera.dispose = dispose;
  camera.getGlPos = getGlPos;
  camera.refresh = refresh;
  camera.tick = tick;

  return camera;
};

export default canvas2dCamera;
