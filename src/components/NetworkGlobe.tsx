import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface Point {
  position: [number, number, number];
  color: string;
}

interface NetworkGlobeProps {
  points: Point[];
  connections: [Point, Point][];
}

export function NetworkGlobe({ points, connections }: NetworkGlobeProps) {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <Sphere ref={globeRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial
          color="#1e40af"
          transparent
          opacity={0.3}
          wireframe
        />
      </Sphere>
      
      {points.map((point, i) => (
        <Sphere key={i} args={[0.02, 16, 16]} position={point.position}>
          <meshBasicMaterial color={point.color} />
        </Sphere>
      ))}

      {connections.map(([start, end], i) => (
        <Line
          key={i}
          points={[start.position, end.position]}
          color="#60a5fa"
          lineWidth={1}
        />
      ))}
    </>
  );
}