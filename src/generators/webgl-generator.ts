import { DesignGenome } from "../genome/types.js";

export class WebGLGenerator {
    generateR3F(genome: DesignGenome): string {
        const { material, roughness, transmission } = genome.chromosomes.ch14_physics;

        if (material === "glass") {
            return `// React Three Fiber - Glass Material
import { Canvas } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';

export function Procedural3D() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshTransmissionMaterial 
          roughness={${roughness}}
          transmission={${transmission}}
          thickness={0.5}
          ior={1.5}
        />
      </mesh>
    </Canvas>
  );
}`;
        } else if (material === "metallic") {
            return `// React Three Fiber - Metallic Material
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

export function Procedural3D() {
  return (
    <Canvas>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Environment preset="studio" />
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          metalness={1}
          roughness={${roughness}}
        />
      </mesh>
    </Canvas>
  );
}`;
        } else {
            return `// WebGL disabled for this topology (${material})`;
        }
    }
}
