import createCamera from "camera-2d-simple";
import { vec2 } from "gl-matrix";
import isKeyDown from "is-key-down";
import createMousePosition from "mouse-position";
import createMousePressed from "mouse-pressed";
import createScroll from "scroll-speed";

const dom2dCamera = (
  element,
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
  let camera = createCamera(target, distance, rotation);
  let isChanged = false;
  let mousePosition = createMousePosition(element);
  let mousePressed = createMousePressed(element);
  let scroll = createScroll(element, isZoom);

  let { width, height } = element.getBoundingClientRect();
  let aspectRatio = width / height;
  let isAlt = false;

  const tick = () => {
    if (isFixed) return false;

    isAlt = isKeyDown("Alt");
    isChanged = false;

    const { 0: x, 1: y } = mousePosition;
    const { 0: pX, 1: pY } = mousePosition.prev;

    if (isPan && mousePressed.left && !isAlt) {
      // To pan 1:1 we need to half the width and height because the uniform
      // coordinate system goes from -1 to 1.
      camera.pan([
        ((panSpeed * (x - pX)) / width) * 2 * aspectRatio,
        ((panSpeed * (pY - y)) / height) * 2
      ]);
      isChanged = true;
    }

    if (isZoom && scroll[1]) {
      const dZ = zoomSpeed * Math.exp(scroll[1] / height);

      // Get normalized device coordinates (NDC)
      const xNdc = (-1 + (x / width) * 2) * aspectRatio;
      const yNdc = 1 - (y / height) * 2;

      camera.scale(1 / dZ, [xNdc, yNdc]);

      isChanged = true;
    }

    if (isRotate && (mousePressed.left && isAlt)) {
      const wh = width / 2;
      const hh = height / 2;
      const x1 = pX - wh;
      const y1 = hh - pY;
      const x2 = x - wh;
      const y2 = hh - y;
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
    isFixed: newIsFixed = null,
    isPan: newIsPan = null,
    isRotate: newIsRotate = null,
    isZoom: newIsZoom = null,
    panSpeed: newPanSpeed = null,
    rotateSpeed: newRotateSpeed = null,
    zoomSpeed: newZoomSpeed = null
  } = {}) => {
    isFixed = newIsFixed !== null ? newIsFixed : isFixed;
    isPan = newIsPan !== null ? newIsPan : isPan;
    isRotate = newIsRotate !== null ? newIsRotate : isRotate;
    isZoom = newIsZoom !== null ? newIsZoom : isZoom;
    panSpeed = +newPanSpeed > 0 ? newPanSpeed : panSpeed;
    rotateSpeed = +newRotateSpeed > 0 ? newRotateSpeed : rotateSpeed;
    zoomSpeed = +newZoomSpeed > 0 ? newZoomSpeed : zoomSpeed;
  };

  const refresh = () => {
    const bBox = element.getBoundingClientRect();
    height = bBox.height;
    width = bBox.width;
    aspectRatio = width / height;
  };

  camera.config = config;
  camera.dispose = dispose;
  camera.refresh = refresh;
  camera.tick = tick;

  return camera;
};

export default dom2dCamera;
