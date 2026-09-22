import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface FragmentPiece {
  mesh: THREE.Mesh | THREE.Group;
  assembledPos: THREE.Vector3;
  assembledRot: THREE.Euler;
  scatteredPos: THREE.Vector3;
  scatteredRot: THREE.Euler;
  delay: number;
}

export function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAssemblyComplete, setIsAssemblyComplete] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080a, 0.045);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, isMobile ? 5.8 : 4.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Master Group for the Mannequin
    const characterRoot = new THREE.Group();
    characterRoot.position.set(0, -0.4, 0);
    scene.add(characterRoot);

    // Torso Group
    const torsoGroup = new THREE.Group();
    characterRoot.add(torsoGroup);

    // Head Group (Articulated to follow mouse)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.2, 0);
    characterRoot.add(headGroup);

    // Materials - Obsidian Futuristic Mannequin
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x121318,
      roughness: 0.32,
      metalness: 0.85,
    });

    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x1d2029,
      roughness: 0.2,
      metalness: 0.95,
    });

    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      opacity: 0.95,
      transparent: true,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: false,
    });

    const fragmentPieces: FragmentPiece[] = [];

    // Helper to register a fragment mesh with scattered & assembled coordinates
    const registerFragment = (
      mesh: THREE.Mesh | THREE.Group,
      parent: THREE.Group,
      targetPos: THREE.Vector3,
      targetRot: THREE.Euler,
      delayFraction = 0
    ) => {
      parent.add(mesh);

      // Random scattered position in a 3D sphere/box
      const scatterRadius = isMobile ? 2.5 : 4.0;
      const scatteredPos = new THREE.Vector3(
        targetPos.x + (Math.random() - 0.5) * scatterRadius * 2,
        targetPos.y + (Math.random() - 0.5) * scatterRadius * 1.8 + 1.0,
        targetPos.z + (Math.random() - 0.5) * scatterRadius * 2
      );

      const scatteredRot = new THREE.Euler(
        targetRot.x + (Math.random() - 0.5) * Math.PI * 2,
        targetRot.y + (Math.random() - 0.5) * Math.PI * 2,
        targetRot.z + (Math.random() - 0.5) * Math.PI * 2
      );

      // Initialize mesh at scattered state
      if (!prefersReducedMotion) {
        mesh.position.copy(scatteredPos);
        mesh.rotation.copy(scatteredRot);
      } else {
        mesh.position.copy(targetPos);
        mesh.rotation.copy(targetRot);
      }

      fragmentPieces.push({
        mesh,
        assembledPos: targetPos.clone(),
        assembledRot: targetRot.clone(),
        scatteredPos,
        scatteredRot,
        delay: delayFraction,
      });
    };

    // --- CONSTRUCT THE HEAD FRAGMENTS ---
    // 1. Cranium Upper Dome
    const craniumGeom = new THREE.SphereGeometry(0.38, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const craniumMesh = new THREE.Mesh(craniumGeom, darkMat);
    registerFragment(craniumMesh, headGroup, new THREE.Vector3(0, 0.2, -0.05), new THREE.Euler(0, 0, 0), 0.1);

    // 2. Visor / Sleek Cybernetic Eye Plate
    const visorGeom = new THREE.CylinderGeometry(0.36, 0.36, 0.14, 20, 1, false, -Math.PI * 0.45, Math.PI * 0.9);
    const visorMesh = new THREE.Mesh(visorGeom, visorMat);
    registerFragment(visorMesh, headGroup, new THREE.Vector3(0, 0.14, 0.05), new THREE.Euler(0, 0, 0), 0.25);

    // 2b. Visor Horizon Light Line (Cyan Glow)
    const visorLightGeom = new THREE.BoxGeometry(0.55, 0.015, 0.02);
    const visorLightMesh = new THREE.Mesh(visorLightGeom, cyanGlowMat);
    registerFragment(visorLightMesh, headGroup, new THREE.Vector3(0, 0.14, 0.38), new THREE.Euler(0, 0, 0), 0.3);

    // 3. Jaw / Chin Plate
    const jawGeom = new THREE.ConeGeometry(0.28, 0.36, 5);
    const jawMesh = new THREE.Mesh(jawGeom, darkAccentMat);
    registerFragment(jawMesh, headGroup, new THREE.Vector3(0, -0.15, 0.05), new THREE.Euler(Math.PI, 0, 0), 0.15);

    // 4. Lateral Head Panels (Left & Right Ear/Temple nodes)
    const templeGeom = new THREE.BoxGeometry(0.08, 0.2, 0.28);
    const leftTemple = new THREE.Mesh(templeGeom, darkAccentMat);
    registerFragment(leftTemple, headGroup, new THREE.Vector3(-0.35, 0.15, -0.05), new THREE.Euler(0, 0.1, -0.1), 0.2);

    const rightTemple = new THREE.Mesh(templeGeom, darkAccentMat);
    registerFragment(rightTemple, headGroup, new THREE.Vector3(0.35, 0.15, -0.05), new THREE.Euler(0, -0.1, 0.1), 0.2);

    // 5. Neck Ring Connectors
    for (let i = 0; i < 3; i++) {
      const ringGeom = new THREE.TorusGeometry(0.14 + i * 0.02, 0.02, 8, 20);
      const ringMesh = new THREE.Mesh(ringGeom, darkAccentMat);
      registerFragment(
        ringMesh,
        headGroup,
        new THREE.Vector3(0, -0.32 - i * 0.08, -0.02),
        new THREE.Euler(Math.PI / 2, 0, 0),
        0.05 + i * 0.05
      );
    }

    // --- CONSTRUCT THE TORSO FRAGMENTS ---
    // 6. Upper Collar / Clavicle Beam
    const clavicleGeom = new THREE.BoxGeometry(1.3, 0.1, 0.3);
    const clavicleMesh = new THREE.Mesh(clavicleGeom, darkAccentMat);
    registerFragment(clavicleMesh, torsoGroup, new THREE.Vector3(0, 0.65, 0), new THREE.Euler(0, 0, 0), 0.2);

    // 7. Pectoral / Chest Armor Plates (Split Left & Right for mechanical detail)
    const chestPlateGeom = new THREE.BoxGeometry(0.5, 0.42, 0.22);
    const leftChest = new THREE.Mesh(chestPlateGeom, darkMat);
    registerFragment(leftChest, torsoGroup, new THREE.Vector3(-0.3, 0.38, 0.08), new THREE.Euler(-0.08, 0.05, -0.05), 0.18);

    const rightChest = new THREE.Mesh(chestPlateGeom, darkMat);
    registerFragment(rightChest, torsoGroup, new THREE.Vector3(0.3, 0.38, 0.08), new THREE.Euler(-0.08, -0.05, 0.05), 0.18);

    // 8. Glowing Central Core Reactor / Seam
    const coreGeom = new THREE.OctahedronGeometry(0.12, 1);
    const coreMesh = new THREE.Mesh(coreGeom, cyanGlowMat);
    registerFragment(coreMesh, torsoGroup, new THREE.Vector3(0, 0.36, 0.18), new THREE.Euler(0, 0, 0), 0.35);

    // 9. Rib Cage Lateral Plates
    for (let i = 0; i < 3; i++) {
      const ribGeom = new THREE.BoxGeometry(0.42 - i * 0.05, 0.09, 0.2);
      const leftRib = new THREE.Mesh(ribGeom, darkAccentMat);
      registerFragment(
        leftRib,
        torsoGroup,
        new THREE.Vector3(-0.25 + i * 0.02, 0.08 - i * 0.12, 0.05),
        new THREE.Euler(0, 0.05, -0.05),
        0.25 + i * 0.06
      );

      const rightRib = new THREE.Mesh(ribGeom, darkAccentMat);
      registerFragment(
        rightRib,
        torsoGroup,
        new THREE.Vector3(0.25 - i * 0.02, 0.08 - i * 0.12, 0.05),
        new THREE.Euler(0, -0.05, 0.05),
        0.25 + i * 0.06
      );
    }

    // 10. Spine Vertebrae (Back Column)
    for (let i = 0; i < 4; i++) {
      const vertGeom = new THREE.CylinderGeometry(0.06, 0.07, 0.1, 8);
      const vertMesh = new THREE.Mesh(vertGeom, darkAccentMat);
      registerFragment(
        vertMesh,
        torsoGroup,
        new THREE.Vector3(0, 0.45 - i * 0.16, -0.12),
        new THREE.Euler(0, 0, 0),
        0.1 + i * 0.05
      );
    }

    // 11. Shoulders (Deltoid Articulations)
    const shoulderGeom = new THREE.SphereGeometry(0.24, 12, 10);
    const leftShoulder = new THREE.Mesh(shoulderGeom, darkMat);
    registerFragment(leftShoulder, torsoGroup, new THREE.Vector3(-0.85, 0.55, 0), new THREE.Euler(0, 0, 0.2), 0.15);

    const rightShoulder = new THREE.Mesh(shoulderGeom, darkMat);
    registerFragment(rightShoulder, torsoGroup, new THREE.Vector3(0.85, 0.55, 0), new THREE.Euler(0, 0, -0.2), 0.15);

    // 12. Floating Kinetic Micro-Fragments (Floating around character like nanite geometry)
    const naniteGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const naniteCount = isMobile ? 18 : 36;
    for (let i = 0; i < naniteCount; i++) {
      const naniteMesh = new THREE.Mesh(naniteGeom, i % 3 === 0 ? cyanGlowMat : darkAccentMat);
      const theta = (i / naniteCount) * Math.PI * 2;
      const ringRadius = 0.95 + (i % 4) * 0.15;
      const targetPos = new THREE.Vector3(
        Math.cos(theta) * ringRadius,
        0.2 + Math.sin(theta * 2) * 0.7,
        Math.sin(theta) * ringRadius * 0.6
      );
      registerFragment(
        naniteMesh,
        torsoGroup,
        targetPos,
        new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        0.3 + (i / naniteCount) * 0.4
      );
    }

    // --- AMBIENT PARTICLES / STAR DUST IN BACKGROUND ---
    const starCount = isMobile ? 80 : 180;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 14;
      starPositions[i + 1] = (Math.random() - 0.5) * 12;
      starPositions[i + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: isMobile ? 0.04 : 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainKeyLight.position.set(3, 5, 4);
    scene.add(mainKeyLight);

    // Dynamic Cyan Rim Light (reacts to mouse)
    const cyanLight = new THREE.PointLight(0x00f0ff, 2.8, 12);
    cyanLight.position.set(-2, 1, 2);
    scene.add(cyanLight);

    // Warm Specular Accent Light
    const accentLight = new THREE.PointLight(0xf59e0b, 1.6, 10);
    accentLight.position.set(2.5, -1, 1.5);
    scene.add(accentLight);

    // --- INTERPOLATION STATE ---
    let normalizedMouseX = 0;
    let normalizedMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Map window coordinates to [-1, 1]
      normalizedMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      normalizedMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Intro Assembly Animation Timeline
    const assemblyDuration = prefersReducedMotion ? 0.1 : 2.4;
    const startTime = performance.now();
    let isFinished = prefersReducedMotion;

    // Cubic bezier ease-out approximation
    const easeOutCubic = (x: number): number => {
      return 1 - Math.pow(1 - x, 3);
    };

    let animationFrameId: number;

    const renderLoop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const rawProgress = Math.min(1, elapsed / assemblyDuration);
      setLoadProgress(Math.round(rawProgress * 100));

      // 1. ANIMATE FRAGMENT ASSEMBLY
      if (!isFinished) {
        fragmentPieces.forEach((fragment) => {
          // Individual stagger with piece delay
          const localT = Math.max(0, Math.min(1, (rawProgress - fragment.delay * 0.4) / (1 - fragment.delay * 0.4)));
          const eased = easeOutCubic(localT);

          fragment.mesh.position.lerpVectors(fragment.scatteredPos, fragment.assembledPos, eased);

          // Smooth rotational alignment
          fragment.mesh.rotation.x = fragment.scatteredRot.x + (fragment.assembledRot.x - fragment.scatteredRot.x) * eased;
          fragment.mesh.rotation.y = fragment.scatteredRot.y + (fragment.assembledRot.y - fragment.scatteredRot.y) * eased;
          fragment.mesh.rotation.z = fragment.scatteredRot.z + (fragment.assembledRot.z - fragment.scatteredRot.z) * eased;
        });

        if (rawProgress >= 1) {
          isFinished = true;
          setIsAssemblyComplete(true);
        }
      }

      // 2. MOUSE TRACKING & INTERPOLATION (HEAD & BODY)
      // Damping / Spring interpolation
      smoothMouseX += (normalizedMouseX - smoothMouseX) * 0.06;
      smoothMouseY += (normalizedMouseY - smoothMouseY) * 0.06;

      // Realistic Subtle Head Look-At
      // Restrict rotation bounds: Horizontal ±24 deg, Vertical ±16 deg
      headGroup.rotation.y = smoothMouseX * 0.42;
      headGroup.rotation.x = -smoothMouseY * 0.28;

      // Subtle breathing & torso lean
      const breathing = Math.sin(now * 0.0018) * 0.025;
      torsoGroup.position.y = breathing;
      torsoGroup.rotation.y = smoothMouseX * 0.12;
      torsoGroup.rotation.z = -smoothMouseX * 0.04;

      // Subtle dynamic lighting motion following cursor
      cyanLight.position.x = -2.5 + smoothMouseX * 1.5;
      cyanLight.position.y = 1.0 + smoothMouseY * 1.2;

      // Subtle ambient background drift
      starField.rotation.y = now * 0.00008;
      starField.position.x = -smoothMouseX * 0.4;
      starField.position.y = -smoothMouseY * 0.3;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75));
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP TO PREVENT MEMORY LEAKS
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose geometries & materials
      craniumGeom.dispose();
      visorGeom.dispose();
      visorLightGeom.dispose();
      jawGeom.dispose();
      templeGeom.dispose();
      clavicleGeom.dispose();
      chestPlateGeom.dispose();
      coreGeom.dispose();
      shoulderGeom.dispose();
      naniteGeom.dispose();
      starGeom.dispose();

      darkMat.dispose();
      darkAccentMat.dispose();
      visorMat.dispose();
      cyanGlowMat.dispose();
      starMat.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none" aria-label="Interactive 3D Experience">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Assembly status indicator (fades out gracefully upon completion) */}
      {!isAssemblyComplete && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-cyan-500/20 bg-zinc-950/80 px-4 py-1.5 backdrop-blur-md transition-opacity duration-700">
          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            <span className="font-mono tracking-wider text-cyan-300">
              Loading 3D Scene... {loadProgress}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
