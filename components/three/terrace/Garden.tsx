"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom } from "./random";

/*
 * Jardin de la maison finie, volontairement minimal (lisibilité du toit et fluidité) :
 * ciel bleu, gazon tondu, terrasse en pierre, piscine et un massif fleuri.
 * Style « maquette d'architecte » : tout est dessiné en code, sans fichier externe.
 */

// Mêmes dimensions que la maison (TerraceScene)
const W = 10;
const D = 8;

// Implantation (en mètres) — la façade vitrée regarde vers +z
const TERRACE = { x0: -W / 2 - 1, x1: W / 2 + 1, z0: D / 2, z1: D / 2 + 3.2 };
const POOL = { cx: 1.5, cz: D / 2 + 3.2 + 2.3, w: 7.5, d: 3.4, coping: 0.35 };

/* -------------------------------------------------------------------------- */
/*  Textures procédurales                                                      */
/* -------------------------------------------------------------------------- */
function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, rand: () => number) => void, seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, seededRandom(seed));
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Gazon tondu en bandes alternées (effet « green de golf »). */
function lawnTexture() {
  return canvasTexture(
    512,
    (ctx, rand) => {
      const bands = 4;
      for (let b = 0; b < bands; b++) {
        ctx.fillStyle = b % 2 ? "#628f3f" : "#6a9746";
        ctx.fillRect(0, (b * 512) / bands, 512, 512 / bands);
      }
      for (let i = 0; i < 26000; i++) {
        const l = 28 + rand() * 16;
        ctx.fillStyle = `hsla(${86 + rand() * 16} 38% ${l}% / 0.5)`;
        ctx.fillRect(rand() * 512, rand() * 512, 1, 2);
      }
    },
    11,
  );
}

/** Dallage en pierre claire (travertin), joints fins. */
function stoneTexture(tile: number) {
  return canvasTexture(
    512,
    (ctx, rand) => {
      ctx.fillStyle = "#cbbfa8";
      ctx.fillRect(0, 0, 512, 512);
      const n = 512 / tile;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const l = 76 + rand() * 8;
          ctx.fillStyle = `hsl(38 22% ${l}%)`;
          ctx.fillRect(i * tile + 2, j * tile + 2, tile - 4, tile - 4);
        }
      for (let k = 0; k < 4000; k++) {
        ctx.fillStyle = `rgba(120,105,85,${rand() * 0.18})`;
        ctx.fillRect(rand() * 512, rand() * 512, 2, 1);
      }
    },
    12,
  );
}

/** Carrelage bleu clair du bassin. */
function poolTileTexture() {
  return canvasTexture(
    256,
    (ctx, rand) => {
      ctx.fillStyle = "#cfe9ef";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 16; i++)
        for (let j = 0; j < 16; j++) {
          ctx.fillStyle = `hsl(192 ${45 + rand() * 15}% ${70 + rand() * 8}%)`;
          ctx.fillRect(i * 16 + 1, j * 16 + 1, 14, 14);
        }
    },
    15,
  );
}

/** Petites vagues pour le reflet de l'eau (carte de relief). */
function waterBumpTexture() {
  return canvasTexture(
    256,
    (ctx, rand) => {
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 900; i++) {
        const g = 90 + rand() * 90;
        ctx.fillStyle = `rgba(${g},${g},${g},0.35)`;
        ctx.beginPath();
        ctx.ellipse(rand() * 256, rand() * 256, 6 + rand() * 14, 2 + rand() * 4, rand() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    16,
  );
}

function useGardenMaterials() {
  return useMemo(() => {
    const lawn = lawnTexture();
    lawn.repeat.set(1 / 10, 1 / 10); // une texture = 10 m (bandes de 2,5 m)
    const stone = stoneTexture(64);
    stone.repeat.set(1 / 4.8, 1 / 4.8); // dalles de 60 cm
    const tiles = poolTileTexture();
    tiles.repeat.set(4, 1);
    const bump = waterBumpTexture();
    bump.colorSpace = THREE.NoColorSpace;
    bump.repeat.set(3, 1.5);
    return {
      lawn: new THREE.MeshStandardMaterial({ map: lawn, roughness: 0.95 }),
      stone: new THREE.MeshStandardMaterial({ map: stone, roughness: 0.75 }),
      coping: new THREE.MeshStandardMaterial({ color: "#e4dccb", roughness: 0.6 }),
      water: new THREE.MeshPhysicalMaterial({
        color: "#1e9fc4",
        roughness: 0.04,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        bumpMap: bump,
        bumpScale: 0.6,
        transparent: true,
        opacity: 0.88,
        envMapIntensity: 1.4,
      }),
      poolTiles: new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.3 }),
      soil: new THREE.MeshStandardMaterial({ color: "#4a3a2c", roughness: 1 }),
      leaf: new THREE.MeshStandardMaterial({ roughness: 0.8, vertexColors: false }),
      flower: new THREE.MeshStandardMaterial({ roughness: 0.6 }),
    };
  }, []);
}
type GM = ReturnType<typeof useGardenMaterials>;

/* -------------------------------------------------------------------------- */
/*  Sol : gazon percé à l'emplacement de la piscine                            */
/* -------------------------------------------------------------------------- */
function Ground({ g }: { g: GM }) {
  const geometry = useMemo(() => {
    const size = 160;
    const shape = new THREE.Shape();
    shape.moveTo(-size, -size);
    shape.lineTo(size, -size);
    shape.lineTo(size, size);
    shape.lineTo(-size, size);
    shape.closePath();
    // Trou de la piscine (coordonnées du plan : x, -z)
    const hx = POOL.w / 2 + POOL.coping;
    const hz = POOL.d / 2 + POOL.coping;
    const hole = new THREE.Path();
    hole.moveTo(POOL.cx - hx, -(POOL.cz - hz));
    hole.lineTo(POOL.cx - hx, -(POOL.cz + hz));
    hole.lineTo(POOL.cx + hx, -(POOL.cz + hz));
    hole.lineTo(POOL.cx + hx, -(POOL.cz - hz));
    hole.closePath();
    shape.holes.push(hole);
    return new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2);
  }, []);
  return <mesh geometry={geometry} material={g.lawn} receiveShadow />;
}

function Hardscape({ g }: { g: GM }) {
  const stoneGeom = useMemo(() => {
    const w = TERRACE.x1 - TERRACE.x0;
    const d = TERRACE.z1 - TERRACE.z0;
    return new THREE.BoxGeometry(w, 0.1, d);
  }, []);
  return (
    <group>
      {/* Terrasse en pierre devant la baie vitrée */}
      <mesh
        geometry={stoneGeom}
        material={g.stone}
        position={[(TERRACE.x0 + TERRACE.x1) / 2, 0.05, (TERRACE.z0 + TERRACE.z1) / 2]}
        receiveShadow
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Piscine                                                                    */
/* -------------------------------------------------------------------------- */
function Pool({ g }: { g: GM }) {
  const water = useRef<THREE.Mesh>(null);
  const depth = 1.4;
  const { cx, cz, w, d, coping: c } = POOL;
  useFrame((_, delta) => {
    const mat = water.current!.material as THREE.MeshPhysicalMaterial;
    mat.bumpMap!.offset.x += delta * 0.01;
    mat.bumpMap!.offset.y += delta * 0.006;
  });
  return (
    <group position={[cx, 0, cz]}>
      {/* Margelles */}
      <mesh position={[0, 0.06, -d / 2 - c / 2]} material={g.coping} castShadow receiveShadow>
        <boxGeometry args={[w + 2 * c, 0.12, c]} />
      </mesh>
      <mesh position={[0, 0.06, d / 2 + c / 2]} material={g.coping} castShadow receiveShadow>
        <boxGeometry args={[w + 2 * c, 0.12, c]} />
      </mesh>
      <mesh position={[-w / 2 - c / 2, 0.06, 0]} material={g.coping} castShadow receiveShadow>
        <boxGeometry args={[c, 0.12, d]} />
      </mesh>
      <mesh position={[w / 2 + c / 2, 0.06, 0]} material={g.coping} castShadow receiveShadow>
        <boxGeometry args={[c, 0.12, d]} />
      </mesh>
      {/* Bassin carrelé */}
      <mesh position={[0, -depth, 0]} rotation-x={-Math.PI / 2} material={g.poolTiles}>
        <planeGeometry args={[w, d]} />
      </mesh>
      {[
        { p: [0, -depth / 2, -d / 2], r: 0, s: w },
        { p: [0, -depth / 2, d / 2], r: Math.PI, s: w },
        { p: [-w / 2, -depth / 2, 0], r: Math.PI / 2, s: d },
        { p: [w / 2, -depth / 2, 0], r: -Math.PI / 2, s: d },
      ].map((wall, i) => (
        <mesh
          key={i}
          position={wall.p as [number, number, number]}
          rotation-y={wall.r}
          material={g.poolTiles}
        >
          <planeGeometry args={[wall.s, depth]} />
        </mesh>
      ))}
      {/* Eau */}
      <mesh ref={water} position={[0, -0.08, 0]} rotation-x={-Math.PI / 2} material={g.water}>
        <planeGeometry args={[w, d]} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Massifs : arbustes arrondis et fleurs                                      */
/* -------------------------------------------------------------------------- */
type Bed = { x0: number; x1: number; z0: number; z1: number };
const BEDS: Bed[] = [
  { x0: W / 2 + 0.3, x1: W / 2 + 1.5, z0: -D / 2, z1: D / 2 - 0.2 }, // le long de la façade droite
];

const FLOWER_COLORS = ["#e8709c", "#f4f1ea", "#9a6fd6", "#f2c14e", "#e24f5c", "#f6a5c0"];

function Beds({ g, narrow }: { g: GM; narrow: boolean }) {
  const bushes = useRef<THREE.InstancedMesh>(null);
  const flowers = useRef<THREE.InstancedMesh>(null);
  const bushGeometry = useMemo(() => {
    // Boule irrégulière (arbuste taillé)
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const rand = seededRandom(21);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const k = 1 + (rand() - 0.5) * 0.14;
      p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.85, p.getZ(i) * k);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const data = useMemo(() => {
    const rand = seededRandom(22);
    const b: { x: number; z: number; r: number; hue: number }[] = [];
    BEDS.forEach((bed) => {
      const area = (bed.x1 - bed.x0) * (bed.z1 - bed.z0);
      const n = Math.round(area * 1.6);
      for (let i = 0; i < n; i++)
        b.push({
          x: bed.x0 + rand() * (bed.x1 - bed.x0),
          z: bed.z0 + rand() * (bed.z1 - bed.z0),
          r: 0.28 + rand() * 0.3,
          hue: rand(),
        });
    });
    const perBush = narrow ? 6 : 14;
    const f: { x: number; y: number; z: number; c: number }[] = [];
    b.forEach((bush) => {
      for (let k = 0; k < perBush; k++) {
        const a = rand() * Math.PI * 2;
        const el = 0.25 + rand() * 1.1;
        f.push({
          x: bush.x + Math.cos(a) * Math.cos(el) * bush.r,
          y: bush.r * 0.85 + Math.sin(el) * bush.r * 0.85,
          z: bush.z + Math.sin(a) * Math.cos(el) * bush.r,
          c: Math.floor(rand() * FLOWER_COLORS.length),
        });
      }
    });
    return { b, f };
  }, [narrow]);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const bm = bushes.current!;
    data.b.forEach((b, i) => {
      dummy.position.set(b.x, b.r * 0.85, b.z);
      dummy.scale.setScalar(b.r);
      dummy.updateMatrix();
      bm.setMatrixAt(i, dummy.matrix);
      bm.setColorAt(i, color.setHSL(0.26 + b.hue * 0.08, 0.45, 0.22 + b.hue * 0.1));
    });
    bm.instanceMatrix.needsUpdate = true;
    if (bm.instanceColor) bm.instanceColor.needsUpdate = true;
    const fm = flowers.current!;
    data.f.forEach((f, i) => {
      dummy.position.set(f.x, f.y, f.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      fm.setMatrixAt(i, dummy.matrix);
      fm.setColorAt(i, color.set(FLOWER_COLORS[f.c]));
    });
    fm.instanceMatrix.needsUpdate = true;
    if (fm.instanceColor) fm.instanceColor.needsUpdate = true;
  }, [data]);

  return (
    <group>
      {BEDS.map((bed, i) => (
        <mesh
          key={i}
          position={[(bed.x0 + bed.x1) / 2, 0.02, (bed.z0 + bed.z1) / 2]}
          material={g.soil}
          receiveShadow
        >
          <boxGeometry args={[bed.x1 - bed.x0 + 0.2, 0.04, bed.z1 - bed.z0 + 0.2]} />
        </mesh>
      ))}
      <instancedMesh
        ref={bushes}
        args={[bushGeometry, g.leaf, data.b.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh ref={flowers} args={[undefined, g.flower, data.f.length]}>
        <icosahedronGeometry args={[0.055, 0]} />
      </instancedMesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ciel de plein jour : dôme en dégradé (bleu au zénith, clair à l'horizon)   */
/* -------------------------------------------------------------------------- */
export const HORIZON = "#c9ddef";

function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          top: { value: new THREE.Color("#3a82d6") },
          horizon: { value: new THREE.Color(HORIZON) },
        },
        vertexShader: `varying vec3 vPos; void main() { vPos = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 horizon; varying vec3 vPos;
          void main() { float h = max(vPos.y, 0.0); gl_FragColor = vec4(mix(horizon, top, smoothstep(0.0, 0.22, h)), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          }`,
      }),
    [],
  );
  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[340, 32, 16]} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
export function Garden({ narrow }: { narrow: boolean }) {
  const g = useGardenMaterials();
  return (
    <group>
      <SkyDome />
      <Ground g={g} />
      <Hardscape g={g} />
      <Pool g={g} />
      <Beds g={g} narrow={narrow} />
    </group>
  );
}
