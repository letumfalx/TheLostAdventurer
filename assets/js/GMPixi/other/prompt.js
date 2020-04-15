/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, 'Prompt', {
    value: function Prompt(o) {
        this.room = o.room;
        PIXI.Sprite.call(this, o.sprite);
        this.pos_x = o.x;
        this.pos_y = o.y;
    }
}); 

Object.defineProperty(GMPixi.other.Prompt, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.other.Prompt.prototype, {
    reset: {
        value: function reset() {
            this.x = this.pos_x;
            this.y = this.pos_y;
            this.visible = false;
            this.animate = false;
        }
    },
    update: {
        value: function update() {
            if(this.animate && this.room.steps%30 === 0) {
                this.visible = !this.visible;
            }
        }
    }
});
