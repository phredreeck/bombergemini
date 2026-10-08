import Constants from "@/Constants.js";
import Graphics from "@/Graphics.js";
import Utils from "@/Utils.js";

import sprBomb from "@assets/img/bomb.png";
import sprSparks from "@assets/img/sparks.png";
import sprTileset from "@assets/img/tileset.png";
import sprItems from "@assets/img/items.png";
import sprStars from "@assets/img/stars.png";

export default ({
    // Variables
    // =========

    imgSparks: null,
    imgBomb: null,
    imgTileset: null,
    imgItems: null,
    imgStars: null,

    sparks: [],
    explosions: [],
    rumbles: [],
    items: [],
    texts: [],
    stars: [],

    currentShakeTime: 0,
    shakeState: 0,
    colorState: 0,
    animCycle: 0,
    currentAnimTime: 0,

    // Fonctions
    // =========

    init: async function() {
        // Chargement des ressources.
        this.imgSparks = await Graphics.loadAsset(sprSparks);
        this.imgBomb = await Graphics.loadAsset(sprBomb);
        this.imgTileset = await Graphics.loadAsset(sprTileset);
        this.imgItems = await Graphics.loadAsset(sprItems);
        this.imgStars = await Graphics.loadAsset(sprStars);
    },
    destroy: function() {
        this.sparks = [];
        this.explosions = [];
        this.rumbles = [];
        this.items = [];
        this.texts = [];
        this.stars = [];
    },
    createSpark: function(x, y, vx, vy, color) {
        // Créé une étincelle colorée.
        this.sparks.push({
            x: x,
            y: y,
            color: color,
            vx: (vx * Constants.SPARK_VELOCITY),
            vy: (vy * Constants.SPARK_VELOCITY),
            deleted: false,
        });
    },
    createExplosionEffect: function(x, y) {
        // Créé un effet d'explosion.
        this.explosions.push({
            x: x,
            y: y,
            timer: 4,
            deleted: false,
        });
    },
    createRumble: function(x, y, vx, vy, type = "rumble") {
        this.rumbles.push({
            x: x,
            y: y,
            vx: (vx * Constants.RUMBLE_VELOCITY),
            vy: (vy * Constants.RUMBLE_VELOCITY),
            type: type,
            deleted: false,
        });
    },
    createItem: function(x, y, type) {
        this.items.push({
            x: x,
            y: y,
            vx: 0,
            vy: (Constants.SPARK_VELOCITY * -1),
            alpha: 1.0,
            type: type,
            deleted: false,
        });
    },
    createStar: function(type = "star") {
        if (type == "star") {
            // Créé une étoile qui tombe.
            this.stars.push({
                x: (Utils.randomBetween(16, 50) * 8),
                y: -16,
                vx: (Constants.STAR_VELOCITY * -1),
                vy: (Constants.STAR_VELOCITY * 1),
                type: "star",
                deleted: false,
            });
        } else if (type == "diamond") {
            // Créé un diamant qui tombe.
            let i = Utils.randomBetween(1, 4);
            let vx = (i * 0.25) - 0.5;
            this.stars.push({
                x: (Utils.randomBetween(0, 34) * 8),
                y: -16,
                vx: (Constants.STAR_VELOCITY * vx),
                vy: (Constants.STAR_VELOCITY * 1),
                color: Utils.randomBetween(0, 3),
                type: "diamond",
                deleted: false,
            });
        }
    },
    createText: function(x, y, text) {
        this.texts.push({
            x: x,
            y: y,
            vx: 0,
            vy: (Constants.TEXT_VELOCITY * -1),
            alpha: 1.0,
            text: text,
            deleted: false,
        });
    },
    createExplosion: function(x, y, color) {
        // Créé des étincelles qui partent dans toutes les directions.
        this.createSpark(x, y, 0, -1.5, color);
        this.createSpark(x, y, -0.5, -1.5, color);
        this.createSpark(x, y, -0.5, -1, color);
        this.createSpark(x, y, -0.5, -0.5, color);
        this.createSpark(x, y, 0, -0.5, color);
        this.createSpark(x, y, 0.5, -0.5, color);
        this.createSpark(x, y, 0.5, -1, color);
        this.createSpark(x, y, 0.5, -1.5, color);

        // Créé un effet d'explosion.
        this.createExplosionEffect(x - 8, y - 8);
    },
    shake: function() {
        this.shakeState = 8;
    },
    twinkle: function() {
        this.colorState = 4;
    },
    draw: function() {
        Graphics.setAlpha(0.75);

        // Dessine les étincelles.
        for (let spark of this.sparks) {
            if (!spark.deleted) {
                Graphics.drawImagePart(this.imgSparks, spark.x, spark.y, ((spark.color - 1) * 8), 0, 8, 8);
            }
        }

        // Dessine les morceaux de caisses de bois.
        for (let rumble of this.rumbles) {
            if (!rumble.deleted) {
                if (rumble.type == "rumble") {
                    Graphics.drawImagePart(this.imgTileset, rumble.x, rumble.y, 72, 48, 8, 8);
                } else if (rumble.type == "nut") {
                    Graphics.drawImagePart(this.imgTileset, rumble.x, rumble.y, 72, 56, 8, 8);
                }
            }
        }

        // Dessine les items récoltés.
        for (let item of this.items) {
            if (!item.deleted) {
                Graphics.setAlpha(item.alpha);
                let x = (((item.type - 1) % 4) * 16);
                let y = ((Math.ceil(item.type / 4) - 1) * 16);
                Graphics.drawImagePart(this.imgItems, item.x, item.y, x, y, 16, 16);
            }
        }

        // Dessine les textes.
        for (let text of this.texts) {
            if (!text.deleted) {
                Graphics.setAlpha(text.alpha);
                Graphics.drawStringNotTiled(text.x, text.y, text.text, "tiny");
            }
        }

        Graphics.setAlpha(1);

        // Dessine les explosions.
        for (let explosion of this.explosions) {
            if (!explosion.deleted) {
                Graphics.drawImagePart(this.imgBomb, explosion.x, explosion.y, (explosion.timer === 2 ? 80 : 48), 32, 32, 32);
            }
        }

        // Dessine les étoiles qui tombent du ciel.
        for (let star of this.stars) {
            if (!star.deleted) {
                if (star.type == "star") {
                    Graphics.drawImagePart(this.imgStars, star.x, star.y, (this.animCycle * 16), 0, 16, 16);
                } else if (star.type == "diamond") {
                    Graphics.drawImagePart(this.imgItems, star.x, star.y, (star.color * 16), 0, 16, 16);
                }
            }
        }
    },
    update: function(dt) {
        // Gestion des animations
        // ----------------------

        let time = window.performance.now();
        if (time > this.currentAnimTime) {
            this.currentAnimTime = (125 + time);

            // Incrémente le compteur. 
            this.animCycle += 1;
            if (this.animCycle > 3) {
                // Le compteur repart de zéro.
                this.animCycle = 0;
            }
        }

        // Gestion du tremblement d'écran
        // ------------------------------

        if (time > this.currentShakeTime) {
            this.currentShakeTime = (62 + time);

            for (let idx in this.explosions) {
                if (!this.explosions[idx].deleted) {
                    this.explosions[idx].timer--;
                    if (this.explosions[idx].timer === 0) {
                        this.explosions[idx].deleted = true;
                    }
                }
            }

            if (this.shakeState > 0) {
                switch (this.shakeState) {
                    case 1: {
                        Graphics.moveY = 0;
                        break;
                    }

                    case 2: {
                        Graphics.moveY = -1;
                        break;
                    }

                    case 3: {
                        Graphics.moveY = 2;
                        break;
                    }

                    case 4: {
                        Graphics.moveY = -2;
                        break;
                    }

                    case 5: {
                        Graphics.moveY = 3;
                        break;
                    }

                    case 6: {
                        Graphics.moveY = -3;
                        break;
                    }

                    case 7: {
                        Graphics.moveY = 4;
                        break;
                    }

                    case 8: {
                        Graphics.moveY = -4;
                        break;
                    }
                }

                this.shakeState--;
            }

            if (this.colorState > 0) {
                switch (this.colorState) {
                    case 1: {
                        Graphics.backgroundColor = "#000000";
                        break;
                    }

                    case 2: {
                        Graphics.backgroundColor = "#00FFFF";
                        break;
                    }

                    case 3: {
                        Graphics.backgroundColor = "#FFFF00";
                        break;
                    }

                    case 4: {
                        Graphics.backgroundColor = "#FF00FF";
                        break;
                    }
                }

                this.colorState--;
            }
        }

        // Gestion des effets
        // ------------------

        for (let idx in this.sparks) {
            if (!this.sparks[idx].deleted) {
                // Applique les paramètres de vélocité de l'étincelle sur sa position.
                this.sparks[idx].x += (this.sparks[idx].vx * dt);
                this.sparks[idx].y += (this.sparks[idx].vy * dt);

                // Gère la gravité de l'étincelle.
                if (this.sparks[idx].vy < Constants.SPARK_MAX_VELOCITY) {
                    this.sparks[idx].vy += (Constants.SPARK_GRAVITY * dt);
                }

                // Dès que l'étincelle sort de l'écran, on la détruit.
                if (this.sparks[idx].x < Constants.BOARD_X) {
                    this.sparks[idx].deleted = true;
                }
                if (this.sparks[idx].x > (Constants.BOARD_X2 - 8)) {
                    this.sparks[idx].deleted = true;
                }
                if (this.sparks[idx].y > (Constants.CANVAS_HEIGHT + 8)) {
                    this.sparks[idx].deleted = true;
                }
                if (this.sparks[idx].y < Constants.BOARD_Y) {
                    this.sparks[idx].deleted = true;
                }
            }
        }

        for (let idx in this.rumbles) {
            if (!this.rumbles[idx].deleted) {
                // Gère la gravité du morceau de bois.
                if (this.rumbles[idx].vy < Constants.RUMBLE_MAX_VELOCITY) {
                    this.rumbles[idx].vy += (Constants.RUMBLE_GRAVITY * dt);
                }

                // Applique les paramètres de vélocité du morceau de bois sur sa position.
                this.rumbles[idx].x += (this.rumbles[idx].vx * dt);
                this.rumbles[idx].y += (this.rumbles[idx].vy * dt);

                // Dès que le morceau de bois sort de l'écran, on la détruit.
                if (this.rumbles[idx].y > (Constants.CANVAS_HEIGHT + 8)) {
                    this.rumbles[idx].deleted = true;
                }
            }
        }

        for (let idx in this.items) {
            if (!this.items[idx].deleted) {
                // Déplace l'item vers le haut.
                this.items[idx].x += (this.items[idx].vx * dt);
                this.items[idx].y += (this.items[idx].vy * dt);

                // Ralentit la vitesse de déplacement de l'item.
                if (this.items[idx].vy < 0) {
                    this.items[idx].vy += (0.0005 * dt);
                    if (this.items[idx].vy >= 0) {
                        this.items[idx].vy = 0;
                    }
                } else {
                    // L'item s'estompe petit à petit.
                    this.items[idx].alpha -= (0.0025 * dt);
                }

                // Dès que l'item sort de l'écran, on la détruit.
                if (this.items[idx].y < -16 || this.items[idx].alpha < 0) {
                    this.items[idx].deleted = true;
                }
            }
        }

        for (let idx in this.texts) {
            if (!this.texts[idx].deleted) {
                // Déplace le texte vers le haut.
                this.texts[idx].x += (this.texts[idx].vx * dt);
                this.texts[idx].y += (this.texts[idx].vy * dt);

                // Ralentit la vitesse de déplacement du texte.
                if (this.texts[idx].vy < 0) {
                    this.texts[idx].vy += (0.0005 * dt);
                    if (this.texts[idx].vy >= 0) {
                        this.texts[idx].vy = 0;
                    }
                } else {
                    // Le texte s'estompe petit à petit.
                    this.texts[idx].alpha -= (0.0025 * dt);
                }

                // Dès que le texte sort de l'écran, on la détruit.
                if (this.texts[idx].y < -16 || this.texts[idx].alpha < 0) {
                    this.texts[idx].deleted = true;
                }
            }
        }

        for (let idx in this.stars) {
            if (!this.stars[idx].deleted) {
                // Déplace l'étoile vers le bas.
                this.stars[idx].x += (this.stars[idx].vx * dt);
                this.stars[idx].y += (this.stars[idx].vy * dt);

                // Dès que l'étoile sort de l'écran, on la détruit.
                if (this.stars[idx].y > Constants.CANVAS_HEIGHT) {
                    this.stars[idx].deleted = true;
                }
            }
        }

        this.sparks = this.sparks.filter(spark => !spark.deleted);
        this.explosions = this.explosions.filter(explosion => !explosion.deleted);
        this.rumbles = this.rumbles.filter(rumble => !rumble.deleted);
        this.items = this.items.filter(item => !item.deleted);
        this.texts = this.texts.filter(text => !text.deleted);
        this.stars = this.stars.filter(star => !star.deleted);
    },
})
