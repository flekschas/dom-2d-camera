import createCamera from "camera-2d-simple";
import { vec2, vec3 } from "gl-matrix";
import createKeyPressed from "key-pressed";
import createMousePosition from "mouse-position";
import createMousePressed from "mouse-pressed";
import createScroll from "scroll-speed";

const canvas2dCamera = (
  canvas,
  {
    distance = 1.0,
    target = [],
    isFixed = false,
    isPan = true,
    panSpeed = 1,
    isRotate = true,
    rotateSpeed = 1,
    isZoom = true,
    zoomSpeed = 1
  } = {}
) => {
  let camera = createCamera({ target, distance });
  let isChanged = false;
  let mousePosition = createMousePosition(canvas);
  let mousePressed = createMousePressed(canvas);
  let scroll = createScroll(canvas, isZoom);

  const getGlPos = (x, y, w, h) => {
    // Get relative WebGL position
    const relX = -1 + (x / w) * 2;
    const relY = 1 + (y / h) * -2;
    // Homogeneous vector
    const v = [relX, relY, 1];
    // Translate vector
    vec3.transformMat3(v, v, camera.transformation);
    return v.slice(0, 2);
  };

  const tick = () => {
    if (isFixed) return undefined;

    const alt = createKeyPressed("<alt>");
    const height = canvas.height / window.devicePixelRatio;
    const width = canvas.width / window.devicePixelRatio;
    isChanged = false;

    if (isPan && mousePressed.left && !alt) {
      // To pan 1:1 we need to half the width and height because the uniform
      // coordinate system goes from -1 to 1.
      camera.pan([
        ((panSpeed * (mousePosition[0] - mousePosition.prev[0])) / width) * 2,
        ((panSpeed * (mousePosition[1] - mousePosition.prev[1])) / height) * 2
      ]);
      isChanged = true;
    }

    if (isZoom && scroll[1]) {
      // Target == viewport center
      const { target, distance: oldDist } = camera;
      const dZ = zoomSpeed * Math.exp(scroll[1] / height);
      const newDist = oldDist * dZ;

      const recipDDist = 1 - newDist / oldDist;

      // Get the relative WebGL coordinates of the mouse
      const [relX, relY] = getGlPos(
        mousePosition[0],
        mousePosition[1],
        width,
        height
      );

      // X and Y distance between the center and the mouse
      const dX = target[0] - relX;
      const dY = target[1] - relY;

      camera.pan([dX * recipDDist, -dY * recipDDist]);
      camera.zoom(dZ);

      isChanged = true;
    }

    if (isRotate && (mousePressed.left && alt)) {
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
    panSpeed: newPanSpeed,
    isRotate: newIsRotate,
    rotateSpeed: newRotateSpeed,
    isZoom: newIsZoom,
    zoomSpeed: newZoomSpeed
  } = {}) => {
    if (typeof newIsFixed !== "undefined") {
      isFixed = newIsFixed;
    }
    if (typeof newIsPan !== "undefined") {
      isPan = newIsFixed;
    }
    if (typeof newPanSpeed !== "undefined" && +newPanSpeed > 0) {
      panSpeed = newPanSpeed;
    }
    if (typeof newIsRotate !== "undefined") {
      isRotate = newIsRotate;
    }
    if (typeof newRotateSpeed !== "undefined" && +newRotateSpeed > 0) {
      rotateSpeed = newRotateSpeed;
    }
    if (typeof newIsZoom !== "undefined") {
      isZoom = newIsZoom;
    }
    if (typeof newZoomSpeed !== "undefined" && +newZoomSpeed > 0) {
      zoomSpeed = newZoomSpeed;
    }
  };

  camera.config = config;
  camera.dispose = dispose;
  camera.getGlPos = getGlPos;
  camera.tick = tick;

  return camera;
};

export default canvas2dCamera;
