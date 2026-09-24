"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { createContext, useContext, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { easeIn, easeInOut, easeOut, easeOutBack, phase, range } from "./timeline";

/* -------------------------------------------------------------------------- */
/*  Dimensions de la maison (en mètres)                                        */
/* -------------------------------------------------------------------------- */
const W = 10; // largeur (x)
const D = 8; // profondeur (z)
const H = 3.1; // hauteur du dessus de dalle
const T = 0.22; // épaisseur des acrotères
const P = 0.55; // hauteur des acrotères au-dessus de la dalle
const IW = W - 2 * T; // largeur intérieure de la terrasse
const ID = D - 2 * T; // profondeur intérieure
const VB = 0.004; // épaisseur du pare-vapeur
const INS = 0.12; // épaisseur de l'isolant
const MEM = 0.012; // épaisseur de la membrane
const TOP_INS = H + VB + INS;
const TOP_MEM = TOP_INS + MEM;

/* -------------------------------------------------------------------------- */
/*  Progression lissée, partagée par tous les éléments de la scène             */
/* -------------------------------------------------------------------------- */
const ProgressContext = createContext<RefObject<number>>({ current: 0 });
const useProgress = () => useContext(ProgressContext);

/** Générateur pseudo-aléatoire déterministe (même tirage à chaque chargement). */
function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/*  Textures procédurales (aucun fichier à télécharger)                        */
/* -------------------------------------------------------------------------- */
function makeCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  return { canvas, ctx: canvas.getContext("2d")! };
}

function toTexture(canvas: HTMLCanvasElement, repeat: number, color = true) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  if (color) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Grain fin (béton, enduit, membrane sablée). */
function noiseTexture(size: number, base: number, spread: number, repeat: number, seed: number) {
  const rand = seededRandom(seed);
  const { canvas, ctx } = makeCanvas(size);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = base + (rand() - 0.5) * spread;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(canvas, repeat);
}

/** Tapis de gravillons roulés : des centaines de petits galets ombrés. */
function gravelTexture(seed: number) {
  const rand = seededRandom(seed);
  const size = 1024;
  const { canvas, ctx } = makeCanvas(size);
  ctx.fillStyle = "#4a4640";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 5200; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 5 + rand() * 8;
    const l = 48 + rand() * 30;
    const hue = 30 + rand() * 14;
    // ombre portée, galet, reflet
    ctx.fillStyle = "rgba(20,18,15,0.55)";
    ctx.beginPath();
    ctx.ellipse(x + r * 0.25, y + r * 0.3, r, r * 0.8, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsl(${hue} 9% ${l}%)`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.65 + rand() * 0.3), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsla(${hue} 10% 92% / 0.35)`;
    ctx.beginPath();
    ctx.ellipse(x - r * 0.3, y - r * 0.3, r * 0.35, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return toTexture(canvas, 3);
}

function useMaterials() {
  return useMemo(() => {
    const concreteMap = noiseTexture(256, 200, 34, 5, 1);
    const renderMap = noiseTexture(256, 236, 14, 8, 2);
    const membraneMap = noiseTexture(256, 190, 80, 14, 3);
    const gravelMap = gravelTexture(4);
    return {
      render: new THREE.MeshStandardMaterial({ color: "#e9e5dd", roughness: 0.93, map: renderMap }),
      plinth: new THREE.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.8 }),
      concrete: new THREE.MeshStandardMaterial({ color: "#a7a6a1", roughness: 0.95, map: concreteMap }),
      glass: new THREE.MeshStandardMaterial({ color: "#1c2631", roughness: 0.05, metalness: 0.85, envMapIntensity: 0.55 }),
      frame: new THREE.MeshStandardMaterial({ color: "#33363b", roughness: 0.4, metalness: 0.6 }),
      vapour: new THREE.MeshStandardMaterial({ color: "#16171a", roughness: 0.55, metalness: 0.1 }),
      interior: new THREE.MeshStandardMaterial({ color: "#0c0d0f", roughness: 1 }),
      insulation: new THREE.MeshStandardMaterial({ color: "#c9b98f", roughness: 0.45, metalness: 0.35, envMapIntensity: 0.6 }),
      membrane: new THREE.MeshStandardMaterial({ color: "#2a2b2f", roughness: 0.85, map: membraneMap }),
      aluminium: new THREE.MeshStandardMaterial({ color: "#eef0f3", roughness: 0.22, metalness: 1, envMapIntensity: 1.8 }),
      gravel: new THREE.MeshStandardMaterial({ roughness: 0.85 }),
      gravelBed: new THREE.MeshStandardMaterial({
        map: gravelMap,
        bumpMap: gravelMap,
        bumpScale: 3,
        roughness: 0.9,
        clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, 0, -1), -ID / 2)],
      }),
      floor: new THREE.MeshStandardMaterial({ color: "#1e2024", roughness: 1 }),
    };
  }, []);
}
type Materials = ReturnType<typeof useMaterials>;

/* -------------------------------------------------------------------------- */
/*  Le bâtiment (fixe) : murs percés de vraies ouvertures                      */
/* -------------------------------------------------------------------------- */
const WALL = 0.3; // épaisseur des murs
const HW = H - 0.3; // hauteur des murs sous la dalle
const REVEAL = 0.12; // profondeur de la menuiserie dans le tableau

type Opening = { x: number; y: number; w: number; h: number; leaves: number };

/** Mur plein percé d'ouvertures (extrusion d'un contour avec trous). Face extérieure en z = 0. */
function wallGeometry(length: number, openings: Opening[]) {
  const shape = new THREE.Shape();
  shape.moveTo(-length / 2, 0);
  shape.lineTo(length / 2, 0);
  shape.lineTo(length / 2, HW);
  shape.lineTo(-length / 2, HW);
  shape.closePath();
  openings.forEach(({ x, y, w, h }) => {
    const hole = new THREE.Path();
    hole.moveTo(x - w / 2, y);
    hole.lineTo(x - w / 2, y + h);
    hole.lineTo(x + w / 2, y + h);
    hole.lineTo(x + w / 2, y);
    hole.closePath();
    shape.holes.push(hole);
  });
  return new THREE.ExtrudeGeometry(shape, { depth: WALL, bevelEnabled: false }).translate(0, 0, -WALL);
}

/** Menuiserie aluminium : dormant fin, montants entre vantaux, vitrage, appui alu. */
function WindowUnit({ o, m }: { o: Opening; m: Materials }) {
  const f = 0.05; // largeur de profilé
  const d = 0.07; // épaisseur de profilé
  const z = -REVEAL;
  const cy = o.y + o.h / 2;
  const mullions = Array.from({ length: o.leaves - 1 }, (_, i) => o.x - o.w / 2 + ((i + 1) * o.w) / o.leaves);
  return (
    <group>
      <mesh material={m.glass} position={[o.x, cy, z - 0.01]}>
        <boxGeometry args={[o.w - 0.02, o.h - 0.02, 0.012]} />
      </mesh>
      {/* Dormant */}
      <mesh material={m.frame} position={[o.x, o.y + o.h - f / 2, z]} castShadow>
        <boxGeometry args={[o.w, f, d]} />
      </mesh>
      <mesh material={m.frame} position={[o.x, o.y + f / 2, z]}>
        <boxGeometry args={[o.w, f, d]} />
      </mesh>
      {[o.x - o.w / 2 + f / 2, o.x + o.w / 2 - f / 2].map((x) => (
        <mesh key={x} material={m.frame} position={[x, cy, z]}>
          <boxGeometry args={[f, o.h, d]} />
        </mesh>
      ))}
      {/* Montants centraux (vantaux coulissants) */}
      {mullions.map((x) => (
        <mesh key={x} material={m.frame} position={[x, cy, z + 0.005]}>
          <boxGeometry args={[f * 1.6, o.h, d]} />
        </mesh>
      ))}
      {/* Appui de fenêtre en aluminium, légèrement en saillie */}
      {o.y > 0.4 && (
        <mesh material={m.frame} position={[o.x, o.y - 0.008, -0.05]} castShadow>
          <boxGeometry args={[o.w + 0.06, 0.024, 0.2]} />
        </mesh>
      )}
    </group>
  );
}

function Facade({
  length,
  openings,
  m,
  position,
  rotationY,
}: {
  length: number;
  openings: Opening[];
  m: Materials;
  position: [number, number, number];
  rotationY: number;
}) {
  const geometry = useMemo(() => wallGeometry(length, openings), [length, openings]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={geometry} material={m.render} castShadow receiveShadow />
      {/* Soubassement anthracite (hors ouvertures toute hauteur) */}
      <mesh material={m.plinth} position={[0, 0.15, 0.006]} receiveShadow>
        <boxGeometry args={[length, 0.3, 0.012]} />
      </mesh>
      {openings.map((o, i) => (
        <WindowUnit key={i} o={o} m={m} />
      ))}
    </group>
  );
}

const FRONT: Opening[] = [
  { x: -1.3, y: 0.3, w: 4.8, h: 2.15, leaves: 4 }, // baie coulissante
  { x: 3.3, y: 1.3, w: 1.6, h: 1.1, leaves: 2 },
];
const SIDE: Opening[] = [{ x: 0.8, y: 1.25, w: 3.2, h: 1.1, leaves: 2 }];
const BACK: Opening[] = [{ x: 1.5, y: 1.3, w: 2, h: 1.1, leaves: 2 }];

function House({ m }: { m: Materials }) {
  const parapets: [number, number, number, number][] = [
    // [x, z, largeur x, profondeur z]
    [0, D / 2 - T / 2, W, T],
    [0, -D / 2 + T / 2, W, T],
    [-W / 2 + T / 2, 0, T, D - 2 * T],
    [W / 2 - T / 2, 0, T, D - 2 * T],
  ];
  return (
    <group>
      <Facade length={W} openings={FRONT} m={m} position={[0, 0, D / 2]} rotationY={0} />
      <Facade length={W} openings={BACK} m={m} position={[0, 0, -D / 2]} rotationY={Math.PI} />
      <Facade length={D - 2 * WALL} openings={SIDE} m={m} position={[W / 2, 0, 0]} rotationY={Math.PI / 2} />
      <Facade length={D - 2 * WALL} openings={[]} m={m} position={[-W / 2, 0, 0]} rotationY={-Math.PI / 2} />
      {/* Intérieur sombre, visible à travers les vitrages */}
      <mesh position={[0, HW / 2, 0]} material={m.interior}>
        <boxGeometry args={[W - 2 * WALL - 0.02, HW - 0.02, D - 2 * WALL - 0.02]} />
      </mesh>
      {/* Dalle béton (nez de dalle visible) */}
      <mesh position={[0, H - 0.15, 0]} castShadow receiveShadow material={m.concrete}>
        <boxGeometry args={[W, 0.3, D]} />
      </mesh>
      {/* Acrotères */}
      {parapets.map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, H + P / 2, z]} castShadow receiveShadow material={m.concrete}>
          <boxGeometry args={[w, P, d]} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 2 : pare-vapeur bitumineux (noir), puis son premier relevé           */
/* -------------------------------------------------------------------------- */
const VB_UP = P - 0.002; // le relevé de pare-vapeur monte jusqu'en haut de l'acrotère

function VapourBarrier({ m }: { m: Materials }) {
  const ref = useRef<THREE.Mesh>(null);
  const ups = useRef<(THREE.Mesh | null)[]>([]);
  const progress = useProgress();
  const [a, b] = range("pare-vapeur");
  const geometry = useMemo(() => new THREE.BoxGeometry(1, VB, ID).translate(0.5, 0, 0), []);
  const faces = useMemo(
    () =>
      [
        { pos: [0, H, ID / 2 - 0.002] as const, size: [IW, 1, VB] as const },
        { pos: [0, H, -ID / 2 + 0.002] as const, size: [IW, 1, VB] as const },
        { pos: [-IW / 2 + 0.002, H, 0] as const, size: [VB, 1, ID] as const },
        { pos: [IW / 2 - 0.002, H, 0] as const, size: [VB, 1, ID] as const },
      ].map((f) => ({ ...f, geometry: new THREE.BoxGeometry(...f.size).translate(0, 0.5, 0) })),
    [],
  );
  useFrame(() => {
    const local = phase(progress.current, a, b);
    const t = easeInOut(phase(local, 0, 0.65));
    const mesh = ref.current!;
    mesh.visible = t > 0.001;
    mesh.scale.x = Math.max(t * IW, 0.0001);
    ups.current.forEach((up, i) => {
      if (!up) return;
      const u = easeOut(phase(local, 0.55 + i * 0.06, 0.8 + i * 0.06));
      up.visible = u > 0.001;
      up.scale.y = Math.max(u * VB_UP, 0.0001);
    });
  });
  return (
    <group>
      <mesh ref={ref} geometry={geometry} material={m.vapour} position={[-IW / 2, H + VB / 2, 0]} receiveShadow />
      {faces.map((f, i) => (
        <mesh
          key={i}
          ref={(el) => {
            ups.current[i] = el;
          }}
          geometry={f.geometry}
          material={m.vapour}
          position={[f.pos[0], f.pos[1], f.pos[2]]}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 3 : panneaux isolants posés à joints décalés (en quinconce)          */
/* -------------------------------------------------------------------------- */
const PANEL_L = 1.2; // longueur d'un panneau (x)
const PANEL_W = 1.0; // largeur d'un panneau (z)
const JOINT = 0.006;

/**
 * Calepinage : une rangée sur deux commence par un demi-panneau, pour que les joints
 * ne soient jamais alignés d'une rangée à l'autre (pas de pont thermique continu).
 * Les panneaux de rive sont recoupés à la bonne dimension.
 */
function insulationLayout() {
  const panels: { x: number; z: number; sx: number; sz: number }[] = [];
  const rows = Math.ceil(ID / PANEL_W - 1e-6);
  for (let r = 0; r < rows; r++) {
    const z0 = -ID / 2 + r * PANEL_W;
    const zw = Math.min(PANEL_W, ID / 2 - z0);
    let cursor = -IW / 2;
    let next = r % 2 === 1 ? PANEL_L / 2 : PANEL_L;
    while (cursor < IW / 2 - 1e-6) {
      const len = Math.min(next, IW / 2 - cursor);
      panels.push({ x: cursor + len / 2, z: z0 + zw / 2, sx: len - JOINT, sz: zw - JOINT });
      cursor += len;
      next = PANEL_L;
    }
  }
  return panels;
}
const PANELS = insulationLayout();

function Insulation({ m }: { m: Materials }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const progress = useProgress();
  const [a, b] = range("isolant");
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const last = useRef(-1);

  useFrame(() => {
    const p = progress.current;
    if (Math.abs(p - last.current) < 1e-5) return;
    last.current = p;
    const local = phase(p, a, b);
    const mesh = ref.current!;
    PANELS.forEach((panel, k) => {
      // Pose rangée par rangée, panneau après panneau
      const delay = (k / PANELS.length) * 0.78;
      const t = easeOut(phase(local, delay, delay + 0.22));
      dummy.position.set(panel.x, H + VB + INS / 2 + (1 - t) * 1.2, panel.z);
      dummy.rotation.set((1 - t) * 0.3, 0, (1 - t) * -0.2);
      if (t < 0.001) dummy.scale.setScalar(0.0001);
      else dummy.scale.set(panel.sx, 1, panel.sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(k, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, PANELS.length]} material={m.insulation} castShadow receiveShadow>
      <boxGeometry args={[1, INS, 1]} />
    </instancedMesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 4 : lés de membrane qui se déroulent (avec leur rouleau)             */
/* -------------------------------------------------------------------------- */
const STRIPS = 5;
const OVERLAP = 0.1;
function Membrane({ m }: { m: Materials }) {
  const progress = useProgress();
  const [a, b] = range("membrane");
  const stripW = IW / STRIPS + OVERLAP;
  const sheets = useRef<(THREE.Mesh | null)[]>([]);
  const rolls = useRef<(THREE.Mesh | null)[]>([]);
  const sheetGeometry = useMemo(() => new THREE.BoxGeometry(stripW, MEM, 1).translate(0, 0, 0.5), [stripW]);
  const rollGeometry = useMemo(() => new THREE.CylinderGeometry(1, 1, stripW, 32).rotateZ(Math.PI / 2), [stripW]);

  useFrame(() => {
    const local = phase(progress.current, a, b);
    for (let s = 0; s < STRIPS; s++) {
      const start = (s / STRIPS) * 0.7;
      const t = easeInOut(phase(local, start, start + 0.3));
      const sheet = sheets.current[s]!;
      const roll = rolls.current[s]!;
      const length = t * ID;
      sheet.visible = t > 0.001;
      sheet.scale.z = Math.max(length, 0.0001);
      // Le rouleau s'amincit en se déroulant et disparaît en bout de course
      const r = THREE.MathUtils.lerp(0.17, 0.07, t);
      roll.visible = t > 0.001 && t < 0.999;
      roll.scale.set(1, r, r);
      roll.position.set(roll.position.x, TOP_INS + MEM + s * 0.0015 + r, -ID / 2 + length);
      roll.rotation.x = length / r;
    }
  });

  return (
    <group>
      {Array.from({ length: STRIPS }, (_, s) => {
        const x = -IW / 2 + (IW / STRIPS) * (s + 0.5);
        return (
          <group key={s}>
            <mesh
              ref={(el) => {
                sheets.current[s] = el;
              }}
              geometry={sheetGeometry}
              material={m.membrane}
              position={[x, TOP_INS + MEM / 2 + s * 0.0015, -ID / 2]}
              receiveShadow
            />
            <mesh
              ref={(el) => {
                rolls.current[s] = el;
              }}
              geometry={rollGeometry}
              material={m.membrane}
              position={[x, TOP_INS, -ID / 2]}
              castShadow
            />
          </group>
        );
      })}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 5 : relevés qui remontent le long des acrotères                      */
/* -------------------------------------------------------------------------- */
function Upstands({ m }: { m: Materials }) {
  const progress = useProgress();
  const [a, b] = range("releves");
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const h = H + P - TOP_INS + 0.01; // de l'isolant jusqu'en haut de l'acrotère
  const faces: { pos: [number, number, number]; size: [number, number, number] }[] = [
    { pos: [0, TOP_INS, ID / 2 - 0.006], size: [IW, 1, MEM] },
    { pos: [0, TOP_INS, -ID / 2 + 0.006], size: [IW, 1, MEM] },
    { pos: [-IW / 2 + 0.006, TOP_INS, 0], size: [MEM, 1, ID] },
    { pos: [IW / 2 - 0.006, TOP_INS, 0], size: [MEM, 1, ID] },
  ];
  const geometries = useMemo(
    () => faces.map((f) => new THREE.BoxGeometry(...f.size).translate(0, 0.5, 0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useFrame(() => {
    const local = phase(progress.current, a, b);
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = easeOut(phase(local, i * 0.12, i * 0.12 + 0.6));
      mesh.visible = t > 0.001;
      mesh.scale.y = Math.max(t * h, 0.0001);
    });
  });
  return (
    <group>
      {faces.map((f, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          geometry={geometries[i]}
          material={m.membrane}
          position={f.pos}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 6 : couvertines aluminium, coupes d'onglet, angles parfaitement carrés */
/* -------------------------------------------------------------------------- */
const CAP = 0.016; // épaisseur du capot
const DRIP = 0.1; // hauteur des retombées
const Xo = W / 2 + 0.05; // bord extérieur (débord de 5 cm)
const Zo = D / 2 + 0.05;
const Xi = W / 2 - T - 0.05; // bord intérieur (débord de 5 cm côté terrasse)
const Zi = D / 2 - T - 0.05;

/** Capot d'une longueur de couvertine, coupé à 45° aux deux extrémités (trapèze). */
function mitredCap(points: [number, number][]) {
  // Contour dans le plan (x, -z), puis extrusion vers le haut
  let pts = points.map(([x, z]) => new THREE.Vector2(x, -z));
  if (THREE.ShapeUtils.isClockWise(pts)) pts = pts.reverse();
  return new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: CAP, bevelEnabled: false }).rotateX(-Math.PI / 2);
}

type CopingSide = {
  cap: [number, number][];
  drips: { pos: [number, number]; size: [number, number] }[]; // [x, z], [longueur x, longueur z]
};

const COPING_SIDES: CopingSide[] = [
  {
    // avant
    cap: [[-Xo, Zo], [Xo, Zo], [Xi, Zi], [-Xi, Zi]],
    drips: [
      { pos: [0, Zo - 0.006], size: [2 * Xo, 0.012] },
      { pos: [0, Zi + 0.006], size: [2 * Xi, 0.012] },
    ],
  },
  {
    // droite
    cap: [[Xo, Zo], [Xo, -Zo], [Xi, -Zi], [Xi, Zi]],
    drips: [
      { pos: [Xo - 0.006, 0], size: [0.012, 2 * Zo] },
      { pos: [Xi + 0.006, 0], size: [0.012, 2 * Zi] },
    ],
  },
  {
    // arrière
    cap: [[Xo, -Zo], [-Xo, -Zo], [-Xi, -Zi], [Xi, -Zi]],
    drips: [
      { pos: [0, -Zo + 0.006], size: [2 * Xo, 0.012] },
      { pos: [0, -Zi - 0.006], size: [2 * Xi, 0.012] },
    ],
  },
  {
    // gauche
    cap: [[-Xo, -Zo], [-Xo, Zo], [-Xi, Zi], [-Xi, -Zi]],
    drips: [
      { pos: [-Xo + 0.006, 0], size: [0.012, 2 * Zo] },
      { pos: [-Xi - 0.006, 0], size: [0.012, 2 * Zi] },
    ],
  },
];

function Copings({ m }: { m: Materials }) {
  const progress = useProgress();
  const [a, b] = range("couvertines");
  const refs = useRef<(THREE.Group | null)[]>([]);
  const caps = useMemo(() => COPING_SIDES.map((s) => mitredCap(s.cap)), []);
  const y = H + P; // dessous du capot = dessus de l'acrotère

  useFrame(() => {
    const local = phase(progress.current, a, b);
    refs.current.forEach((g, i) => {
      if (!g) return;
      const t = phase(local, i * 0.16, i * 0.16 + 0.5);
      g.visible = t > 0.001;
      g.position.y = (1 - easeOutBack(t)) * 2.2;
    });
  });

  return (
    <group>
      {COPING_SIDES.map((side, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <mesh geometry={caps[i]} material={m.aluminium} position={[0, y, 0]} castShadow receiveShadow />
          {side.drips.map((d, k) => (
            <mesh key={k} material={m.aluminium} position={[d.pos[0], y + CAP - DRIP / 2, d.pos[1]]} castShadow>
              <boxGeometry args={[d.size[0], DRIP, d.size[1]]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 7 : pluie de gravillons                                              */
/* -------------------------------------------------------------------------- */
function Gravel({ m, count }: { m: Materials; count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const bed = useRef<THREE.Mesh>(null);
  const progress = useProgress();
  const [a, b] = range("gravillons");
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const last = useRef(-1);

  // Chaque gravillon tombe un peu en avant du « front » de répandage, qui avance de l'arrière vers l'avant
  const stones = useMemo(() => {
    const rand = seededRandom(2005);
    return Array.from({ length: count }, () => {
      const z = (rand() - 0.5) * (ID - 0.08);
      return {
        x: (rand() - 0.5) * (IW - 0.08),
        z,
        y: TOP_MEM + 0.03 + rand() * 0.015,
        drop: 0.5 + rand() * 0.7,
        delay: ((z + ID / 2) / ID) * 0.72 + rand() * 0.08,
        scale: 0.6 + rand() * 0.9,
        rot: [rand() * 6, rand() * 6, rand() * 6] as const,
        hue: rand(),
        light: rand(),
      };
    });
  }, [count]);

  useLayoutEffect(() => {
    const mesh = ref.current!;
    const color = new THREE.Color();
    stones.forEach((s, i) => {
      color.setHSL(0.09 + s.hue * 0.03, 0.06 + s.hue * 0.06, 0.32 + s.light * 0.22);
      mesh.setColorAt(i, color);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [stones]);

  useFrame(() => {
    const p = progress.current;
    if (Math.abs(p - last.current) < 1e-5) return;
    last.current = p;
    const local = phase(p, a, b);

    // Le tapis de gravillons se découvre au fur et à mesure (plan de coupe mobile)
    const front = -ID / 2 + easeInOut(phase(local, 0.1, 0.95)) * ID;
    const bedMesh = bed.current!;
    (bedMesh.material as THREE.MeshStandardMaterial).clippingPlanes![0].constant = front;
    bedMesh.visible = local > 0.1;

    const mesh = ref.current!;
    stones.forEach((s, i) => {
      const t = phase(local, s.delay, s.delay + 0.18);
      dummy.position.set(s.x, s.y + (1 - easeIn(t)) * s.drop, s.z);
      dummy.rotation.set(s.rot[0] + t * 2, s.rot[1], s.rot[2]);
      dummy.scale.setScalar(t < 0.001 ? 0.0001 : s.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={bed} rotation-x={-Math.PI / 2} position={[0, TOP_MEM + 0.02, 0]} material={m.gravelBed} receiveShadow>
        <planeGeometry args={[IW, ID]} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, count]} material={m.gravel} castShadow>
        <dodecahedronGeometry args={[0.02, 0]} />
      </instancedMesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Caméra : vol de « drone » entre des points clés                            */
/* -------------------------------------------------------------------------- */
type Key = { at: number; pos: [number, number, number]; look: [number, number, number] };
const cameraKeys: Key[] = [
  { at: 0.0, pos: [18, 11, 20], look: [0, 2.2, 0] }, // plan large d'ouverture
  { at: 0.1, pos: [11.5, 11, 12.5], look: [0, 3, 0] }, // la dalle nue
  { at: 0.3, pos: [8.5, 9.5, 9.5], look: [0, 3.1, 0] }, // pare-vapeur, isolant
  { at: 0.47, pos: [3.5, 6.8, 9.8], look: [0, 3.1, -0.5] }, // membrane, vue rasante
  { at: 0.6, pos: [1.8, 5.2, -0.6], look: [-4.4, 3.35, 3.4] }, // relevés, vus depuis la terrasse
  { at: 0.72, pos: [10.5, 6.4, 10], look: [3.6, 3.5, 3] }, // couvertines
  { at: 0.84, pos: [7, 9, 10.5], look: [0, 3.1, 0] }, // gravillons
  { at: 1.0, pos: [17, 7, 19], look: [0, 2, 0] }, // la maison terminée
];

function CameraRig({ narrow }: { narrow: boolean }) {
  const progress = useProgress();
  const { camera, pointer, size } = useThree();
  const vectors = useRef({ look: new THREE.Vector3(), pos: new THREE.Vector3(), tmp: new THREE.Vector3() });
  const sway = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const p = progress.current;
    const { look, pos, tmp } = vectors.current;
    const next = cameraKeys.findIndex((k, idx) => idx > 0 && p <= k.at);
    const i = next === -1 ? cameraKeys.length - 2 : next - 1;
    const k0 = cameraKeys[i];
    const k1 = cameraKeys[i + 1];
    const t = easeInOut(phase(p, k0.at, k1.at));
    pos.set(...k0.pos).lerp(tmp.set(...k1.pos), t);
    look.set(...k0.look).lerp(tmp.set(...k1.look), t);

    // Écran étroit (téléphone) : on recule pour tout garder dans le cadre
    if (narrow) pos.sub(look).multiplyScalar(1.55).add(look);

    // Léger mouvement de la caméra qui suit la souris (effet de profondeur)
    sway.current.x = THREE.MathUtils.damp(sway.current.x, pointer.x, 2, delta);
    sway.current.y = THREE.MathUtils.damp(sway.current.y, pointer.y, 2, delta);
    pos.x += sway.current.x * 0.5;
    pos.y += sway.current.y * 0.3;

    camera.position.copy(pos);
    camera.lookAt(look);

    // Cadrage : le sujet est décalé à droite sur ordinateur (texte à gauche), vers le haut sur téléphone
    const cam = camera as THREE.PerspectiveCamera;
    const { width, height } = size;
    if (narrow) cam.setViewOffset(width, height, 0, height * 0.12, width, height);
    else cam.setViewOffset(width, height, -width * 0.14, 0, width, height);
  });
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Assemblage de la scène                                                     */
/* -------------------------------------------------------------------------- */
function Scene({
  progress,
  narrow,
  onProgress,
}: {
  progress: RefObject<number>;
  narrow: boolean;
  onProgress?: (p: number) => void;
}) {
  const smooth = useRef(progress.current ?? 0);
  const m = useMaterials();
  // Lisse la progression brute du scroll pour des mouvements fluides
  useFrame((_, delta) => {
    smooth.current = THREE.MathUtils.damp(smooth.current, progress.current ?? 0, 5, Math.min(delta, 0.1));
    onProgress?.(smooth.current);
  });
  return (
    <ProgressContext.Provider value={smooth}>
      <CameraRig narrow={narrow} />

      <color attach="background" args={["#1e2024"]} />
      <fog attach="fog" args={["#1e2024", 32, 75]} />

      {/* Éclairage type studio produit : soleil chaud rasant + reflets doux de « boîtes à lumière » */}
      <hemisphereLight args={["#dfe6ee", "#1a1b1e", 0.3]} />
      <directionalLight
        position={[10, 15, 7]}
        intensity={2.6}
        color="#ffeed8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-8, 6, -6]} intensity={0.6} color="#9fb4cc" />
      <Environment resolution={512} environmentIntensity={0.6}>
        <Lightformer form="rect" intensity={4} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[16, 16, 1]} />
        <Lightformer form="rect" intensity={3} position={[0, 4, -12]} scale={[20, 5, 1]} />
        <Lightformer form="rect" intensity={2} position={[-12, 3, 2]} rotation-y={Math.PI / 2} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#bcd0e6" position={[12, 4, 4]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#3a3530" position={[0, -2, 0]} rotation-x={-Math.PI / 2} scale={[30, 30, 1]} />
      </Environment>

      <House m={m} />
      <VapourBarrier m={m} />
      <Insulation m={m} />
      <Membrane m={m} />
      <Upstands m={m} />
      <Copings m={m} />
      <Gravel m={m} count={narrow ? 900 : 2200} />

      {/* Sol sombre et ombre portée douce */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow material={m.floor}>
        <planeGeometry args={[200, 200]} />
      </mesh>
      <ContactShadows position={[0, 0.01, 0]} scale={26} blur={2.4} far={5} opacity={0.7} resolution={1024} frames={1} />

      {/* Post-traitement : occlusion ambiante (ombres douces dans les angles), anti-crénelage, vignettage */}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <N8AO aoRadius={1.1} distanceFalloff={1} intensity={narrow ? 1.6 : 2.4} quality={narrow ? "performance" : "medium"} halfRes />
        <SMAA />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.25} darkness={0.55} />
      </EffectComposer>
    </ProgressContext.Provider>
  );
}

/**
 * Canvas 3D de la toiture terrasse. `progress` (0 → 1) vient du scroll ;
 * `active` suspend le rendu quand la section n'est pas à l'écran (économie de batterie).
 */
export default function TerraceScene({
  progress,
  active,
  narrow,
  onProgress,
}: {
  progress: RefObject<number>;
  active: boolean;
  narrow: boolean;
  /** Appelé à chaque image avec la progression lissée réellement affichée. */
  onProgress?: (p: number) => void;
}) {
  return (
    <Canvas
      shadows
      frameloop={active ? "always" : "never"}
      dpr={[1, narrow ? 1.5 : 2]}
      camera={{ fov: 32, near: 0.5, far: 120, position: [18, 11, 20] }}
      gl={{ antialias: false, powerPreference: "high-performance", localClippingEnabled: true } as THREE.WebGLRendererParameters & { localClippingEnabled: boolean }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
    >
      <Scene progress={progress} narrow={narrow} onProgress={onProgress} />
    </Canvas>
  );
}
