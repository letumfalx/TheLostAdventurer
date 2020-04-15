/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, 'Mask', {
    value: function Mask(o) {
        this.room = o.room;
        PIXI.Graphics.call(this);
        
        this.beginFill(0x000000);
        this.drawRect(0, 0, this.room.width, this.room.height);
        this.endFill();
        this.animate = {};
        
        this.next = o.next || {
            entrance: function() {},
            exit: function() {}
        };
        
    }
}); 

Object.defineProperty(GMPixi.other.Mask, 'prototype', {
    value: Object.create(PIXI.Graphics.prototype)
});

Object.defineProperties(GMPixi.other.Mask.prototype, {
    reset: {
        value: function reset() {
            this.animate.entrance = false;
            this.animate.exit = false;
            this.animate.endgame = false;
            this.alpha = 1;
        }
    },
    update: {
        value: function update() {
            if(this.animate.entrance) {
                if(this.alpha > 0) this.alpha -= 0.075;
                else {
                    this.alpha = 0;
                    this.animate.entrance = false;
                    this.next.entrance();
                }
            }
            else if(this.animate.exit) {
                if(this.alpha < 1) this.alpha += 0.1;
                else {
                    this.alpha = 1;
                    this.animate.exit = false;
                    this.next.exit();
                }
            }
        }
    }
});


