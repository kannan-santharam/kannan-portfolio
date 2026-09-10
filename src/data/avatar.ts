/**
 * 3D greeter avatar configuration.
 *
 * The avatar is OFF in production until `AVATAR_GLB_URL` is set. Nothing
 * renders and the three.js chunk is never fetched while it is null, so the
 * site's first paint is untouched by this feature.
 *
 * `public/avatar/kannan.glb` was generated from `public/kannanphoto.jpeg` by
 * Avaturn and then slimmed for the web by `scripts/optimise_glb.py`: 72 facial
 * blendshapes down to the 8 the greeter drives, morph normals dropped,
 * off-camera meshes removed and textures capped at 512px, which takes the file
 * from 13.5 MB to 2.5 MB. Re-run that script if the avatar is ever regenerated
 * rather than shipping the raw Avaturn export.
 */

export const AVATAR_GLB_URL: string | null = '/avatar/kannan.glb';

/**
 * Name of the clip inside the GLB to play as the greeting wave. Avaturn calls
 * its exported gesture `gesture_1`. Null falls back to the first clip in the
 * file; if the GLB has no clips at all the avatar still blinks, smiles and
 * tracks the cursor, it just does not gesture.
 */
export const AVATAR_WAVE_CLIP: string | null = 'gesture_1';

/**
 * Framing. The model is measured at load and normalised to a unit height, so
 * these read the same whichever avatar is swapped in and none of them are
 * per-model magic numbers.
 */
export const AVATAR_VIEW = {
  /** Fraction of the canvas height the figure fills, head to feet. */
  fillHeight: 0.9,
  /** Nudge the figure up (+) or down (-) in the frame, in canvas heights. */
  verticalBias: -0.02,
  fov: 30,
};

/**
 * 'full'  waves on load, blinks, eases into a smile, sways, follows the cursor.
 * 'still' one standing pose, smile held, nothing moves and the render loop is
 *         drawn once rather than every frame.
 */
export const AVATAR_MOTION: 'full' | 'still' = 'still';

/**
 * Which second of the wave clip to freeze on in 'still' mode. The GLB's own
 * bind pose is a T-pose, so a standing pose has to be borrowed from the clip.
 */
export const AVATAR_STILL_POSE_TIME = 0;

/** How much the mouth smile blendshape is held open, 0 to 1. */
export const AVATAR_SMILE = 0.5;

export const AVATAR_COPY = {
  greeting: "Hi, I'm Kannan.",
  body: 'Ask my AI assistant about my work, or paste a job description and see how I fit.',
  cta: 'Open the chat',
};
