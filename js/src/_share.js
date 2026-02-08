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