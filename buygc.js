//navbar
function toggleMenu() {
            var menu = document.getElementById("mobileMenu");
            if (menu.style.display === "block") {
                menu.style.display = "none";
            } else {
                menu.style.display = "block";
            }
        }



      let index = 0;
      const slides = document.querySelectorAll('.slide');
      const totalSlides = slides.length;
      const carousel = document.querySelector('.carousel');
      const dotsContainer = document.querySelector('.dots');

      // Create dots dynamically
      slides.forEach((_, i) => {
          const dot = document.createElement('span');
          dot.classList.add('dot');
          dot.setAttribute('data-index', i);
          dotsContainer.appendChild(dot);
      });

      const dots = document.querySelectorAll('.dot');
      dots[0].classList.add('active');

      function showSlide(i) {
          index = (i + totalSlides) % totalSlides;
          carousel.style.transform = `translateX(-${index * 100}%)`;
          dots.forEach(dot => dot.classList.remove('active'));
          dots[index].classList.add('active');
      }

      document.querySelector('.prev').addEventListener('click', () => showSlide(index - 1));
      document.querySelector('.next').addEventListener('click', () => showSlide(index + 1));
      dots.forEach(dot => dot.addEventListener('click', e => showSlide(parseInt(e.target.dataset.index))));

      // Auto-slide
      setInterval(() => showSlide(index + 1), 5000);


const menu = document.querySelector(".mobile-menu");
const menuIcon = document.querySelector(".menu-icon");
const closeBtn = document.querySelector(".close-btn");

menuIcon.addEventListener("click", () => {
    menu.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    menu.classList.remove("show");
});
