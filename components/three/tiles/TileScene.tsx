"use client";

import parkHdri from "@pmndrs/assets/hdri/park.exr";
import { Environment } from "@react-three/drei";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { seededRandom } from "../terrace/random";

/*
 * Pan de toiture en tuiles romanes couvert de mousse. Le visiteur « nettoie » les tuiles
 * en passant la souris ou le doigt : on efface la mousse dans un masque (canvas 2D)
 * que le shader des tuiles lit pour mélanger terre cuite propre et mousse.
 */

/* -------------------------------------------------------------------------- */
/*  Dimensions (mètres)                                                        */
/* -------------------------------------------------------------------------- */
const TILE_W = 0.3; // largeur utile d'une tuile
const TILE_L = 0.42; // longueur d'une tuile
const OVERLAP = 0.08; // recouvrement d'un rang sur l'autre
const STEP = TILE_L - OVERLAP;
const COLS = 16;
const ROWS = 11;
const ROOF_W = COLS * TILE_W; // 4,8 m
const ROOF_L = (ROWS - 1) * STEP + TILE_L; // longueur de rampant
const PITCH = THREE.MathUtils.degToRad(32);
const THICK = 0.014;

const MASK_SIZE = 512;
const BRUSH = 26; // rayon du « pinceau » en pixels du masque

export type TileControls = { cleanAll: () => void; reset: () => void };

/* -------------------------------------------------------------------------- */
/*  Géométrie : une tuile romane (partie plate + bourrelet arrondi)            */
/* -------------------------------------------------------------------------- */
function tileGeometry() {
  const s = new THREE.Shape();
  const r = 0.045;
  const cx = TILE_W - r;
  s.moveTo(0, 0);
  s.lineTo(cx - r, 0);
  s.absarc(cx, 0, r, Math.PI, 0, true); // bourrelet (au-dessus)
  s.lineTo(TILE_W, -THICK);
  s.lineTo(0, -THICK);
  s.closePath();
  // Extrusion selon la longueur de la tuile (axe z du repère « toiture »)
  return new THREE.ExtrudeGeometry(s, { depth: TILE_L, bevelEnabled: false, curveSegments: 10 });
}

/**
 * Toutes les tuiles fusionnées en une seule géométrie (un seul appel de dessin).
 * Repère « toiture » : x le long de l'égout, y perpendiculaire au pan, z dans le sens de la pente
 * (0 au faîtage, ROOF_L à l'égout). Chaque sommet reçoit ses coordonnées de masque (roofUv).
 */
function roofGeometry() {
  const base = tileGeometry();
  const rand = seededRandom(7);
  const parts: THREE.BufferGeometry[] = [];
  const m = new THREE.Matrix4();
  const tilt = new THREE.Matrix4();
  const color = new THREE.Color();
  const v = new THREE.Vector3();
  // Chaque tuile est légèrement inclinée : son bas repose sur la tuile du rang inférieur
  tilt.makeRotationX(-Math.asin(THICK / TILE_L));
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const g = base.clone();
      m.makeTranslation(col * TILE_W, row * 0.0005, row * STEP).multiply(tilt);
      g.applyMatrix4(m);
      // Teinte de terre cuite légèrement variable d'une tuile à l'autre
      color.setHSL(0.03 + rand() * 0.02, 0.55 + rand() * 0.12, 0.36 + rand() * 0.07);
      const n = g.attributes.position.count;
      const colors = new Float32Array(n * 3);
      const roofUv = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) {
        v.fromBufferAttribute(g.attributes.position, i);
        colors.set([color.r, color.g, color.b], i * 3);
        roofUv.set([v.x / ROOF_W, v.z / ROOF_L], i * 2);
      }
      g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      g.setAttribute("roofUv", new THREE.BufferAttribute(roofUv, 2));
      g.deleteAttribute("uv");
      parts.push(g);
    }
  }
  return mergeGeometries(parts)!;
}

/* -------------------------------------------------------------------------- */
/*  Textures : masque de mousse (modifiable) et détail de la mousse            */
/* -------------------------------------------------------------------------- */
function drawInitialMoss(ctx: CanvasRenderingContext2D) {
  const rand = seededRandom(42);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
  const blob = (x: number, y: number, r: number, a: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  // La mousse s'installe surtout au bas de chaque rang (zones humides) et vers l'égout
  for (let row = 0; row < ROWS; row++) {
    const y = ((row * STEP + TILE_L) / ROOF_L) * MASK_SIZE;
    for (let i = 0; i < 70; i++) {
      blob(rand() * MASK_SIZE, y - rand() * 22, 8 + rand() * 18, 0.55 + rand() * 0.4);
    }
  }
  // Grandes plaques
  for (let i = 0; i < 55; i++) {
    const y = MASK_SIZE * (0.15 + Math.sqrt(rand()) * 0.85);
    blob(rand() * MASK_SIZE, y, 30 + rand() * 60, 0.35 + rand() * 0.45);
  }
}

function mossDetailTexture() {
  const rand = seededRandom(43);
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#3f4a24";
  ctx.fillRect(0, 0, size, size);
  // Touffes de mousse (verts sombres à jaune-vert)
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `hsl(${68 + rand() * 30} ${35 + rand() * 30}% ${16 + rand() * 26}%)`;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, 1 + rand() * 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Lichens gris clair
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = `hsla(50 12% ${62 + rand() * 18}% / 0.8)`;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, 2 + rand() * 6, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* -------------------------------------------------------------------------- */
/*  « Pinceau » : gère le masque de mousse, hors du cycle de rendu React       */
/* -------------------------------------------------------------------------- */
class MossPainter {
  canvas = document.createElement("canvas");
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  private probe = document.createElement("canvas");
  private probeCtx: CanvasRenderingContext2D;
  private baseline = 1;
  private last: { x: number; y: number } | null = null;
  private raf = 0;

  constructor() {
    this.canvas.width = this.canvas.height = MASK_SIZE;
    this.ctx = this.canvas.getContext("2d")!;
    drawInitialMoss(this.ctx);
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.flipY = false;
    // Petit canvas pour mesurer le pourcentage nettoyé sans lire tout le masque
    this.probe.width = this.probe.height = 48;
    this.probeCtx = this.probe.getContext("2d", { willReadFrequently: true })!;
    this.baseline = this.remaining();
  }

  /** Quantité de mousse restante (somme des pixels du masque réduit). */
  private remaining() {
    this.probeCtx.drawImage(this.canvas, 0, 0, 48, 48);
    const data = this.probeCtx.getImageData(0, 0, 48, 48).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) sum += data[i];
    return sum;
  }

  /** Part de la toiture nettoyée (0 → 1). */
  cleaned() {
    return Math.min(1, Math.max(0, 1 - this.remaining() / this.baseline));
  }

  /** Efface la mousse le long du trait, de la position précédente à (x, y) en pixels du masque. */
  paint(x: number, y: number) {
    const from = this.last ?? { x, y };
    const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (BRUSH * 0.35)));
    for (let i = 1; i <= steps; i++) {
      const px = from.x + ((x - from.x) * i) / steps;
      const py = from.y + ((y - from.y) * i) / steps;
      const g = this.ctx.createRadialGradient(px, py, 0, px, py, BRUSH);
      g.addColorStop(0, "rgba(0,0,0,0.85)");
      g.addColorStop(0.6, "rgba(0,0,0,0.5)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      this.ctx.fillStyle = g;
      this.ctx.beginPath();
      this.ctx.arc(px, py, BRUSH, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.last = { x, y };
    this.texture.needsUpdate = true;
  }

  lift() {
    this.last = null;
  }

  reset() {
    cancelAnimationFrame(this.raf);
    drawInitialMoss(this.ctx);
    this.last = null;
    this.texture.needsUpdate = true;
  }

  /** Balayage animé en zigzag, du faîtage vers l'égout. */
  cleanAll(onFrame: () => void) {
    cancelAnimationFrame(this.raf);
    const start = performance.now();
    const duration = 2600;
    const passes = 9;
    this.last = null;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const pos = t * passes;
      const pass = Math.min(passes - 1, Math.floor(pos));
      const along = pos - pass;
      const x = (pass % 2 === 0 ? along : 1 - along) * MASK_SIZE;
      const y = ((pass + 0.5) / passes) * MASK_SIZE;
      this.paint(x, y);
      if (t < 1) this.raf = requestAnimationFrame(tick);
      else {
        // Finition : plus aucune trace
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
        this.texture.needsUpdate = true;
        this.last = null;
      }
      onFrame();
    };
    this.raf = requestAnimationFrame(tick);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
  }
}

/* -------------------------------------------------------------------------- */
/*  Le pan de toiture                                                          */
/* -------------------------------------------------------------------------- */
function Roof({
  controls,
  onProgress,
}: {
  controls: RefObject<TileControls | null>;
  onProgress: (cleaned: number) => void;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const tilesGroup = useRef<THREE.Group>(null);
  const geometry = useMemo(() => roofGeometry(), []);
  const [painter] = useState(() => new MossPainter());
  const lastReport = useRef(0);

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62 });
    const detail = mossDetailTexture();
    const maskTexture = painter.texture;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.mossMask = { value: maskTexture };
      shader.uniforms.mossDetail = { value: detail };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec2 roofUv;\nvarying vec2 vRoofUv;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRoofUv = roofUv;");
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nuniform sampler2D mossMask;\nuniform sampler2D mossDetail;\nvarying vec2 vRoofUv;",
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          float mossRaw = texture2D(mossMask, vRoofUv).r;
          float mossAmount = smoothstep(0.08, 0.6, mossRaw);
          vec3 mossColor = texture2D(mossDetail, vRoofUv * vec2(7.0, 6.0)).rgb;
          // Sous la mousse, la tuile est aussi ternie (salissures)
          vec3 dirty = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.55, 0.52, 0.45), smoothstep(0.02, 0.3, mossRaw));
          diffuseColor.rgb = mix(dirty, mossColor, mossAmount);`,
        )
        .replace(
          "#include <roughnessmap_fragment>",
          "#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 1.0, mossAmount);",
        );
    };
    return mat;
  }, [painter]);

  const report = useCallback(
    (force = false) => {
      const now = performance.now();
      if (!force && now - lastReport.current < 200) return;
      lastReport.current = now;
      onProgress(painter.cleaned());
    },
    [painter, onProgress],
  );

  // Commandes accessibles au clavier : « Tout nettoyer » et « Recommencer »
  useImperativeHandle(
    controls,
    () => ({
      cleanAll: () =>
        painter.cleanAll(() => {
          invalidate();
          report();
        }),
      reset: () => {
        painter.reset();
        invalidate();
        report(true);
      },
    }),
    [painter, invalidate, report],
  );
  useEffect(() => () => painter.dispose(), [painter]);

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const local = tilesGroup.current!.worldToLocal(e.point.clone());
    const u = local.x / ROOF_W;
    const v = local.z / ROOF_L;
    if (u < 0 || u > 1 || v < 0 || v > 1) return;
    painter.paint(u * MASK_SIZE, v * MASK_SIZE);
    invalidate();
    report();
  };

  return (
    // Faîtage en haut, pan incliné vers la caméra
    <group position={[0, 6, -1.6]} rotation-x={PITCH}>
      <group ref={tilesGroup} position={[-ROOF_W / 2, 0, 0]}>
        <mesh
          geometry={geometry}
          material={material}
          castShadow
          receiveShadow
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => painter.lift()}
        />
      </group>
      {/* Faîtage */}
      <mesh position={[0, 0.02, 0.02]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.13, 0.13, ROOF_W + 0.1, 20, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#8a4a33" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mur, débord de toit et gouttière sous l'égout                              */
/* -------------------------------------------------------------------------- */
function EaveAndWall() {
  const eaveY = 6 - ROOF_L * Math.sin(PITCH);
  const eaveZ = -1.6 + ROOF_L * Math.cos(PITCH);
  return (
    <group>
      {/* Mur enduit, en retrait du débord */}
      <mesh position={[0, eaveY / 2 - 0.2, eaveZ - 0.9]} receiveShadow>
        <boxGeometry args={[ROOF_W + 1, eaveY, 0.3]} />
        <meshStandardMaterial color="#efe6d8" roughness={0.95} />
      </mesh>
      {/* Sous-face PVC anthracite */}
      <mesh position={[0, eaveY - 0.16, eaveZ - 0.45]} receiveShadow>
        <boxGeometry args={[ROOF_W, 0.03, 0.9]} />
        <meshStandardMaterial color="#2f3237" roughness={0.6} />
      </mesh>
      {/* Gouttière aluminium demi-ronde */}
      <mesh position={[0, eaveY - 0.12, eaveZ + 0.06]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.08, 0.08, ROOF_W + 0.1, 24, 1, true, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#e9ebee" metalness={1} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function TileScene({
  controls,
  onProgress,
  narrow,
}: {
  controls: RefObject<TileControls | null>;
  onProgress: (cleaned: number) => void;
  narrow: boolean;
}) {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, narrow ? 1.5 : 2]}
      camera={{ fov: narrow ? 42 : 32, near: 0.3, far: 100, position: narrow ? [0.8, 8.2, 8.6] : [1.6, 7.4, 7.4] }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ camera }) => camera.lookAt(0, 4.75, 0.2)}
      style={{ touchAction: "pan-y" }}
    >
      <hemisphereLight args={["#f1efe8", "#8a7a66", 0.35]} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={2.2}
        color="#fff1dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <Environment files={parkHdri} environmentIntensity={0.35} />
      <Roof controls={controls} onProgress={onProgress} />
      <EaveAndWall />
    </Canvas>
  );
}
