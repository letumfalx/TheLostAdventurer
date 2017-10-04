/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, , {
    value: function (o) {
        this.room = o.room;
        GMPixi.object.Container.call(this);
        
    }
}); 

Object.defineProperty(GMPixi.other., 'prototype', {
    value: Object.create(GMPixi.object.Container.prototype)
});

Object.defineProperties(GMPixi.other..prototype, {
    reset: {
        value: function reset() {
            
        }
    },
    update: {
        value: function update() {
            
        }
    }
});


