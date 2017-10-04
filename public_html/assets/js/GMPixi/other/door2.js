/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, 'Door', {
    value: function Door(o) {
        this.room = o.room;
        PIXI.Sprite.call(this, GMPixi.sprites('door000' + o.type));
        
    }
}); 

Object.defineProperty(GMPixi.other.Door, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.other.Door.prototype, {
    reset: {
        value: function reset() {
            
        }
    },
    update: {
        value: function update() {
            
        }
    }
});

