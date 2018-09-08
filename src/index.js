import createCamera from 'camera-2d-simple';
import { vec3 } from 'gl-matrix';
import createKeyPressed from 'key-pressed';
import createMousePosition from 'mouse-position';
import createMousePressed from 'mouse-pressed';
import createScroll from 'scroll-speed';

const canvas2dCamera = (
  canvas,
  {
    distance: initDistance = 1.0,
    pan: initPan = true,
    panSpeed: initPanSpeed = 1,
    rotate: initRotate = true,
    rotateSpeed: initRotateSpeed = 1,
    target: initTarget = [],
    zoom: initZoom = true,
    zoomSpeed: initZoomSpeed = 1,
  } = {},
) => {
  let pan = initPan;
  let panSpeed = initPanSpeed;
  let rotate = initRotate;
  let rotateSpeed = initRotateSpeed;
  let zoom = initZoom;
  let zoomSpeed = initZoomSpeed;

  let camera = createCamera({ initTarget, initDistance });
  let isChanged = false;
  let mousePosition = createMousePosition(canvas);
  let mousePressed = createMousePressed(canvas);
  let scroll = createScroll(canvas, zoom);

  const getGlPos = (x, y, w, h) => {
    // Get relative WebGL position
    const relX = -1 + (x / w * 2);
    const relY = 1 + (y / h * -2);
    // Homogeneous vector
    const v = [relX, relY, 1];
    // Translate vector
    vec3.transformMat3(v, v, camera.transformation);
    return v.slice(0, 2);
  };

  const tick = () => {
    const alt = createKeyPressed('<alt>');
    const height = canvas.height / window.devicePixelRatio;
    const width = canvas.width / window.devicePixelRatio;
    isChanged = false;

    if (pan && mousePressed.left && !alt) {
      // To pan 1:1 we need to half the width and height because the uniform
      // coordinate system goes from -1 to 1.
      camera.pan([
        panSpeed * (mousePosition[0] - mousePosition.prev[0]) / width * 2,
        panSpeed * (mousePosition[1] - mousePosition.prev[1]) / height * 2,
      ]);
      isChanged = true;
    }

    if (zoom && scroll[1]) {
      // Target == viewport center
      const { target, distance: oldDist } = camera;
      const newDist = zoomSpeed * camera.distance * Math.exp(scroll[1] / height);

      const dDist = newDist / oldDist;
      const recipDDist = 1 - dDist;

      // Get the relative WebGL coordinates of the mouse
      const [relX, relY] = getGlPos(
        mousePosition[0],
        mousePosition[1],
        width,
        height,
      );

      // X and Y distance between the center and the mouse
      const dX = target[0] - relX;
      const dY = target[1] - relY;

      camera.lookAt(
        [
          target[0] - dX * recipDDist,
          target[1] - dY * recipDDist,
        ],
        newDist,
      );

      isChanged = true;
    }

    if (zoom && (mousePressed.middle || (mousePressed.left && alt))) {
      const d = mousePosition[1] - mousePosition.prev[1];
      if (!d) return undefined;

      camera.distance *= zoomSpeed * Math.exp(d / height);
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

  camera.tick = tick;
  camera.getGlPos = getGlPos;
  camera.dispose = dispose;

  Object.defineProperty(camera, 'isPan', {
    get: () => pan,
    set: (newPan) => { pan = !!newPan; },
  });
  Object.defineProperty(camera, 'panSpeed', {
    get: () => panSpeed,
    set: (newPanSpeed) => { panSpeed = +newPanSpeed > 0 ? +newPanSpeed : panSpeed; },
  });
  Object.defineProperty(camera, 'isRotate', {
    get: () => rotate,
    set: (newRotate) => { rotate = !!newRotate; },
  });
  Object.defineProperty(camera, 'rotateSpeed', {
    get: () => rotateSpeed,
    set: (newRotateSpeed) => { rotateSpeed = +newRotateSpeed > 0 ? +newRotateSpeed : rotateSpeed; },
  });
  Object.defineProperty(camera, 'isZoom', {
    get: () => zoom,
    set: (newZoom) => { zoom = !!newZoom; },
  });
  Object.defineProperty(camera, 'zoomSpeed', {
    get: () => zoomSpeed,
    set: (newZoomSpeed) => { zoomSpeed = +newZoomSpeed > 0 ? +newZoomSpeed : zoomSpeed; },
  });

  return camera;
};

export default canvas2dCamera;
