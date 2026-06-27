/* ============= LOADER ============= */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

/* ============= 3D BACKGROUND ============= */
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: 0x00f0ff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Torus Knot (3D shape)
const torusGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
const torusMaterial = new THREE.MeshBasicMaterial({
  color: 0x7b2ff7,
  wireframe: true,
  transparent: true,
  opacity: 0.3
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

camera.position.z = 5;

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  particlesMesh.rotation.y += 0.0008;
  particlesMesh.rotation.x += 0.0003;
  torus.rotation.x += 0.005;
  torus.rotation.y += 0.008;
  camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ============= CUSTOM CURSOR ============= */
const cursor = document.querySelector('.cursor');

window.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

/* ============= NAVBAR SCROLL ============= */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

/* ============= MOBILE MENU ============= */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

/* ============= PROJECT FILTER ============= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hide');
        card.style.animation = 'fadeIn 0.5s ease';
      } else {
        card.classList.add('hide');
      }
    });
  });
});

/* ============= TILT EFFECT ============= */
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
});

/* ============= SCROLL REVEAL ============= */
const reveals = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => { r.classList.add('reveal'); observer.observe(r); });

/* ============= PARALLAX ON SCROLL ============= */
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.hero-content');
  if (parallax) {
    parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
    parallax.style.opacity = 1 - scrolled / 700;
  }
});

/* ============= FORM SUBMIT ============= */
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = e.target.querySelector("button");

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      category: document.getElementById("category").value,
      message: document.getElementById("message").value,
    };

    try {
      btn.textContent = "Sending...";
      btn.disabled = true;

      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        btn.textContent = "✓ Message Sent!";
        form.reset();
      } else {
        btn.textContent = "❌ Failed. Try again.";
      }
    } catch (error) {
      console.error("Form submission error:", error);
      btn.textContent = "❌ Server Error";
    } finally {
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = "Send Message →";
      }, 3000);
    }
  });
}
/* ============= SERVICE CARDS CLICK TO CONTACT ============= */
document.addEventListener("DOMContentLoaded", () => {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach(card => {
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      const contactSection = document.getElementById("contact");

      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});