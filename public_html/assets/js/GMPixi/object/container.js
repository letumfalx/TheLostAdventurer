/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.object = GMPixi.object || Object.defineProperty(GMPixi, 'object', {
    value: {}
}).Object;


Object.defineProperty(GMPixi.object, 'Container', {
    value: function Container() {
        PIXI.Container.call(this);
    }
}); 

Object.defineProperty(GMPixi.object.Container, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.object.Container.prototype, {
    _update: {
        value: function _update() {
            
            for(var c in this.children) {    
                if(GMPixi.checkType(this.children[c]._update, Function)) {
                    this.children[c]._update();
                }
                else if(GMPixi.checkType(this.children[c].update, Function)) {
                    this.children[c].update();
                }
            }
            
            if(GMPixi.checkType(this.update, Function)) this.update();
        }
    },
    _reset: {
        value: function _rset() {
            for(var c in this.children) {
                if(GMPixi.checkType(this.children[c]._reset, Function)) {
                    this.children[c]._reset();
                }
                else if(GMPixi.checkType(this.children[c].reset, Function)) {
                    this.children[c].reset();
                }
            }
            
            if(GMPixi.checkType(this.reset, Function)) this.reset();
        }
    },
    add: {
        enumerable: true,
        value: function add(obj, x, y, ax, ay, sx, sy, rot, a) {
            if(!GMPixi.checkType(obj)) {
                return null;
            }
            
            return this.addTo(obj, this, x, y, ax, ay, sx, sy, rot, a);
            
        }
    },
    addContainer: {
        enumerable: true,
        value: function addContainer(x, y, px, py) {
            var obj = new GMPixi.object.Container();
    
            //set defaults
            x = GMPixi.Math.toNumber(x, 0);
            y = GMPixi.Math.toNumber(y, 0);
            px = GMPixi.Math.toNumber(px, 0);


            if(!GMPixi.isTypeOf(py, [Number, String])) py = px;
            else py = GMPixi.Math.toNumber(py, 0);

            if(GMPixi.checkType(obj.pivot)) obj.pivot.set(px, py);
            
            this.addChild(obj);
            
            return obj;
        }
    },
    remove: {
        enumerable: true,
        value: function remove(obj) {
            this.removeChild(obj);
        }
    },
    removeAll: {
        enumerable: true,
        value: function removeAll() {
            this.removeChild();
        }
    },
    addTo: {
        enumerable: true,
        value: function addTo(obj, cont, x, y, ax, ay, sx, sy, rot, a) {
            if(!GMPixi.checkType(cont)) {
                return null;
            }
            if(!GMPixi.checkType(obj)) {
                return null;
            }
            
            //set defaults
            x = GMPixi.Math.toNumber(x, 0);
            y = GMPixi.Math.toNumber(y, 0);
            ax = GMPixi.Math.toNumber(ax, 0);
            sx = GMPixi.Math.toNumber(sx, 1);
            rot = GMPixi.Math.toNumber(rot, 0);
            a = GMPixi.Math.toNumber(a, 1);

            if(!GMPixi.isTypeOf(ay, [Number, String])) ay = ax;
            else ay = GMPixi.Math.toNumber(ay, 0);

            if(!GMPixi.isTypeOf(ay, [Number, String])) sy = sx;
            else sy = GMPixi.Math.toNumber(sy, 1);

            //set position
            obj.position.set(x, y);

            //set anchor
            if(GMPixi.checkType(obj.anchor)) obj.anchor.set(ax, ay);

            //set scales
            if(GMPixi.checkType(obj.scale)) {
                obj.scale.x = sx;
                obj.scale.y = sy;
            }

            //set rotation
            if(GMPixi.checkType(obj.rotation)) obj.rotation = rot;

            //set alpha/opacity
            if(GMPixi.checkType(obj.alpha)) obj.alpha = a;

            //add the object to the container
            cont.addChild(obj);

            //return the obj for further use
            return obj;
        }
    }
});

