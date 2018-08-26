import Camera from '2d-camera';
import Scroll from 'scroll-speed';
import mp from 'mouse-position';
import mb from 'mouse-pressed';
import key from 'key-pressed';

const attachCamera = (
  canvas,
  {
    pan = false,
    panSpeed = 1,
    scale = false,
    target = [],
    distance = 1,
  } = {},
) => {
  const scroll = Scroll(canvas, scale);
  const mbut = mb(canvas);
  const mpos = mp(canvas);
  const camera = Camera(target, distance);

  const tick = () => {
    const alt = key('<alt>');
    const height = canvas.height / window.devicePixelRatio;
    const width = canvas.width / window.devicePixelRatio;

    if (pan && mbut.left && !alt) {
      // To pan 1:1 we need to half the width and height because the uniform
      // coordinate system goes from -1 to 1.
      camera.pan([
        panSpeed * (mpos.x - mpos.prevX) / width * 2,
        panSpeed * (mpos.y - mpos.prevY) / height * 2,
      ]);
    }

    if (scale && scroll[1]) {
      camera.distance *= Math.exp(scroll[1] / height);
    }

    if (scale && (mbut.middle || (mbut.left && alt))) {
      const d = mpos.y - mpos.prevY;
      if (!d) return;

      camera.distance *= Math.exp(d / height);
    }

    scroll.flush();
    mpos.flush();
  };

  const dispose = () => {
    console.warn('Not implemented yet');
  };

  camera.tick = tick;
  camera.dispose = dispose;

  return camera;
};

export default attachCamera;
