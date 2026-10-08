import App from "@/App.js";
import Bomb from "@/Bomb.js";
import Constants from "@/Constants.js";
import Effect from "@/Effect.js";
import Graphics from "@/Graphics.js";
import Enemy from "@/Enemy.js";
import Input from "@/Input.js";
import Item from "@/Item.js";
import Sound from "@/Sound.js";
import Stage from "@/Stage.js";
import Utils from "@/Utils.js";

import sprPlayer from "@assets/img/player.png";
import sprBubble from "@assets/img/bubble.png";
import sprBomb from "@assets/img/bomb.png";

import sndJump from "@assets/snd/jump.ogg";
import sndPlant from "@assets/snd/plant.ogg";
import sndHurt from "@assets/snd/hurt.ogg";
import sndDie from "@assets/snd/die.ogg";

export default ({
    // Variables
    // =========

    imgPlayer: null,
    imgBubble: null,
    imgBomb: null,

    sndJump: null,
    sndPlant: null,
    sndHurt: null,
    sndDie: null,

    data: null,
    energy: 0,
    maxEnergy: 0,
    currentTime: 0,
    animCycle: 0,
    maxBombs: 1,
    battery: 0,
    bombShield: false,
    enemyShield: false,
    isInvincible: false,
    hasRemote: false,
    diamonds: 0,
    totalDiamonds: 0,
    food: 0,

    // Fonctions
    // =========

    init: async function() {
        // Chargement des ressources.
        this.imgPlayer = await Graphics.loadAsset(sprPlayer);
        this.imgBubble = await Graphics.loadAsset(sprBubble);
        this.imgBomb = await Graphics.loadAsset(sprBomb);

        this.sndJump = await Sound.loadAsset(sndJump);
        this.sndPlant = await Sound.loadAsset(sndPlant);
        this.sndHurt = await Sound.loadAsset(sndHurt);
        this.sndDie = await Sound.loadAsset(sndDie);
    },
    setup: function() {
        // Initialise la structure de données du joueur. La position initiale du joueur
        // est toujours située en bas à gauche du tableau.
        this.data = {
            x: Constants.PLAYER_STARTX,
            y: Constants.PLAYER_STARTY,
            vx: 0,
            vy: 0,
            w: 16,
            h: 16,
            direction: "right",
            jumping: false,
            grounded: false,
            hit: false,
            killed: false,
            dead: false,
            knockOutTimer: 0,
            invincibleTimer: 0,
            rx1: 0,
            ry1: 0,
            rangle1: 0,
            rx2: 0,
            ry2: 0,
            rangle2: 180,
        };

        // Les protections sont désactivés à chaque début de niveau.
        this.bombShield = false;
        this.enemyShield = false;
    },
    destroy: function() {
        // Efface toute donnée concernant le joueur.
        this.data = null;
    },
    hit: function(direction, by) {
        if (by == "timeout" || by == "shake" || (this.data.invincibleTimer === 0 && this.data.knockOutTimer === 0 && !this.data.hit)) {
            let jump = true, noHit = false;

            if (!App.settings.invincibility) {
                switch (by) {
                    case "explosion": {
                        // Le joueur a été touché par une explosion. Il perd 2 points d'énergie, sauf si le niveau
                        // est terminé.
                        if (Stage.diamondsLeft > 0) {
                            this.energy -= 2;
                        }

                        break;
                    }

                    case "enemy": {
                        // Le joueur a été touché par un ennemi. Il perd 1 point d'énergie.
                        this.energy -= 1;

                        break;
                    }

                    case "flash": {
                        // Le joueur a été touché par un éclair. Comme il n'existe pas de protection efficace
                        // contre les éclairs, la protection anti-monstres en atténue quand même les dégâts.
                        if (this.enemyShield) {
                            // Sans protection anti-monstres, le joueur ne perd que 1 seul petit point d'énergie.
                            this.energy -= 1;
                        } else {
                            // Sans protection anti-monstres, le joueur perd 3 points d'énergie.
                            this.energy -= 3;
                        }

                        break;
                    }

                    case "poison": {
                        // Le joueur a bu une potion empoisonné. Cela lui fait perdre 3 points d'énergie.
                        this.energy -= 3;

                        break;
                    }

                    case "spear": {
                        // Le joueur a touché un pic. Il perd 1 point d'énergie, sauf si le niveau est terminé pour 
                        // éviter les problèmes...
                        if (Stage.diamondsLeft > 0) {
                            this.energy -= 1;
                        }
                        
                        break;
                    }

                    case "shake": {
                        // Le joueur est déstabilisé par les tremblements. Il ne perd pas de point d'énergie.
                        noHit = true;

                        break;
                    }

                    case "timeout": {
                        // Le temps est écoulé, la partie est maintenant terminée.
                        this.energy = 0;

                        break;
                    }
                }
            }

            if (jump) {
                // Le joueur a été touché, celui-ci fait un bond en arrière.
                this.data.hit = !noHit;
                this.data.jumping = true;
                this.data.grounded = false;
                this.data.direction = direction;
                this.data.vy = -(Constants.PLAYER_JUMP_VELOCITY / 2);
                if (direction == "left") {
                    this.data.vx = (Constants.PLAYER_VELOCITY / 2);
                } else if (direction == "right") {
                    this.data.vx = -(Constants.PLAYER_VELOCITY / 2);
                }
            }

            if (this.energy <= 0) {
                this.energy = 0;

                // Joue un son.
                Sound.play(this.sndDie);

                // La barre d'énergie du joueur est épuisé. La partie est maintenant terminée.
                this.data.killed = true;
                this.data.dead = false;
                this.data.jumping = false;
                this.data.grounded = false;
            } else {
                // Affiche un petit "Ouille !" à côté du joueur.
                Effect.createText(this.data.x + 16, this.data.y, "OUCH!");

                // Joue un son.
                Sound.play(this.sndHurt);
            }
        }
    },
    draw: function() {
        if (this.data && !this.data.dead) {
            // Dessine le joueur.
            let y = (this.data.direction == "left" ? 16 : 0);
            if (this.data.killed) {
                // Le joueur est vaincu.
                if (this.data.vx < 0) {
                    Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, 64, 0, 16, 16);
                } else {
                    Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, 64, 16, 16, 16);
                }
            } else {
                if (this.data.hit) {
                    // Dessine le joueur en train d'être touché par un ennemi.
                    if (this.data.vx < 0) {
                        Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, 64, 0, 16, 16);
                    } else {
                        Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, 64, 16, 16, 16);
                    }
                } else {
                    let noDrawing = false;

                    if (this.data.invincibleTimer > 0) {
                        // Le joueur est actuellement invincible. On utilise le compteur de cycle
                        // d'animation pour faire clignoter le joueur à l'écran.
                        if (this.animCycle == 0) {
                            noDrawing = true;
                        } 
                    }

                    if (!noDrawing) {
                        if (this.data.knockOutTimer > 0) {
                            // Dessine le joueur quand il est K.O.
                            Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, 48, y, 16, 16);

                            // Dessine les petites étoiles au-dessus du joueur.
                            Graphics.drawImagePart(this.imgBomb, this.data.x + 4 + this.data.rx1, this.data.y - 8 + this.data.ry1, 120, 0, 8, 8);
                            Graphics.drawImagePart(this.imgBomb, this.data.x + 4 + this.data.rx2, this.data.y - 8 + this.data.ry2, 120, 0, 8, 8);
                        } else {
                            if (this.data.jumping && this.data.vy < 0.05) {
                                // Dessine le joueur en train de sauter.
                                Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, 80, y, 16, 16);
                            } else {
                                if (this.data.vy >= 0.05) {
                                    // Dessine le joueur en train de tomber.
                                    Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, 96, y, 16, 16);
                                } else {
                                    if (Input.keys["KeyLeft"] || Input.keys["KeyRight"]) {
                                        // Dessine le joueur en train de marcher.
                                        let x = 16;
                                        if (this.animCycle == 1 || this.animCycle == 3) {
                                            x = 0;
                                        } else if (this.animCycle == 2) {
                                            x = 32;
                                        }
                                        Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, x, y, 16, 16);
                                    } else {
                                        // Dessine le joueur en train de ne rien faire.
                                        Graphics.drawImagePart(this.imgPlayer, this.data.x, this.data.y, 0, y, 16, 16);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Dessine un aura rouge autour du joueur qui illustre le fait qu'il est protégé
            // contre les explosions des bombes.
            if (this.bombShield) {
                let sx = 32;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    sx = 0;
                } else if (this.animCycle == 2) {
                    sx = 64;
                }

                if (this.enemyShield) {
                    if (this.animCycle != 1) {
                        Graphics.drawImagePart(this.imgBubble, this.data.x - 8, this.data.y - 8, sx, 64, 32, 32);
                    }
                } else {
                    Graphics.drawImagePart(this.imgBubble, this.data.x - 8, this.data.y - 8, sx, 64, 32, 32);
                }
            }

            // Dessine un aura bleu autour du joueur qui illustre le fait qu'il est protégé
            // contre toute attaque des ennemis.
            if (this.enemyShield) {
                let sx = 64;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    sx = 0;
                } else if (this.animCycle == 2) {
                    sx = 32;
                }

                if (this.bombShield) {
                    if (this.animCycle != 3) {
                        Graphics.drawImagePart(this.imgBubble, this.data.x - 8, this.data.y - 8, sx, 32, 32, 32);
                    }
                } else {
                    Graphics.drawImagePart(this.imgBubble, this.data.x - 8, this.data.y - 8, sx, 32, 32, 32);
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

            // Gère en même temps les déplacements des petites étoiles qui s'affichent au-dessus
            // de la tête du joueur quand il est un peu sonné.
            if (this.data) {
                if (this.data.knockOutTimer > 0) {
                    this.data.rx1 = (Math.cos(this.data.rangle1) * 6);
                    this.data.ry1 = (Math.sin(this.data.rangle1) * 3);
                    this.data.rx2 = (Math.cos(this.data.rangle2) * 6);
                    this.data.ry2 = (Math.sin(this.data.rangle2) * 3);
                    this.data.rangle1 += (0.05 * dt);
                    this.data.rangle2 += (0.05 * dt);
                    if (this.data.rangle1 >= 360) {
                        this.data.rangle1 = (this.rangle1 - 360);
                    }
                    if (this.data.rangle2 >= 360) {
                        this.data.rangle2 = (this.rangle2 - 360);
                    }
                }
            }

            if (this.data && !this.data.dead) {
                // Ici, on gère le compteur qui permet de rendre le joueur invincible pendant un
                // cours laps de temps.
                if (this.data.invincibleTimer > 0) {
                    // Décrémente le compteur. 
                    this.data.invincibleTimer -= 1;

                    if (this.data.invincibleTimer === 0) {
                        this.isInvincible = false;
                    }
                }

                // Ici, on gère le compteur qui permet de gérer la petite animation du joueur
                // quand celui-ci est K.O. après s'être fait attaqué par un ennmi. Pendant ce temps,
                // le joueur ne peut pas être contrôlé au clavier.
                if (this.data.knockOutTimer > 0) {
                    // Décrémente le compteur. 
                    this.data.knockOutTimer -= 1;

                    if (this.data.knockOutTimer === 0) {
                        // Il reste encore de l'énergie au joueur, il peut continuer la partie. De plus,
                        // pour éviter les heurts en cascade, il dispose de quelques secondes d'invincibilité.
                        this.data.invincibleTimer = (Constants.INVINCIBLE_TIME_AFTER_HIT * 8);
                    }
                }
            }
        }

        // Gestion de la logique du joueur
        // -------------------------------

        if (this.data && !this.data.dead) {
            // Commandes du joueur
            // -------------------

            if (Stage.ready && !this.data.hit && this.data.knockOutTimer === 0) { 
                if (Input.keys["KeyLeft"]) {
                    // La touche GAUCHE permet de déplacer le joueur vers la gauche.
                    if (this.data.vx > -(Constants.PLAYER_MAX_VELOCITY)) {
                        this.data.vx -= Constants.PLAYER_VELOCITY;
                    }
                    this.data.direction = "left";
                }

                if (Input.keys["KeyRight"]) {
                    // La touche DROITE permet de déplacer le joueur vers la droite.
                    if (this.data.vx < Constants.PLAYER_MAX_VELOCITY) {
                        this.data.vx += Constants.PLAYER_VELOCITY;
                    }
                    this.data.direction = "right";
                }

                if (Input.isKeyPressed("KeyAction1")) { 
                    // La touche ACTION 1 ou le bouton A permet au joueur de faire un saut.
                    if (!this.data.jumping && this.data.vy < Constants.PLAYER_MAX_VELOCITY) {
                        // Le joueur saute.
                        this.data.jumping = true;
                        this.data.grounded = false;
                        this.data.vy = -Constants.PLAYER_JUMP_VELOCITY;

                        // Joue un son.
                        Sound.play(this.sndJump);
                    }
                }

                if (Input.isKeyPressed("KeyAction2")) { 
                    // La touche ACTION 2 ou le bouton B permet de poser une bombe. A noter qu'au début du niveau, le joueur
                    // ne peut pas poser de bombe tant que les ennemis ne sont pas tous en place. Sinon, c'est beaucoup
                    // trop facile.
                    if (Enemy.enemiesToLaunch == 0 && !Stage.isBonusLevel) {
                        if (Bomb.bombs.length < this.maxBombs) {
                            if (this.data.jumping) {
                                // Le joueur est en train de sauter. La bombe est lancé assez loin.
                                Bomb.throw(2);
                            } else if ((Input.keys["KeyLeft"] || Input.keys["KeyRight"])) {
                                // Le joueur est en train de marcher. La bombe est donc jeté un peu plus loin.
                                Bomb.throw(1);
                            } else {
                                // Le joueur est immobile. On dépose une bombe au pied du joueur.
                                Bomb.throw(0);
                            }
                        }
                    }
                } 

                if (Input.isKeyPressed("KeyAction3")) { 
                    if (this.hasRemote) {
                        // Le joueur vient d'actionner la télécommande, la première bombe qui a été 
                        // posé va exploser. Il faudra de nouveau actionner la télécommande pour faire
                        // exploser les bombes qui restent.
                        this.usedRemote = true;
                        Bomb.explodeFirst();
                    }
                }
            }

            // Préparatifs pour la détection de collisions
            // -------------------------------------------

            let shapeTop = { x: this.data.x + 2, y: this.data.y, w: 12, h: 2, vx: 0, vy: 0 };
            let shapeBottom = { x: this.data.x + 2, y: this.data.y + this.data.h - 1, w: 12, h: 2, vx: 0, vy: 0 };
            let shapeLeft = { x: this.data.x, y: this.data.y + 2, w: 2, h: 12, vx: 0, vy: 0 };
            let shapeRight = { x: this.data.x + this.data.w - 1, y: this.data.y + 2, w: 2, h: 12, vx: 0, vy: 0 };

            // Gestion des collisions entre le joueur et les murs
            // --------------------------------------------------

            // Vérifie si le joueur entre en collision avec les murs et les plateformes.
            if (!this.data.killed) {
                this.data.grounded = false;
                for (let platform of Stage.platforms) {
                    if (!platform.enabled) {
                        continue;
                    }

                    if (platform.type != "ceiling" && platform.type != "hiddenceiling") {
                        // Détecte une collision sous le joueur.
                        if (this.data.vy > 0) {
                            if (Utils.isOverlapping(shapeBottom, platform) && (this.data.y + this.data.h - 4) < platform.y) {
                                // La collision a eu lieu sur une plateforme.
                                this.data.vy = 0;
                                this.data.y = platform.y - this.data.h;
                                this.data.grounded = true;
                                this.data.jumping = false;

                                if (platform.type == "spear") {
                                    // Le joueur perd un point d'énergie.
                                    this.hit(this.data.direction, "spear");
                                }
                            }
                        }

                        // Détecte une collision au-dessus de la tête du joueur.
                        if (this.data.vy < 0 && Utils.isOverlapping(shapeTop, platform)) {
                            if (platform.type == "edge" || platform.type == "floor" || platform.type == "hiddenfloor" || platform.type == "crate" || platform.type == "spear") {
                                // La collision a eu lieu sous la plateforme.
                                this.data.vy *= -1;
                                this.data.y = platform.y + platform.h;

                                // Joue un son.
                                Sound.play(this.sndPlant);
                            }
                        }

                        // Détecte une collision de chaque côté du joueur.
                        if ((this.data.vx < 0 && Utils.isOverlapping(shapeLeft, platform)) || (this.data.vx > 0 && Utils.isOverlapping(shapeRight, platform))) {
                            if (platform.type == "edge" || platform.type == "floor" || platform.type == "hiddenfloor" || platform.type == "crate") {
                                // La collision a eu lieu à gauche ou à droite de la plateforme.
                                this.data.vx = 0;
                                this.data.jumping = false;
                            } else if ((platform.type == "hiddenplatform" || platform.type == "platform") && (!this.data.jumping || (this.data.jumping && this.data.vy > Constants.PLAYER_MAX_VELOCITY) || (this.data.jumping && this.data.hit)) && platform.th > 1) {
                                this.data.vx = 0;
                                this.data.jumping = false;
                            } else if (platform.type == "spear") {
                                // Il y a eu une collision avec un pic. Le joueur perd un point d'énergie.
                                if (this.data.vx < 0) {
                                    this.hit("left", "spear");
                                } else if (this.data.vx > 0) {
                                    this.hit("right", "spear");
                                }
                                this.data.vx = 0;
                                this.data.jumping = false;
                            }
                        }
                    }
                }
            }

            // Gestion des collisions entre le joueur et un ennemi
            // ---------------------------------------------------

            if (!this.data.hit /* && Enemy.enemiesToLaunch === 0 */) {
                for (let enemy of Enemy.enemies) {
                    if (!enemy.killed) {
                        // Détermine dans quelle direction la collision a eu lieu.
                        if (Utils.isOverlapping(this.data, enemy)) {
                            if (this.isInvincible) {
                                // Le joueur a bu une potion d'invincibilité. Il lui suffit juste de toucher un
                                // ennemi pour le vaincre.
                                Enemy.kill(this.data.direction, enemy, "heart");
                            } else {
                                if (!this.enemyShield) {
                                    // La collision a bien eu lieu, le joueur perd 1 point d'énergie, sauf si celui-ci
                                    // est protégé contre les attaques ennemis.
                                    this.hit(enemy.direction, "enemy");
                                }
                            }
                        }
                    }
                }
            }

            // Gestion des collisions entre le joueur et un éclair lancé par un ennemi
            // -----------------------------------------------------------------------

            for (let idx in Enemy.flashes) {
                // Détermine dans quelle direction la collision a eu lieu.
                if (Utils.isOverlapping(this.data, Enemy.flashes[idx])) {
                    // La collision a bien eu lieu, le joueur perd 3 points d'énergie. Avec une protection
                    // contre les attaques ennemis active, la perte d'énergie est réduite à 1 seul point.
                    this.hit(Enemy.flashes[idx].direction, "flash");

                    // L'éclair disparait.
                    Enemy.flashes[idx].destroyed = true;
                }
            }

            // Gestion des collisions entre le joueur et un item
            // -------------------------------------------------

            if (!this.data.hit && !this.data.killed) {
                for (let item of Item.items) {
                    // Le joueur ne peut pas attraper un item pendant qu'il descend du haut du niveau.
                    if (!item.destroyed && item.ready) {
                        // Détermine dans quelle direction la collision a eu lieu.
                        if (Utils.isOverlapping(this.data, item)) {
                            // Le joueur vient de ramasser un item.
                            Item.pickUp(item);
                            if (!this.data) {
                                return;
                            }
                        }
                    }
                }
            }

            // Déplacement du joueur
            // ---------------------

            // Gère le "freinage" du joueur.
            if (!this.data.hit) {
                this.data.vx *= Constants.PLAYER_FRICTION;
            }

            // Déplace le joueur selon les paramètres de vélocité.
            this.data.x += (this.data.vx * dt);
            this.data.y += (this.data.vy * dt);

            // Modifie la vélocité du joueur en fonction de la gravité.
            if (!this.data.grounded && this.data.vy < Constants.PLAYER_MAX_VELOCITY) {
                this.data.vy += (Constants.PLAYER_GRAVITY * dt);
            }

            // On met à zéro la vélocité verticale du joueur si il atterit sur une plateforme,
            // pour éviter que le joueur ne la traverse.
            if (this.data.grounded) {
                this.data.vy = 0;
                if (!this.data.killed) { 
                    if (this.data.hit && this.energy > 0) {
                        this.data.knockOutTimer = 8;
                        this.data.rx1 = 0;
                        this.data.ry1 = 0;
                        this.data.rangle1 = 0;
                        this.data.rx2 = 0;
                        this.data.ry2 = 0;
                        this.data.rangle2 = 180;
                    }
                    this.data.hit = false;
                }
            }

            // Vérifie si le joueur tombe et sort de l'écran.
            if (this.data.y > Constants.CANVAS_HEIGHT) {
                if (this.data.killed) {
                    // Le joueur a été vaincu. La partie est maintenant terminée.
                    this.data.dead = true;
                    this.data.vy = 0;
                    App.countdown = 2;
                } else {
                    // Le joueur réapparait en haut de l'écran
                    this.data.y = -16;

                    if (this.data.hit) {
                        // Le joueur réapparait en haut de l'écran avec un léger déplacement
                        // vers la gauche ou la droite pour éviter de rentrer dans une sorte de
                        // "boucle infinie" ou il traverse sans cesse l'écran.
                        if (this.data.vx >= -0.5 && this.data.vx <= 0.5) {
                            let i = Utils.randomBetween(1, 2);
                            this.data.vx = (i == 1 ? -0.1 : 0.1);
                        }
                    }
                }
            }
        }
    }
});
