document.addEventListener('DOMContentLoaded', () => {
    initializer(
        {
            target: document.querySelector('.js-news-section')
        },
        ({ target }) => {
            const swiper = target.querySelector('.js-swiper');
            const swiperWrapper = target.querySelector('.js-swiper-wrapper');
            const swiperSlide = target.querySelectorAll('.js-swiper-slide');

            MediaQuery.down(MediaQuery.breakpoints.sm, {
                match: (ctx) => {
                    target.classList.remove('slider');
                    target.classList.add('list');
                    
                    swiper.classList.remove('swiper');
                    swiperWrapper.classList.remove('swiper-wrapper');
                    swiperSlide.forEach((slide) => slide.classList.remove('swiper-slide'));

                    ctx.swiper?.destroy();
                },
                unmatch: (ctx) => {
                    target.classList.remove('list');
                    target.classList.add('slider');

                    // swiper.classList.add('swiper');
                    swiperWrapper.classList.add('swiper-wrapper');
                    swiperSlide.forEach((slide) => slide.classList.add('swiper-slide'));

                    ctx.swiper = new Swiper(swiper, {
                        slidesPerView: 'auto',
                        spaceBetween: 26,
                        navigation: {
                            prevEl: target.querySelector('.js-button-prev'),
                            nextEl: target.querySelector('.js-button-next'),
                        }
                    });
                },
            });
        },
    );
});