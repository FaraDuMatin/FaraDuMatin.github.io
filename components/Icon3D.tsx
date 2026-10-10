'use client';

import { useEffect, useRef, useState } from 'react';

// Header icon as a small 3D model (public/icons-3d/*.glb) that turns like a turntable while
// the parent link is hovered, and finishes its turn on leave. three.js loads after the page, so
// the flat `fallback` icon shows until the model is ready (and stays if WebGL fails).
// Renders only while it's moving; idle costs nothing.
const SPEED = 0.05; // radians per frame while hovered
const EASE = 0.08;  // per-frame approach to the target angle
const TAU = Math.PI * 2;
const REST = { x: -0.45, y: 0 }; // resting angle: looking up, so the bottom edge shows without hover
const DEPTH = 2;   // thickness multiplier (the models are only 3 deep for 24 wide)

export default function Icon3D({ src, fallback, size = 32, className = '' }: { src: string; fallback: React.ReactNode; size?: number; className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const host = canvas?.closest('a') ?? canvas?.parentElement;
        if (!canvas || !host) return;
        let disposed = false;
        let cleanup = () => {};

        (async () => {
            const THREE = await import('three');
            const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
            if (disposed) return;

            let renderer: InstanceType<typeof THREE.WebGLRenderer>;
            try {
                renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            } catch { return; } // no WebGL: keep the flat icon
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(size, size, false);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(30, 1, 1, 200);
            camera.position.set(0, 0, 56);
            // Low ambient + a strong front-left key: bright face, darker sides, so the depth reads.
            scene.add(new THREE.AmbientLight(0xffffff, 0.35));
            const key = new THREE.DirectionalLight(0xffffff, 3);
            key.position.set(-15, 20, 40);
            scene.add(key);
            const rim = new THREE.DirectionalLight(0xbcd4ff, 0.8);
            rim.position.set(30, -10, -10);
            scene.add(rim);

            const gltf = await new GLTFLoader().loadAsync(src).catch(() => null);
            if (disposed || !gltf) { renderer.dispose(); return; }
            const pivot = new THREE.Group();
            const material = new THREE.MeshStandardMaterial({ color: 0xf4f6fa, roughness: 0.35, metalness: 0.15, flatShading: true });
            gltf.scene.traverse(obj => {
                if (obj instanceof THREE.Mesh) {
                    obj.geometry.computeVertexNormals();
                    obj.material = material;
                }
            });
            gltf.scene.scale.z = DEPTH;
            // Center on the origin so it turns around its middle.
            const box = new THREE.Box3().setFromObject(gltf.scene);
            gltf.scene.position.sub(box.getCenter(new THREE.Vector3()));
            pivot.add(gltf.scene);
            scene.add(pivot);

            let angle = REST.y; // target turn
            pivot.rotation.set(REST.x, REST.y, 0);
            let hovered = false;
            let frame = 0;
            const draw = () => renderer.render(scene, camera);
            const tick = () => {
                if (hovered) angle += SPEED;
                pivot.rotation.y += (angle - pivot.rotation.y) * EASE;
                draw();
                const settled = !hovered && Math.abs(angle - pivot.rotation.y) < 0.001;
                frame = settled ? 0 : requestAnimationFrame(tick);
            };
            const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };

            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const onEnter = (e: PointerEvent) => {
                if (reduced || e.pointerType === 'touch') return;
                hovered = true;
                kick();
            };
            const onLeave = () => {
                hovered = false;
                angle = REST.y + Math.ceil((angle - REST.y) / TAU) * TAU; // finish the turn, face front
                kick();
            };
            host.addEventListener('pointerenter', onEnter);
            host.addEventListener('pointerleave', onLeave);

            draw();
            setReady(true);

            cleanup = () => {
                cancelAnimationFrame(frame);
                host.removeEventListener('pointerenter', onEnter);
                host.removeEventListener('pointerleave', onLeave);
                gltf.scene.traverse(obj => { if (obj instanceof THREE.Mesh) obj.geometry.dispose(); });
                material.dispose();
                renderer.dispose();
            };
        })();

        return () => { disposed = true; cleanup(); };
    }, [src, size]);

    return (
        <span className={`relative inline-grid place-items-center ${className}`} style={{ width: size, height: size }}>
            <canvas ref={canvasRef} aria-hidden style={{ width: size, height: size }}
                className={`absolute inset-0 transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`} />
            <span aria-hidden className={`transition-opacity duration-300 ${ready ? 'opacity-0' : 'opacity-100'}`}>{fallback}</span>
        </span>
    );
}
