import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  AVATAR_GLB_URL,
  AVATAR_MOTION,
  AVATAR_STILL_POSE_TIME,
  AVATAR_SMILE,
  AVATAR_VIEW,
  AVATAR_WAVE_CLIP,
} from '../data/avatar';

/* This module is only ever reached through a dynamic import from
   AvatarGreeter, which is what keeps three.js out of the main bundle. */

const GLB = AVATAR_GLB_URL as string;
const STILL = AVATAR_MOTION === 'still';

const BLINK_CLOSE = 0.06; // seconds to shut the lid
const BLINK_OPEN = 0.09; // seconds to open it again
const BLINK_MIN = 3;
const BLINK_MAX = 6.5;

/* Every generator names its blendshapes differently: ARKit uses eyeBlinkLeft,
   Oculus/Wolf3D uses eyesClosed, some exporters use snake or CC naming. Each
   list is tried in full and misses are skipped, so an avatar from any of them
   animates whatever it happens to ship. */
const EYE_KEYS = [
  'eyeBlinkLeft', 'eyeBlinkRight', // ARKit
  'eyesClosed', 'eyeBlink_L', 'eyeBlink_R', // Oculus / Wolf3D
  'blink_left', 'blink_right', 'blink', // snake-case exporters
  'Eye_Blink_L', 'Eye_Blink_R', // Character Creator
];
const SMILE_KEYS = [
  'mouthSmile', 'mouthSmileLeft', 'mouthSmileRight', // ARKit
  'mouthSmile_L', 'mouthSmile_R', // Oculus / Wolf3D
  'smile', 'Mouth_Smile_L', 'Mouth_Smile_R',
];
/* Ridden along with the smile at a fraction of its strength: a smile that
   only moves the mouth reads as a grimace. */
const SMILE_SUPPORT_KEYS = ['cheekSquintLeft', 'cheekSquintRight', 'browInnerUp'];
const SMILE_SUPPORT_RATIO = 0.45;

const HEAD_BONES = ['Head', 'mixamorigHead', 'head', 'Bip01_Head', 'CC_Base_Head'];

type MorphMesh = { mesh: THREE.Mesh; dict: Record<string, number> };

function collectMorphMeshes(root: THREE.Object3D): MorphMesh[] {
  const found: MorphMesh[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && m.morphTargetDictionary && m.morphTargetInfluences) {
      found.push({ mesh: m, dict: m.morphTargetDictionary as Record<string, number> });
    }
  });
  return found;
}

/* Named lookup first, then a case-insensitive sweep, so a rig that calls the
   bone `HEAD` or `Neck_Head` still gets pointer tracking. */
function findHead(root: THREE.Object3D): THREE.Object3D | null {
  for (const name of HEAD_BONES) {
    const hit = root.getObjectByName(name);
    if (hit) return hit;
  }
  let fallback: THREE.Object3D | null = null;
  root.traverse((o) => {
    if (!fallback && /head$/i.test(o.name)) fallback = o;
  });
  return fallback;
}

/* Mixamo prefixes every track with `mixamorig:`, most avatar generators leave
   their bones unprefixed, and AnimationClip tracks bind by name. Without the
   strip an imported Mixamo clip plays against nothing, silently. */
function normaliseTracks(clip: THREE.AnimationClip) {
  const out = clip.clone();
  for (const track of out.tracks) {
    track.name = track.name.replace(/^mixamorig[:_]?/i, '');
  }
  return out;
}

/* Measure the model and fit it to the canvas rather than hand-tuning offsets
   per avatar: normalise it to a unit height, centre it, then pull the camera
   back by whatever that unit needs at the current field of view. */
function useFitToCanvas(
  group: React.RefObject<THREE.Group | null>,
  model: THREE.Object3D,
) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const g = group.current;
    if (!g) return;

    g.scale.setScalar(1);
    g.position.set(0, 0, 0);
    g.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const extent = new THREE.Vector3();
    box.getSize(extent);
    const centre = new THREE.Vector3();
    box.getCenter(centre);
    if (extent.y === 0) return;

    const scale = 1 / extent.y;
    g.scale.setScalar(scale);
    g.position.set(
      -centre.x * scale,
      -centre.y * scale + AVATAR_VIEW.verticalBias / AVATAR_VIEW.fillHeight,
      -centre.z * scale,
    );

    const halfView = 0.5 / AVATAR_VIEW.fillHeight;
    camera.fov = AVATAR_VIEW.fov;
    camera.position.set(0, 0, halfView / Math.tan((AVATAR_VIEW.fov * Math.PI) / 360));
    camera.lookAt(0, 0, 0);
    camera.near = 0.1;
    camera.far = 20;
    camera.updateProjectionMatrix();
    invalidate(); // still mode draws on demand, so ask for the first frame
  }, [camera, group, invalidate, model, size.width, size.height]);
}

interface AvatarProps {
  /** Bumping this replays the wave. */
  waveNonce: number;
}

function Avatar({ waveNonce }: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  const sway = useRef<THREE.Group>(null);
  const { scene: model, animations } = useGLTF(GLB);

  const morphs = useMemo(() => collectMorphMeshes(model), [model]);
  const head = useMemo(() => findHead(model), [model]);

  const setMorph = useMemo(() => {
    return (keys: string[], value: number) => {
      for (const { mesh, dict } of morphs) {
        for (const key of keys) {
          const i = dict[key];
          if (i === undefined) continue;
          mesh.morphTargetInfluences![i] = value;
        }
      }
    };
  }, [morphs]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const available = morphs.flatMap((m) => Object.keys(m.dict));
    const matched = [...EYE_KEYS, ...SMILE_KEYS].filter((k) => available.includes(k));
    if (matched.length === 0) {
      console.warn(
        '[avatar] no known blendshapes matched, so the face will not animate.',
        'Shipped by this model:', available,
        '\nAdd the right names to EYE_KEYS / SMILE_KEYS in AvatarScene.tsx.',
      );
    }
    if (!head) console.warn('[avatar] no head bone found, pointer tracking is off.');
  }, [morphs, head]);

  useFitToCanvas(group, model);

  useEffect(() => {
    if (!STILL) return;
    setMorph(EYE_KEYS, 0);
    setMorph(SMILE_KEYS, AVATAR_SMILE);
    setMorph(SMILE_SUPPORT_KEYS, AVATAR_SMILE * SMILE_SUPPORT_RATIO);
  }, [setMorph]);

  const blink = useRef({ elapsed: 0, wait: BLINK_MIN + Math.random() * (BLINK_MAX - BLINK_MIN) });
  const smile = useRef(0);

  useFrame((state, delta) => {
    if (STILL) return;
    const dt = Math.min(delta, 0.1); // a backgrounded tab can hand back huge deltas

    // Blink: hold the eyes open for `wait`, then run one close/open sweep.
    const b = blink.current;
    b.elapsed += dt;
    let lid = 0;
    const into = b.elapsed - b.wait;
    if (into >= 0) {
      if (into < BLINK_CLOSE) {
        lid = into / BLINK_CLOSE;
      } else if (into < BLINK_CLOSE + BLINK_OPEN) {
        lid = 1 - (into - BLINK_CLOSE) / BLINK_OPEN;
      } else {
        b.elapsed = 0;
        b.wait = BLINK_MIN + Math.random() * (BLINK_MAX - BLINK_MIN);
      }
    }
    setMorph(EYE_KEYS, lid);

    // Smile eases in and then stays, so the face never reads as deadpan.
    smile.current += (AVATAR_SMILE - smile.current) * Math.min(1, dt * 2.5);
    setMorph(SMILE_KEYS, smile.current);
    setMorph(SMILE_SUPPORT_KEYS, smile.current * SMILE_SUPPORT_RATIO);

    // Idle life. The clip only covers the greeting, so between waves a slow
    // breath and turn keep the figure from reading as a frozen render. It
    // rides the wrapper rather than the bones, so it never fights the mixer.
    if (sway.current) {
      const t = state.clock.elapsedTime;
      sway.current.position.y = Math.sin(t * 1.1) * 0.004;
      sway.current.rotation.y = Math.sin(t * 0.37) * 0.07;
    }
  });

  return (
    <group ref={group}>
      <DragToSpin>
        <group ref={sway}>
          <primitive object={model} />
        </group>
      </DragToSpin>
      <BodyClips target={group} animations={animations} waveNonce={waveNonce} />
      {/* After BodyClips on purpose: useFrame callbacks run in mount order, so
          the pointer look has to write the head bone after the mixer does,
          otherwise the clip overwrites it every frame. */}
      {!STILL && <HeadLook head={head} />}
    </group>
  );
}

/* Drag anywhere on the canvas to turn the avatar all the way round. The
   rotation eases towards the dragged target and keeps asking for frames until
   it settles, which is what makes it work in still mode too, where the canvas
   otherwise only draws on demand. */
function DragToSpin({ children }: { children: React.ReactNode }) {
  const spin = useRef<THREE.Group>(null);
  const target = useRef(0);
  const canvas = useThree((s) => s.gl.domElement);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let pointer: number | null = null;
    let lastX = 0;

    const down = (e: PointerEvent) => {
      pointer = e.pointerId;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      target.current += ((e.clientX - lastX) / canvas.clientWidth) * Math.PI * 2;
      lastX = e.clientX;
      invalidate();
    };

    const up = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      pointer = null;
      canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = 'grab';
    };

    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, [canvas, invalidate]);

  useFrame((_state, delta) => {
    const g = spin.current;
    if (!g) return;
    const gap = target.current - g.rotation.y;
    if (Math.abs(gap) < 0.0005) {
      g.rotation.y = target.current;
      return;
    }
    g.rotation.y += gap * Math.min(1, Math.min(delta, 0.1) * 9);
    invalidate(); // still mode: keep the frames coming until it settles
  });

  return <group ref={spin}>{children}</group>;
}

function HeadLook({ head }: { head: THREE.Object3D | null }) {
  // R3F's own pointer only updates while the cursor is over the canvas, and
  // this canvas is a small corner tile. Tracking the window instead is what
  // makes the avatar look at the visitor wherever they are on the page.
  const aim = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      aim.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      aim.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_state, delta) => {
    if (!head) return;
    const dt = Math.min(delta, 0.1);
    const yaw = aim.current.x * 0.26;
    const pitch = aim.current.y * 0.13;
    head.rotation.y += (yaw - head.rotation.y) * Math.min(1, dt * 3);
    head.rotation.x += (pitch - head.rotation.x) * Math.min(1, dt * 3);
  });
  return null;
}

interface BodyClipsProps {
  target: React.RefObject<THREE.Group | null>;
  animations: THREE.AnimationClip[];
  waveNonce: number;
}

function BodyClips({ target, animations, waveNonce }: BodyClipsProps) {
  const clips = useMemo(() => {
    const named = AVATAR_WAVE_CLIP
      ? animations.find((c) => c.name === AVATAR_WAVE_CLIP)
      : undefined;
    const wave = named ?? animations[0];
    return wave ? [Object.assign(normaliseTracks(wave), { name: 'Wave' })] : [];
  }, [animations]);

  const { actions, mixer } = useAnimations(clips, target as React.RefObject<THREE.Object3D>);
  const invalidate = useThree((s) => s.invalidate);

  // Wave on mount and whenever the greeter asks for another one. The model has
  // no idle clip, so the wave fades back out to the rest pose rather than
  // clamping on its last frame with an arm stuck in the air.
  useEffect(() => {
    const wave = actions.Wave;
    if (!wave) return;

    // Still mode borrows a single frame of the clip as the standing pose: the
    // GLB's own bind pose is a T-pose, arms straight out.
    if (STILL) {
      wave.reset().play();
      wave.paused = true;
      wave.time = AVATAR_STILL_POSE_TIME;
      mixer.update(0);
      invalidate();
      return;
    }

    wave.setLoop(THREE.LoopOnce, 1);
    wave.clampWhenFinished = false;
    wave.reset().fadeIn(0.25).play();

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === wave) wave.fadeOut(0.5);
    };

    mixer.addEventListener('finished', onFinished as never);
    return () => mixer.removeEventListener('finished', onFinished as never);
  }, [actions, invalidate, mixer, waveNonce]);

  return null;
}

export interface AvatarSceneProps {
  waveNonce: number;
  /** Stops the render loop while the avatar is hidden behind the chat. */
  paused: boolean;
}

export default function AvatarScene({ waveNonce, paused }: AvatarSceneProps) {
  return (
    <Canvas
      // 'demand' in still mode: the pose is drawn when something invalidates
      // it and then the loop sleeps, instead of burning a frame every 16ms.
      frameloop={paused ? 'never' : STILL ? 'demand' : 'always'}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 3], fov: AVATAR_VIEW.fov }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={1.6} />
      {/* Key light slightly above and in front, so the face is the brightest
          thing in a corner of the page that is otherwise very dark. */}
      <directionalLight position={[0.6, 1.6, 2.5]} intensity={2.6} />
      <directionalLight position={[-1.8, 0.8, 1.2]} intensity={0.9} />
      {/* Cyan rim to tie the avatar to the site accent and lift the dark suit
          off the dark page. */}
      <directionalLight position={[-1.5, 1.2, -2]} intensity={1.4} color="#00D2FF" />
      <Avatar waveNonce={waveNonce} />
    </Canvas>
  );
}

useGLTF.preload(GLB);
