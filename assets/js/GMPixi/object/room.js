
/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;


GMPixi.object = GMPixi.object || Object.defineProperty(GMPixi, 'object', {
    value: {}
}).object;

Object.defineProperty(GMPixi.object, 'Room', {
    enumerable: true,
    value: function Room(details) {
        GMPixi.object.Container.call(this);
        
        //setting the room global details and this room method like update/reset
        Object.defineProperties(this, {
            room: {
                enumerable: true,
                value: GMPixi.checkType(details.room, Object) 
                        ? details.room : {}
            },
            rooms: {
                enumerable: true,
                value: GMPixi.checkType(details.rooms, Object) 
                        ? details.rooms : {}
            },
            default:  {
                enumerable: true,
                value: GMPixi.checkType(details.default, Boolean) 
                        ? details.default : false
            },
            update: {
                enumerable: true,
                value: GMPixi.checkType(details.update, Function) 
                        ? details.update.bind(this) : null
            },
            reset: {
                enumerable: true,
                value: GMPixi.checkType(details.reset, Function) 
                        ? details.reset.bind(this) : null
            }
        });
        
        //parse all methods first
        if(GMPixi.checkType(details.methods, Object)) {
            for(var imethod in details.methods) {
                Object.defineProperty(this, imethod, {
                    enumerable: true,
                    writable: true,
                    value: details.methods[imethod].bind(this)
                });
            }
        } 
        
        //then parse all data
        if(GMPixi.checkType(details.data, Object)) {
            for(var idata in details.data) {
                //protection for reserve keys
                Object.defineProperty(this, idata, {
                    enumerable: true,
                    writable: true,
                    value: details.data[idata]
                });
            }
        }
        
        //do the setup here
        if(GMPixi.checkType(details.setup, Function)) {
            details.setup.call(this);
        }
        
    }
});

Object.defineProperty(GMPixi.object.Room, 'prototype', {
    value: Object.create(GMPixi.object.Container.prototype)
});

