import createCamera from 'camera-2d';
import { vec3 } from 'gl-matrix';
import createKeyPressed from 'key-pressed';
import createMousePosition from 'mouse-position';
import createMousePressed from 'mouse-pressed';
import createScroll from 'scroll-speed';

const canvas2dCamera = (
  canvas,
  {
    pan: initPan = true,
    panSpeed: initPanSpeed = 1,
    scale: initScale = true,
    target: initTarget = [],
    distance: initDistance = 1.0,
  } = {},
) => {
  let pan = initPan;
  let panSpeed = initPanSpeed;
  let scale = initScale;
  let scroll = createScroll(canvas, scale);
  let mousePressed = createMousePressed(canvas);
  let mousePosition = createMousePosition(canvas);
  let camera = createCamera({ initTarget, initDistance });
  let isChanged = false;

  const getRelCoords = (x, y, w, h) => {
    // Get relative webgl coordinates
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

    if (scale && scroll[1]) {
      // Target == viewport center
      const { target, distance: oldDist } = camera;
      const newDist = camera.distance * Math.exp(scroll[1] / height);

      const dDist = newDist / oldDist;
      const recipDDist = 1 - dDist;

      // Get the relative WebGL coordinates of the mouse
      const [relX, relY] = getRelCoords(
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

    if (scale && (mousePressed.middle || (mousePressed.left && alt))) {
      const d = mousePosition.y - mousePosition.prevY;
      if (!d) return undefined;

      camera.distance *= Math.exp(d / height);
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
  camera.getRelCoords = getRelCoords;
  camera.dispose = dispose;

  return camera;
};

export default canvas2dCamera;
