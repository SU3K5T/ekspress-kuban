class ModalAppDefault extends ModalFullDefault {
    constructor(options) {
      const additionalClass = options.target.getAttribute('modal-root-class');
      super(
        {
          ...options,
          plugins: {
            template: {
              classes: {
                root: ['modal', ...(additionalClass?.split(' ') ?? [])],
              }
            }
          }
        }
      );
    }
  }class Follower {
  get rect() {
    return this.target.getBoundingClientRect();
  }

  get offsetX() {
    return this._offsetX();
  }
  get offsetY() {
    return this._offsetY();
  }

  constructor(options) {
    this.target = options.target;
    this.container = options.container;
    if(options.offsetX) {
      this._offsetX = options.offsetX.bind(this);
    }
    if(options.offsetY) {
      this._offsetY = options.offsetY.bind(this);
    }
    this.x = 0;
    this.y = 0;

    this.xController = new PIDController({...options.k});
    this.yController = new PIDController({...options.k});

    this.time = 0;
  }

  _offsetX() {
    return -this.rect.width/2;
  }

  _offsetY() {
    return -this.rect.height/2;
  }

  to(x, y) {
    this.xController.setTarget(x + this.offsetX);
    this.yController.setTarget(y + this.offsetY);
  }

  follow(x, y) {
    this.x = x - 70;
    this.y = y - 70;
    this.to(this.x, this.y);
    if(this.requestAnimationId == null) {
      this.requestAnimationId = requestAnimationFrame(this._update.bind(this));
    }
  }

  unfollow() {
      if(this.requestAnimationId) {
          cancelAnimationFrame(this.requestAnimationId);
          this.requestAnimationId = null;
          this.time = 0;
      }
  }

  _update(time) {
    const dt = this._getDt(time);
    this._updatePosition(dt);
    this._setPosition();
    this.requestAnimationId = requestAnimationFrame(this._update.bind(this));
  }

  _updatePosition(dt) {
      this.x += this.xController.update(this.x, dt);
      this.y += this.yController.update(this.y, dt);
  }

  _getDt(time) {
      if(this.time == 0) {
          this.time = time;
      }
      const dt = (time - this.time) / 1000;

      this.time = time;
      return dt;
  }

  _setPosition() {
      const x = this.x;
      const y = this.y;
      this.target.style['transform'] = `translate(${x}px, ${y}px)`;
  }
}


class FollowerItem  {
    get rect() {
        return this.target.getBoundingClientRect();
    }
    constructor(options) {
        this.target = options.target;
        this.modal = options.modal;
        this.follower = new Follower({
            container: this.target,
            target: this.modal,
            offsetX: () => -20,
            offsetY: () => -20,
            k: {
                kP: 0.1,
                kI: 0.12,
                kD: 0.1,
                kDt: 10
            }
        });

        this.target.addEventListener('mouseenter', this.onEnter.bind(this));
        this.target.addEventListener('mouseleave', this.onLeave.bind(this));
    }

    onEnter(e) {
        this._onMove = this.onMove.bind(this);
        const rect = this.rect;
        this.follower.follow(e.clientX - rect.x, e.clientY - rect.y - 40);
        this.target.addEventListener('mousemove', this._onMove);
    }

    onLeave() {
        this.follower.unfollow();
        if (this._onMove) {
            this.target.removeEventListener('mousemove', this._onMove);
            this._onMove = null;
        }
    }

    onMove(e) {
        const rect = this.rect;
        this.follower.to(e.clientX - rect.x, e.clientY - rect.y - 40);
    }
}

class PIDController {
  constructor(options) {
      this.kP = options.kP ?? 1;
      this.kI = options.kI ?? 0;
      this.kD = options.kD ?? 0;
      this.kDt = options.kDt ?? 1;

      this.target = 0;
      this.iError = 0;
      this.pError = 0;
  }

  setTarget(targetValue) {
      this.target = targetValue;
  }

  proportional(currentError) {
      return (this.kP * currentError);
  }

  integral(currentError, dt) {
      this.iError = (this.kI * currentError * dt) + this.iError;

      return this.iError;
  }

  derivative(currentError, dt) {
      const D = this.kD * (currentError - this.pError);
      this.pError = currentError;

      return dt == 0 ? D : D / dt;
  }

  update(currentValue, dt) {
      const currentError = this.target - currentValue;
      dt *= this.kDt;

      const P = this.proportional(currentError);
      const I = this.integral(currentError, dt);
      const D = this.derivative(currentError, dt);

      return P + I + D;
  }

  reset() {
      this.target = 0;
      this.iError = 0;
      this.pError = 0;
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const section = document.querySelector('.js-banner-section');

    section.querySelectorAll('.js-item').forEach(item => {
        new FollowerItem({
            target: item,
            modal: item.querySelector('.js-item-modal'),
        });
    });
});class ContactsMap {
  constructor(options) {
    this.controllers = {};
    this.DOM = {};

    this.DOM.target = options.target;

    if (typeof ymaps === 'undefined') {
        return this;
    }

    ymaps.ready(() => {
      let lat = parseFloat(this.DOM.target.dataset.lat);
      let long = parseFloat(this.DOM.target.dataset.long);

      this.map = new ymaps.Map(this.DOM.target, {
        center: [lat, long],
        zoom: 15,
        controls: ['smallMapDefaultSet'],
      });

      this.map.controls.remove('geolocationControl');

      const iconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<span class="map-placemark"></span>'
      );

      const myPlacemark = new ymaps.Placemark(
        [lat, long],
        {},
        {
          iconLayout: 'default#imageWithContent',
          iconImageHref: '',
          iconImageSize: [38, 40],
          iconImageOffset: [-19, -40],
          iconContentLayout: iconContentLayout
        }
      );

      this.map.geoObjects.add(myPlacemark);

      this.map.behaviors.disable('scrollZoom');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
    initializer(
        {
            target: document.querySelector('.js-contacts-map')
        },
        ({ target }) => {
            new ContactsMap({
                target: target,
            });
        },
    );
});class CookieNotice {
  constructor(options) {
    this.DOM = {};
    this.settings = {
      cookieName: 'cookie_accepted',
      cookieExpireDays: 365,
      showDelay: 1000,
      ...options
    };

    this.DOM.target = this.settings.target;
    
    if (!this.DOM.target || this.getCookie(this.settings.cookieName)) {
      return;
    }

    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.showNotice();
  }

  cacheDOM() {
    this.DOM.acceptBtn = this.DOM.target.querySelector('[data-cookie-accept]');
  }

  bindEvents() {
    if (this.DOM.acceptBtn) {
      this.DOM.acceptBtn.addEventListener('click', () => this.acceptCookie());
    }
  }

  showNotice() {

    setTimeout(() => {
      this.DOM.target.classList.add('show');
      // document.body.style.overflow = 'hidden';
    }, this.settings.showDelay);
  }

  hideNotice() {
    this.DOM.target.classList.remove('show');
    document.body.style.overflow = '';
    

    setTimeout(() => {
      this.DOM.target.remove();
    }, 300);
  }

  acceptCookie() {
    this.setCookie(this.settings.cookieName, 'true', this.settings.cookieExpireDays);
    
    if (typeof this.settings.onAccept === 'function') {
      this.settings.onAccept();
    }
    
    this.hideNotice();
  }

  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict${secure}`;
  }

  getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
  }

  static isAccepted(cookieName = 'cookie_accepted') {
    const cookie = new CookieNotice({});
    return !!cookie.getCookie(cookieName);
  }
}


document.addEventListener('DOMContentLoaded', () => {

  const cookieElement = document.querySelector('[data-cookie-notice]');
  
  if (cookieElement) {
    new CookieNotice({
      target: cookieElement,
      cookieName: cookieElement.dataset.cookieName || 'cookie_accepted',
      cookieExpireDays: parseInt(cookieElement.dataset.expireDays) || 365,
      showDelay: parseInt(cookieElement.dataset.showDelay) || 1000,
      onAccept: function() {

      }
    });
  }
});class FeedbackForm extends Form {
    constructor(options) {
      super({
        target: options.target,
        controlls: [
          new FormControll({
            target: options.target.querySelector('[form-controll="name"]'),
          }),
          new FormControll({
            target: options.target.querySelector('[form-controll="phone"]'),
            afterInit: (control) => {
              _phoneInputMaskHelper(control.strategies.input.DOM.input);
            }
          }),
          new FormControll({
            target: options.target.querySelector('[form-controll="email"]'),
          }),
          new FormControll({
            target: options.target.querySelector('[form-controll="message"]'),
          }),
          new FormControll({
            target: options.target.querySelector('[form-controll="agreement"]'),
            afterInit: (control) => {
              control.strategies.input.DOM.inputs[0]?.addEventListener('change', (e) => {
                _disableFormHelper(this, e.target.checked);
              });
            }
          }),
        ],
      });

      _formResultHandlerHelper(this);
      _disableFormHelper(this, false);
    }
  }

  function _disableFormHelper(form, value) {
    const submitButton = form.form.querySelector('button[type="submit"]');

    if(value) {
      form.enable();
      submitButton?.removeAttribute('disabled');
    } else {
      form.disable();
      submitButton?.setAttribute('disabled', true);
    }
  }

  function _phoneInputMaskHelper(input) {
    var maskOptions = {
      mask: '+{7} | 000 000-00-00',
      prepare: function (appended, masked) {
        if (appended === '8' && masked.value === '') {
          return ' ';
        }
        return appended;
      },
      lazy: false,
      overwrite: 'shift',
    };

    return IMask(input, maskOptions);
  }

  function _formResultHandlerHelper(form) {
    form.subscribe('form.submit.error', () => {
      modalResultError.open();
    });
    form.subscribe('form.submit.success', (e) => {
      form.reset();
      modalResultSuccess.open({
        title: e?.message?.title,
        text: e?.message?.text,
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    new FeedbackForm({
        target: document.querySelector('form'),
    })
})
;

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
    document.querySelectorAll('.js-manufacture-section').forEach((target) => {
        new ManufactureSlider({ target })
    })
});class ModalMenu extends ModalAppDefault {
    constructor(options) {
        super({ ...options });
        this.activeSubmenu = null; 
    }
}

class SubmenuItem {
    constructor(options) {
        this.target = options.target;
        this.name = this.target.getAttribute('submenu');
        this.triggers = document.querySelectorAll(`[submenu-trigger="${this.name}"]`);
        this.modal = options.modal; 
        this.init();
    }

    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        });
    }

    toggle() {
        if (this.modal.activeSubmenu && this.modal.activeSubmenu !== this) {
            this.modal.activeSubmenu.hide();
        }
        
        if (this.target.classList.contains('opened')) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.target.classList.add('opened');
        this.modal.activeSubmenu = this; 
    }

    hide() {
        this.target.classList.remove('opened');
        if (this.modal.activeSubmenu === this) {
            this.modal.activeSubmenu = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const modalEl = document.getElementById('menu-modal');
    const modal = new ModalMenu({ target: modalEl });
    
    modalEl.querySelectorAll('[submenu]').forEach(submenu => {
        const item = new SubmenuItem({ 
            target: submenu,
            modal: modal
        });
        
        modal.subscribe('close', () => {
            item.hide();
            modal.activeSubmenu = null;
        });
    });
});

class ModalResultError extends ModalAppDefault {
    constructor(options) {
      super({ ...options }
      );
      this.target = options.target;
      this._init();
    }

    _init() {
      this.textElement = document.querySelector('.js-modal-result-error-text');


      this.refreshButton = this.target.querySelector('.js-modal-result-error-refresh');
      this.refreshButton.addEventListener('click', this._onRefreshButtonClick.bind(this));
    }

    _onRefreshButtonClick(e) {
      this.close();
      location.reload();
    }

    reset() {
      this.textElement.innerHTML = '';
    }

    open(text) {
      this.reset();
      if(text != null) {
        this.textElement.innerHTML = text;
      }

      super.open();
    }

    close() {
      super.close();
    }
  }

  class ModalResultSuccess extends ModalAppDefault {
    constructor(options) {
      super({ ...options });
      this.target = options.target;

      this.textElement = document.querySelector('.js-modal-result-success-text');
      this.supportTextElement = document.querySelector('.js-modal-result-success-support-text');


      this.refreshButton = this.target.querySelector('.js-modal-result-success-button');
      this.refreshButton.addEventListener('click', this._onRefreshButtonClick.bind(this));
    }

    _onRefreshButtonClick(e) {
      this.close();
    }

    reset() {
      this.textElement.innerHTML = '';
    }

    open({ title, text }) {
      this.reset();

      if (title != null) {
        this.supportTextElement.innerHTML = title;
      } else {
        const defaultText = this.supportTextElement.getAttribute('default-text')
        this.supportTextElement.innerHTML = defaultText;
      }

      if (text != null) {
        this.textElement.innerHTML = text;
      } else {
        this.textElement.innerHTML = '';
      }

      super.open();
    }

    close() {
      super.close();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initializer(
        {
            target: document.getElementById('modal-result-success'),
        },
        ({ target }) => {
            window.modalResultSuccess = new ModalResultSuccess({
                target: target,
            });
        }
    );

    initializer(
        {
            target: document.getElementById('modal-result-error'),
        },
        ({ target }) => {
            window.modalResultError = new ModalResultError({
                target: target,
            });
        }
    );
  });document.addEventListener('DOMContentLoaded', () => {
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
});class NumbersSlider {
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
});class TerritorySlider {
  constructor({ target }) {
    this.target = target;
    this.slider = target.querySelector('.js-territory-swiper');
    this.init()
  }

  init() {
    if (!this.slider) return;

    this.swiper = new Swiper(this.slider, {
      direction: "horizontal",
      slidesPerView: 'auto',
      spaceBetween: 35,
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
});class TrademarkSlider {
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
});