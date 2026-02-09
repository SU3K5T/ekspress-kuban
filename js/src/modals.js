

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

  class ModalForm extends ModalAppDefault {
    constructor(options) {
      super({ ...options });
      this.target = options.target;
      this._init();
    }

    _init() {
      this.form = this.target.querySelector('form');
      this.submitButton = this.form.querySelector('button[type="submit"]');

      if (this.form) {
        this.form.addEventListener('submit', this._onSubmit.bind(this));
      }
    }

    async _onSubmit(e) {
      e.preventDefault();
      
      const url = this.form.getAttribute('action');
      const formData = new FormData(this.form);

      this.submitButton.disabled = true;

      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          this.close();

          if (window.modalResultSuccess) {
            window.modalResultSuccess.open({ 
              title: 'Заявка отправлена', 
              text: 'Мы свяжемся с вами в ближайшее время' 
            });
          }
        } else {
          throw new Error('Ошибка сервера');
        }
      } catch (error) {
        if (window.modalResultError) {
          window.modalResultError.open('Не удалось отправить форму. Попробуйте позже.');
        }
      } finally {
        this.submitButton.disabled = false;
      }
    }

    reset() {
      if (this.form) this.form.reset();
    }

    close() {
      super.close();
    }

    open() {
      this.reset();
      super.open();
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
   
    initializer(
        {
            target: document.getElementById('modal-header-form'),
        },
        ({ target }) => {
            window.modalForm = new ModalForm({
                target: target,
            });
        }
    );
  });

  document.addEventListener('click', (e) => {
    const openButton = e.target.closest('.js-open-header-form-modal');
    
    if (openButton) {
        e.preventDefault();
        
        if (window.modalForm) {
            window.modalForm.open();
        } else {
          console.error('форма не инциализирована')
        }
    }
  });