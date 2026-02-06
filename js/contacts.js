class ContactsMap {
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
});