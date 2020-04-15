/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, 'Block', {
    value: function (o) {
        this.room = o.room;
        
        PIXI.Sprite.call(this);
        
        //array index reference
        this.m = o.m;
        this.n = o.n;
        
        this.w = 40;
        this.h = 40;
        
        this.level = o.level;
        
        Object.defineProperties(this, {
            /*
             * TYPES:
             * 0    -   none
             * -1    -   door entrance
             * 1     -   door exit
             * -2    -   spike downward
             * 2     -   spike upward
             * 3xy   -   terrain
             */
            _type: {
                writable: true,
                value: 0
            },
            type: {
                get: function() {
                    return this._type;
                },
                set: function(val) {
                    this._type = val;
                    var spr = GMPixi.sprite('empty');
                    switch(val) {
                        case 1:     spr = GMPixi.sprite('door0001'); break;
                        case -1:    spr = GMPixi.sprite('door0002'); break;
                        case 2:     spr = GMPixi.sprite('spike0001'); break;
                        case -2:    spr = GMPixi.sprite('spike0002'); break;
                        default: 
                            if(val >= 300 && val < 400) {
                                var num = Math.floor(val) % 300;
                                spr = GMPixi.Tile(Math.floor(num/10), num%10);
                                this._type = 3;
                            }
                            break;
                    }
                    this.setTexture(spr);
                }
            }
        });
        
    }
}); 

Object.defineProperty(GMPixi.other.Block, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.other.Block.prototype, {
    reset: {
        value: function reset() {
        }
    },
    update: {
        value: function update() {

        }
    }
});

