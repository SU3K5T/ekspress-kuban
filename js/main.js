
'use strict'

const tickerSwiper = new Swiper('.ticker-slider', {
  slidesPerView: 'auto',
  spaceBetween: 30,
  loop: true,
  speed: 4000,
  breakpoints: {
    0: {
      enabled: false,
    },
    768: {
      enabled: true,
    }
  },
  allowTouchMove: false,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
  preventClicks: false,
  freeMode: true,
  touchStartPreventDefault: false,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
  },
});

