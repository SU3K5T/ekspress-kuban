class NumbersSlider {
    get swiperOption() {
        return {
            slidesPerView: "auto",
            // direction: "vertical",
            autoHeight: true,
            speed: 1500,
            allowTouchMove: false,
            // effect: "coverflow",
            // coverflowEffect: {
            //   rotate: 0,
            //   stretch: window.matchMedia("(max-width: 991.98px)").matches ? 20 : 50,
            //   depth: 10,
            //   modifier: 1,
            //   slideShadows: false,
            // },
            slideActiveClass: 'active',
            effect: "creative",
            creativeEffect: {
                prev: {
                shadow: false,
                translate: [0, '-20px', -1],
                opacity: 0,
                },
                next: {
                shadow: false,
                opacity: 0,
                translate: [0, '20px', 0],
                },
            },
            mousewheel: {
                enabled: true,
                releaseOnEdges: true,
                sensitivity: 0.5,
                thresholdDelta: 10,
                thresholdTime: 500,
            },
            forceToAxis: true,
        }
    }
    
    constructor({ target }) {
        this.target = target;
        this.slider = target.querySelector('.js-numbers-slider');
        this.init();
    }

    init() {
        if (!this.slider) return;

        this.swiper = new Swiper(this.slider, {
            ...this.swiperOption,
            on: {
                slideChange: () => {
                    this.items.forEach((item, index) => {
                        if (index === this.swiper.activeIndex) {
                            item.active();
                        } else {
                            item.deactive();
                        }
                    });
                },
            },
        });
        this.items = Array.from(this.slider.querySelectorAll('.js-numbers-item')).map(item => new NumbersItem({ target: item }));
    }

    destroy() {
        this.swiper?.destroy();
        this.items.forEach(item => item.destroy());
    }
}

class NumbersItem {
    constructor({ target }) {
        this.target = target;
        this.video = this.target.querySelector('.js-numbers-video');
        this.counters = Array.from(this.target.querySelectorAll('.js-numbers-value')).map(item => new Counter({ target: item }));
        this.init();
    }

    init() {
        if (!this.target) return;
    }

    destroy() {
        this.counters.forEach(item => item.destroy());
        this.video?.pause();
    }

    active() {
        this.counters.forEach(item => item.active());
        this.video?.play();
    }

    deactive() {
        this.counters.forEach(item => item.deactive());
        this.video?.pause();
    }
}

class Counter {
    constructor({ target }) {
        this.target = target;
        this.counter = target.querySelector('.js-numbers-counter');
        this.init();
    }

    init() {
        if (!this.counter) return;

        this.value = this.counter.textContent.replace(/\D/g, '');
    }

    destroy() {
        cancelAnimationFrame(this.animationFrame);
    }

    active() {
        this.counter.textContent = this.formatValue(this.value);
        this.animateCounter();
    }

    deactive() {
        this.counter.textContent = this.formatValue(this.value);
        cancelAnimationFrame(this.animationFrame);
    }

    formatValue(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    animateCounter() {
        const duration = 3000;
        const startTime = performance.now();

        cancelAnimationFrame(this.animationFrame);

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = Math.floor(progress * this.value);

            
            this.counter.textContent = this.formatValue(currentValue);

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.counter.textContent = this.formatValue(this.value);
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }
}

class NumbersList {
    constructor({ target }) {
        this.target = target;
        this.items = Array.from(this.target.querySelectorAll('.js-numbers-item')).map(item => new NumbersItem({ target: item }));
        this.init();
    }

    init() {
        if (!this.target) return;
        
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const item = this.items.find(item => item.target === entry.target);
                if (entry.isIntersecting) {
                    item?.active();
                } else {
                    item?.deactive();
                }
            });
        }, { threshold: 0.5 });

        this.items.forEach(item => this.observer.observe(item.target));
    }

    destroy() {
        this.observer.disconnect();
        this.items.forEach(item => item.destroy());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializer(
        {
            target: document.querySelector('.js-numbers-section')
        },
        ({ target }) => {
            const swiper = target.querySelector('.js-swiper');
            const swiperWrapper = target.querySelector('.js-swiper-wrapper');
            const swiperSlide = target.querySelectorAll('.js-swiper-slide');

            MediaQuery.down(MediaQuery.breakpoints.md, {
                match: (ctx) => {
                    swiper.classList.remove('swiper');
                    swiperWrapper.classList.remove('swiper-wrapper');
                    swiperSlide.forEach((slide) => slide.classList.remove('swiper-slide'));

                    ctx.slider?.destroy();

                    ctx.list = new NumbersList({
                        target: target,
                    });
                },
                unmatch: (ctx) => {
                    swiper.classList.add('swiper');
                    swiperWrapper.classList.add('swiper-wrapper');
                    swiperSlide.forEach((slide) => slide.classList.add('swiper-slide'));
                    
                    ctx.list?.destroy();

                    ctx.slider = new NumbersSlider({
                        target: target,
                    })
                },
            });
        },
    );
});