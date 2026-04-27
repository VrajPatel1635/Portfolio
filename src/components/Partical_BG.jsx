// src/components/ThreeBackground.jsx
import { useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ThreeBackground = () => {
  useEffect(() => {
    const PARTICLE_COUNT = 3000;
    const PARTICLE_SIZE = 0.035;
    const CAM_Z = 4;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.15);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = CAM_Z;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ensure only one background canvas exists (helps with Fast Refresh / StrictMode).
    const existingCanvas = document.getElementById('three-bg-canvas');
    if (existingCanvas && existingCanvas.parentNode) {
      existingCanvas.parentNode.removeChild(existingCanvas);
    }
    renderer.domElement.id = 'three-bg-canvas';

    // canvas styling is controlled via CSS (canvas { position: fixed; ... })
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targets = { cloud: [], sphere: [], helix: [], cube: [], ring: [] };

    // Cloud
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      targets.cloud.push(x, y, z);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    // Sphere
    const radius = 2;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      targets.sphere.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
    }

    // Helix
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = (i / PARTICLE_COUNT) * Math.PI * 10;
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const hRadius = 1.5;
      const height = 8;
      const x = hRadius * Math.cos(t + strand);
      const z = hRadius * Math.sin(t + strand);
      const y = (i / PARTICLE_COUNT) * height - height / 2;
      targets.helix.push(x, y, z);
    }

    // Cube
    const side = Math.cbrt(PARTICLE_COUNT);
    const step = 3.5 / side;
    const offset = (side * step) / 2;
    let c = 0;
    for (let x = 0; x < side; x++) {
      for (let y = 0; y < side; y++) {
        for (let z = 0; z < side; z++) {
          if (c < PARTICLE_COUNT) {
            const px = x * step - offset;
            const py = y * step - offset;
            const pz = z * step - offset;
            const rx = px * Math.cos(0.5) - pz * Math.sin(0.5);
            const rz = px * Math.sin(0.5) + pz * Math.cos(0.5);
            targets.cube.push(rx, py, rz);
            c++;
          }
        }
      }
    }
    while (targets.cube.length < PARTICLE_COUNT * 3) {
      targets.cube.push(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      );
    }

    // Ring
    const RING_MAJOR = 2.5;
    const RING_MINOR = 0.6;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const tx = (RING_MAJOR + RING_MINOR * Math.cos(v)) * Math.cos(u);
      const ty = (RING_MAJOR + RING_MINOR * Math.cos(v)) * Math.sin(u);
      const tz = RING_MINOR * Math.sin(v);
      targets.ring.push(tx, ty, tz);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const getTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.2, 'rgba(0,243,255,1)');
      grad.addColorStop(0.5, 'rgba(0,243,255,0.2)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: PARTICLE_SIZE,
      map: getTexture(),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
      color: 0xffffff
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let currentShape = 'cloud';
    const currentTargetPos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < targets.cloud.length; i++) currentTargetPos[i] = targets.cloud[i];

    const clock = new THREE.Clock();

    let rafId;
    const animateParticles = () => {
      rafId = requestAnimationFrame(animateParticles);
      const time = clock.getElapsedTime();

      particles.rotation.y = time * 0.05;
      particles.rotation.x = Math.sin(time * 0.1) * 0.05;

      const posAttr = geometry.attributes.position;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3,
          iy = i * 3 + 1,
          iz = i * 3 + 2;
        let px = posAttr.array[ix],
          py = posAttr.array[iy],
          pz = posAttr.array[iz];
        const tx = currentTargetPos[ix],
          ty = currentTargetPos[iy],
          tz = currentTargetPos[iz];
        let vx = (tx - px) * 0.05,
          vy = (ty - py) * 0.05,
          vz = (tz - pz) * 0.05;

        const noise = Math.sin(time * 2 + px) * 0.002;
        posAttr.array[ix] += vx + noise;
        posAttr.array[iy] += vy + noise;
        posAttr.array[iz] += vz + noise;
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animateParticles();

    const morphTo = (shapeName) => {
      const targetArr = targets[shapeName];
      for (let i = 0; i < targetArr.length; i++) currentTargetPos[i] = targetArr[i];
    };

    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.2) {
          if (currentShape !== 'cloud') {
            currentShape = 'cloud';
            morphTo('cloud');
          }
        } else if (p >= 0.2 && p < 0.4) {
          if (currentShape !== 'sphere') {
            currentShape = 'sphere';
            morphTo('sphere');
          }
        } else if (p >= 0.4 && p < 0.6) {
          if (currentShape !== 'helix') {
            currentShape = 'helix';
            morphTo('helix');
          }
        } else if (p >= 0.6 && p < 0.8) {
          if (currentShape !== 'cube') {
            currentShape = 'cube';
            morphTo('cube');
          }
        } else {
          if (currentShape !== 'ring') {
            currentShape = 'ring';
            morphTo('ring');
          }
        }
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Loader logic (same ids as original)
    const bar = document.getElementById('progress-bar');
    const loader = document.getElementById('loader');
    if (bar && loader) {
      setTimeout(() => {
        bar.style.width = '100%';
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
          }, 1000);
        }, 800);
      }, 200);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      if (rafId != null) cancelAnimationFrame(rafId);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return null;
};

export default ThreeBackground;
