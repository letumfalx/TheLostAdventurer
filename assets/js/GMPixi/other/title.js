/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, 'Title', {
    value: function Title(o) {
        this.room = o.room;
        PIXI.Sprite.call(this, GMPixi.sprite('title'));
        
        this.next = o.next || function() {};
    }
}); 

Object.defineProperty(GMPixi.other.Title, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.other.Title.prototype, {
    reset: {
        value: function reset() {
            this.y = this.room.height/3;
            this.alpha = 0;
        }
    },
    update: {
        value: function update() {
            if(this.animate) {
                if(this.alpha < 1) {
                    this.alpha += 0.025;
                }
                else {
                    this.alpha = 1;
                    this.animate = false;
                    this.next();
                }
            }
        }
    }
});



