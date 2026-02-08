class ModalMenu extends ModalAppDefault {
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