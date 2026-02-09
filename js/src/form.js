class FeedbackForm extends Form {
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
      mask: '+{7} (000) 000-00-00',
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
