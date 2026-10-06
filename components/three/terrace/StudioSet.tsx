"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { seededRandom } from "./random";

/*
 * Décor « studio » (page labo, style page produit) : la maison est présentée comme un objet,
 * sur un jardin très épuré qui se fond dans le fond clair de la page.
 * Pelouse en disque, dallage de pierre devant la baie, quelques buis taillés en boule.
 */

const W = 10;
const D = 8;

// Fond « surexposé » : après le rendu cinéma (tone mapping ACES), il ressort au blanc cassé Apple (~#f5f5f7)
export const STUDIO_BG = new THREE.Color(1.45, 1.45, 1.48);

export function StudioSet() {
  const mats = useMemo(
    () => ({
      lawn: new THREE.MeshStandardMaterial({ color: "#9cba78", roughness: 0.95 }),
      stone: new THREE.MeshStandardMaterial({ color: "#e4ded3", roughness: 0.8 }),
      box: new THREE.MeshStandardMaterial({ color: "#5f7d45", roughness: 0.9, flatShading: true }),
    }),
    [],
  );

  // Buis taillés en boule, légèrement irréguliers (géométrie déformée une fois pour toutes)
  const shrubs = useMemo(() => {
    const rand = seededRandom(7);
    const spots: [number, number, number][] = [
      [W / 2 + 1.4, 0, -1.8],
      [W / 2 + 1.9, 0, 0.4],
      [W / 2 + 1.3, 0, 2.4],
      [-W / 2 - 1.5, 0, 1.6],
    ];
    return spots.map((p, i) => {
      const r = 0.55 + rand() * 0.25;
      const g = new THREE.IcosahedronGeometry(r, 3);
      const pos = g.attributes.position;
      for (let k = 0; k < pos.count; k++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, k);
        v.multiplyScalar(1 + (rand() - 0.5) * 0.08);
        pos.setXYZ(k, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
      return { key: i, geometry: g, position: [p[0], r * 0.85, p[2]] as [number, number, number] };
    });
  }, []);

  return (
    <group>
      {/* Pelouse : disque qui se fond dans le fond de page grâce au brouillard clair */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 1]} material={mats.lawn} receiveShadow>
        <circleGeometry args={[140, 96]} />
      </mesh>
      {/* Dallage devant la façade vitrée */}
      <mesh position={[0, 0.03, D / 2 + 1.6]} material={mats.stone} receiveShadow castShadow>
        <boxGeometry args={[W + 1.2, 0.06, 3.2]} />
      </mesh>
      {shrubs.map((s) => (
        <mesh key={s.key} geometry={s.geometry} position={s.position} material={mats.box} castShadow receiveShadow />
      ))}
    </group>
  );
}
