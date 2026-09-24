"use client";

import { Cloud, Clouds, RoundedBox } from "@react-three/drei";
import cloudTexture from "@pmndrs/assets/textures/cloud.webp";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { seededRandom } from "./random";

/*
 * Jardin de la maison finie : gazon tondu, terrasse en pierre, piscine, allée pavée,
 * palmiers, massifs fleuris et arbres en arrière-plan.
 * Style « maquette d'architecte » : tout est dessiné en code, sans fichier externe.
 */

// Mêmes dimensions que la maison (TerraceScene)
const W = 10;
const D = 8;

// Implantation (en mètres) — la façade vitrée regarde vers +z
const TERRACE = { x0: -W / 2 - 1, x1: W / 2 + 1, z0: D / 2, z1: D / 2 + 3.2 };
const POOL = { cx: 1.5, cz: D / 2 + 3.2 + 2.3, w: 7.5, d: 3.4, coping: 0.35 };
const DRIVE = { x0: -8.6, x1: -6.2, z0: -1.5, z1: 40 };

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

/** Pavés gris posés en rangs décalés. */
function paverTexture() {
  return canvasTexture(
    512,
    (ctx, rand) => {
      ctx.fillStyle = "#6d6b67";
      ctx.fillRect(0, 0, 512, 512);
      const h = 32;
      const w = 64;
      for (let r = 0; r < 512 / h; r++) {
        const off = r % 2 ? w / 2 : 0;
        for (let c = -1; c < 512 / w + 1; c++) {
          const l = 52 + rand() * 12;
          ctx.fillStyle = `hsl(${30 + rand() * 10} 6% ${l}%)`;
          ctx.fillRect(c * w + off + 2, r * h + 2, w - 4, h - 4);
        }
      }
    },
    13,
  );
}

/** Palme : folioles fines de part et d'autre d'une nervure, fond transparent. */
function frondTexture() {
  return canvasTexture(
    256,
    (ctx, rand) => {
      ctx.clearRect(0, 0, 256, 256);
      ctx.strokeStyle = "#5c7a2e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(128, 0);
      ctx.lineTo(128, 256);
      ctx.stroke();
      for (let y = 4; y < 252; y += 4) {
        const len = 118 * Math.sin((Math.PI * y) / 256) ** 0.6;
        for (const side of [-1, 1]) {
          ctx.strokeStyle = `hsl(${84 + rand() * 20} ${40 + rand() * 15}% ${24 + rand() * 14}%)`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(128, y);
          ctx.quadraticCurveTo(128 + side * len * 0.5, y + 6, 128 + side * len, y + 22);
          ctx.stroke();
        }
      }
    },
    14,
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
    const pavers = paverTexture();
    const frond = frondTexture();
    const tiles = poolTileTexture();
    tiles.repeat.set(4, 1);
    const bump = waterBumpTexture();
    bump.colorSpace = THREE.NoColorSpace;
    bump.repeat.set(3, 1.5);
    return {
      lawn: new THREE.MeshStandardMaterial({ map: lawn, roughness: 0.95 }),
      stone: new THREE.MeshStandardMaterial({ map: stone, roughness: 0.75 }),
      coping: new THREE.MeshStandardMaterial({ color: "#e4dccb", roughness: 0.6 }),
      pavers: new THREE.MeshStandardMaterial({ map: pavers, roughness: 0.85 }),
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
      treeLeaf: new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true }),
      boxwood: new THREE.MeshStandardMaterial({ color: "#3f6a2c", roughness: 0.9 }),
      frond: new THREE.MeshStandardMaterial({
        map: frond,
        alphaTest: 0.35,
        side: THREE.DoubleSide,
        roughness: 0.7,
      }),
      // Ombre portée des palmes découpée selon les folioles (et non en rectangles pleins)
      frondDepth: new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: frond, alphaTest: 0.35 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#86735c", roughness: 0.95 }),
      flower: new THREE.MeshStandardMaterial({ roughness: 0.6 }),
      lounger: new THREE.MeshStandardMaterial({ color: "#f3f1ec", roughness: 0.6 }),
      loungerFrame: new THREE.MeshStandardMaterial({ color: "#33363b", roughness: 0.4, metalness: 0.6 }),
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
  const driveLen = DRIVE.z1 - DRIVE.z0;
  return (
    <group>
      {/* Terrasse en pierre devant la baie vitrée */}
      <mesh
        geometry={stoneGeom}
        material={g.stone}
        position={[(TERRACE.x0 + TERRACE.x1) / 2, 0.05, (TERRACE.z0 + TERRACE.z1) / 2]}
        receiveShadow
      />
      {/* Allée pavée vers l'entrée (façade gauche) */}
      <mesh position={[(DRIVE.x0 + DRIVE.x1) / 2, 0.02, (DRIVE.z0 + DRIVE.z1) / 2]} material={g.pavers} receiveShadow>
        <boxGeometry args={[DRIVE.x1 - DRIVE.x0, 0.04, driveLen]} />
      </mesh>
      <mesh position={[-5.6, 0.02, 1.5]} material={g.pavers} receiveShadow>
        <boxGeometry args={[1.3, 0.04, 1.8]} />
      </mesh>
      {/* Bordures de l'allée */}
      {[DRIVE.x0 - 0.06, DRIVE.x1 + 0.06].map((x) => (
        <mesh key={x} position={[x, 0.05, (DRIVE.z0 + DRIVE.z1) / 2]} material={g.coping} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.1, driveLen]} />
        </mesh>
      ))}
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
      {/* Deux bains de soleil sur la plage */}
      {[-1.2, 0.4].map((x) => (
        <group key={x} position={[x, 0, -d / 2 - c - 1.25]} rotation-y={Math.PI}>
          <mesh position={[0, 0.32, 0]} material={g.lounger} castShadow>
            <boxGeometry args={[0.7, 0.1, 1.5]} />
          </mesh>
          <mesh position={[0, 0.5, -0.78]} rotation-x={-0.9} material={g.lounger} castShadow>
            <boxGeometry args={[0.7, 0.1, 0.6]} />
          </mesh>
          <mesh position={[0, 0.14, 0]} material={g.loungerFrame}>
            <boxGeometry args={[0.6, 0.28, 1.3]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Palmiers                                                                   */
/* -------------------------------------------------------------------------- */
function palmGeometries(height: number, lean: number, seed: number) {
  const rand = seededRandom(seed);
  // Stipe légèrement courbé, plus épais à la base
  const top = new THREE.Vector3(lean * 0.8, height, lean * 0.3);
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(lean * 0.15, height * 0.35, lean * 0.05),
    new THREE.Vector3(lean * 0.45, height * 0.7, lean * 0.15),
    top,
  ]);
  const segments = 24;
  const radial = 10;
  const trunk = new THREE.TubeGeometry(path, segments, 0.17, radial, false);
  const pos = trunk.attributes.position;
  const center = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    path.getPointAt(t, center);
    // Base évasée, anneaux légers
    const taper = 1.35 - 0.5 * t + (t < 0.08 ? (0.08 - t) * 6 : 0) + Math.sin(t * 90) * 0.03;
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, k).sub(center).multiplyScalar(taper).add(center);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  trunk.computeVertexNormals();

  // Couronne de palmes : rubans arqués qui retombent
  const fronds: THREE.BufferGeometry[] = [];
  const count = 13;
  for (let f = 0; f < count; f++) {
    const azimuth = (f / count) * Math.PI * 2 + rand() * 0.3;
    const elev = 0.55 - rand() * 0.5; // certaines palmes montent, d'autres retombent
    const length = 2.4 + rand() * 0.9;
    const dir = new THREE.Vector3(Math.cos(azimuth), 0, Math.sin(azimuth));
    const side = new THREE.Vector3(-dir.z, 0, dir.x);
    const n = 12;
    const positions: number[] = [];
    const uvs: number[] = [];
    const index: number[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const along = length * t;
      const p = top
        .clone()
        .addScaledVector(dir, along * Math.cos(elev))
        .add(new THREE.Vector3(0, along * Math.sin(elev) - 1.1 * t * t * length * 0.5, 0));
      const width = 0.95 * Math.sin(Math.PI * Math.min(1, t * 1.05)) ** 0.7 + 0.05;
      const fold = new THREE.Vector3(0, width * 0.12, 0); // légère forme en V
      const left = p.clone().addScaledVector(side, -width / 2).sub(fold);
      const right = p.clone().addScaledVector(side, width / 2).sub(fold);
      positions.push(left.x, left.y, left.z, p.x, p.y, p.z, right.x, right.y, right.z);
      uvs.push(0, t, 0.5, t, 1, t);
      if (i < n) {
        const a = i * 3;
        index.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(index);
    g.computeVertexNormals();
    fronds.push(g);
  }
  return { trunk, fronds: mergeGeometries(fronds)!, top };
}

const PALMS: { pos: [number, number]; h: number; lean: number }[] = [
  { pos: [9.6, 8.6], h: 6.5, lean: 0.9 },
  { pos: [8.4, 11.8], h: 7.6, lean: 1.2 },
  { pos: [-4.2, 12.4], h: 5.6, lean: -0.8 },
  { pos: [-10.6, -2.5], h: 7.2, lean: -1 },
  { pos: [7.2, -6.2], h: 6.2, lean: 0.7 },
];

function Palm({ g, x, z, h, lean, seed }: { g: GM; x: number; z: number; h: number; lean: number; seed: number }) {
  const { trunk, fronds, top } = useMemo(() => palmGeometries(h, lean, seed), [h, lean, seed]);
  return (
    <group position={[x, 0, z]}>
      <mesh geometry={trunk} material={g.trunk} castShadow receiveShadow />
      <mesh geometry={fronds} material={g.frond} customDepthMaterial={g.frondDepth} castShadow />
      <mesh position={top} material={g.trunk}>
        <sphereGeometry args={[0.22, 12, 8]} />
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
  { x0: -W / 2 + 0.5, x1: W / 2 - 0.5, z0: -D / 2 - 1.4, z1: -D / 2 - 0.3 }, // à l'arrière
  { x0: -5.9, x1: -5.3, z0: -D / 2, z1: 0.4 }, // près de l'entrée
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
      {/* Buis taillés le long de l'allée */}
      {Array.from({ length: 9 }, (_, i) => (
        <RoundedBox
          key={i}
          args={[0.7, 0.6, 0.7]}
          radius={0.25}
          smoothness={3}
          position={[DRIVE.x1 + 0.7, 0.3, 3 + i * 2.6]}
          material={g.boxwood}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Arbres en arrière-plan (ils se fondent dans la brume)                      */
/* -------------------------------------------------------------------------- */
function BackgroundTrees({ g, narrow }: { g: GM; narrow: boolean }) {
  const crowns = useRef<THREE.InstancedMesh>(null);
  const cypress = useRef<THREE.InstancedMesh>(null);
  const trunks = useRef<THREE.InstancedMesh>(null);
  const trees = useMemo(() => {
    const rand = seededRandom(31);
    const list: { x: number; z: number; h: number; r: number; hue: number; kind: "round" | "cypress" }[] = [];
    const n = narrow ? 30 : 60;
    let guard = 0;
    while (list.length < n && guard++ < 1000) {
      const a = rand() * Math.PI * 2;
      const dist = 60 + rand() * 80;
      const x = Math.cos(a) * dist;
      const z = Math.sin(a) * dist;
      // on garde dégagée la vue depuis la caméra (quart +x +z) et l'allée
      if (x > 0 && z > 0) continue;
      if (x > -10 && x < -5 && z > 0) continue;
      const kind = rand() < 0.45 ? "cypress" : "round";
      list.push({ x, z, h: kind === "cypress" ? 7 + rand() * 5 : 3.5 + rand() * 3.5, r: 2 + rand() * 2.2, hue: rand(), kind });
    }
    return list;
  }, [narrow]);
  const rounds = trees.filter((t) => t.kind === "round");
  const cypresses = trees.filter((t) => t.kind === "cypress");

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    rounds.forEach((t, i) => {
      dummy.position.set(t.x, t.h + t.r * 0.6, t.z);
      dummy.scale.set(t.r, t.r * 1.05, t.r);
      dummy.updateMatrix();
      crowns.current!.setMatrixAt(i, dummy.matrix);
      crowns.current!.setColorAt(i, color.setHSL(0.24 + t.hue * 0.06, 0.4, 0.2 + t.hue * 0.07));
      dummy.position.set(t.x, (t.h + 0.4) / 2, t.z);
      dummy.scale.set(1, t.h + 0.4, 1);
      dummy.updateMatrix();
      trunks.current!.setMatrixAt(i, dummy.matrix);
    });
    cypresses.forEach((t, i) => {
      dummy.position.set(t.x, t.h / 2, t.z);
      dummy.scale.set(t.r * 0.32, t.h / 2, t.r * 0.32);
      dummy.updateMatrix();
      cypress.current!.setMatrixAt(i, dummy.matrix);
      cypress.current!.setColorAt(i, color.setHSL(0.3 + t.hue * 0.05, 0.35, 0.14 + t.hue * 0.05));
    });
    [crowns, trunks, cypress].forEach((r) => {
      r.current!.instanceMatrix.needsUpdate = true;
      if (r.current!.instanceColor) r.current!.instanceColor.needsUpdate = true;
    });
  }, [rounds, cypresses]);

  return (
    <group>
      <instancedMesh ref={crowns} args={[undefined, g.treeLeaf, rounds.length]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
      </instancedMesh>
      <instancedMesh ref={trunks} args={[undefined, g.trunk, rounds.length]}>
        <cylinderGeometry args={[0.12, 0.18, 1, 6]} />
      </instancedMesh>
      {/* Cyprès : fuseaux sombres, très méditerranéens */}
      <instancedMesh ref={cypress} args={[undefined, g.treeLeaf, cypresses.length]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
      </instancedMesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ciel de plein jour : dôme en dégradé (bleu au zénith, clair à l'horizon)   */
/* -------------------------------------------------------------------------- */
export const HORIZON = "#d3e4f2";

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
          void main() { float h = max(vPos.y, 0.0); gl_FragColor = vec4(mix(horizon, top, smoothstep(0.0, 0.32, h)), 1.0);
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

function SkyClouds({ narrow }: { narrow: boolean }) {
  const clouds: { pos: [number, number, number]; bounds: [number, number, number]; seed: number }[] = [
    { pos: [-70, 32, -160], bounds: [40, 4, 8], seed: 1 },
    { pos: [40, 40, -190], bounds: [55, 5, 10], seed: 2 },
    { pos: [-170, 36, -30], bounds: [40, 4, 20], seed: 3 },
    { pos: [-20, 48, -140], bounds: [30, 4, 8], seed: 4 },
  ];
  return (
    <Clouds texture={cloudTexture} material={THREE.MeshBasicMaterial} limit={narrow ? 120 : 250}>
      {clouds.slice(0, narrow ? 2 : 4).map((c) => (
        <Cloud
          key={c.seed}
          seed={c.seed}
          position={c.pos}
          bounds={c.bounds}
          segments={narrow ? 14 : 26}
          volume={16}
          opacity={0.7}
          speed={0.08}
          color="#ffffff"
          fade={200}
        />
      ))}
    </Clouds>
  );
}

/* -------------------------------------------------------------------------- */
export function Garden({ narrow }: { narrow: boolean }) {
  const g = useGardenMaterials();
  return (
    <group>
      <SkyDome />
      <SkyClouds narrow={narrow} />
      <Ground g={g} />
      <Hardscape g={g} />
      <Pool g={g} />
      <Beds g={g} narrow={narrow} />
      {PALMS.map((p, i) => (
        <Palm key={i} g={g} x={p.pos[0]} z={p.pos[1]} h={p.h} lean={p.lean} seed={100 + i} />
      ))}
      <BackgroundTrees g={g} narrow={narrow} />
    </group>
  );
}
