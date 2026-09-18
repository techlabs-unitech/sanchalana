"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";

function CameraModel() {
  const modelRef = useRef();

  const { scene } = useGLTF("/models/studio-camera.glb");

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={2}
      position={[0, -1.5, 0]}
    />
  );
}

useGLTF.preload("/models/studio-camera.glb");

export default function ThreeScene() {
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <Canvas camera={{ position: [0, 1, 7], fov: 45 }}>
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
        />

        <directionalLight
          position={[-5, 2, -5]}
          intensity={1}
        />

        <CameraModel />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}