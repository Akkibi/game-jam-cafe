# Mobile

See also [architecture](architecture.md) and [gameplay-tuning](gameplay-tuning.md).

`src/utils/device.ts` treats a device as touch when its primary pointer is coarse (`pointer: coarse`). Desktop is unaffected, including narrow portrait windows.

## Touch controls

`src/components/touchControls.tsx` feeds `GameControls` the same way as other inputs:

- Joystick: horizontal and analog, through `handleInputGamepad`. It measures from where the thumb lands anywhere in the left zone. `STICK_TRAVEL_PX` is the drag for full speed, `DEAD_ZONE` the ignored centre.
- Jump button: `i` key down and up, so holding it still controls jump height.

They are hidden in portrait and on the end screen. They sit at `z-[100]`, above every game overlay. The keyboard help (`controls.tsx`) is not shown on touch, and the score moves to the top right.

## Landscape hold

Touch in portrait sets `isRotateBlocked` in the store, which shows `src/components/rotatePopup.tsx` over the game. Assets load and the scene renders behind it. The hold applies on load and whenever the device is rotated back mid-run.

`SceneManager` applies the hold:

- `gsap.globalTimeline` is paused, which freezes the countdown, tweens and collider delays.
- Sound is muted. The intro voice and soundtrack first play when the hold first lifts.
- Physics, blocks, seeds and the player stop updating. `rotateHoldSeconds` is taken off the time given to blocks and seeds, so platform lifespans do not age.

Timers outside GSAP that change game state must check `isRotateBlocked` too, as `score.tsx` and `multBar.tsx` do.

UI shown during the hold must use CSS animation, because GSAP is paused. `gsap.set` also does not render while paused, so the HUD only mounts once `hasEnteredLandscape` is true.

## Fullscreen

`src/utils/fullscreen.ts` requests fullscreen on the first tap of a page load, then locks the orientation to landscape. It listens to `pointerup` because a touch only counts as a user gesture once released. A locked phone in portrait turns landscape, which also lifts the [landscape hold](#landscape-hold).

Browsers without these APIs, such as Safari on iPhone, skip this and rely on the rotate popup. It is not requested again after the player leaves fullscreen.

## Safari

Only the latest Safari is targeted. `isWebKit` in `src/utils/device.ts` also covers every other iOS browser, since they all run on WebKit.

- Renderer: `SceneManager` forces the WebGL2 backend, because the game needs nothing from WebGPU and Safari's WebGPU is less proven.
- Fullscreen: not available on iPhone. Adding the game to the Home Screen hides the Safari UI, through the `apple-mobile-web-app-*` meta tags in `index.html`.
- Outro: `end.tsx` calls `play()` inside the tap through a store subscription, which keeps the sound. If that is refused it plays muted, and if that fails too the outro is skipped.
- Audio: `SoundManager` resumes the audio context on the next tap after a call or an app switch.
- Size: `SceneManager` reads the size of `#root` through a `ResizeObserver`, because window sizes can be stale after a rotation.
- Zoom: `gesturestart` is cancelled, because iOS ignores `user-scalable=no`.

## Viewport

`#root` is fixed and clips its content, and the viewport has `minimum-scale=1`. Without both, oversized HUD elements such as the `w-[275vh]` banner make mobile browsers widen the layout viewport.
