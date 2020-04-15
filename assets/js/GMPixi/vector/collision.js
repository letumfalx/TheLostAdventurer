/* global GMPixi */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.vector = GMPixi || Object.defineProperty(GMPixi, 'vector', {
    enumerable: true,
    value: {}
}).vector;

Object.defineProperty(GMPixi.vector, 'Collision', {
    value: {}
});

Object.defineProperties(GMPixi.vector.Collision, {
    TOP: {
        value: 1
    },
    BOTTOM: {
        value: 3
    },
    LEFT: {
        value: 0
    },
    RIGHT: {
        value: 2
    },
    NONE: {
        value: -1
    },
    rectToRect: {
        value: function rectToRect(ref, bumper) {
            
            //the half dimensions
            var rhw = ref.getBounds().width/2;
            var rhh = ref.getBounds().height/2;
            
            var bhw = ref.getBounds().width/2;
            var bhh = ref.getBounds().height/2;
            
            //center locations
            var rcx = ref.getBounds().x + rhw
            var rcy = ref.getBounds().y + rhh;
            
            var bcx = bumper.getBounds().x + bhw;
            var bcy = bumper.getBounds().y + bhh;
            
            //distance between the two center
            var dx = bcx - rcx;
            var dy = bcy - rcy;
            
            //combined half dimensions
            var chw = rhw + bhw;
            var chh = rhh + bhh;
            
            if(Math.abs(dx) < chw) {
                if(Math.abs(dy) < chh) {
                    //get the overlapped size
                    var ox = chw - Math.abs(dx);
                    var oy = chh - Math.abs(dy);
                    
                    if(ox > oy) {
                        if(dy > 0) {
                            return GMPixi.vector.Collision.BOTTOM;
                        }
                        else {
                            return GMPixi.vector.Collision.TOP;
                        }
                    } else {
                        if(dx > 0) {
                            return GMPixi.vector.Collision.RIGHT;
                        }
                        else {
                            return GMPixi.vector.Collision.LEFT;
                        }
                    }
                    
                }
            }
            
            return GMPixi.vector.Collision.NONE;
        }
    },
    
    
//    rectToRect: {
//        value: function hitRectToRect(ref, bumper) {
//            
//            /**
//             * reference values:
//             * 0    -   left
//             * 1    -   top
//             * 2    -   right
//             * 3    -   bottom
//             * -1   -   no collsion
//             */
//            
//            var left = 0;
//            var top = 1;
//            var right = 2;
//            var bottom = 3;
//            
//            var rx1 = ref.getBounds().x;
//            var rx2 = ref.getBounds().x + ref.getBounds().width;
//            var ry1 = ref.getBounds().y;
//            var ry2 = ref.getBounds().y + ref.getBounds().height;
//            var rcx = ref.getBounds().x + ref.getBounds().width/2;
//            var rcy = ref.getBounds().y + ref.getBounds().height/2;
//            
//            var bx1 = bumper.getBounds().x;
//            var bx2 = bumper.getBounds().x + ref.getBounds().width;
//            var by1 = bumper.getBounds().y;
//            var by2 = bumper.getBounds().y + ref.getBounds().height;
//            var bcx = bumper.getBounds().x + ref.getBounds().width/2;
//            var bcy = bumper.getBounds().y + ref.getBounds().height/2;
//            
//            var atX_r = GMPixi.Math.isOnRange(bx1, rx1, rx2);       //right collison
//            var atX_l = GMPixi.Math.isOnRange(bx2, rx1, rx2);       //left collision
//            
//            var atY_b = GMPixi.Math.isOnRange(by1, ry1, ry2);       //bottom collsion
//            var atY_t = GMPixi.Math.isOnRange(by2, ry1, ry2);       //top collision
//            
//            var diff_x = bcx - rcx;
//            var diff_y = bcy - rcy;
//            
//            if(diff_x > 0) {    
//                //right, check if top or bottom
//                if(diff_y > 0) {    //for bottom
//                    //check if really bottom
//                    if(diff_y > diff_x) {   //return which ever is farther it is the one that is just collided
//                        return bottom;
//                    }
//                }
//                else {
//                    if()
//                }
//                return 
//            }
//            else {
//                
//            }
//            
//            //no collision
//            return -1;
//        }
//    },
    elipseToRect: {
        value: function hit(ref, bumper) {
            var rx = ref.getBounds().x;
            var ry = ref.getBounds().y;
            var rw = ref.getBounds().width/2;
            var rh = ref.getBounds().height/2;
            
            var bx = bumper.getBounds().x;
            var by = bumper.getBounds().y;
            var bw = bumper.getBounds().width/2;
            var bh = bumper.getBounds().height/2;
            
            //get the angle of between the reference and the bumper
            var angle = Math.atan2(by - ry, by - bx);
            
            
            
        }
    }
});


//Object.defineProperty(GMPixi.vector, 'Collision', {
//    value: function Collision(obj, circular) {
//        Object.defineProperties(this, {
//            main: {
//                value: obj
//            },
//            circular: {
//                value: GMPixi.checkType(circular, Boolean) ? circular : false
//            },
//            width: {
//                get: function() {
//                    return this.main.width;
//                }.bind(this)
//            },
//            height: {
//                get: function() {
//                    return this.main.height;
//                }.bind(this)
//            },
//            center: {
//                value: {}
//            }
//        }); 
//        Object.defineProperties(this.center, {
//            x: {
//                get: function() {
//                    var p = GMPixi.Math.toNumber(this.main.pivot.x, 0);
//                    var a = GMPixi.Math.toNumber(this.main.anchor.x, 0);
//                    var rad = this.main.rotation - Math.tan2()
//                    return this.main.x + ((0.5 - a) * this.width - p) * Math.cos(this.main.rotation);
//                }.bind(this)
//            },
//            y: {
//                get: function() {
//                    var p = GMPixi.Math.toNumber(this.main.pivot.y, 0);
//                    var a = GMPixi.Math.toNumber(this.main.anchor.y, 0);
//                    console.log(this.main.y);
//                    return this.main.y + ((0.5 - a) * this.height - p) * Math.sin(this.main.rotation + Math.PI/2);
//                }.bind(this)
//            }
//        });
//    }
//});
//
//Object.defineProperty(GMPixi.vector.Collision, 'prototype', {
//    value: Object.create(null)
//}); 
//
//Object.defineProperties(GMPixi.vector.Collision.prototype, {
//});
//
//
//