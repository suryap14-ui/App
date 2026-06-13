import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Pure-imperative Three.js hero scene. Avoids R3F JSX entirely so the
 * Emergent visual-edits babel transform (which injects data-line-number
 * source props) doesn't poison three.js object prop application.
 */
export const HeroScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const l1 = new THREE.PointLight(0x00f0ff, 4, 50);
    l1.position.set(10, 10, 10);
    scene.add(l1);
    const l2 = new THREE.PointLight(0xb026ff, 3.5, 50);
    l2.position.set(-10, -10, -5);
    scene.add(l2);
    const l3 = new THREE.PointLight(0xffffff, 1.5, 50);
    l3.position.set(0, 5, 5);
    scene.add(l3);

    // ===== Main AI Orb =====
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Outer wireframe shell
    const shellGeo = new THREE.IcosahedronGeometry(1.55, 4);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a2a,
      emissive: 0x2a0a55,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    orbGroup.add(shell);

    // Inner core
    const coreGeo = new THREE.SphereGeometry(0.85, 48, 48);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.6,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(core);

    // Violet bloom
    const bloomGeo = new THREE.SphereGeometry(1.05, 48, 48);
    const bloomMat = new THREE.MeshBasicMaterial({
      color: 0xb026ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    orbGroup.add(new THREE.Mesh(bloomGeo, bloomMat));

    // Orbital rings
    const haloGroup = new THREE.Group();
    orbGroup.add(haloGroup);
    const rings = [
      { r: 2.1, t: 0.012, c: 0x00f0ff, o: 0.7, rot: [Math.PI / 2.5, 0, 0] },
      { r: 2.35, t: 0.008, c: 0xb026ff, o: 0.65, rot: [Math.PI / 1.8, Math.PI / 4, 0] },
      { r: 2.6, t: 0.006, c: 0x00f0ff, o: 0.45, rot: [Math.PI / 3, -Math.PI / 3, 0] },
    ];
    rings.forEach((r) => {
      const g = new THREE.TorusGeometry(r.r, r.t, 16, 100);
      const m = new THREE.MeshBasicMaterial({ color: r.c, transparent: true, opacity: r.o });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.set(...r.rot);
      haloGroup.add(mesh);
    });

    // ===== Floating polyhedra =====
    const floaters = [];
    const floaterData = [
      { pos: [-3.4, 1.8, -1], color: 0x00f0ff, scale: 0.42, wire: true },
      { pos: [3.6, -1.6, -2], color: 0xb026ff, scale: 0.55, wire: true },
      { pos: [-2.6, -2.2, 0], color: 0x00f0ff, scale: 0.22, wire: false },
      { pos: [3, 2.4, -1.5], color: 0xb026ff, scale: 0.28, wire: false },
    ];
    floaterData.forEach((f) => {
      const g = new THREE.IcosahedronGeometry(f.scale, f.wire ? 0 : 1);
      const m = new THREE.MeshStandardMaterial({
        color: f.color,
        emissive: f.color,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: f.wire,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...f.pos);
      mesh.userData = { base: f.pos.slice(), phase: Math.random() * Math.PI * 2 };
      scene.add(mesh);
      floaters.push(mesh);
    });

    // ===== Particle field =====
    const count = 600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color(0x00f0ff);
    const violet = new THREE.Color(0xb026ff);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() > 0.5 ? cyan : violet;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ===== Mouse parallax =====
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.3;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3;
    };
    window.addEventListener("mousemove", onMove);

    // ===== Animate =====
    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();

      // Orb rotation + breathing core
      orbGroup.rotation.y = t * 0.25;
      orbGroup.rotation.x = Math.sin(t * 0.3) * 0.15;
      orbGroup.position.y = Math.sin(t * 0.7) * 0.15;
      const s = 1 + Math.sin(t * 2) * 0.06;
      core.scale.set(s, s, s);

      haloGroup.rotation.y = -t * 0.4;
      haloGroup.rotation.z = t * 0.2;

      // Floaters orbit
      floaters.forEach((f, i) => {
        const base = f.userData.base;
        const phase = f.userData.phase;
        f.position.y = base[1] + Math.sin(t * (1 + i * 0.2) + phase) * 0.4;
        f.position.x = base[0] + Math.cos(t * 0.6 + phase) * 0.25;
        f.rotation.x = t * 0.4;
        f.rotation.y = t * 0.3;
      });

      // Particles slow drift
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.02;

      // Camera parallax
      camera.position.x += (target.x * 2 - camera.position.x) * 0.05;
      camera.position.y += (-target.y * 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} data-testid="three-hero-scene" />;
};

/**
 * Smaller decorative scene for Capabilities section.
 */
export const CapabilitiesScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const l1 = new THREE.PointLight(0x00f0ff, 3, 30);
    l1.position.set(5, 5, 5);
    scene.add(l1);
    const l2 = new THREE.PointLight(0xb026ff, 2.5, 30);
    l2.position.set(-5, -5, -5);
    scene.add(l2);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 1),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.5,
        wireframe: true,
      })
    );
    scene.add(wire);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0xb026ff,
        emissive: 0xb026ff,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.7,
      })
    );
    scene.add(sphere);

    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      wire.rotation.x = t * 0.5;
      wire.rotation.y = t * 0.3;
      wire.position.y = Math.sin(t * 1.4) * 0.25;
      sphere.position.x = Math.cos(t * 1.1) * 0.4;
      sphere.position.y = Math.sin(t * 1.1) * 0.3;
      sphere.rotation.y = t * 0.6;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} data-testid="three-capabilities-scene" />;
};
