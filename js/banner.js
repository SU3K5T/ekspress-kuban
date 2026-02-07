class Follower {
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
            offsetX: () => 10,
            offsetY: () => -200,
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
});