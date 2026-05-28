/* =============================================================
   Interacciones de la landing page
   - Menú móvil
   - Animaciones al hacer scroll
   - Previsualización de fotografías locales
   - Lightbox para ver imágenes completas
   - Scroll progress, parallax y tilt suave
   ============================================================= */

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const photoInput = document.getElementById('photoInput');
const uploadButton = document.getElementById('uploadButton');
const galleryGrid = document.getElementById('galleryGrid');
const notifyForm = document.getElementById('notifyForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

// Menú responsive
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Barra de progreso al hacer scroll
const updateScrollProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (scrollTop / height) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Brillo del cursor para dar sensación de videojuego/menú interactivo
window.addEventListener('pointermove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

// Animación al hacer scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 25, 180)}ms`;
  revealObserver.observe(element);
});

// Parallax suave en elementos decorativos del hero
const parallaxItems = document.querySelectorAll('.parallax');
window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.depth || 0.03);
    item.style.translate = `${x * depth * 100}px ${y * depth * 100}px`;
  });
});

// Tilt 3D suave para tarjetas
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// Lightbox para mirar las imágenes completas sin recorte
function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt || 'Imagen ampliada de la galería';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
}

galleryGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.gallery-open');
  if (!button) return;
  const img = button.querySelector('img');
  if (img) openLightbox(img.src, img.alt);
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightboxClose.addEventListener('click', closeLightbox);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// Galería: previsualiza imágenes seleccionadas desde tu computadora.
// Esto no sube archivos a ningún servidor; solo los muestra en el navegador.
uploadButton.addEventListener('click', () => photoInput.click());

photoInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files || []);
  const imageFiles = files.filter((file) => file.type.startsWith('image/'));

  imageFiles.forEach((file) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const article = document.createElement('article');
      article.className = 'gallery-item active reveal';

      const button = document.createElement('button');
      button.className = 'gallery-open';
      button.type = 'button';
      button.setAttribute('aria-label', `Abrir ${file.name}`);

      const img = document.createElement('img');
      img.src = readerEvent.target.result;
      img.alt = `Imagen agregada: ${file.name}`;

      const caption = document.createElement('div');
      caption.innerHTML = `<strong>${file.name}</strong><span>Fotografía agregada localmente para previsualización.</span>`;

      button.appendChild(img);
      article.appendChild(button);
      article.appendChild(caption);
      galleryGrid.prepend(article);
      requestAnimationFrame(() => article.classList.add('active'));
    };

    reader.readAsDataURL(file);
  });

  photoInput.value = '';
});

// Formulario conceptual de notificación
notifyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();

  if (!email) {
    formMessage.textContent = 'Escribe un correo para mostrar el mensaje de confirmación.';
    return;
  }

  formMessage.textContent = 'Listo. En una versión real, este correo se guardaría en una base de datos.';
  emailInput.value = '';
});
