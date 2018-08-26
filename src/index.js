import createCamera from 'camera-2d';
import createScroll from 'scroll-speed';
import createMousePosition from 'mouse-position';
import createMousePressed from 'mouse-pressed';
import createKeyPressed from 'key-pressed';

const canvas2dCamera = (
  canvas,
  {
    pan = true,
    panSpeed = 1,
    scale = true,
    target = [],
    distance = 1,
  } = {}  // eslint-disable-line
) => {
  let scroll = createScroll(canvas, scale);
  let mousePressed = createMousePressed(canvas);
  let mousePosition = createMousePosition(canvas);
  let camera = createCamera(target, distance);
  let isChanged = false;

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
      camera.distance *= Math.exp(scroll[1] / height);
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
  camera.dispose = dispose;

  return camera;
};

export default canvas2dCamera;
