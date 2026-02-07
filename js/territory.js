class TerritorySlider {
  constructor({ target }) {
    this.target = target;
    this.slider = target.querySelector('.js-territory-swiper');
    this.init()
  }

  init() {
    if (!this.slider) return;

    this.swiper = new Swiper(this.slider, {
      direction: "horizontal",
      slidesPerView: 1.2,
      spaceBetween: 20,
      navigation: {
        prevEl: '.js-territory-swiper-button-prev',
        nextEl: '.js-territory-swiper-button-next',
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section-territory').forEach((target) => {
    new TerritorySlider({ target })
  })
})