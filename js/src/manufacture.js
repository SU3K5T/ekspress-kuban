class ManufactureSlider {
    constructor({ target }) {
        this.target = target;
        this.slider = target.querySelector('.js-manufacture-slider');
        this.init();
    }

    init() {
        if (!this.slider) return;


        this.thumbs = new Swiper(this.target.querySelector('.js-swiper-manufacture-pagination'), {
            slidesPerView: 'auto',
            breakpoints: {
                768: {
                    slidesPerView: 3,
                },
            }
        });

        this.swiper = new Swiper(this.slider, {
            direction: 'horizontal',
            slidesPerView: 1,
            forceToAxis: true,
            thumbs: {
                swiper: this.thumbs,
                slideThumbActiveClass: 'active',
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-manufacture-section').forEach((target) => {
        new ManufactureSlider({ target })
    })
});