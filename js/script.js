/* =============================================================
   Interacciones de la landing page
   - Menú móvil
   - Animaciones al hacer scroll
   - Previsualización de fotografías locales
   - Mensaje de formulario conceptual
   ============================================================= */

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const photoInput = document.getElementById('photoInput');
const uploadButton = document.getElementById('uploadButton');
const galleryGrid = document.getElementById('galleryGrid');
const notifyForm = document.getElementById('notifyForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');

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

revealElements.forEach((element) => revealObserver.observe(element));

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
      article.className = 'gallery-item active';

      const img = document.createElement('img');
      img.src = readerEvent.target.result;
      img.alt = `Imagen agregada: ${file.name}`;

      const caption = document.createElement('div');
      caption.innerHTML = `<strong>${file.name}</strong><span>Fotografía agregada localmente para previsualización.</span>`;

      article.appendChild(img);
      article.appendChild(caption);
      galleryGrid.prepend(article);
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
