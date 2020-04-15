
var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.data = GMPixi.data || Object.defineProperty(GMPixi, 'data', {
    enumerable: true,
    value: {}
}).data;

Object.defineProperty(GMPixi.data, 'Cookie', {
    enumerable: true,
    value: {}
});

Object.defineProperties(GMPixi.data.Cookie, {
    set: {
        value: function set(key, value, howLong, path) {
            var expires = "";
            if(!GMPixi.checkType(key)) {
                throw ReferenceError('Cookie key is undefined.');
            }
            if(!GMPixi.checkType(value)) {
                throw ReferenceError('Cookie value is undefined');
            }
            if(GMPixi.checkType(howLong, Number)) {
                var date = new Date();
                date.setTime(date.getTime() + howLong);
                expires = "; expires=" + date.toUTCString();
            }
            if(GMPixi.checkType(path, String)) {
                path = "/";
            }
            
            document.cookie = key + "=" + value + expires + "; path=/";
            return GMPixi.Data.Cookie.get(key);
        }
    },
    get: {
        value: function(key, defaultValue, createDefault, howLong, path) {
            key = key + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)===' ') c = c.substring(1,c.length);
                if (c.indexOf(key) === 0) 
                    return c.substring(key.length,c.length).replace("=", "");
            }

            if(!GMPixi.checkType(defaultValue)) defaultValue = null;
            if(!GMPixi.checkType(createDefault, Boolean)) createDefault = false;

            if(createDefault && defaultValue !== null) {
                GMPixi.Data.Cookie.set(key, defaultValue, howLong, path);
                return GMPixi.data.Cookie.get(key);
            }
            return null;
        }
    },
    remove: {
        value: function remove(key) {
            return GMPixi.data.Cookie.set(key, "", -1);
        }
    }
});





