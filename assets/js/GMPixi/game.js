
/* global GMPixi, Function, PIXI */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.Game = GMPixi.Game || Object.defineProperty(GMPixi, 'Game', {
    enumerable: true,
    value: function Game(o) {
        
        //checks if there options are defined else define an empty object
        if(!GMPixi.checkType(o, Object)) o = {};

        //checks if room options are defined else define an empty object
        if(!GMPixi.checkType(o.room, Object)) o.room = {};
        
        //initialize room and rooms object
        Object.defineProperties(this, {
            room: {
                enumerable: true,
                value: {}
            },
            rooms: {
                enumerable: true,
                value: {}
            }
        });
        
        //create some variables that will not be accessible outside
        //only setter and getter can modify this
        var room_steps = 0;
        var room_current = null;
        var room_count = 0;
        
        //initialize the rooms total
        Object.defineProperty(this.rooms, 'count', {
            set: function(value) {
                room_count = value;
            },
            get: function() {
                return room_count;
            }
            
        });
        
        //init all properties of rooms and set their enumerable, configurable, etc
        Object.defineProperties(this.room, {
            width: {
                enumerable: true,
                value: Math.abs(GMPixi.Math.toNumber(o.room.width, 480))
            },
            height: {
                enumerable: true,
                value: Math.abs(GMPixi.Math.toNumber(o.room.height, 320))
            },
            steps: {
                enumerable: true,
                get: function() {
                    return room_steps;
                },
                set: function() {
                    room_steps++;
                }
            },
            current: {
                enumerable: true,
                get: function() {
                    return room_current;
                },
                set: function(name) {
                    if(GMPixi.checkType(GMPixi.checkType(name, String) 
                            ? this.rooms[name] : name, GMPixi.object.Room)) {
                        room_current = name;
                    }
                    else {
                        throw TypeError("Failed to set room. " + 
                                "Input is not a room or a name.");
                    }
                }
            },
            add: {
                value: function add(rname, rdetails) {
                    //return false if no room name is specified
                    if(!GMPixi.checkType(rname, String)) {
                        throw TypeError('Failed to add room. Invalid name.');
                    }

                    //check if the given name already exists
                    //if exists return false
                    for(var rkey in this.rooms) {
                        if(rkey === rname) {
                            throw Error('Failed to add room. Room name already exists.');
                        }
                    }

                    //check if the given room details is an object
                    //if not return false
                    if(!GMPixi.checkType(rdetails, Object)) {
                        throw TypeError('Failed to add room. Room details is not an object.');
                    }

                    //adding the pointer of this.room and this.rooms to the rdetails so 
                    //that it can be accessed by the rooms
                    rdetails.room = this.room;
                    rdetails.rooms = this.rooms;


                    //create a new Room with the specified detail and store it to
                    this.rooms[rname] = new GMPixi.object.Room(rdetails);

                    //increment the room count if adding was a success
                    this.rooms.count++;
                    return this.rooms[rname];
                }.bind(this)
            },
            addRoom: {
                value: function addRoom(rname, rm) {
                    //return false if rm is not a room type
                    if(!GMPixi.checkType(rm, GMPixi.object.Room)) {
                        throw TypeError('Failed to add room. Invalid type.');
                    }
                    
                    if(!GMPixi.checkType(rname, String)) {
                        throw TypeError('Failed to add room. Invalid name.');
                    }
                    
                    //check if the given name already exists
                    //if exists return false
                    for(var rkey in this.rooms) {
                        if(rkey === rname) {
                            throw Error('Failed to add room. Room name already exists.');
                        }
                    }

                    //adds the room to the rooms list
                    this.rooms[rname] = rm;

                    //increment the room count if adding was a success
                    this.rooms.count++;
                    return this.rooms[rname];
                }.bind(this)
            },
            change: {
                value: function(rname, reset, override) {
                    
                    var typeName = GMPixi.checkType(rname, String) 
                            ? String : GMPixi.checkType(rname, GMPixi.object.Room) 
                            ? GMPixi.object.Room : null;
                    
                    //checks if there exists room with name 'rname'
                    //or the room rname, if true, go, else throw error
                    if(typeName === null ? true : typeName === String 
                            ? !GMPixi.checkType(this.rooms[rname]) : false) {
                        throw ReferenceError('Room not found!');
                    }
                    
                    //reference the room
                    var theRoom = 
                            typeName === String ? this.rooms[rname] : rname;
                    
                    //if reset is not defined, set it to true
                    if(!GMPixi.checkType(reset, Boolean)) reset = true;

                    //if override is not defined set it to empty objecct
                    if(!GMPixi.checkType(override, Object)) override = {};

                    //override the values of the keys in the room 
                    for(var okey in override) {
                        theRoom[okey] = override[okey];
                    }

                    //reset if requested
                    if(reset && GMPixi.checkType(theRoom._reset, Function)) {
                        theRoom._reset();
                    }

                    //set the current room to the room requested
                    this.room.current = theRoom;
                }.bind(this)
            },
            global: {
                enumerable: true,
                value: {}
            }
        });
        
        //creates the renderer
        switch(GMPixi.checkType(o.room.renderer, String) 
            ? o.room.renderer.toString().toLowerCase().replace(' ', '') 
            : 'auto') {
                case 'canvas': case 'c':
                    Object.defineProperty(this, 'renderer', {
                        enumerable: true,
                        value: new PIXI.CanvasRenderer(this.room.width, 
                            this.room.height, 
                            GMPixi.checkType(o.room.options, Object) 
                                    ? o.room.options
                                    : { background: '#000000' })
                    });
                    break;
                case 'webgl': case 'gl': case 'wg': case 'w': case 'g':
                    Object.defineProperty(this, 'renderer', {
                        enumerable: true,
                        value: new PIXI.WebGLRenderer(this.room.width, 
                            this.room.height, 
                            GMPixi.checkType(o.room.options, Object) 
                                    ? o.room.options
                                    : { background: '#000000' })
                    });
                    break;
                default: 
                    Object.defineProperty(this, 'renderer', {
                        enumerable: true,
                        value: PIXI.autoDetectRenderer(this.room.width, 
                            this.room.height, 
                            GMPixi.checkType(o.room.options, Object) 
                                    ? o.room.options
                                    : { background: '#000000' })
                    });
                    break;
        }

        //the parent of the renderer's view
        var room_parent = document.body;
        if(GMPixi.checkType(o.room.parent, String)) {
            room_parent = document.getElementById(o.room.parent);
            if(room_parent === null) room_parent = document.body;
        }
        
        Object.defineProperty(this.room, 'parent', {
            enumerable: true,
            value: room_parent
        });
        
        this.room.parent.appendChild(this.renderer.view);

        //setting room current position on its parent
        if(GMPixi.checkType(o.room.position, String)) {
            var poskeys = ["left", "right", "top", "bottom", "topleft", "lefttop", 
                        "topright", "righttop", "bottomleft", "leftbottom", 
                        "bottomright", "rightbottom", 'center', 'middle', 'rt',
                        "tr", "br", "rb", "tl", "lt", "c", "m", "l", "r", "t", "b"];
            o.room.position = o.room.position.toString().toLowerCase()
                    .replace('-', '').replace('_', '').replace(' ', '');
            if(poskeys.indexOf(o.room.position) <= -1) {
                o.room.position = "topleft";
            }
        }
        else if(GMPixi.checkType(o.room.position, Object)) {
            o.room.position.x = GMPixi.Math.toNumber(o.room.position.x, 0);
            o.room.position.y = GMPixi.Math.toNumber(o.room.position.y, 0);
        }
        else if(GMPixi.checkType(o.room.position, Array)) {
            o.room.position = {
                x: GMPixi.Math.toNumber(o.room.position[0], 0),
                y: GMPixi.Math.toNumber(o.room.position[1], 0)
            };
        }
        else {
            o.room.position = "topleft";
        }

        Object.defineProperty(this.room, 'position', {
            enumerable: true,
            value: o.room.position
        });
        
        //use to relocate the canvas if ever the size of the window changes
        var relocateView = function() {
            this.room.parent.width = this.room.parent.scrollWidth;
            this.room.parent.height = this.room.parent.scrollHeight > 0 
                    ? this.room.parent.scrollHeight : this.renderer.view.height;
            switch(this.room.position) {
                case 'left': case 'l':
                    this.room.x = 0;
                    this.room.y = this.room.parent.height/2;
                    break;
                case 'right': case 'r':
                    this.room.x = this.room.parent.width - this.room.width;
                    this.room.y = this.room.parent.height/2;
                    break;
                case 'top': case 't':
                    this.room.x = this.room.parent.width/2;
                    this.room.y = 0;
                    break;
                case 'bottom': case 'b':
                    this.room.x = this.room.parent.width/2;
                    this.room.y = this.room.parent.height - this.room.height;
                    break;
                case 'topleft': case 'lefttop': case 'tl': case 'lt':
                    this.room.x = 0;
                    this.room.y = 0;
                    break;        
                case 'topright': case 'righttop': case 'tr': case 'rt':
                    this.room.x = this.room.parent.width - this.room.width;
                    this.room.y = 0;
                    break; 
                case 'bottomleft': case 'leftbottom': case 'bl': case 'lb':
                    this.room.x = 0;
                    this.room.y = this.room.parent.height - this.room.height;
                    break;        
                case 'bottomright': case 'rightbottom': case 'br': case 'rb':
                    this.room.x = this.room.parent.width - this.room.width;
                    this.room.y = this.room.parent.height - this.room.height;;
                    break; 
                case 'center': case 'middle': case 'c': case 'm':
                    this.room.x = (this.room.parent.width - this.room.width)/2;
                    this.room.y = (this.room.parent.height - this.room.height)/2;
                    break;
            }
            this.renderer.view.style.left = this.room.x + "px";
            this.renderer.view.style.top = this.room.y + "px";
        }.bind(this);

        //if ever the window resizes or changes orientation
        window.addEventListener('resize', relocateView);
        //initial call
        relocateView();

        //some styling in the view
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";

        //function before loading resources
        if(GMPixi.checkType(o.preload, Function)) {
            o.preload.call(this);
        }
        
        //the setup function
        var setup = function() {
            //do something before creating the rooms
            if(GMPixi.checkType(o.preroom, Function)) {
                o.preroom.call(this);
            }
            
            //create the rooms
            if(GMPixi.checkType(o.rooms, Object)) {
                var firstRoom = null;       //tracks which room is first created
                var defaultRoom = null;     //tracks which room is default
                for(var roomname in o.rooms) {
                    var room_obj = this.room.add(roomname, o.rooms[roomname]);
                    if(room_obj.default && defaultRoom === null) defaultRoom = roomname;
                    if(firstRoom === null) firstRoom = roomname;
                }
                
                //do post loading here
                if(GMPixi.checkType(o.postload, Function)) {
                    o.postload.call(this);
                }

                //set the current room
                if(defaultRoom !== null) {
                    this.room.change(defaultRoom);
                }
                else {
                    if(firstRoom !== null) this.room.change(firstRoom);
                }

                //do the update after some delay
                setTimeout(this._update.bind(this), 1);
            }
            else {
                //do post loading if there is no room to be loaded
                if(GMPixi.checkType(o.postload, Function)) {
                    o.postload.call(this);
                }
            }
        }.bind(this);

        //check for resource loading
        if(GMPixi.checkType(o.resource, Array)) {
            for(var i in o.resource) {
                PIXI.loader.add(o.resource[i]);
            }
            PIXI.loader.on('load', function(loader, resource) {
                if(GMPixi.checkType(o.onload, Function)) {
                    o.onload.call(this, loader, resource);
                }
            }.bind(this)).load(setup);
        }
        else if(GMPixi.checkType(o.resource, String)) {
            PIXI.loader.add(o.resource)
                    .on('load', function(loader, resource) {
                        if(GMPixi.checkType(o.onload, Function)) {
                            o.onload.call(this, loader, resource);
                        }
                    }.bind(this)).load(setup);
        }
        else {
            setup();
        }
    }
});

Object.defineProperties(GMPixi.Game.prototype, {
    _loopUpdate: {
        value: function _loopUdate() {
            return window.requestAnimationFrame 
                    || window.webkitRequestAnimationFrame 
                    || window.mozRequestAnimationFrame 
                    || window.oRequestAnimationFrame 
                    || window.msRequestAnimationFrame 
                    || function(callback) {
                            window.setTimeout(callback, 1000/60);
                    };
        }
    },
    _update: {
        value: function _update() {
            if(GMPixi.checkType(this.room.current, GMPixi.object.Room)) {
                if(GMPixi.checkType(this.room.current._update, Function)) {
                    this.room.current._update();
                }
            }
            this.renderer.render(this.room.current);
            this.room.steps++;
            (this._loopUpdate())(this._update.bind(this));
        }
    }
});

