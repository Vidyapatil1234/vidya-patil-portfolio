// HeroScene.jsx
// Interactive 3D "signal core" centrepiece rendered with Three.js.
// Features an outer wireframe icosahedron, an inner point cloud core,
// and a tilted orbit ring with drag & mouse-tilt controls.
import { useEffect, useRef } from 'react';

import * as THREE from 'three';

export default function HeroScene({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced-motion preferences: skip auto-spin and intro animation.
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 1. Scene, Camera & Renderer ───────────────────────────────────────
    const scene = new THREE.Scene();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // ── 2. 3D Meshes & Group ──────────────────────────────────────────────
    const group = new THREE.Group();

    // (1) Outer shell: Edges of an Icosahedron (radius 1.9, detail 1) in signal orange.
    const outerGeom = new THREE.IcosahedronGeometry(1.9, 1);
    const edgesGeom = new THREE.EdgesGeometry(outerGeom);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: isReduced ? 0.9 : 0,
    });
    const outerShell = new THREE.LineSegments(edgesGeom, outerMat);
    group.add(outerShell);

    // (2) Inner core: Dense point cloud (radius 1.15, detail 4) in bone color.
    const innerGeom = new THREE.IcosahedronGeometry(1.15, 4);
    const innerMat = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    });
    const innerCore = new THREE.Points(innerGeom, innerMat);
    group.add(innerCore);

    // (3) Orbit ring: 128 points around an ellipse radius 2.7, tilted at PI / 2.4.
    const curve = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, 2 * Math.PI, false, 0);
    const ringPoints = curve.getPoints(128);
    const ringGeom = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    });
    const orbitRing = new THREE.LineLoop(ringGeom, ringMat);
    orbitRing.rotation.x = Math.PI / 2.4;
    group.add(orbitRing);

    scene.add(group);

    // Initial scale: 0.6 if animating intro, or 1.0 if reduced motion.
    if (!isReduced) {
      group.scale.set(0.6, 0.6, 0.6);
    } else {
      group.scale.set(1, 1, 1);
    }

    // ── 3. Interaction State ──────────────────────────────────────────────
    const state = {
      isDragging: false,
      lastX: 0,
      lastY: 0,
      dragSpinX: 0,
      dragSpinY: 0,
      autoSpinY: 0,
      tiltTargetX: 0,
      tiltTargetY: 0,
      isVisible: true,
      animId: 0,
    };

    // Mouse tilt on window pointermove.
    const onWindowPointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      state.tiltTargetY = normX * 0.4;
      state.tiltTargetX = normY * 0.25;

      if (state.isDragging) {
        const deltaX = e.clientX - state.lastX;
        const deltaY = e.clientY - state.lastY;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.dragSpinY += deltaX * 0.01;
        state.dragSpinX += deltaY * 0.01;
      }
    };

    // Canvas pointerdown starts dragging.
    const onCanvasPointerDown = (e) => {
      state.isDragging = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
    };

    // Pointerup ends dragging.
    const onWindowPointerUp = () => {
      state.isDragging = false;
    };

    window.addEventListener('pointermove', onWindowPointerMove);
    renderer.domElement.addEventListener('pointerdown', onCanvasPointerDown);
    window.addEventListener('pointerup', onWindowPointerUp);

    // ── 4. Resize Handling ────────────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener('resize', onResize);
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(container);

    // ── 5. Off-Screen Pausing (IntersectionObserver) ───────────────────────
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    // ── 6. Animation Loop ─────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const startTime = performance.now();

    const animate = () => {
      state.animId = requestAnimationFrame(animate);

      // Pause rendering while scrolled off-screen.
      if (!state.isVisible) return;

      const elapsedSec = (performance.now() - startTime) / 1000;

      // Intro "materialisation": scale 0.6 -> 1.0, edge opacity 0 -> 0.9 over 1s.
      if (!isReduced) {
        if (elapsedSec < 1.0) {
          const progress = Math.min(elapsedSec / 1.0, 1);
          // Ease-out cubic curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentScale = 0.6 + (1 - 0.6) * easeOut;
          group.scale.set(currentScale, currentScale, currentScale);
          outerMat.opacity = 0.9 * easeOut;
        } else {
          group.scale.set(1, 1, 1);
          outerMat.opacity = 0.9;
        }

        // Auto-spin on Y (+0.0025 per frame)
        state.autoSpinY += 0.0025;

        // Inner points rotate in the opposite direction (-time * 0.15)
        const time = clock.getElapsedTime();
        innerCore.rotation.y = -time * 0.15;
      }

      // Easing toward target rotation (factor 0.06)
      const targetRotationX = state.dragSpinX + state.tiltTargetX;
      const targetRotationY = state.autoSpinY + state.dragSpinY + state.tiltTargetY;
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.06;
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.06;

      renderer.render(scene, camera);
    };

    state.animId = requestAnimationFrame(animate);

    // ── 7. Comprehensive Cleanup on Unmount ───────────────────────────────
    return () => {
      cancelAnimationFrame(state.animId);

      observer.disconnect();
      resizeObserver.disconnect();

      window.removeEventListener('pointermove', onWindowPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onCanvasPointerDown);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('resize', onResize);

      // Dispose all geometries
      outerGeom.dispose();
      edgesGeom.dispose();
      innerGeom.dispose();
      ringGeom.dispose();

      // Dispose all materials
      outerMat.dispose();
      innerMat.dispose();
      ringMat.dispose();

      // Dispose renderer & release context
      renderer.dispose();
      renderer.forceContextLoss();

      // Remove canvas from container
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []); // ONE useEffect

  return (
    <div
      ref={containerRef}
      className={`h-full w-full cursor-grab active:cursor-grabbing touch-none select-none ${className}`}
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  );
}
