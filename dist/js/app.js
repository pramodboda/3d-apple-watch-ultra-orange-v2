import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

var myFullpage = new fullpage("#fullpage", {
  // Equivalent to jQuery `easeOutBack` extracted from http://matthewlein.com/ceaser/
  // easingcss3: "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
  easingcss3: "cubic-bezier(0, 0.55, 0.45, 1)",

  // Get your license at https://alvarotrigo.com/fullPage/pricing
  licenseKey: "xxxxxxxxxxxxxxxxxxxxxxxxx",
});

// Create a camera and scene
const camera = new THREE.PerspectiveCamera(
  0.7,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 13;

const scene = new THREE.Scene();

let appleWatch;
let mixer;

const gltfLoader = new GLTFLoader();

// Show loading spinner
const loadingElement = document.getElementById("loading");

gltfLoader.load(
  "dist/assets/3d-models/apple_watch_ultra_-_orange.glb",
  function (gltf) {
    appleWatch = gltf.scene;
    appleWatch.position.set(0, -0.02, 0);
    appleWatch.rotation.set(0, 0, 0);

    // appleWatch.position.set(0.02, -0.025, 6.5);
    // appleWatch.rotation.set(0.5, -1.6, 0.5);

    scene.add(appleWatch);

    mixer = new THREE.AnimationMixer(appleWatch);
    mixer.clipAction(gltf.animations[0]).play();

    // Hide loading spinner
    if (loadingElement) {
      loadingElement.style.display = "none";
    }

    modelMode();
  },
  function (xhr) {
    // Optionally, you can log the loading progress
    console.log(`Model ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`);
  },
  function (error) {
    console.error("An error occurred while loading the model", error);
    // Optionally, hide the spinner and show an error message
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500);
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
};
reRender3D();

// Define model position array
let arrPositionModel = [
  {
    id: "hero",
    position: { x: 0, y: -0.02, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: "feature1",
    position: { x: 0, y: -0.02, z: 0 },
    rotation: { x: 0.2, y: 5.8, z: 0 },
  },
  {
    id: "feature2",
    position: { x: 0.025, y: -0.02, z: 4.5 },
    rotation: { x: 0.5, y: -0.55, z: 0.2 },
  },
  {
    id: "feature3",
    position: { x: -0.0008, y: -0.05, z: 5 },
    rotation: { x: -1.6, y: 0.61, z: 1.6 },
  },
  {
    id: "feature4",
    position: { x: 0.025, y: -0.025, z: 5 },
    rotation: { x: 0, y: 4, z: 0 },
  },
  {
    id: "feature5",
    position: { x: 0.025, y: -0.025, z: 4.5 },
    rotation: { x: 0.5, y: -0.5, z: 0.2 },
  },
  {
    id: "feature6",
    position: { x: 0.02, y: -0.025, z: 6 },
    rotation: { x: 0.5, y: -1.6, z: 0.5 },
  },
  {
    id: "feature7",
    position: { x: 0.03, y: -0.04, z: 5 },
    rotation: { x: -2, y: -1.5, z: -1.5 },
  },
  {
    id: "feature8",
    position: { x: 0, y: -0.015, z: 0 },
    rotation: { x: -0.3, y: -4, z: -0.2 },
  },
];

// Use IntersectionObserver to update model position
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5, // 50% of the section must be visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const section = entry.target;
    const sectionId = section.id;

    if (entry.isIntersecting) {
      updateModelPosition(sectionId);
    }
  });
}, observerOptions);

const sections = document.querySelectorAll(".section");
sections.forEach((section) => {
  observer.observe(section);
});

// Update model position based on section
const updateModelPosition = (sectionId) => {
  let position_active = arrPositionModel.findIndex(
    (val) => val.id === sectionId
  );

  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];

    gsap.to(appleWatch.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out",
    });

    gsap.to(appleWatch.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 3,
      ease: "power1.out",
    });
  }

  console.log(`Current Section: ${sectionId}`);
};

// Responsive
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Scroll navigation
document.addEventListener("DOMContentLoaded", function () {
  let currentSection = 1;
  let totalSections = [...document.querySelectorAll(".section")];

  function scrollToSection(section) {
    currentSection = section;
    document.querySelectorAll(".section").forEach((sec, index) => {
      sec.style.transform = `translateY(-${(section - 1) * 100}vh)`;
    });
  }

  function scrollUp() {
    if (currentSection > 1) {
      scrollToSection(currentSection - 1);
    }
  }

  function scrollDown() {
    if (currentSection < totalSections.length) {
      scrollToSection(currentSection + 1);
    }
  }

  // // Scroll-based navigation controls
  // document.addEventListener("wheel", (event) => {
  //   if (event.deltaY > 0) {
  //     scrollDown();
  //   } else {
  //     scrollUp();
  //   }
  // });

  // // Touch scroll navigation (for mobile)
  // let touchStartY = 0;
  // let touchEndY = 0;

  // document.addEventListener("touchstart", (event) => {
  //   touchStartY = event.changedTouches[0].screenY;
  // });

  // document.addEventListener("touchend", (event) => {
  //   touchEndY = event.changedTouches[0].screenY;
  //   if (touchStartY > touchEndY + 50) {
  //     // Swiped up (scroll down)
  //     scrollDown();
  //   } else if (touchStartY < touchEndY - 50) {
  //     // Swiped down (scroll up)
  //     scrollUp();
  //   }
  // });
});
