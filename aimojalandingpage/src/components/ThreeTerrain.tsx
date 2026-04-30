import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeTerrain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create terrain
    const geometry = new THREE.PlaneGeometry(20, 20, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0x009B3A,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -2;
    scene.add(terrain);

    // Animate terrain
    const positions = geometry.attributes.position;
    if (!positions) return;
    const originalPositions = positions.array.slice();

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      for (let i = 0; i < positions.count; i++) {
        const x = originalPositions[i * 3];
        const y = originalPositions[i * 3 + 1];
        if (x === undefined || y === undefined) continue;
        const z = Math.sin(x * 0.5 + time) * 0.3 + Math.cos(y * 0.5 + time) * 0.3;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;

      terrain.rotation.z = Math.sin(time * 0.2) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    camera.position.z = 5;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
