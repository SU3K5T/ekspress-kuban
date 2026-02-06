
'use strict'

const manufactureSwiper = new Swiper(".js-swiper-manufacture", {
  direction: "horizontal",
  slidesPerView: 1,
  mousewheel: {
    enabled: true,
    releaseOnEdges: true,
    sensitivity: 0.5,
    thresholdDelta: 10,
    thresholdTime: 500,
  },
  forceToAxis: true,
  pagination: {
    el: ".js-swiper-manufacture-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      const menuTitles = ['От фермерских полей до магазинной полки', 'Проверенные рецепты и современные ГОСТЫ', 'Кукуруза, горошек, варенье и многе другое'];
      return `<div class="${className} pagination-item">
          ${menuTitles[index]}
      </div>`;
    },
  },
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 1) {
      manufactureSwiper.mousewheel.enable();
    } else {
      manufactureSwiper.mousewheel.disable();
    }
  });
}, {
  threshold: [1]
});

observer.observe(document.querySelector('.js-swiper-manufacture'));

const territorySwiper = new Swiper(".js-territory-swiper", {
  direction: "horizontal",
  slidesPerView: 1.2,
  spaceBetween: 20,
  navigation: {
    prevEl: '.js-territory-swiper-button-prev',
    nextEl: '.js-territory-swiper-button-next',
  }
});