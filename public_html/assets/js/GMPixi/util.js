
/* global Function, PIXI, GMPixi */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

/** Create the Global utils functions **/
Object.defineProperties(GMPixi, {
    checkType: {
        value: function checkType(obj, type) {
            try {
                if(typeof type === 'undefined') return typeof obj !== 'undefined';
                if(type === String || type === Number || type === Function || type === Object) {
                    return obj.constructor === type;
                }
                return obj instanceof type;
            }
            catch(error) {
                return false;
            }
        }
    },
    isTypeOf: {
        value: function isTypeOf(obj, types) {
            if(!GMPixi.checkType(obj)) return false;
            if(GMPixi.checkType(types)) {
                if(GMPixi.checkType(types, Array)) {
                    for(var i in types) {
                        if(obj.constructor === types[i]) return true;
                    }
                }
                else {
                    return obj.constructor === types;
                }
            }
            return false;
        }
    },
    isOneOf: {
        value: function isOneOf(obj, values) {
            if(!GMPixi.checkType(obj)) return false;
            if(GMPixi.checkType(values)) {
                if(GMPixi.checkType(values, Array)) {
                    for(var i in values) {
                        if(obj === values[i]) return true;
                    }
                }
                else {
                    return obj === values;
                }
            }
            return false;
        }
    },
    getElementLocation: {
        value: function getElementLocation(ele) {
            var el = ele.getBoundingClientRect();
            return GMPixi.Vector.point(el.left + window.scrollX, el.top + window.scrollY);
        }
    }
});
//GMPixi.checkType = GMPixi.checkType || Object.defineProperty(GMPixi, 'checkType', {
//    checkType: {
//        value: function checkType(obj, type) {
//            try {
//                if(typeof type === 'undefined') return typeof obj !== 'undefined';
//                if(type === String || type === Number || type === Function || type === Object) {
//                    return obj.constructor === type;
//                }
//                return obj instanceof type;
//            }
//            catch(error) {
//                return false;
//            }
//        }
//    }
//});
//
//GMPixi.isTypeOf = GMPixi.isTypeOf || Object.defineProperty(GMPixi, 'isTypeOf', {
//    value: function isTypeOf(obj, types) {
//        if(!GMPixi.checkType(obj)) return false;
//        if(GMPixi.checkType(types)) {
//            if(GMPixi.checkType(types, Array)) {
//                for(var i in types) {
//                    if(obj.constructor === types[i]) return true;
//                }
//            }
//            else {
//                return obj.constructor === types;
//            }
//        }
//        return false;
//    }
//});
//    
//
//
//GMPixi.isOneOf = GMPixi.isOneOf || Object.defineProperty(GMPixi, 'isOneOf', {
//    value: function isOneOf(obj, values) {
//        if(GMPixi.checkType(obj)) return false;
//        if(GMPixi.checkType(values)) {
//            if(GMPixi.checkType(values, Array)) {
//                for(var i in values) return obj === values[i];
//            }
//            else {
//                return obj === values;
//            }
//        }
//        return false;
//    }
//});
//
//GMPixi.getElementLocation = GMPixi.getElementLocation || Object.defineProperty(GMPixi, 'getElementLocation', {
//    value: function getElementLocation(ele) {
//        var el = ele.getBoundingClientRect();
//        return GMPixi.Vector.point(el.left + window.scrollX, el.top + window.scrollY);
//    }
//});