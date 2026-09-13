"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Group, MathUtils, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { createJetGeometries, type JetFinish } from "@/lib/scene/jet-geometry";

export type JetModelProps = { reveal: RefObject<number> };

function createFinishes() {
  return {
    pearl: new MeshPhysicalMaterial({ color: "#e6eae9", metalness: 0.25, roughness: 0.27, clearcoat: 0.9, clearcoatRoughness: 0.19, side: DoubleSide }),
    wingPanel: new MeshStandardMaterial({ color: "#cdd7da", metalness: 0.32, roughness: 0.34, side: DoubleSide }),
    silver: new MeshStandardMaterial({ color: "#7f97a2", metalness: 0.87, roughness: 0.25, side: DoubleSide }),
    dark: new MeshPhysicalMaterial({ color: "#102731", metalness: 0.45, roughness: 0.16, clearcoat: 1, side: DoubleSide }),
    ink: new MeshStandardMaterial({ color: "#223941", metalness: 0.45, roughness: 0.32, side: DoubleSide }),
    gold: new MeshStandardMaterial({ color: "#a48c61", metalness: 0.75, roughness: 0.33, side: DoubleSide }),
    leather: new MeshPhysicalMaterial({ color: "#93552f", metalness: 0.025, roughness: 0.57, clearcoat: 0.13 }),
    ivory: new MeshStandardMaterial({ color: "#e1d2b7", metalness: 0.02, roughness: 0.70 }),
    wood: new MeshStandardMaterial({ color: "#3d281c", metalness: 0.04, roughness: 0.45 }),
    woodLight: new MeshStandardMaterial({ color: "#755139", metalness: 0.03, roughness: 0.5 }),
    rug: new MeshStandardMaterial({ color: "#a89b84", metalness: 0, roughness: 0.98 }),
    light: new MeshStandardMaterial({ color: "#ffe2a5", emissive: "#ffd29a", emissiveIntensity: 2.2, toneMapped: false }),
  } satisfies Record<JetFinish, MeshStandardMaterial>;
}

/** One aircraft throughout the journey. The same open cabin closes for side flight. */
export default function JetModel({ reveal }: JetModelProps) {
  const upperRef = useRef<Group>(null);
  const cabinRef = useRef<Group>(null);
  const geometry = useMemo(() => createJetGeometries(), []);
  const finishes = useMemo(() => createFinishes(), []);
  const upperFinishes = useMemo(() => {
    const cloned = { pearl: finishes.pearl.clone(), silver: finishes.silver.clone(), dark: finishes.dark.clone() };
    Object.values(cloned).forEach((material) => {
      material.transparent = true;
      material.forceSinglePass = true;
    });
    return cloned;
  }, [finishes]);

  useEffect(() => () => {
    [...geometry.exterior, ...geometry.upper, ...geometry.cabin].forEach((part) => part.geometry.dispose());
    Object.values(finishes).forEach((material) => material.dispose());
    Object.values(upperFinishes).forEach((material) => material.dispose());
  }, [geometry, finishes, upperFinishes]);

  useFrame(() => {
    const amount = MathUtils.clamp(Number.isFinite(reveal.current) ? reveal.current : 0, 0, 1);
    if (upperRef.current) {
      upperRef.current.position.set(amount * 0.12, amount * 1.9, 0);
      upperRef.current.rotation.z = -amount * 0.055;
      upperRef.current.visible = amount < 0.995;
    }
    if (cabinRef.current) cabinRef.current.visible = amount > 0.003;
    const opacity = 1 - MathUtils.smoothstep(amount, 0.12, 0.84);
    Object.values(upperFinishes).forEach((material) => {
      material.opacity = opacity;
      material.depthWrite = amount < 0.13;
    });
  }, -1);

  return (
    <group name="JetRoot" dispose={null}>
      <group name="AircraftExterior">
        {geometry.exterior.map((part) => (
          <mesh key={`${part.name}-${part.material}`} name={part.name} geometry={part.geometry} material={finishes[part.material]} castShadow receiveShadow />
        ))}
      </group>
      <group ref={upperRef} name="FuselageUpper">
        {geometry.upper.map((part) => (
          <mesh key={`${part.name}-${part.material}`} name={part.name} geometry={part.geometry} material={upperFinishes[part.material as keyof typeof upperFinishes]} castShadow receiveShadow />
        ))}
      </group>
      <group ref={cabinRef} name="CabinInterior" visible={false}>
        {geometry.cabin.map((part) => (
          <mesh key={`${part.name}-${part.material}`} name={part.name} geometry={part.geometry} material={finishes[part.material]} castShadow receiveShadow />
        ))}
      </group>
    </group>
  );
}
