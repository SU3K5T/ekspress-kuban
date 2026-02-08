class CookieNotice {
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
});