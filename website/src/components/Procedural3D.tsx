import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import type { Mesh } from 'three';

/* Permutations Generated DNA:
 * Material: glass
 * Roughness: 0.048627450980392145
 * Transmission: 0.8949019607843138
 * Geometry: torusKnot
 */

function GlassOrganism() {
    const meshRef = useRef<Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.15;
            meshRef.current.rotation.y += delta * 0.25;
        }
    });

    return (
        <mesh ref={meshRef} scale={1.2} position={[2, 0, 0]}>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <MeshTransmissionMaterial
                roughness={0.048627450980392145}
                transmission={0.8949019607843138}
                thickness={0.5}
                ior={1.5}
                color="#7f93c9"
            />
        </mesh>
    );
}

export function Procedural3D() {
    return (
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            <GlassOrganism />
        </Canvas>
    );
}
