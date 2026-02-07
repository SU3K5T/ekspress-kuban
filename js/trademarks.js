class TrademarkSlider {
    constructor({ target }) {
        this.target = target;
        this.slider = target.querySelector('.js-trademarks-slider');
        this.init();
    }

    init() {
        if (!this.slider) return;

        this.swiper = new Swiper(this.slider, {
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 30,
            mousewheel: {
                enabled: true,
                releaseOnEdges: true,
                sensitivity: 0.5,
                thresholdDelta: 10,
                thresholdTime: 500,
            },
            forceToAxis: true,
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TrademarkSlider({
        target: document.querySelector('.js-trademarks-section'),
    })
})