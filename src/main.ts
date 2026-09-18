import './style.css'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Lenis from 'lenis'
import { initI18n, toggleLanguage, updateContent } from './i18n'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

gsap.registerPlugin(ScrollTrigger)

// --- Lenis Smooth Scrolling Setup ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// A11y: Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Disable most GSAP animations globally for accessibility
  gsap.globalTimeline.timeScale(1000); 
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize translations
  initI18n();

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
  }

  // We stop lenis from scrolling until loading is done
  lenis.stop();

  // Initialize 3D and preload
  setupThreeJS(() => {
    // This callback runs when the 3D model finishes loading
    startBootSequence();
  });

  function startBootSequence() {
    const bootLines = document.querySelectorAll('.boot-line');
    const tlBoot = gsap.timeline({
      onComplete: () => {
        gsap.to('.boot-sequence', {
          y: '-100%',
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => {
            document.body.classList.remove('loading');
            lenis.start(); // Enable scrolling
            initHeroAnimations();
          }
        });
      }
    });

    bootLines.forEach((line, index) => {
      if (index === 0) {
        tlBoot.to(line, { opacity: 1, duration: 0.5 });
      } else {
        const texts = [
          "✓ SENSOR ARRAY ONLINE",
          "✓ COMPUTER VISION ONLINE",
          "✓ AUTONOMY CORE ONLINE",
          "✓ TELEMETRY LINK ESTABLISHED",
          "✓ MISSION CONTROL CONNECTED"
        ];
        tlBoot.call(() => {
          (line as HTMLElement).textContent = texts[index - 1];
        }, undefined, "+=0.3");
        tlBoot.to(line, { opacity: 1, duration: 0.1 });
      }
    });
  }

  // --- Hero Animations ---
  function initHeroAnimations() {
    const tlHero = gsap.timeline();
    
    // Animate words up
    tlHero.to('.hero-title .word', {
      y: '0%',
      duration: 1.2,
      stagger: 0.2,
      ease: 'power4.out',
      delay: 0.2
    });

    tlHero.to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }, "-=0.8");

    tlHero.to('.hero-ctas', {
      opacity: 1,
      duration: 1
    }, "-=0.5");

    // HUD Glitch/Flicker effect
    gsap.to('.hud-item .hud-value', {
      opacity: 0.5,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      stagger: 0.1,
      delay: 0.5
    });
    
    // Parallax background
    gsap.to('.hero-bg', {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // --- Horizontal Scroll (Missions) ---
  const missionsSection = document.querySelector('.missions-section');
  const missionsContainer = document.querySelector('.missions-container');
  
  if (missionsSection && missionsContainer && window.innerWidth > 768) {
    const amountToScroll = missionsContainer.scrollWidth - window.innerWidth;
    
    gsap.to(missionsContainer, {
      x: -amountToScroll,
      ease: "none",
      scrollTrigger: {
        trigger: missionsSection,
        start: "top top",
        end: `+=${amountToScroll}`,
        pin: true,
        scrub: 1,
      }
    });
  }

  // --- Product Annotations ---
  const annotations = document.querySelectorAll('.annotation');
  ScrollTrigger.create({
    trigger: ".product-visual",
    start: "top center",
    onEnter: () => {
      gsap.to(annotations, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      });
    }
  });

  // Specs Interaction
  const specItems = document.querySelectorAll('.spec-item');
  specItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item, { backgroundColor: '#111', duration: 0.3 });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item, { backgroundColor: 'transparent', duration: 0.3 });
    });
  });

  // --- Tech Layers ---
  const layers = document.querySelectorAll('.layer');
  layers.forEach((layer) => {
    ScrollTrigger.create({
      trigger: layer,
      start: "top 80%",
      onEnter: () => layer.classList.add('active'),
      onLeaveBack: () => layer.classList.remove('active')
    });
  });
});

function setupThreeJS(onLoadComplete: () => void) {
  const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // The Drone Group will hold our loaded model
  const droneGroup = new THREE.Group();
  scene.add(droneGroup);

  const progressEl = document.getElementById('load-progress');

  // Load the 3D Model
  const loader = new GLTFLoader();
  loader.load(
    '/fighter-jet-x-einheit-funf/source/Meshy_AI_Shadow_Wing_0909233125_texture.glb',
    (gltf) => {
      const model = gltf.scene;
      // Scale and center the model appropriately
      model.scale.set(2.5, 2.5, 2.5); 
      
      // Add lighting directly to the group or scene since the model might be dark
      const ambientLight = new THREE.AmbientLight(0xffffff, 2);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      droneGroup.add(model);
      
      // Model is loaded, signal completion
      if (progressEl) progressEl.textContent = '100%';
      // slight delay so the user sees 100%
      setTimeout(() => {
        updateContent(); // Ensure translated text is caught up
        onLoadComplete();
      }, 200); 
    },
    (xhr) => {
      // Update loading progress
      const percent = Math.round((xhr.loaded / xhr.total) * 100);
      if (progressEl && !isNaN(percent)) {
        progressEl.textContent = `${percent}%`;
      }
    },
    (error) => {
      console.error('An error happened while loading the 3D model:', error);
      // Even on error, we should let the user in
      onLoadComplete();
    }
  );

  // Initial position (off-screen or Hero position)
  droneGroup.position.set(0, -1, 0);
  droneGroup.rotation.set(0.2, -0.5, 0);

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    
    // Add subtle hover effect
    const elapsedTime = clock.getElapsedTime();
    droneGroup.position.y += Math.sin(elapsedTime * 2) * 0.002;

    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // GSAP ScrollTrigger for 3D Model
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Smooth scrubbing
    }
  });

  // Keyframes for the drone's flight path as you scroll
  // Sequentially chain the animations so it spans the entire scroll height
  // 1. Hero to Missions
  tl.to(droneGroup.position, { x: 2, y: 1, z: -1, duration: 1 })
    .to(droneGroup.rotation, { x: 0.5, y: 0.5, z: -0.2, duration: 1 }, "<")
    
  // 2. Missions to Platform
    .to(droneGroup.position, { x: -2.5, y: 0, z: -2, duration: 1 })
    .to(droneGroup.rotation, { x: -0.2, y: 1.5, z: 0.2, duration: 1 }, "<")
    
  // 3. Platform to Technology
    .to(droneGroup.position, { x: 0, y: -0.5, z: 1, duration: 1 })
    .to(droneGroup.rotation, { x: 0, y: 3.14, z: 0, duration: 1 }, "<")
    
  // 4. Intelligence at the Edge (Dramatic close flyby)
    .to(droneGroup.position, { x: 4, y: 1, z: 3, duration: 1 })
    .to(droneGroup.rotation, { x: 0.2, y: 4, z: 0.5, duration: 1 }, "<")
    
  // 5. Tech Layers (Bank heavily left and away)
    .to(droneGroup.position, { x: -4, y: 2, z: -5, duration: 1 })
    .to(droneGroup.rotation, { x: -0.5, y: 5.5, z: -0.8, duration: 1 }, "<")

  // 6. Operations / Footer (End in a perfectly straight position, facing the camera)
    .to(droneGroup.position, { x: 0, y: 0, z: 1, duration: 1 })
    .to(droneGroup.rotation, { x: 0.1, y: Math.PI * 2.5, z: 0, duration: 1 }, "<");
}
