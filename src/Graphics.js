import Constants from "@/Constants.js";

import sprFont from "@assets/img/font.png";
import sprTinyFont from "@assets/img/tinyfont.png";

export default ({
    imgFont: null,
    imgTinyFont: null,

    canvas: null,
    context: null,
    moveX: 0,
    moveY: 0,
    backgroundColor: "#000000",
    
    init: async function(canvas) {
        if (canvas) {
            // Récupère le contexte du canvas. C'est grâce à ce contexte que nous pourrons
            // dessiner dedans.
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
        } else {
            console.error("Canvas required.");
        }

        // Chargement des polices de caractères.
        this.imgFont = await this.loadAsset(sprFont);
        this.imgTinyFont = await this.loadAsset(sprTinyFont);

        return this.context;
    },
    loadAsset: async function(assetName) {
        const image = new Image();
        image.src = assetName;
        return image;
    },
    resetEffects: function() {
        this.moveX = 0;
        this.moveY = 0;
        this.backgroundColor = "#000000";
    },
    clear: function() {
        if (this.context) {
            // Efface l'écran.
            this.context.fillStyle = this.backgroundColor;
            this.context.imageSmoothingEnabled = false;
            this.context.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
        } else {
            console.error("clear: no context defined.");
        }
    },
    drawImage: function(image, x, y) {
        if (this.context) {
            if (image) {
                this.context.imageSmoothingEnabled = false;
                this.context.drawImage(image, (x + this.moveX), (y + this.moveY));
            }
        } else {
            console.error("drawImage: no context defined.");
        }
    },
    drawImageScaled: function(image, x, y, w, h) {
        if (this.context) {
            if (image) {
                this.context.imageSmoothingEnabled = false;
                this.context.drawImage(image, (x + this.moveX), (y + this.moveY), w, h);
            }
        } else {
            console.error("drawImage: no context defined.");
        }
    },
    drawImagePart: function(image, x, y, sx, sy, w, h, fullScreen = false) {
        if (this.context) {
            if (image) {
                this.context.imageSmoothingEnabled = false;
                this.context.drawImage(image, sx, sy, w, h, (x + this.moveX), (y + this.moveY), w, h);
            }
        } else {
            console.error("drawImagePart: no context defined.");
        }
    },
    drawImagePartScaled: function(image, x, y, w, h, sx, sy, sw, sh, fullScreen = false) {
        if (this.context) {
            if (image) {
                this.context.imageSmoothingEnabled = false;
                this.context.drawImage(image, sx, sy, sw, sh, (x + this.moveX), (y + this.moveY), w, h);
            }
        } else {
            console.error("drawImagePart: no context defined.");
        }
    },
    drawChar: function(x, y, ch, font = "normal") {
        if (this.context) {
            let lx = 8, ly = 8, image = null;
            if (font == "tiny") {
                lx = 4;
                image = this.imgTinyFont;
            } else {
                image = this.imgFont;
            }

            // Récupère le code ASCII du caractère à afficher.
            let c = ch.charCodeAt(0);
            
            // Détermine à quel endroit se trouve le caractère à afficher dans la 
            // police de caractères.
            let sx = 0, sy = 0;
            if (font == "tiny") {
                sx = (c % 16) * 4;
            } else {
                sx = (c % 16) * 8;
            }

            if (c >= 32 && c <= 47) {
                sy = 0;
            } else if (c >= 48 && c <= 63) {
                sy = 8;
            } else if (c >= 64 && c <= 79) {
                sy = 16;
            } else if (c >= 80 && c <= 95) {
                sy = 24;
            } else if (c >= 96 && c <= 111) {
                sy = 32;
            } else if (c >= 112 && c <= 127) {
                sy = 40;
            }

            // Dessine le caractère.
            this.context.imageSmoothingEnabled = false;
            if (c != 32) {
                this.context.fillStyle = this.backgroundColor;
                this.context.clearRect((x + this.moveX), (y + this.moveY), lx, ly);
            }
            this.context.drawImage(image, sx, sy, lx, ly, (x + this.moveX), (y + this.moveY), lx, ly);
        } else {
            console.error("drawChar: no context defined.");
        }
    },
    drawString: function(x, y, s, font = "normal") {
        let dx = (x * 8), dy = (y * 8);
        this.drawStringNotTiled(dx, dy, s, font);
    },
    drawStringNotTiled: function(dx, dy, s, font = "normal") {
        let x = dx;

        if (this.context) {
            // Parcourt la chaîne de caractères.
            for (let i = 0; i < s.length; i++) {
                // Récupère un caractère.
                let c = s.charAt(i);

                if (c == '\n') {
                    // Passe à la ligne suivante.
                    dy += 8;
                    dx = x;

                    continue;
                }

                // Dessine le caractère.
                this.drawChar(dx, dy, c, font);

                // Passe à la colonne suivante.
                if (font == "tiny") {
                    dx += 4;
                } else {
                    dx += 8;
                }
            }
        } else {
            console.error("drawString: no context defined.");
        }
    },
    drawRectangle: function(x, y, w, h, color) {
        this.context.fillStyle = color;
        this.context.imageSmoothingEnabled = false;
        this.context.fillRect((x + this.moveX), (y + this.moveY), w, h);
        this.context.fillStyle = this.backgroundColor;
    },
    setAngle: function(angle) {
        let radians = angle * Math.PI / 180.0;
        this.context.rotate(radians);
    },
    setAlpha: function(alpha) {
        this.context.globalAlpha = alpha;
    },
    setFullScreen: async function (state) {
        switch (APP_PLATFORM) {
            case "webapp": {
                // Web application (PWA)
                // ---------------------

                if (state) {
                    // Active le mode plein écran.
                    document.body.requestFullscreen();
                } else {
                    // Désactive le mode plein écran.
                    document.exitFullscreen();
                }

                break;
            }

            case "windows": {
                // Windows (via NeutralinoJS)
                // --------------------------

                if (state) {
                    // Active le mode plein écran.
                    await Neutralino.window.setFullScreen();
                } else {
                    // Désactive le mode plein écran.
                    await Neutralino.window.exitFullScreen();
                }

                break;
            }
        }
    }
})
