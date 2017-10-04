/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, 'Background', {
    value: function Background(o) {
        this.room = o.room;
        PIXI.Sprite.call(this, GMPixi.sprite('bg'));
        
    }
}); 

Object.defineProperty(GMPixi.other.Background, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.other.Background.prototype, {
    reset: {
        value: function reset() {
            this.width = this.room.width;
            this.height = this.room.height;
        }
    },
    update: {
        value: function update() {
            
        }
    }
});



