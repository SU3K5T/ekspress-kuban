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
}

class ModalMenu extends ModalAppDefault {
    constructor(options) {
            super({ ...options }
        );
    }
}

class SubmenuItem {
    constructor(options) {
        this.target = options.target;
        this.name = this.target.getAttribute('submenu');
        this.triggers = document.querySelectorAll(`[submenu-trigger="${this.name}"]`);
        this.init();
    }
    
    init() {
       this.triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.toggle();
            });
       });
    }

    toggle() {
        this.target.classList.toggle('opened');
    }

    show() {
        this.target.classList.add('opened');
    }

    hide() {
        this.target.classList.remove('opened');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const modalEl = document.getElementById('menu-modal');
    
    const modal = new ModalMenu({target: modalEl});
    modalEl.querySelectorAll('[submenu]').forEach(submenu => {
        const item = new SubmenuItem({target: submenu});
        modal.subscribe('close', () => {
            item.hide();
        });
    });
});