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
                    roughness={0.3858823529411765}
                />
            </mesh>
        </Canvas>
    );
}
