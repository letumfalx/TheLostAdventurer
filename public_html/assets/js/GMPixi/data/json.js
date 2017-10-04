
/* global Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.data = GMPixi.data || Object.defineProperty(GMPixi, 'data', {
    enumerable: true,
    value: {}
}).data;

Object.defineProperty(GMPixi.data, 'Json', {
    enumerable: true,
    value: {}
});

Object.defineProperties(GMPixi.data.Json, {
    timeout: {
        value: 2000
    },
    fromFileAsync: {
        value: function fromFileAsync(path, onsuccess, onerror) {
            
            if(!GMPixi.checkType(path, String)) {
                throw Error('Invalid path type.');
            }
            
            if (window.XMLHttpRequest) {
                var xmlhttp = new XMLHttpRequest();
            } 
            else {    
                var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            xmlhttp.overrideMimeType("application/json");
            
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState === 4) {
                    if(xmlhttp.status === 200) {
                        if(GMPixi.checkType(onsuccess, Function)) 
                            onsuccess(JSON.parse(xmlhttp.responseText));
                    }
                    else {
                        if(GMPixi.checkType(onerror, Function)) onerror();
                    }
                }
            };
            
            xmlhttp.timeout = GMPixi.data.Json.timeout;
            xmlhttp.ontimeout = function() {
                if(GMPixi.checkType(onerror, Function)) onerror();
            };
            
            xmlhttp.open("GET", path, true);
            xmlhttp.send();
        }
    },
    fromFile: {
        value: function fromFile(path, onsuccess, onerror) {
            
            if(!GMPixi.checkType(path, String)) {
                throw Error('Invalid path type.');
            }
            
            if (window.XMLHttpRequest) {
                var xmlhttp = new XMLHttpRequest();
            } 
            else {    
                var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            xmlhttp.overrideMimeType("application/json");
            
            xmlhttp.open("GET", path, false);
            
            try {
                xmlhttp.send();
            }
            catch(error) {
                return null;
            }
            
            if(xmlhttp.status === 200) {
                return JSON.parse(xmlhttp.responseText);
            }
            else {
                return null;
            }
            
            
        }
    }
});




