import Constants from "@/Constants.js";
import Effect from "@/Effect.js";
import Graphics from "@/Graphics.js";
import Enemy from "@/Enemy.js";
import Player from "@/Player.js";
import Sound from "@/Sound.js";
import Stage from "@/Stage.js";
import Utils from "@/Utils.js";

import sprBomb from "@assets/img/bomb.png";

import sndThrow from "@assets/snd/throw.ogg";
import sndBomb from "@assets/snd/bomb.ogg";
import sndPlant from "@assets/snd/plant.ogg";

export default ({
    // Variables
    // =========

    imgBomb: null,

    sndThrow: null,
    sndBomb: null,
    sndPlant: null,

    bombs: [],

    currentTime: 0,
    animCycle: 0,

    // Fonctions
    // =========

    init: async function() {
        // Chargement des ressources.
        this.imgBomb = await Graphics.loadAsset(sprBomb);

        this.sndThrow = await Sound.loadAsset(sndThrow);
        this.sndBomb = await Sound.loadAsset(sndBomb);
        this.sndPlant = await Sound.loadAsset(sndPlant);
    },
    reset: function() {
        // Initialise la liste des bombes.
        this.bombs = [];
    },
    throw: function(throwType) {
        let x = 0, vx = 0, vy = 0;

        // Détermine la position de la bombe.
        if (throwType === 1) {
            x = (Player.data.direction == "left" ? Player.data.x - (Player.data.w - 2) : Player.data.x + (Player.data.w - 2));
            vx = (Player.data.direction == "left" ? -0.7 : 0.7);
            vy = -0.5;
        } else if (throwType === 2) {
            x = (Player.data.direction == "left" ? Player.data.x - (Player.data.w - 2) : Player.data.x + (Player.data.w - 2));
            vx = (Player.data.direction == "left" ? -1 : 1);
            vy = -1;
        } else {
            x = Player.data.x;
            vx = 0;
            vy = 0;
        }

        // Créé la structure de données de la bombe.
        let bomb = {
            x: x,
            y: Player.data.y,
            vx: (vx * Constants.BOMB_VELOCITY),
            vy: (vy * Constants.BOMB_VELOCITY),
            w: 16,
            h: 16,
            timer: (Player.hasRemote ? Constants.BOMB_TIME_REMOTE : Constants.BOMB_TIME),
            grounded: false,
            destroyed: false,
        };
        
        // On vérifie si il n'y a pas une plateforme, un mur ou une caisse en bois à l'endroit où l'on
        // va poser la bombe. 
        /*for (let platform of Stage.platforms) {
            if (Utils.isOverlapping(bomb, platform)) {
                // Il y a un mur, une plateforme ou une caisse en bois. La bombe sera posée là où est
                // Misty.
                bomb.x = Player.data.x;
            }
        }*/

        // Ajoute la bombe à l'écran.
        this.bombs.push(bomb);

        if (throwType > 0) {
            // Joue un son.
            Sound.play(this.sndThrow);
        }
    },
    explode: function(bomb) {
        // Créé un effet d'explosion.
        let color = Utils.randomBetween(Constants.SPARK_BLUE, Constants.SPARK_MAGENTA);
        Effect.createExplosion(bomb.x, bomb.y, color);

        // Tue tous les ennemis aux alentours.
        Enemy.killAround(bomb.x, bomb.y);

        // Casse toutes les caisses en bois aux alentours.
        Stage.destroyWoodenCrates(bomb.x, bomb.y);

        // Si le joueur se trouve aussi dans les alentours, il est touché.
        if (Player.data.y >= (bomb.y - 32) && Player.data.y <= (bomb.y + 32) && Player.data.x >= (bomb.x - 32) && Player.data.x <= (bomb.x + 32)) {
            if (!Player.bombShield) {
                // Une explosion fait perdre pas mal d'énergie au joueur, sauf si celui-ci
                // est protégé contre les explosions.
                if (Player.data.x < bomb.x) {
                    Player.hit("right", "explosion");
                } else {
                    Player.hit("left", "explosion");
                }
            }
        }

        // Fait trembler l'aire de jeu.
        Effect.shake();

        // Joue un son.
        Sound.play(this.sndBomb);
    },
    explodeFirst: function() {
        for (let idx in this.bombs) {
            if (!this.bombs[idx].destroyed) {
                if (this.bombs[idx].timer > 0) {
                    // La bombe explose.
                    this.explode(this.bombs[idx]);
                    this.bombs[idx].destroyed = true;

                    break;
                }
            }
        }
    },
    draw: function() {
        // Dessine les bombes posées par le joueur.
        for (let bomb of this.bombs) {
            if (!bomb.destroyed && bomb.timer > 0) {
                // Dessine la bombe.
                let x = 16;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    x = 0;
                } else if (this.animCycle == 2) {
                    x = 32;
                }
                Graphics.drawImagePart(this.imgBomb, bomb.x, bomb.y, x, 0, 16, 16);

                // Avant l'explosion, on fait scintiller la bombe.
                if (bomb.timer == 6 || bomb.timer == 4 || bomb.timer == 2) {
                    Graphics.drawImagePart(this.imgBomb, bomb.x, bomb.y, x, 32, 16, 16);
                }
            }
        }
    },
    update: function(dt) {
        // Gestion des compteurs
        // ---------------------

        let time = window.performance.now();
        if (time > this.currentTime) {
            this.currentTime = (125 + time);

            // Ici, on gère le compteur qui permet d'animer le sprite du joueur. Ce compteur
            // va de 0 jusqu'à 3, soit 4 sprites en tout pour animer le sprite.
            // Incrémente le compteur. 
            this.animCycle += 1;
            if (this.animCycle > 3) {
                // Le compteur repart de zéro.
                this.animCycle = 0;
            }

            // Gère les chronomètres des bombes. 
            for (let idx in this.bombs) {
                if (!this.bombs[idx].destroyed) {
                    if (this.bombs[idx].timer > 0) {
                        // Décrémente le chronomètre de la bombe.
                        this.bombs[idx].timer--;

                        if (this.bombs[idx].timer === 1) {
                            // Le chronomètre de la bombe à atteint 0, la bombe explose.
                            this.explode(this.bombs[idx]);
                        } else if (this.bombs[idx].timer === 0) {
                            // La bombe disparait.
                            this.bombs[idx].destroyed = true;
                        }
                    }
                }
            }
        }

        // Gestion des bombes
        // ------------------

        // Retire les bombes qui sont sorties de l'écran ou qui ont explosées.
        this.bombs = this.bombs.filter((bomb) => !bomb.destroyed);

        for (let idx in this.bombs) {
            if (!this.bombs[idx].destroyed) {
                // Préparatifs pour la détection de collisions
                // -------------------------------------------

                let shapeTop = { x: this.bombs[idx].x + 3, y: this.bombs[idx].y, w: 10, h: 4, vx: 0, vy: 0 };
                let shapeBottom = { x: this.bombs[idx].x + 3, y: this.bombs[idx].y + this.bombs[idx].h - 3, w: 10, h: 4, vx: 0, vy: 0 };
                let shapeLeft = { x: this.bombs[idx].x, y: this.bombs[idx].y + 3, w: 4, h: 10, vx: 0, vy: 0 };
                let shapeRight = { x: this.bombs[idx].x + this.bombs[idx].w - 3, y: this.bombs[idx].y + 3, w: 4, h: 10, vx: 0, vy: 0 };

                // Détection des collisions
                // ------------------------

                for (let platform of Stage.platforms) {
                    if (!platform.enabled) {
                        continue;
                    }

                    if (platform.type != "ceiling" && platform.type != "hiddenceiling") {
                        // Détecte une collision de chaque côté de la bombe.
                        if ((this.bombs[idx].vx < 0 && Utils.isOverlapping(shapeLeft, platform)) || (this.bombs[idx].vx > 0 && Utils.isOverlapping(shapeRight, platform))) {
                            if (platform.type == "edge" || platform.type == "floor" || platform.type == "hiddenfloor" || platform.type == "platform" || platform.type == "hiddenplatform" || platform.type == "crate") {
                                if ((this.bombs[idx].vx > 0 && (this.bombs[idx].x + this.bombs[idx].w - 4) < platform.x) || this.bombs[idx].vx < 0 && this.bombs[idx].x > (platform.x + platform.w - 4)) {
                                    // La collision a eu lieu à gauche ou à droite de la plateforme. La bombe va
                                    // dans la direction opposée.
                                    this.bombs[idx].vx *= -1;

                                    // Joue un son.
                                    Sound.play(this.sndPlant);
                                }
                            }
                        } else {
                            // Détecte une collision sous la bombe.
                            if (this.bombs[idx].vy > 0 && Utils.isOverlapping(shapeBottom, platform)) {
                                if ((this.bombs[idx].y + this.bombs[idx].h - 2) < platform.y) {
                                    // La bombe a atterit sur une plateforme.
                                    this.bombs[idx].y = platform.y - this.bombs[idx].h;
                                    this.bombs[idx].vx = 0;
                                    this.bombs[idx].vy = 0;
                                    this.bombs[idx].grounded = true;
                                    
                                    // Joue un son.
                                    Sound.play(this.sndPlant);
                                }
                            } else {
                                if (this.bombs[idx].vy > 0) {
                                    this.bombs[idx].grounded = false;
                                }
                            }

                            // Détecte une collision au-dessus de la bombe.
                            if (this.bombs[idx].vy < 0 && Utils.isOverlapping(shapeTop, platform)) {
                                if (platform.type == "edge" || platform.type == "floor" || platform.type == "hiddenfloor" || platform.type == "crate") {
                                    // La collision a eu lieu sous la plateforme. La bombe retombe aussitôt.
                                    this.bombs[idx].vy *= -1;
                                    this.bombs[idx].y = platform.y + platform.h;

                                    // Joue un son.
                                    Sound.play(this.sndPlant);
                                }
                            }

                            // On fait en sorte qu'une bombe ne sorte jamais des limites du niveau.
                            if (this.bombs[idx].x < 16 && this.bombs[idx].vx < 0) {
                                this.bombs[idx].x = 16
                                this.bombs[idx].vx *= -1;
                                this.bombs[idx].vy = 0;
                            }
                            if (this.bombs[idx].x > (Constants.CANVAS_WIDTH - 32) && this.bombs[idx].vx > 0) {
                                this.bombs[idx].x = (Constants.CANVAS_WIDTH - 32)
                                this.bombs[idx].vx *= -1;
                                this.bombs[idx].vy = 0;
                            }
                        }
                    }
                }

                // Applique les paramètres de vélocité de la bombe sur sa position. Une valeur
                // positive déplace la bombe vers le bas ou la droite, une valeur négative déplace
                // la bombe vers le haut ou à gauche.
                this.bombs[idx].x += (this.bombs[idx].vx * dt);
                this.bombs[idx].y += (this.bombs[idx].vy * dt);

                // Gère la gravité de la bombe.
                if (this.bombs[idx].vy < Constants.BOMB_MAX_VELOCITY) {
                    this.bombs[idx].vy += (Constants.BOMB_GRAVITY * dt);
                }

                // La bombe est sur une plateforme, ou vient d'attérir dessus. On fait en sorte
                // qu'il ne traverse pas cette plateforme.
                if (this.bombs[idx].grounded) {
                    this.bombs[idx].vy = 0;
                }

                // Vérifie si la bombe sort de l'écran.
                if (this.bombs[idx].y > Constants.CANVAS_HEIGHT) {
                    // La bombe réapparait en haut de l'écran.
                    this.bombs[idx].y = -16;
                }
            }
        }
    }
});
