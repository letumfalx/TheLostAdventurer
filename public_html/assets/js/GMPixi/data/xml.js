
/* global Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.data = GMPixi.data || Object.defineProperty(GMPixi, 'data', {
    enumerable: true,
    value: {}
}).data;

Object.defineProperty(GMPixi.data, 'Xml', {
    enumerable: true,
    value: {}
});

Object.defineProperties(GMPixi.data.Xml, {
    timeout: {
        value: 20000
    },
    fileToJson: {
        value: function fileToJson(path, async, onsuccess, onerror) {
            
            var loadFile = function(xmlRequest) {
                var doc = xmlRequest.responseText;

                //removes all white space between tags
                var pattern = />[\r\n\t ]+</;
                while(pattern.test(doc)) {
                    doc = doc.replace(pattern, "><");
                }
                while(doc.indexOf('\\n') > -1) {
                    doc = doc.replace('\\n', '\n');
                }

                //converts back to xml after cleaning
                var parser;
                var xmlDoc;

                if (window.DOMParser) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(doc, "text/xml");
                } else { 
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(doc); 
                } 
                
                var obj = GMPixi.data.Xml.toJson(xmlDoc);
                
                if(!async) {
                    return obj;
                }
                if(GMPixi.checkType(onsuccess, Function)) onsuccess(obj);
            };
            
            if(!async) {
                return loadFile(GMPixi.data.Xml.load(path));
            }
            GMPixi.data.Xml.loadAsync(path, loadFile, onerror);
        }
    },
    loadAsync: {
        value: function loadAsync(path, onsuccess, onerror) {
            
            if(!GMPixi.checkType(path, String)) {
                throw Error('Invalid path type.');
            }

            if (window.XMLHttpRequest) {
                var xmlhttp = new XMLHttpRequest();
            } else {    
                var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState === 4) {
                    if(xmlhttp.status === 200) {
                        if(GMPixi.checkType(onsuccess, Function)) 
                            onsuccess(xmlhttp);
                    }
                    else {
                        if(GMPixi.checkType(onerror, Function)) 
                            onerror();
                    }
                }
            };
            
            xmlhttp.timeout = GMPixi.data.Xml.timeout;
            xmlhttp.ontimeout = function() {
                if(GMPixi.checkType(onerror, Function)) onerror();
            };
            
            xmlhttp.open("GET", path, true);
            xmlhttp.send();
        }
    },
    load: {
        value: function load(path) {
            
            if(!GMPixi.checkType(path, String)) {
                throw Error('Invalid path type.');
            }

            if (window.XMLHttpRequest) {
                var xmlhttp = new XMLHttpRequest();
            } else {    
                var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            xmlhttp.timeout = GMPixi.data.Xml.timeout;
            xmlhttp.ontimeout = function() {
                if(GMPixi.checkType(onerror, Function)) onerror();
            };
            
            xmlhttp.open("GET", path, false);
            xmlhttp.send();
            
            if(xmlhttp.readyState === 4) {
                if(xmlhttp.status === 200) {
                    return xmlhttp;
                }
            }
            return null;
        }
    },
    toJson: {
        value: function toJson(xml) {
            var obj = {};
    
            if(xml.nodeType === 1) { 
                if(xml.attributes.length > 0) {
                    for(var j=0; j<xml.attributes.length; ++j) {
                        var attrib = xml.attributes.item(j);
                        obj[attrib.nodeName] = attrib.nodeValue;
                    }
                }
            }
            else if (xml.nodeType === 3) {
                obj = xml.nodeValue;
            }

            if(xml.hasChildNodes()) {
                for(var i=0; i<xml.childNodes.length; ++i) {
                    var item = xml.childNodes[i];
                    var nodeName = item.nodeName;
                    if(typeof obj[nodeName] === 'undefined') {
                        obj[nodeName] = GMPixi.data.Xml.toJson(item);
                    }
                    else {
                        if(typeof obj[nodeName].push === "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(GMPixi.data.Xml.toJson(item));
                    }
                }
            }

            return obj;
        }
    }
});

