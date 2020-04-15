
/* global GMPixi */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.Math = GMPixi.Math || Object.defineProperty(GMPixi, 'Math', {
            enumerable: true,
            value: {}
        });


Object.defineProperties(GMPixi.Math, {
    WHOLE: {
        enumerable: true,
        value: Math.PI * 2
    },
    toNumber: {
        value: function toNumber(object, defaultValue) {
            if(!GMPixi.checkType(defaultValue, Number)) {
                defaultValue = Number(defaultValue);
                if(Number.isNaN(defaultValue)) defaultValue = 0;
            }
            object = Number(object);
            return Number.isNaN(object) ? defaultValue : object;
        }
    },
    canBeNumber: {
        value: function canBeNumber(val) {
            return !Number.isNaN(Number(val));
        }
    },
    random: {
        value: function random(min, max, isInt) {
            min = GMPixi.Math.toNumber(min, 0);
            max = GMPixi.Math.toNumber(max, 100);
            if(!GMPixi.checkType(isInt, Boolean)) isInt = true;
            var rand = Math.random() * (max - min) + min;
            return isInt ? Math.floor(rand) : rand;
        }
    },
    clamp: {
        value: function clamp(val, min, max) {
            if(GMPixi.checkType(val, String)) {
                if(Number.isNaN(val = Number(val))) {
                    throw TypeError('Clamp value cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(val, Number)) {
                throw TypeError('Clamp value cannot be converted to number.');
            }
            
            if(GMPixi.checkType(min, String)) {
                if(Number.isNaN(min = Number(min))) {
                    throw TypeError('Clamp min value cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(min, Number)) {
                throw TypeError('Clamp min value cannot be converted to number.');
            }
            
            if(GMPixi.checkType(max, String)) {
                if(Number.isNaN(max = Number(max))) {
                    throw TypeError('Clamp max value cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(max, Number)) {
                throw TypeError('Clamp max value cannot be converted to number.');
            }

            return Number(min === max ? min : min < max ? 
                (val < min ? min : val > max ? max : val) : (val > max && val < min 
                ? Math.abs(min - val) > Math.abs(max - val) ? max : min : val));
        }
    },
    isOnRange: {
        value: function isOnRange(value, min, max) {
            if(GMPixi.checkType(value, String)) {
                if(Number.isNaN(value = Number(value))) {
                    throw TypeError('Range Value cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(value, Number)) {
                throw TypeError('Range value cannot be converted to number.');
            }
            
            if(GMPixi.checkType(min, String)) {
                if(Number.isNaN(min = Number(min))) {
                    throw TypeError('Range min Value cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(min, Number)) {
                throw TypeError('Range min value cannot be converted to number.');
            }
            
            if(GMPixi.checkType(max, String)) {
                if(Number.isNaN(max = Number(max))) {
                    throw TypeError('Range max Value cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(max, Number)) {
                throw TypeError('Range max value cannot be converted to number.');
            }
            
            return min === max ? value === min : min < max ? value >= min 
                    && value <= max : value >= max && value <= min;
        }
    },
    angleTo360: {
        value: function angleTo360(angle) {
            if(GMPixi.checkType(angle, String)) {
                if(Number.isNaN(angle = Number(angle))) {
                    throw TypeError('Angle cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(angle, Number)) {
                throw TypeError('Angle cannot be converted to number.');
            }
            if(angle > 360) return angle % 360;
            while(angle < 0) {
                angle += 360;
            }
            return angle;
        }
    },
    angleTo2Pi: {
        value: function angleTo2Pi(angle) {
            if(GMPixi.checkType(angle, String)) {
                if(Number.isNaN(angle = Number(angle))) {
                    throw TypeError('Angle cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(angle, Number)) {
                throw TypeError('Angle cannot be converted to number.');
            }
            while(angle > GMPixi.Math.WHOLE) angle -= GMPixi.Math.whole;
            while(angle < 0) angle += GMPixi.Math.WHOLE;
            return angle;
        }
    },
    rad: {
        value: function rad(deg, normalized) {
            if(GMPixi.checkType(deg, String)) {
                if(Number.isNaN(deg = Number(deg))) {
                    throw TypeError('Degree Angle cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(deg, Number)) {
                throw TypeError('Degree Angle cannot be converted to number.');
            }
            if(!GMPixi.checkType(normalized, Boolean)) normalized = true;
            var angle = deg * Math.PI / 180;
            return normalized ? GMPixi.Math.angleTo2Pi(angle) : angle;
        }
    },
    deg: {
        value: function deg(rad, normalized) {
            if(GMPixi.checkType(rad, String)) {
                if(Number.isNaN(rad = Number(rad))) {
                    throw TypeError('Radian Angle cannot be converted to number.');
                }
            }
            else if(!GMPixi.checkType(rad, Number)) {
                throw TypeError('Radian Angle cannot be converted to number.');
            }
            
            if(!GMPixi.checkType(normalized, Boolean)) normalized = true;
            var angle = rad * 180 / Math.PI;
            return normalized ? GMPixi.Math.angleTo360(angle) : angle;
        }
    },
    shuffle: {
        value: function shuffle(array) {
            var arr = array;
            if(GMPixi.checkType(array, String)) {
                arr = array.split("");
            }
            else if(!GMPixi.checkType(array, Array)) {
                throw TypeError('Unable to shuffle input. ' + 
                        'Input must be a string or an array to shuffle.');
            }
            
            for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            
            return GMPixi.checkType(array, Array) ? arr : arr.join("");
        }
    },
    next: {
        value: function(base, min, max, increment) {
            if(!GMPixi.Math.canBeNumber(base)) {
                throw TypeError('Base number cannot convert to number.');
            }
            
            increment = GMPixi.Math.toNumber(increment, 1);
            min = GMPixi.Math.toNumber(min, 0);
            max = GMPixi.Math.toNumber(max, 99);
            base += increment;
            return increment > 0 && base > max ?  min : 
                    increment < 0 && base < min ?  max : base;
            
        }
    }
});