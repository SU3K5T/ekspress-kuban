class ManufactureSlider {
    constructor({ target }) {
        this.target = target;
        this.slider = target.querySelector('.js-manufacture-slider');
        this.init();
    }

    init() {
        if (!this.slider) return;


        this.thumbs = new Swiper(this.target.querySelector('.js-swiper-manufacture-pagination'), {
            slidesPerView: 2,
            breakpoints: {
                768: {
                    slidesPerView: 3,
                },
            }
        });

        this.swiper = new Swiper(this.slider, {
            direction: 'horizontal',
            slidesPerView: 1,
            mousewheel: {
                enabled: true,
                releaseOnEdges: true,
                sensitivity: 0.5,
                thresholdDelta: 10,
                thresholdTime: 500,
            },
            forceToAxis: true,
            thumbs: {
                swiper: this.thumbs,
                slideThumbActiveClass: 'active',
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ManufactureSlider({
        target: document.querySelector('.js-manufacture-section'),
    })
})