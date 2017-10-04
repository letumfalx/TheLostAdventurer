/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.other = GMPixi.other || Object.defineProperty(GMPixi, 'other', {
    value: {}
}).other;


Object.defineProperty(GMPixi.other, 'Player', {
    value: function Player(o) {
        this.room = o.room;
        this.level = o.level;
        this.block = o.level.blocks;
        this.button = o.level.button;
        PIXI.Sprite.call(this);
        
        this.sx = 36 / GMPixi.Player('stand').width;
        this.sy = 38 / GMPixi.Player('stand').height;
        
        this.death = {};
    }
}); 

Object.defineProperty(GMPixi.other.Player, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.other.Player.prototype, {
    movespeed: {
        value: {
            x: 3,
            y: 13,
            maxY: 20
        }
    },
    gravity: {
        value: 1
    },
    _vx: {
        writable: true,
        value: 0
    },
    vx: {
        get: function() {
            return this._vx;
        },
        set: function(val) {
            this._vx = val;
            this.scale.x = val > 0 ? this.sx : val < 0 ? -this.sx : this.scale.x;
        }
    },
    vy: {
        writable: true,
        value: 0
    },
    checkBlock: {
        value: function(x, y, type) {
            return this.block[x][y].type === (type || 3);
        }
    },
    isSpike: {
        value: function(x, y) {
            return this.checkBlock(x, y, 2) || this.checkBlock(x, y, -2);
        }
    },
    reset: {
        value: function reset() {
            this.setTexture(GMPixi.Player('stand'));
            this.pointer = 0;
            this.scale.set(this.sx, this.sy);
            this.vx = 0;
            this.vy = 0;
            this.jump = false;
            this.dead = false;
            this.changing = false;
            this.endgame = false;
            
            this.deathMoveUpTimer = 10;
        }
    },
    update: {
        value: function update() {
            
            //prevents updating player when end game screen is animating
            if(this.endgame) return;
            
            //prevents further update when transitioning to another level
            if(this.changing) {
                this.level.exitRoom(true);
                this.endgame = true;
                return;
            }
            
            //prevents further update when animating death
            if(this.dead) {
                
                //do death animation here
                //move 10px/step * 10 steps (100 px)
                //moves upward
                if(this.deathMoveUpTimer-- > 0) {
                    this.y -= 10;
                }
                else {
                    if(this.scale.y !== -1) {
                        this.scale.y = -1;
                        this.vy = 10;
                    }
                    //then move downward
                    this.y += (this.vy += 0.5);
                    
                    //until outside the room
                    if(this.y > this.room.height + this.height) {
                        this.endgame = true;
                        this.level.exitRoom(false);
                    }
                }
                
                return;
            }
            
            //updates vspeed based on inputs
            if(!this.jump && this.vy === 0 && this.button.space) {
                this.vy = -this.movespeed.y;
                this.jump = true;
            }
            
            //updates hspeed base on inputs
            this.vx = (this.button.right ? this.movespeed.x : 0)            //button right is +
                            - (this.button.left ? this.movespeed.x : 0) ;   //button left is -
            
            //updates sprite every 3 steps
            if(this.room.steps % 3 === 0) {
                //if moving horizontally
                if(this.vx !== 0) {
                    this.setTexture(GMPixi.Player('run_' + 
                            (this.pointer 
                                = GMPixi.Math.next(this.pointer, 0, 13, 1)))); 
                }
                //if not moving horizontally
                else {
                    this.pointer = 0;
                    this.setTexture(GMPixi.Player('stand'));
                }
            }
            
            //updating speeds
            //clamps all values so that it is inside the room
            this.x = GMPixi.Math.clamp(this.x + this.vx, this.width/2, this.room.width - this.width/2);
            this.y += Math.min(this.vy += this.gravity, this.movespeed.maxY);
            this.y = GMPixi.Math.clamp(this.y, -this.height, this.room.height + this.height/2);
            
            //some variables that will be used for collision
            var tileSize = 40;
            var sizeDiffX = tileSize - this.width;
            var sizeDiffY = tileSize - this.height;
            
            //vertical collision
            var bx = Math.floor(this.getBounds().x / 40);
            var by = Math.floor(this.getBounds().y / 40);
            var ox = this.getBounds().x % tileSize > sizeDiffX;
            var oy = this.getBounds().y % tileSize > sizeDiffY;
            
            if(this.vy > 0 && by < 19 && by > -1) {
                if((this.checkBlock(bx, by+1)
                        && !this.checkBlock(bx, by) && oy)
                        || (bx < 19 && this.checkBlock(bx+1, by+1)
                            && !this.checkBlock(bx+1, by) && ox && oy)) {
                    this.y = this.block[bx][by].y + sizeDiffY + this.height/2;
                    this.vy = 0;
                    this.jump = false;
                }
            }
            
            if(this.vy < 0 && by < 19 && by > -1) {
                if((!this.checkBlock(bx, by+1) 
                        && by > 0 && this.checkBlock(bx, by))
                        || (bx < 19 && !this.checkBlock(bx+1, by+1) && by > 0
                            && this.checkBlock(bx+1, by) && ox)) {
                            
                    this.y = this.block[bx][by+1].y + this.height/2;
                    this.vy = 0;
                }
            }
            
            if(this.y > this.room.height) {
                this.dead = true;
                return;
            }
            
            //horizontal movement
            var bx = Math.floor(this.getBounds().x / 40);
            var by = Math.floor(this.getBounds().y / 40);
            var ox = this.getBounds().x % tileSize > sizeDiffX;
            var oy = this.getBounds().y % tileSize > sizeDiffY;
            
            if(this.vx > 0 && bx > -1 && by < 19 && bx < 19 && by > -1) {
                if((this.checkBlock(bx+1, by) 
                        && !this.checkBlock(bx, by) && ox)
                        || (this.checkBlock(bx+1, by+1) 
                            && !this.checkBlock(bx, by+1) && ox && oy)) {
                        
                    this.x = this.block[bx][by].x + sizeDiffX + this.width/2;
                }
            }
            
            if(this.vx < 0 && bx > -1 && by < 19 && bx < 19 && by > -1) {
                if((!this.checkBlock(bx+1, by) 
                        && this.checkBlock(bx, by))
                        || (!this.checkBlock(bx+1, by+1) 
                            && this.checkBlock(bx, by+1) && oy)) {
                            
                    this.x = this.block[bx+1][by].x + this.width/2;
                }
            }
            
            //check if collided with spikes
            var bx = Math.floor(this.getBounds().x / 40);
            var by = Math.floor(this.getBounds().y / 40);
            var ox = this.getBounds().x % tileSize > sizeDiffX;
            var oy = this.getBounds().y % tileSize > sizeDiffY;
            
            if((by > -1 && this.isSpike(bx, by) && GMPixi.vector.Collision.rectToRect(this, this.block[bx][by]) > -1)
                    || (ox && bx < 19 && by > -1 && this.isSpike(bx+1, by) && GMPixi.vector.Collision.rectToRect(this, this.block[bx+1][by]) > -1)
                    || (oy && by < 19 && this.isSpike(bx, by+1) && GMPixi.vector.Collision.rectToRect(this, this.block[bx][by+1]) > -1) 
                    || (ox && oy && bx < 19 && by < 19 && this.isSpike(bx+1, by+1) && GMPixi.vector.Collision.rectToRect(this, this.block[bx+1][by+1]) > -1)) {
                this.dead = true;
            }
            
            //check if going in doors
            if(this.button.up) {
                
                var bx = Math.floor(this.getBounds().x / 40);
                var by = Math.floor(this.getBounds().y / 40);
                
                if(bx > -1 && bx < 20 && by > -1 && by < 19 
                        && this.checkBlock(bx, by, 1)) {
                    var d = this.block[bx][by].getBounds();
                    if(d.contains(this.x, this.y)) {
                        //changing room
                        this.changing = true;
                    }
                }
                else if(bx < 19 && by > -1 && by < 19 
                        && this.checkBlock(bx+1, by, 1)){
                    var d = this.block[bx+1][by].getBounds();
                    if(d.contains(this.x, this.y)) {
                        //changing room
                        this.changing = true;
                    }
                }
            }
            
        }
    }
});





