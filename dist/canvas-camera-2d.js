(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('camera-2d'), require('scroll-speed'), require('mouse-position'), require('mouse-pressed'), require('key-pressed')) :
  typeof define === 'function' && define.amd ? define(['camera-2d', 'scroll-speed', 'mouse-position', 'mouse-pressed', 'key-pressed'], factory) :
  (global.canvasCamera2d = factory(global.createCamera2d,global.createScroll,global.createMousePosition,global.createMousePressed,global.createKeyPressed));
}(this, (function (createCamera,createScroll,createMousePosition,createMousePressed,createKeyPressed) { 'use strict';

  createCamera = createCamera && createCamera.hasOwnProperty('default') ? createCamera['default'] : createCamera;
  createScroll = createScroll && createScroll.hasOwnProperty('default') ? createScroll['default'] : createScroll;
  createMousePosition = createMousePosition && createMousePosition.hasOwnProperty('default') ? createMousePosition['default'] : createMousePosition;
  createMousePressed = createMousePressed && createMousePressed.hasOwnProperty('default') ? createMousePressed['default'] : createMousePressed;
  createKeyPressed = createKeyPressed && createKeyPressed.hasOwnProperty('default') ? createKeyPressed['default'] : createKeyPressed;

  var canvas2dCamera = function (
    canvas,
    ref
  ) {
    if ( ref === void 0 ) ref = {};
    var pan = ref.pan; if ( pan === void 0 ) pan = true;
    var panSpeed = ref.panSpeed; if ( panSpeed === void 0 ) panSpeed = 1;
    var scale = ref.scale; if ( scale === void 0 ) scale = true;
    var target = ref.target; if ( target === void 0 ) target = [];
    var distance = ref.distance; if ( distance === void 0 ) distance = 1;

    var scroll = createScroll(canvas, scale);
    var mousePressed = createMousePressed(canvas);
    var mousePosition = createMousePosition(canvas);
    var camera = createCamera(target, distance);
    var isChanged = false;

    var tick = function () {
      var alt = createKeyPressed('<alt>');
      var height = canvas.height / window.devicePixelRatio;
      var width = canvas.width / window.devicePixelRatio;
      isChanged = false;

      if (pan && mousePressed.left && !alt) {
        // To pan 1:1 we need to half the width and height because the uniform
        // coordinate system goes from -1 to 1.
        camera.pan([
          panSpeed * (mousePosition[0] - mousePosition.prev[0]) / width * 2,
          panSpeed * (mousePosition[1] - mousePosition.prev[1]) / height * 2 ]);
        isChanged = true;
      }

      if (scale && scroll[1]) {
        camera.distance *= Math.exp(scroll[1] / height);
        isChanged = true;
      }

      if (scale && (mousePressed.middle || (mousePressed.left && alt))) {
        var d = mousePosition.y - mousePosition.prevY;
        if (!d) { return undefined; }

        camera.distance *= Math.exp(d / height);
        isChanged = true;
      }

      scroll.flush();
      mousePosition.flush();

      return isChanged;
    };

    var dispose = function () {
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

  return canvas2dCamera;

})));
