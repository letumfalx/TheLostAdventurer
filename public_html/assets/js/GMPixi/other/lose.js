/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, 'Lose', {
    value: function Lose(o) {
        this.room = o.room;
        GMPixi.object.Container.call(this);
        
        this.roomMask = this.add(new PIXI.Graphics());
        this.roomMask.beginFill(0xff3c00);
        this.roomMask.drawRect(0, 0, this.room.width, this.room.height);
        this.roomMask.endFill();
        
        this.lose = this.add(new PIXI.Sprite(GMPixi.sprite('gameover')), 
                this.room.width/2, this.room.height * 0.4, 0.5);
        
        this.prompt = this.add(new PIXI.Sprite(GMPixi.sprite('info3')), 
                this.room.width/2, this.room.height * 0.725, 0.5);
     
        this.animate = {};
        
        this.next = o.next || function() {};
    }
}); 

Object.defineProperty(GMPixi.other.Lose, 'prototype', {
    value: Object.create(GMPixi.object.Container.prototype)
});

Object.defineProperties(GMPixi.other.Lose.prototype, {
    reset: {
        value: function reset() {
            this.prompt.visible = false;
            this.roomMask.alpha = 0;
            
            this.lose.alpha = 0;
            
            this.animate.entrance = false;
            this.animate.blink = false;
            
        }
    },
    update: {
        value: function update() {
            if(this.animate.entrance) {
                if(this.roomMask.alpha < 0.5) {
                    this.roomMask.alpha += 0.025;
                }
                else if(this.roomMask.alpha > 0.5){
                    this.roomMask.alpha = 0.5;
                }
                
                if(this.lose.alpha < 1) {
                    this.lose.alpha += 0.025;
                }
                else if(this.lose.alpha > 1){
                    this.lose.alpha = 1;
                }
                
                if(this.lose.alpha === 1 && this.roomMask.alpha === 0.5) {
                    this.animate.entrance = false;
                    this.animate.blink = true;
                    this.next();
                }
                
                
                
//                if(this.roomMask.alpha < 0.5) this.roomMask.alpha += 0.1;
//                else if(this.roomMask.alpha >= 0.5 && this.lose.alpha < 1) {
//                    if(this.roomMask.alpha > 0.5) this.roomMask.alpha = 0.5;
//                    this.win.alpha += 0.05;
//                }
//                else if(this.lose.alpha >= 1) {
//                    if(this.lose.alpha > 1) this.lose.alpha = 1;
//                    this.animate.blink = true;
//                    this.animate.entrance = false;
//                    this.next();
//                }
                
            }
            
            if(this.animate.blink && this.room.steps % 30 === 0) {
                this.prompt.visible = !this.prompt.visible;
            }
        }
    }
});




