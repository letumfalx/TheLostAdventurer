/* global GMPixi, PIXI */

var game;
window.onload = function() {
    game = new GMPixi.Game({
        resource: [
            'assets/sprite/bg.png',
            'assets/sprite/controls.png',
            'assets/sprite/dash.png',
            'assets/sprite/door0001.png',
            'assets/sprite/door0002.png',
            'assets/sprite/gameover.png',
            'assets/sprite/info1.png',
            'assets/sprite/info2.png',
            'assets/sprite/info3.png',
            'assets/sprite/spike0001.png',
            'assets/sprite/spike0002.png',
            'assets/sprite/tile.png',
            'assets/sprite/title.png',
            'assets/sprite/youwin.png',
            'assets/sprite/empty.png'
        ],
        preroom: function() {
            
            //sets the getter of some sprites
            Object.defineProperty(GMPixi, 'sprite', {
                value: function sprite(name) {
                    return PIXI.TextureCache['assets/sprite/' + name + '.png'] 
                            || null;
                }
            });
            
        },
        postload: function() {
            //remove default from keypresses of space and the directional keys
            //to avoid some unwanted behaviors
            window.addEventListener('keydown', function(e){
                if(GMPixi.isOneOf(e.keyCode, [32, 37, 38, 39, 40])) {
                    e.preventDefault();
                }
            }.bind(this));
        },
        room: {
            width: 800,
            height: 800,
            renderer: 'canvas',
            position: 'center'
        },
        rooms: {
            loading: {
                data: {
                    levelCount: 5
                },
                methods: {
                    loadTerrain: function() {
                        //sets the getter of tile sprites
                        var frame = Object.create(null);       //frames for the spritesheet
                        var spr = GMPixi.sprite('tile');        //base texture of the tiles
                        
                        //loop through the image 40x40 pixels at a time
                        for(var x=0; x<spr.width; x+=40) {
                            for(var y=0; y<spr.height; y+=40) {
                                
                                frame[(x/40) + "," + (y/40)] = {
                                    frame: {
                                        x: x, y: y,
                                        w:40, h:40
                                    },
                                    rotated: false,
                                    trimmed: false,
                                    spriteSourceSize: {
                                        x: x, y: y,
                                        w:40, h:40
                                    },
                                    sourceSize: {w:40,h:40}
                                };
                            }
                        }
                        
                        //create the sprite sheet reference from loaded image
                        var tileSS = new PIXI.Spritesheet(spr, {
                            frames: frame,
                            meta: {
                                image: "./assets/sprite/tile.png",
                                format: "RGBA8888",
                                size: { w: 320, h: 120 },
                                scale: 1
                            }
                        });
                        
                        //parse the spritesheet
                        tileSS.parse(function() {
                            
                            //create a function that will get tiles based 
                            //on row and col position
                            Object.defineProperty(GMPixi, 'Tile', {
                                value: function Tile(c, r) {
                                    return tileSS.textures[c + "," + r] || null;
                                }
                            });
                            
                            //load player sprites
                            this.loadPlayer();
                        }.bind(this));
                    },
                    loadPlayer: function() {
                        
                        //load the data to be used to parse the sprite
                        GMPixi.data.Xml.fileToJson('./assets/xml/dash.xml', 
                            true, 
                            function(obj) {
                                this.parsePlayer(obj.TextureAtlas);
                            }.bind(this), 
                            function() {
                                this.atLoad.visible = false;
                                this.atError.visible = true;
                                this.loading.text = "Load Failed!";
                            }.bind(this));
                    },
                    parsePlayer: function(obj) {
                        
                        //create a temporary pointers
                        var frames = Object.create(null);
                        var textures = obj.SubTexture;
                        
                        //segregate data to different arrays
                        for(var i=0; i<textures.length; ++i) {
                            var fr = textures[i];
                            frames[fr.name] = frames[fr.name] || [];
                            var af = {
                                frame: {
                                    x: fr.frameX, y: fr.frameY,
                                    w: fr.frameWidth, 
                                    h: fr.frameHeight
                                },
                                rotated: false,
                                trimmed: false,
                                spriteSourceSize: {
                                    x: fr.x, y: fr.y,
                                    w: fr.width, h: fr.height
                                },
                                sourceSize: {
                                    w: fr.width, h: fr.height
                                }
                            };
                            frames[fr.name].push(af);
                        }
                        
                        //combine all data into one object
                        var mframe = Object.create(null);
                        for(var k in frames) {
                            if(frames[k].length > 1) {
                                for(var i in frames[k]) {
                                    mframe[k + "_" + i] = frames[k][i];
                                }
                            }
                            else {
                                mframe[k] = frames[k][0] || null;
                            }
                        }
                        
                        //the base texture to be used
                        var base = GMPixi.sprite('dash');
                        
                        //the pointer to the sprites loaded
                        var sprites = new PIXI.Spritesheet(base, {
                            frames: mframe,
                            meta: {
                                image: obj.imagePath,
                                format: "RGBA8888",
                                size: { w: base.width, h: base.height },
                                scale: 1
                            }
                        });
                        
                        //parse the sprite
                        sprites.parse(function() {
                            //create a getter function for the sprites loaded
                            Object.defineProperty(GMPixi, 'Player', {
                                value: function Player(key){
                                    return sprites.textures[key];
                                }
                            });
                            
                            //after loading all sprites, load the levels
                            this.loadLevel();
                        }.bind(this));
                    },
                    loadLevel: function() {
                        
                        //monitors the number of levels that has been loaded
                        var loaded = 0;
                        for(var i=1; i<=this.levelCount; ++i) {
                            (function(n) {
                                GMPixi.data.Json.fromFileAsync(
                                    './assets/json/level' + n + '.json',
                                    function(obj) {
                                        this.createLevel(obj);
                                        if(++loaded >= this.levelCount) {
                                            this.room.change('title');
                                        }
                                    }.bind(this),
                                    function() {
                                        this.atLoad.visible = false;
                                        this.atError.visible = true;
                                        this.loading.text = "Load Failed!";
                                    }.bind(this)
                                );
                            }).call(this, i);
                        }
                    },
                    createLevel: function(d) {
                        d.room = this.room;
                        d.rooms = this.rooms;
                        this.room.addRoom(d.id, new GMPixi.other.Level(d));
                    }
                    
                },
                setup: function() {
                    this.add(new GMPixi.other.Background({room: this.room}));
                    
                    this.loading = this.add(new PIXI.Text('', {
                        fontSize: 72,
                        fontStyle: 'italic',
                        fontWeight: 'bold'
                    }), this.room.width/2, this.room.height * 0.4, 0.5);
                    
                    this.atLoad = this.add(new PIXI.Text('If loading takes too '
                            + 'long, try to reload the page\nIf problem '
                            + 'persists, contact the administrator.', {
                                fontSize: 32,
                                fontStyle: 'italic',
                                align: 'center'
                            }), this.room.width/2, 
                            this.room.height * 0.7, 0.5);
                    
                    this.atError = this.add(new PIXI.Text('Failed to load a ' + 
                            'resource. Please reload the page.\nIf problem '
                            + 'persists, contact the administrator.', {
                                fontSize: 32,
                                fontStyle: 'italic',
                                align: 'center'
                            }), this.room.width/2, this.room.height * 0.7, 0.5);
                    
                },
                reset: function() {
                    this.loading.text = "Loading...";
                    this.atLoad.visible = true;
                    this.atError.visible = false;
                    this.loadTerrain();
                }
            },
            title: {
                methods: {
                    start: function(e) {
                        if(e.keyCode === 32) {
                            //so that this will not be used and called on
                            //the other rooms
                            window.removeEventListener('keyup', this.start);
                            
                            //animate the transition to the next room
                            this.cont.animate = true;
                        }
                        e.preventDefault();
                    }
                },
                setup: function() {
                    this.add(new GMPixi.other.Background({room: this.room}));
                    
                    this.cont = this.addContainer();
                    this.cont.reset = function() {
                        this.animate = false;
                        this.alpha = 1;
                    }.bind(this.cont);
                    this.cont.update = function() {
                        if(this.cont.animate) {
                            if(this.cont.alpha > 0) {
                                this.cont.alpha -= 0.075;
                            }
                            else {
                                this.cont.alpha = 0;
                                this.cont.animate = false;
                                this.room.change('level1');
                            }
                        }
                    }.bind(this);
                    
                    this.title = this.addTo(new GMPixi.other.Title({
                        room: this.room,
                        next: function() {
                            window.addEventListener('keyup', this.start);
                            this.prompt.animate = true;
                        }.bind(this)
                    }), this.cont, this.room.width/2, 0, 0.5);
                    
                    this.prompt = this.addTo(new GMPixi.other.Prompt({
                        room: this.room,
                        sprite: GMPixi.sprite('info1'),
                        x: this.room.width/2,
                        y: this.room.height * 0.75
                    }), this.cont, 0, 0, 0.5);
                    
                },
                reset: function() {
                    this.title.animate = true;
                }
            }
        }
    });
};


