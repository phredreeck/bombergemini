import App from "@/App.js";
import Constants from "@/Constants.js";
import Data from "@/Data.js";
import Effect from "@/Effect.js";
import Graphics from "@/Graphics.js";
import Item from "@/Item.js";
import Player from "@/Player.js";
import Sound from "@/Sound.js";
import Stage from "@/Stage.js";
import Utils from "@/Utils.js";

import sprEnemies from "@assets/img/enemies.png";
import sprBoss from "@assets/img/boss.png";
import sprBomb from "@assets/img/bomb.png";

import sndHit from "@assets/snd/hit.ogg";
import sndThrow from "@assets/snd/throw.ogg";
import sndBomb from "@assets/snd/bomb.ogg";
import sndFlash from "@assets/snd/flash.ogg";

/* Chaque ennemi possède un comportement bien différent. Les ennemis sont au nombre 
 * de 8 :
 * - Zebulon : un personnage en forme de petit accordéon qui sautille sans arrêt. 
 * - Ballo : un personnage jaune en forme de balle. Totalement passif, il se promène
 *   tranquillement, mais est quelques fois imprévisible dans ses déplacements, ce 
 *   qui peut surprendre le joueur.
 * - Bloto : petit monstre vert qui poursuit sans relâche le joueur. Si le joueur se
 *   trouve juste au-dessus de lui, Bloto lui sautera dessus.
 * - Motan : un personnage rouge à trois pattes. Il surgit devant le joueur si ce 
 *   dernier passe au-dessus de lui. Le joueur ne peut pas l'esquiver en sautant par
 *   dessus lui.
 * - Voletta : espèce de papillon rose qui volette dans tous les coins du niveau. 
 * - Blobule : une variante du Voletta de couleur bleue. Celui-ci est
 *   capable de lancer des éclairs autour de lui.
 * - Crokey : personnage à grandes dents qui poursuit le joueur en sautillant.
 * - Boumbo : un personnage qui a la capacité de se transformer en bombe et d'exploser.
 * 
 * Il existe également 4 boss à vaincre qui sont des espèces plus gros que les normaux :
 * - Big Crokey : un Crokey deux fois plus gros qui va deux fois plus vite et saute deux 
 *   fois plus haut.
 * - Big Voletta : un Voletta deux fois plus gros... mais pas deux fois plus rapide. 
 * - Big Motan : un Motan deux fois plus gros qui va deux fois plus vite.
 */
export default ({
    // Variables
    // =========

    imgEnemies: null,
    imgBoss: null,
    imgBomb: null,

    sndHit: null,
    sndThrow: null,
    sndBomb: null,
    sndFlash: null,
    
    enemies: [],
    enemiesToLaunch: 0,
    enemiesLeft: 0,
    currentTime: 0,
    animCycle: 0,
    flashes: [],

    // Fonctions
    // =========

    init: async function() {
        // Chargement des ressources.
        this.imgEnemies = await Graphics.loadAsset(sprEnemies);
        this.imgBoss = await Graphics.loadAsset(sprBoss);
        this.imgBomb = await Graphics.loadAsset(sprBomb);

        this.sndHit = await Sound.loadAsset(sndHit);
        this.sndThrow = await Sound.loadAsset(sndThrow);
        this.sndBomb = await Sound.loadAsset(sndBomb);
        this.sndFlash = await Sound.loadAsset(sndFlash);

        // Initialise la liste des éclairs lancés par les ennemis.
        this.flashes = [];
    },
    setup: function() {
        // Initialise la liste des ennemis.
        this.enemies = [];
        for (let enemy of Data.stages[Stage.number].enemies) {
            let flashTime = 0, energy = 1, width = 16, height = 16, boss = false;
            let enemyType = enemy.type;

            // En mode "super", certains ennemis sont remplacés par d'autres. Seuls les
            // Boumbo et les Blobule ne sont pas concernés.
            if (Stage.superMode) {
                if (enemyType == "voletta") {
                    // Les Voletta sont remplacés par des Zebulon.
                    enemyType = "zebulon";
                } else if (enemyType == "motan") {
                    // Les Motan sont remplacés par des Bloto.
                    enemyType = "bloto";
                } else if (enemyType == "bloto") {
                    // Les Bloto sont remplacés par des Ballo.
                    enemyType = "ballo";
                } else if (enemyType == "ballo") {
                    // Les Ballo sont remplacés par des Crokey.
                    enemyType = "crokey";
                } else if (enemyType == "zebulon") {
                    // Les Zebulon sont remplacés par des Voletta.
                    enemyType = "voletta";
                } else if (enemyType == "crokey") {
                    // Les Crokey sont remplacés par des Motan.
                    enemyType = "motan";
                } 
            }

            // Définit les délais avant l'attaque.
            if (enemyType == "blobule") {
                flashTime = (Constants.ATTACK_TIME + Utils.randomBetween(5, 10));
            } else if (enemyType == "boumbo") {
                flashTime = (Constants.ATTACK_TIME + Utils.randomBetween(15, 30));
            }

            // Certains enemis sont plus gros et ont plus d'énergie que les normaux, ce sont les
            // fameux boss.
            if (enemyType == "bigcrokey" || enemyType == "bigvoletta" || enemyType == "bigmotan") {
                // Ces monstres sont des boss.
                boss = true;

                // Il faut 5 bombes pour venir à bout d'un boss.
                energy = 5;

                // Les boss sont deux fois plus gros que les monstres.
                width = 32;
                height = 32;
            }

            // Construit la structure de données de l'ennemi.
            this.enemies.push({
                x: (enemy.x * 8),
                y: -height,
                w: width,
                h: height,
                vx: 0,
                vy: 0,
                dy: (enemy.y * 8),
                energy: energy,
                type: enemyType,
                direction: enemy.direction,
                idleTime: 1,
                flashTime: flashTime,
                explodeTime: 0,
                jumping: false,
                grounded: false,
                groundedAction: false,
                random: Utils.randomBetween(1, 3),
                flying: ((enemyType == "voletta" || enemyType == "bigvoletta" || enemyType == "blobule") ? true : false),
                killed: false,
                hit: false,
                dead: false,
                boss: boss,
                ready: false,
                state: 0,
            });
        }

        // Une fois la liste des ennemis initialisée, on définit une variable en y
        // inscrivant le nombre d'ennemis à montrer. Ceux-ci apparaitront en haut de l'écran
        // et descendront vers leur position finale. Une fois cette position atteinte, la
        // variable sera décrémentée jusqu'à atteindre 0. A cet instant, les ennemis commenceront
        // à évoluer dans le niveau.
        this.enemiesToLaunch = this.enemies.length;

        // Définit le nombre d'ennemis à vaincre.
        this.enemiesLeft = this.enemies.length;

        // Initialise la liste des éclairs lancés par les ennemis.
        this.flashes = [];
    },
    destroy: function() {
        // Vide la liste des ennemis.
        this.enemies = [];
        this.enemiesLeft = 0;
        this.enemiesToLaunch = 0;
        this.flashes = [];
    },
    kill: function(direction, enemy, itemType = "food", killAnyway = false) {
        let idx = this.enemies.indexOf(enemy);
        if (idx >= 0 && !this.enemies[idx].killed && !this.enemies[idx].hit) {
            if (killAnyway) {
                // Le monstre perd toute son énergie. Il meurt instantanément.
                this.enemies[idx].energy = 0;
            } else {
                // Le monstre perd un point d'énergie.
                this.enemies[idx].energy--;
            }
            
            if (this.enemies[idx].energy == 0) {
                // Le monstre est déclaré mort.
                this.enemies[idx].idleTime = 0;
                this.enemies[idx].flashTime = 0;
                this.enemies[idx].explodeTime = 0;
                this.enemies[idx].vx = ((direction == "left" ? -1.5 : 1.5) * Constants.ENEMY_VELOCITY);
                this.enemies[idx].vy = (-1 * Constants.ENEMY_JUMP_VELOCITY);
                this.enemies[idx].killed = true;
                this.enemies[idx].dead = false;
                this.enemies[idx].hit = false;
                this.enemies[idx].jumping = false;
                this.enemies[idx].grounded = false;
                this.enemies[idx].ready = true;

                // Joue un son.
                Sound.play(this.sndHit);

                if (enemy.boss) {
                    // Un boss vaincu libère 4 diamants.
                    Item.create(Constants.ITEM_DIAMOND, this.enemies[idx].x, this.enemies[idx].y, -1, -1.5);
                    Item.create(Constants.ITEM_DIAMOND, this.enemies[idx].x, this.enemies[idx].y, -0.5, -1.5);
                    Item.create(Constants.ITEM_DIAMOND, this.enemies[idx].x, this.enemies[idx].y, 0.5, -1.5);
                    Item.create(Constants.ITEM_DIAMOND, this.enemies[idx].x, this.enemies[idx].y, 1, -1.5);
                } else {
                    // En guise de récompense, le monstre vaincu libère un diamant, ainsi qu'un autre item.
                    let i = Utils.randomBetween(1, 2);
                    Item.create(Constants.ITEM_DIAMOND, this.enemies[idx].x, this.enemies[idx].y, (i == 2 ? -0.5 : 0.5), -1.5);
                    
                    // Créé le second item.
                    switch (itemType) {
                        case "food": {
                            // Créé de la nourriture.
                            Item.create(Constants.ITEM_FOOD, this.enemies[idx].x, this.enemies[idx].y, (i == 1 ? -0.45 : 0.45), -1.55);

                            break;
                        } 

                        case "heart": {
                            // Créé un coeur.
                            Item.create(Constants.ITEM_HEART, this.enemies[idx].x, this.enemies[idx].y, (i == 1 ? -0.45 : 0.45), -1.55);

                            break;
                        }

                        default: {
                            // On ne créé aucun item.
                            break;
                        }
                    }
                }

                // Incrémente le score du joueur.
                switch (enemy.type) {
                    // Ennemis ordinaires
                    // ------------------

                    case "zebulon": {
                        // Un Zebulon rapporte 250 points.
                        Stage.score += 250;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "250");

                        break;
                    }

                    case "ballo": {
                        // Un Ballo rapporte 150 points.
                        Stage.score += 150;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "150");

                        break;
                    }

                    case "motan": {
                        // Un Motan rapporte 100 points.
                        Stage.score += 100;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "100");

                        break;
                    }

                    case "bigmotan": {
                        // Un Big Motan rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "1000");

                        break;
                    }

                    case "voletta": {
                        // Un Voletta rapporte 300 points.
                        Stage.score += 300;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "300");

                        break;
                    }

                    case "bigvoletta": {
                        // Un Big Voletta rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "1000");

                        break;
                    }

                    case "blobule": {
                        // Un Blobule rapporte 500 points.
                        Stage.score += 500;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "500");

                        // En guise de chant du cygne, le Blobule lance des éclairs à sa mort.
                        /*this.throwFlash("left", this.enemies[idx].x, this.enemies[idx].y, -1, -1);
                        this.throwFlash("right", this.enemies[idx].x, this.enemies[idx].y, 1, -1);
                        this.throwFlash("left", this.enemies[idx].x, this.enemies[idx].y, -1, 1);
                        this.throwFlash("right", this.enemies[idx].x, this.enemies[idx].y, 1, 1);*/

                        break;
                    }

                    case "bloto": {
                        // Un Bloto rapporte 500 points.
                        Stage.score += 500;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "500");

                        break;
                    }

                    case "crokey": {
                        // Un Crokey rapporte 200 points.
                        Stage.score += 200;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "300");

                        break;
                    }

                    case "bigcrokey": {
                        // Un Big Crokey rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "300");

                        break;
                    }

                    case "boumbo": {
                        // Un Boumbo rapporte 500 points.
                        Stage.score += 500;
                        Effect.createText(this.enemies[idx].x, this.enemies[idx].y, "500");

                        break;
                    }
                }

                if (Stage.score > Constants.MAX_SCORE) {
                    Stage.score = Constants.MAX_SCORE;
                }

                // Et un ennemi de moins à vaincre !
                this.enemiesLeft--;
            } else {
                // Le monstre perd un point d'énergie. Il fait un bond en arrière.
                this.enemies[idx].hit = true;
                this.enemies[idx].jumping = true;
                this.enemies[idx].grounded = false;
                if (this.enemies[idx].direction == "left") {
                    this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                } else if (this.enemies[idx].direction == "right") {
                    this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                }
                this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;
            }
        }
    },
    killAround(x, y) {
        let shape = { x: (x - 16), y: (y - 16), w: 48, h: 48 };

        // Elimine tous les monstres aux alentours de la position spécifiée.
        for (let enemy of this.enemies) {
            if (!enemy.dead && enemy.explodeTime == 0) {
                if (Utils.isOverlapping(shape, enemy)) {
                    if (enemy.x < x) {
                        this.kill("left", enemy, "food");
                    } else {
                        this.kill("right", enemy, "food");
                    }
                }
            }
        }
    },
    killAll(itemType = "food") {
        // Elimine tous les monstres encore présents à l'écran.
        for (let enemy of this.enemies) {
            if (!enemy.dead) {
                this.kill(enemy.direction, enemy, itemType, true);
            }
        }
    },
    draw: function() {
        // Dessine les monstres.
        for (let enemy of this.enemies) {
            if (!enemy.dead) {
                switch (enemy.type) {
                    // Ennemis ordinaires
                    // ------------------
                    
                    case "ballo": {
                        // Ballo
                        // -----

                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Ballo mort.
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 48, 0, 16, 16);
                        } else {
                            // On anime ici Ballo en alternant les 3 premiers sprites de la première rangée 
                            // du tileset.
                            let x = 0;
                            if (this.animCycle == 1 || this.animCycle == 3) {
                                x = 16;
                            } else if (this.animCycle == 2) {
                                x = 32;
                            }
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, x, 0, 16, 16);
                        }

                        break;
                    }

                    case "bloto": {
                        // Bloto
                        // -----

                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Bloto mort.
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 48, 32, 16, 16);
                        } else {
                            // On anime ici Bloto en alternant les 3 premiers sprites de la troisième rangée 
                            // du tileset.
                            let x = 0;
                            if (this.animCycle == 1 || this.animCycle == 3) {
                                x = 16;
                            } else if (this.animCycle == 2) {
                                x = 32;
                            }
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, x, 32, 16, 16);
                        }

                        break;
                    }

                    case "voletta": {
                        // Voletta
                        // -------

                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Voletta mort.
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 48, 48, 16, 16);
                        } else {
                            // On anime ici Voletta en alternant les 3 premiers sprites de la quatrième rangée 
                            // du tileset.
                            let x = 0;
                            if (this.animCycle == 1 || this.animCycle == 3) {
                                x = 16;
                            } else if (this.animCycle == 2) {
                                x = 32;
                            }
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, x, 48, 16, 16);
                        }

                        break;
                    }

                    case "bigvoletta": {
                        // Big Voletta
                        // -----------

                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Voletta mort.
                            Graphics.drawImagePartScaled(this.imgEnemies, enemy.x, enemy.y, 32, 32, 48, 48, 16, 16);
                        } else {
                            // On anime ici Voletta en alternant les 3 premiers sprites de la quatrième rangée 
                            // du tileset.
                            let x = 0;
                            if (this.animCycle == 1 || this.animCycle == 3) {
                                x = 16;
                            } else if (this.animCycle == 2) {
                                x = 32;
                            }
                            Graphics.drawImagePartScaled(this.imgEnemies, enemy.x, enemy.y, 32, 32, x, 48, 16, 16);
                        }

                        break;
                    }

                    case "blobule": {
                        // Blobule
                        // -----

                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Blobule mort.
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 48, 80, 16, 16);
                        } else {
                            // On anime ici Blobule en alternant les 3 premiers sprites de la sixième rangée 
                            // du tileset.
                            let x = 0;
                            if (this.animCycle == 1 || this.animCycle == 3) {
                                x = 16;
                            } else if (this.animCycle == 2) {
                                x = 32;
                            }
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, x, 80, 16, 16);
                        }

                        break;
                    }

                    case "zebulon": {
                        // Zebulon
                        // -------
                        
                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Zebulon mort.
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 48, 16, 16, 16);
                        } else {
                            if (enemy.idleTime && enemy.ready) {
                                // Zebulon est immobile à ce moment, on affiche seulement le troisième sprite 
                                // de la deuxième rangée du tileset.
                                Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 32, 16, 16, 16);
                            } else {
                                // Zebulon sautille, on anime ici Zebulon en alternant les 3 premiers 
                                // sprites de la deuxième rangée du tileset.
                                let x = 0;
                                if (this.animCycle == 1 || this.animCycle == 3) {
                                    x = 16;
                                } else if (this.animCycle == 2) {
                                    x = 32;
                                }
                                Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, x, 16, 16, 16);
                            }
                        }

                        break;
                    }

                    case "motan": {
                        // Motan
                        // -----

                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Motan mort.
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 48, 64, 16, 16);
                        } else {
                            // On anime ici Motan en alternant les 3 premiers sprites de la troisième rangée 
                            // du tileset.
                            let x = 0;
                            if (this.animCycle == 1 || this.animCycle == 3) {
                                x = 16;
                            } else if (this.animCycle == 2) {
                                x = 32;
                            }
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, x, 64, 16, 16);
                        }

                        break;
                    }

                    case "bigmotan": {
                        // Big Motan
                        // ---------

                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Motan mort.
                            Graphics.drawImagePartScaled(this.imgEnemies, enemy.x, enemy.y, 32, 32, 48, 64, 16, 16);
                        } else {
                            // On anime ici Motan en alternant les 3 premiers sprites de la troisième rangée 
                            // du tileset.
                            let x = 0;
                            if (this.animCycle == 1 || this.animCycle == 3) {
                                x = 16;
                            } else if (this.animCycle == 2) {
                                x = 32;
                            }
                            Graphics.drawImagePartScaled(this.imgEnemies, enemy.x, enemy.y, 32, 32, x, 64, 16, 16);
                        }

                        break;
                    }

                    case "crokey": {
                        // Crokey
                        // ------
                        
                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Crokey mort.
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 48, 96, 16, 16);
                        } else {
                            if (enemy.idleTime && enemy.ready) {
                                // Le Crokey est immobile à ce moment, on affiche seulement le troisième sprite 
                                // de la deuxième rangée du tileset.
                                Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 32, 96, 16, 16);
                            } else {
                                // Le Crokey sautille. On alterne les sprites selon son déplacement. Quand il saute,
                                // le Crokey lève les yeux, et quand il retombe, il les baisse.
                                if (enemy.vy < 0) {
                                    Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 0, 96, 16, 16);
                                } else {
                                    Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 16, 96, 16, 16);
                                }
                            }
                        }

                        break;
                    }

                    case "bigcrokey": {
                        // Big Crokey
                        // ----------

                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Crokey mort.
                            Graphics.drawImagePart(this.imgBoss, enemy.x, enemy.y, 96, 0, 32, 32);
                        } else {
                            if (enemy.idleTime && enemy.ready) {
                                // Le Crokey est immobile à ce moment, on affiche seulement le troisième sprite 
                                // de la deuxième rangée du tileset.
                                Graphics.drawImagePart(this.imgBoss, enemy.x, enemy.y, 64, 0, 32, 32);
                            } else {
                                // Le Crokey sautille. On alterne les sprites selon son déplacement. Quand il saute,
                                // le Crokey lève les yeux, et quand il retombe, il les baisse.
                                if (enemy.vy < 0) {
                                    Graphics.drawImagePart(this.imgBoss, enemy.x, enemy.y, 0, 0, 32, 32);
                                } else {
                                    Graphics.drawImagePart(this.imgBoss, enemy.x, enemy.y, 32, 0, 32, 32);
                                }
                            }
                        }

                        break;
                    }

                    case "boumbo": {
                        // Boumbo
                        // ------
                        
                        if (enemy.killed || enemy.hit) {
                            // On dessine ici un Boumbo mort.
                            Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 48, 112, 16, 16);
                        } else {
                            if (enemy.explodeTime == 0) {
                                // On anime ici Boumbo en alternant les 3 premiers sprites de la première rangée 
                                // du tileset.
                                let x = 0;
                                if (this.animCycle == 1 || this.animCycle == 3) {
                                    x = 16;
                                } else if (this.animCycle == 2) {
                                    x = 32;
                                }
                                Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, x, 112, 16, 16);
                            } else if (enemy.explodeTime > 0) {
                                // Dessine la bombe.
                                let x = 16;
                                if (this.animCycle == 1 || this.animCycle == 3) {
                                    x = 0;
                                } else if (this.animCycle == 2) {
                                    x = 32;
                                }
                                Graphics.drawImagePart(this.imgBomb, enemy.x, enemy.y, x, 16, 16, 16);

                                // Avant l'explosion, on fait scintiller la bombe.
                                if (enemy.explodeTime == 6 || enemy.explodeTime == 4 || enemy.explodeTime == 2) {
                                    Graphics.drawImagePart(this.imgBomb, enemy.x, enemy.y, x, 32, 16, 16);
                                }
                            } else {
                                // Dessine Boumbo en train de récupérer après une explosion.
                                Graphics.drawImagePart(this.imgEnemies, enemy.x, enemy.y, 16, 112, 16, 16);
                            }
                        }

                        break;
                    }
                }

                //Graphics.drawRectangle(enemy.x, enemy.y, enemy.w, enemy.h, "#FF0000");
            }
        }

        // Dessine les éclairs lancés par les ennemis.
        for (let flash of this.flashes) {
            if (flash.direction == "left") {
                Graphics.drawImagePart(this.imgBomb, flash.x, flash.y, 64, 16, 16, 16);
            } else if (flash.direction == "right") {
                Graphics.drawImagePart(this.imgBomb, flash.x, flash.y, 48, 16, 16, 16);
            }
        }
    },
    update: function(dt) {
        let time = window.performance.now();

        // Gestion des animations
        // ----------------------

        if (time > this.currentTime) {
            this.currentTime = (125 + time);

            // Incrémente le compteur. 
            this.animCycle += 1;
            if (this.animCycle > 3) {
                // Le compteur repart de zéro.
                this.animCycle = 0;
            }

            if (this.enemiesToLaunch == 0) {
                for (let idx in this.enemies) {
                    // Si cet ennemi est mort, on passe au suivant.
                    if (this.enemies[idx].dead) {
                        continue;
                    }

                    // Attaque de l'ennemi
                    // -------------------

                    if (this.enemies[idx].flashTime > 0 && !this.enemies[idx].killed) {
                        // Décrémente le compteur.
                        this.enemies[idx].flashTime--;

                        // Le compteur a atteint 0, l'ennemi lance des éclairs.
                        if (this.enemies[idx].flashTime === 0) {
                            switch (this.enemies[idx].type) {
                                case "blobule": {
                                    // Blobule
                                    // -------

                                    // Blobule lance des éclairs autour de lui.
                                    this.throwFlash("left", this.enemies[idx].x, this.enemies[idx].y, -1, -1);
                                    this.throwFlash("right", this.enemies[idx].x, this.enemies[idx].y, 1, -1);
                                    this.throwFlash("left", this.enemies[idx].x, this.enemies[idx].y, -1, 1);
                                    this.throwFlash("right", this.enemies[idx].x, this.enemies[idx].y, 1, 1);

                                    // Réinitialise le compteur.
                                    this.enemies[idx].flashTime = (Constants.ATTACK_TIME + Utils.randomBetween(5, 10));

                                    // Joue un son.
                                    Sound.play(this.sndFlash);

                                    break;
                                }

                                case "boumbo": {
                                    // Boumbo
                                    // ------

                                    // Boumbo arrête de se déplacer.
                                    this.enemies[idx].vx = 0;
                                    if (!this.enemies[idx].jumping) {
                                        if (this.enemies[idx].vy >= 0 && this.enemies[idx].vy <= Constants.ENEMY_MAX_VELOCITY) {
                                            this.enemies[idx].jumping = true;
                                            this.enemies[idx].grounded = false;
                                            this.enemies[idx].vy = -(Constants.ENEMY_JUMP_VELOCITY / 2);
                                        }
                                    }

                                    // Boumbo se transforme en bombe et ne va pas tarder à exploser.
                                    this.enemies[idx].explodeTime = Constants.BOMB_TIME;

                                    // Joue un son.
                                    Sound.play(this.sndThrow);

                                    break;
                                }
                            }
                        }
                    }

                    if (this.enemies[idx].explodeTime > 0 && !this.enemies[idx].killed) {
                        // Décrémente le compteur.
                        this.enemies[idx].explodeTime--;

                        // Le compteur a atteint 0, l'ennemi explose.
                        if (this.enemies[idx].explodeTime === 0) {
                            this.enemies[idx].explodeTime = -1;

                            // Joue un son.
                            Sound.play(this.sndBomb);

                            // Créé un effet d'explosion.
                            let color = Utils.randomBetween(Constants.SPARK_BLUE, Constants.SPARK_MAGENTA);
                            Effect.createExplosion(this.enemies[idx].x, this.enemies[idx].y, color);

                            // Tue tous les ennemis aux alentours.
                            this.killAround(this.enemies[idx].x, this.enemies[idx].y);

                            // Casse toutes les caisses en bois aux alentours.
                            Stage.destroyWoodenCrates(this.enemies[idx].x, this.enemies[idx].y);

                            // Si le joueur se trouve aussi dans les alentours, il est touché.
                            if (Player.data.y >= (this.enemies[idx].y - 32) && Player.data.y <= (this.enemies[idx].y + 32) && Player.data.x >= (this.enemies[idx].x - 32) && Player.data.x <= (this.enemies[idx].x + 32)) {
                                if (!Player.bombShield) {
                                    // Une explosion fait perdre pas mal d'énergie au joueur, sauf si celui-ci
                                    // est protégé contre les explosions.
                                    if (Player.data.x < this.enemies[idx].x) {
                                        Player.hit("right", "explosion");
                                    } else {
                                        Player.hit("left", "explosion");
                                    }
                                }
                            }

                            // Fait trembler l'aire de jeu.
                            Effect.shake();

                            setTimeout(function() {
                                // L'ennemi reprend son comportement normal.
                                this.enemies[idx].flashTime = (Constants.ATTACK_TIME + Utils.randomBetween(15, 30));
                                this.enemies[idx].explodeTime = 0;

                                // Détermine dans quelle direction l'ennemi va se déplacer.
                                let i = Utils.randomBetween(1, 2);
                                if (i == 1) {
                                    this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                } else {
                                    this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                }
                            }.bind(this), 1000);
                        }
                    }
                }
            }
        }

        // Gestion des ennemis
        // -------------------

        if (this.enemiesToLaunch > 0) {
            // Apparition des ennemis
            // ----------------------

            // En début de niveau, les ennemis apparaissent du haut de l'écran et descendent
            // dans le tableau jusqu'à leur position finale.
            for (let idx in this.enemies) {
                if (!this.enemies[idx].ready) {
                    // Fait descendre l'ennemi.
                    this.enemies[idx].y += (Constants.ENEMY_LAUNCH_VELOCITY * dt);

                    if (this.enemies[idx].y >= this.enemies[idx].dy) {
                        // L'ennemi a atteint sa position finale. A partir de maintenant, il
                        // atteint que ses petits camarades atteignent eux aussi leur position
                        // finale pour commencer à se déplacer.
                        this.enemies[idx].y = this.enemies[idx].dy;
                        this.enemies[idx].ready = true;

                        // Décrémente le compteur d'ennemis à afficher.
                        this.enemiesToLaunch--;
                    }
                }
            }
        } else {
            // Gestion des déplacements des ennemis
            // ------------------------------------

            for (let idx in this.enemies) {
                // Si cet ennemi est mort, on passe au suivant.
                if (this.enemies[idx].dead) {
                    continue;
                }

                this.enemies[idx].grounded = false;
                let noJump = false;

                // Préparatifs pour la détection de collisions
                // -------------------------------------------

                let shapeTop = { x: this.enemies[idx].x + 2, y: this.enemies[idx].y, w: (this.enemies[idx].w - 4), h: 2, vx: 0, vy: 0 };
                let shapeBottom = { x: this.enemies[idx].x + 2, y: this.enemies[idx].y + this.enemies[idx].h - 1, w: (this.enemies[idx].w - 4), h: 2, vx: 0, vy: 0 };
                let shapeLeft = { x: this.enemies[idx].x, y: this.enemies[idx].y + 2, w: 2, h: (this.enemies[idx].h - 4), vx: 0, vy: 0 };
                let shapeRight = { x: this.enemies[idx].x + this.enemies[idx].w - 1, y: this.enemies[idx].y + 2, w: 2, h: (this.enemies[idx].h - 4), vx: 0, vy: 0 };

                // Repos de l'ennemi
                // ----------------- 

                // Un compteur a été enclenchée. Tant que ce compteur ne sera pas écoulé, l'ennemi 
                // restera immobile.
                if (this.enemies[idx].idleTime > 0 && !this.enemies[idx].killed) {
                    // Décrémente le compteur.
                    this.enemies[idx].idleTime--;

                    // Le compteur a atteint 0. On décide du comportement de l'ennemi.
                    if (this.enemies[idx].idleTime === 0) {
                        switch (this.enemies[idx].type) {
                            case "voletta": 
                            case "bigvoletta": {
                                // Voletta & Big Voletta
                                // ---------------------

                                // Voletta vient d'arriver dans le niveau, on définit dans quelle
                                // direction elle doit se diriger.
                                this.enemies[idx].vy = -(Constants.ENEMY_VELOCITY - 0.015);
                                if (this.enemies[idx].direction == "left") {
                                    this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                } else if (this.enemies[idx].direction == "right") {
                                    this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                }

                                break;
                            }

                            case "blobule": {
                                // Blobule
                                // -------

                                // Blobule vient d'arriver dans le niveau, on définit dans quelle
                                // direction elle doit se diriger.
                                this.enemies[idx].vy = -Constants.ENEMY_VELOCITY;
                                if (this.enemies[idx].direction == "left") {
                                    this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                } else if (this.enemies[idx].direction == "right") {
                                    this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                }

                                break;
                            }

                            case "zebulon": {
                                // Zebulon
                                // -------

                                // Après son petit moment de repos, Zebulon saute à nouveau.
                                this.enemies[idx].jumping = true;
                                this.enemies[idx].grounded = false;
                                this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;

                                // Définit dans quelle direction Zebulon doit se diriger.
                                if (this.enemies[idx].direction == "left") {
                                    this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                } else if (this.enemies[idx].direction == "right") {
                                    this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                } 

                                break;
                            }

                            case "crokey": {
                                // Crokey
                                // ------

                                // Après son petit moment de repos, le Crokey saute à nouveau.
                                this.enemies[idx].jumping = true;
                                this.enemies[idx].grounded = false;
                                this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;

                                if (this.enemies[idx].state == 0) {
                                    // Crokey vient d'arriver dans le niveau, on définit dans quelle
                                    // direction elle doit se diriger.
                                    if (this.enemies[idx].direction == "left") {
                                        this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                    } else if (this.enemies[idx].direction == "right") {
                                        this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                    }

                                    this.enemies[idx].state = true;
                                } else {
                                    // Crokey se dirige toujours vers le joueur.
                                    if (Player.data.x < this.enemies[idx].x) {
                                        this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                    } else if (Player.data.x >= (this.enemies[idx].x + this.enemies[idx].w)) { 
                                        this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                    } else {
                                        let i = Utils.randomBetween(1, 2);
                                        this.enemies[idx].vx = (i == 1 ? Constants.ENEMY_VELOCITY : -Constants.ENEMY_VELOCITY);
                                    }
                                }

                                break;
                            }

                            case "bigcrokey": {
                                // Big Crokey
                                // ----------

                                // Après son petit moment de repos, le Crokey saute à nouveau.
                                this.enemies[idx].jumping = true;
                                this.enemies[idx].grounded = false;
                                this.enemies[idx].vy = -(Constants.ENEMY_JUMP_VELOCITY * 1.2);

                                if (this.enemies[idx].state == 0) {
                                    // Crokey vient d'arriver dans le niveau, on définit dans quelle
                                    // direction elle doit se diriger.
                                    if (this.enemies[idx].direction == "left") {
                                        this.enemies[idx].vx = -(Constants.ENEMY_VELOCITY * 1.5);
                                    } else if (this.enemies[idx].direction == "right") {
                                        this.enemies[idx].vx = (Constants.ENEMY_VELOCITY * 1.5);
                                    }

                                    this.enemies[idx].state = true;
                                } else {
                                    // Crokey se dirige toujours vers le joueur.
                                    if (Player.data.x < this.enemies[idx].x) {
                                        this.enemies[idx].vx = -(Constants.ENEMY_VELOCITY * 1.5);
                                    } else if (Player.data.x >= (this.enemies[idx].x + this.enemies[idx].w)) { 
                                        this.enemies[idx].vx = (Constants.ENEMY_VELOCITY * 1.5);
                                    } else {
                                        let i = Utils.randomBetween(1, 2);
                                        this.enemies[idx].vx = ((i == 1 ? Constants.ENEMY_VELOCITY : -Constants.ENEMY_VELOCITY) * 1.5);
                                    }
                                }

                                break;
                            }

                            default: {
                                // Les autres ennemis ne sont pas concernés par ce cas de figure.
                                break;
                            }
                        }
                    }

                    continue;
                }

                // Gestion de la gravité
                // ---------------------

                // On gère la gravité ici. Certains ennemis n'y sont pas soumis.
                switch (this.enemies[idx].type) {
                    case "ballo":
                    case "bloto": 
                    case "motan":
                    case "bigmotan":
                    case "zebulon":
                    case "crokey":
                    case "bigcrokey":
                    case "boumbo": {
                        // Ces ennemis sont soumis à la gravité.
                        let maxVelocity = Constants.ENEMY_MAX_VELOCITY;

                        if (!this.enemies[idx].grounded && this.enemies[idx].vy < maxVelocity) {
                            this.enemies[idx].vy += (Constants.ENEMY_GRAVITY * dt);
                            this.enemies[idx].groundedAction = false;
                        } else {
                            this.enemies[idx].vy = maxVelocity;
                        }

                        break;
                    }

                    default: {
                        // Les autres ennemis ne sont pas soumis à la gravité quand ils sont vivants, sauf
                        // quand ils ont été touchés par une explosion.
                        if (this.enemies[idx].hit) {
                            if (!this.enemies[idx].grounded && this.enemies[idx].vy < Constants.ENEMY_MAX_VELOCITY) {
                                this.enemies[idx].vy += (Constants.ENEMY_GRAVITY * dt);
                                this.enemies[idx].groundedAction = false;
                            } else {
                                this.enemies[idx].vy = Constants.ENEMY_MAX_VELOCITY;
                            }
                        } else {
                            if (this.enemies[idx].killed) {
                                if (!this.enemies[idx].grounded && this.enemies[idx].vy < Constants.ENEMY_MAX_VELOCITY) {
                                    this.enemies[idx].vy += (Constants.ENEMY_GRAVITY * dt);
                                }
                            }
                        }

                        break;
                    }
                }

                // Gestion des collisions entre l'ennemi et les murs
                // -------------------------------------------------

                // Vérifie si l'ennemi entre en collision avec un mur ou une plateforme.
                for (let platform of Stage.platforms) {
                    if (!platform.enabled) {
                        continue;
                    }

                    if (platform.type == "ceiling") {
                        if (this.enemies[idx].flying) {
                            if (this.enemies[idx].hit) {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    }

                    // On gère ici un cas particulier, quand l'ennemi doit sauter pour surgir sur le joueur, on fait
                    // en sorte que l'ennemi ne saute pas quand une caisse en bois se trouve juste
                    // au-dessus de lui. 
                    let shape = { x: this.enemies[idx].x, y: this.enemies[idx].y - 48, w: this.enemies[idx].w, h: this.enemies[idx].h };
                    if (platform.type == "crate" && Utils.isOverlapping(shape, platform)) {
                        noJump = true;
                    }

                    if (!this.enemies[idx].killed) {
                        if (this.enemies[idx].flying && !this.enemies[idx].hit) {
                            // Détecte une collision sous ou en-dessus de l'ennemi.
                            if ((this.enemies[idx].vy > 0 && Utils.isOverlapping(shapeBottom, platform)) || (this.enemies[idx].vy < 0 && Utils.isOverlapping(shapeTop, platform))) {
                                // La collision a eu lieu en haut ou en bas du mur. L'ennemi 
                                // va tout simplement dans la direction opposée.
                                this.enemies[idx].vy *= -1;
                            }

                            // Détecte une collision de chaque côté de l'ennemi.
                            if ((this.enemies[idx].vx < 0 && Utils.isOverlapping(shapeLeft, platform)) || (this.enemies[idx].vx > 0 && Utils.isOverlapping(shapeRight, platform))) {
                                // La collision a eu lieu à gauche ou à droite du mur. L'ennemi 
                                // va tout simplement dans la direction opposée.
                                this.enemies[idx].vx *= -1;
                            }
                        } else {
                            // Détecte une collision sous l'ennemi.
                            if (this.enemies[idx].vy > 0) {
                                if (Utils.isOverlapping(shapeBottom, platform) && (this.enemies[idx].y + this.enemies[idx].h - 4) < platform.y) {
                                    // La collision a eu lieu sur un mur ou sur une plateforme. L'ennemi a 
                                    // donc atterit dessus.
                                    this.enemies[idx].grounded = true;
                                    this.enemies[idx].jumping = false;
                                    this.enemies[idx].y = platform.y - this.enemies[idx].h;

                                    if (!this.enemies[idx].groundedAction) {
                                        this.enemies[idx].groundedAction = true;

                                        switch (this.enemies[idx].type) {
                                            case "ballo": {
                                                // Ballo
                                                // -----
                        
                                                // Ballo est parfois imprévisible dans ses déplacements. Il lui arrive de changer
                                                // de direction pendant qu'il se déplace. C'est au moment où il atterit sur une 
                                                // plateforme qu'il peut aller ailleurs. C'est donc ici qu'on décide ou Ballo doit
                                                // se diriger.
                        
                                                if (this.enemies[idx].vy > (Constants.ENEMY_GRAVITY * dt)) {
                                                    let i = Utils.randomBetween(1, 8);
                                                    if (i == 1) {
                                                        if (this.enemies[idx].direction == "right") {
                                                            // L'ennemi va à gauche.
                                                            this.enemies[idx].direction = "left";
                                                            this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                                        } else if (this.enemies[idx].direction == "left") {
                                                            // L'ennemi va à droite.
                                                            this.enemies[idx].direction = "right";
                                                            this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                                        }
                                                    }

                                                    if (platform.type == "spear") {
                                                        // Si Ballo tombe sur des piques, il sautille.
                                                        this.enemies[idx].jumping = true;
                                                        this.enemies[idx].grounded = false;
                                                        this.enemies[idx].vy = -(Constants.ENEMY_JUMP_VELOCITY * 0.8);
                                                    }
                                                }
                        
                                                break;
                                            }
                        
                                            case "bloto": {
                                                // Bloto
                                                // -----
                        
                                                // Le changement de direction de Bloto est décidé quand celui-ci tombe. Ainsi, 
                                                // quand il atterira sur une plateforme, Bloto ira automatiquement dans la direction
                                                // du joueur.
                        
                                                if (this.enemies[idx].vy > (Constants.ENEMY_GRAVITY * dt)) {
                                                    // Regarde dans quelle direction est le joueur.
                                                    if (Player.data.x < this.enemies[idx].x) {
                                                        // Le joueur est vers la gauche. L'ennemi va dans sa direction.
                                                        this.enemies[idx].direction = "left";
                                                        this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                                    } else {
                                                        // Le joueur est vers la droite. L'ennemi va dans sa direction.
                                                        this.enemies[idx].direction = "right";
                                                        this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                                    }

                                                    if (platform.type == "spear") {
                                                        // Si Bloto tombe sur des piques, il sautille.
                                                        this.enemies[idx].jumping = true;
                                                        this.enemies[idx].grounded = false;
                                                        this.enemies[idx].vy = -(Constants.ENEMY_JUMP_VELOCITY * 0.8);
                                                    }
                                                }
                        
                                                break;
                                            }
                        
                                            case "boumbo": {
                                                // Boumbo
                                                // ------
                        
                                                // Boumbo est parfois imprévisible dans ses déplacements. Il lui arrive de changer
                                                // de direction pendant qu'il se déplace. C'est au moment où il atterit sur une 
                                                // plateforme qu'il peut aller ailleurs. C'est donc ici qu'on décide ou Boumbo doit
                                                // se diriger.
                        
                                                if (this.enemies[idx].explodeTime == 0) {
                                                    if (this.enemies[idx].vy > (Constants.ENEMY_GRAVITY * dt)) {
                                                        let i = Utils.randomBetween(1, 8);
                                                        if (i == 1) {
                                                            if (this.enemies[idx].direction == "right") {
                                                                // L'ennemi va à gauche.
                                                                this.enemies[idx].direction = "left";
                                                                this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                                                            } else if (this.enemies[idx].direction == "left") {
                                                                // L'ennemi va à droite.
                                                                this.enemies[idx].direction = "right";
                                                                this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                                                            }
                                                        }

                                                        if (platform.type == "spear") {
                                                            // Si Boumbo tombe sur des piques, il sautille.
                                                            this.enemies[idx].jumping = true;
                                                            this.enemies[idx].grounded = false;
                                                            this.enemies[idx].vy = -(Constants.ENEMY_JUMP_VELOCITY * 0.8);
                                                        }
                                                    }
                                                }
                        
                                                break;
                                            }

                                            default: {
                                                // Les autres
                                                // ----------
                                                
                                                if (this.enemies[idx].vy > (Constants.ENEMY_GRAVITY * dt)) {
                                                    if (platform.type == "spear") {
                                                        // Si l'ennemi tombe sur des piques, il sautille.
                                                        this.enemies[idx].jumping = true;
                                                        this.enemies[idx].grounded = false;
                                                        this.enemies[idx].vy = -(Constants.ENEMY_JUMP_VELOCITY * 0.8);
                                                    }
                                                }

                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            // Détecte une collision au-dessus de l'ennemi.
                            if (this.enemies[idx].vy < 0 && Utils.isOverlapping(shapeTop, platform)) {
                                if (platform.type == "edge" || platform.type == "floor" || platform.type == "crate" || platform.type == "spear") {
                                    // La collision a eu lieu sous le mur. L'ennemi s'est donc cogné
                                    // la tête contre ce mur, il retombe aussitôt.
                                    this.enemies[idx].vy *= -1;
                                    this.enemies[idx].y = platform.y + platform.h;
                                }
                            }

                            // Détecte une collision à gauche de l'ennemi.
                            if (this.enemies[idx].vx < 0 && Utils.isOverlapping(shapeLeft, platform)) {
                                if (platform.type == "edge" || platform.type == "floor" || platform.type == "crate" || platform.type == "spear" || (platform.type == "platform" && platform.th > 1) || (platform.type == "hiddenplatform" && platform.th > 1)) { 
                                    // La collision a eu lieu à gauche du mur.
                                    this.enemies[idx].vx *= -1;
                                    this.enemies[idx].jumping = false;
                                    this.enemies[idx].random = Utils.randomBetween(1, 4);

                                    // L'ennemi se dirige maintenant à droite après avoir heurté un
                                    // mur à sa gauche.
                                    this.enemies[idx].direction = "right";
                                }
                            }

                            // Détecte une collision à droite de l'ennemi.
                            if (this.enemies[idx].vx > 0 && Utils.isOverlapping(shapeRight, platform)) {
                                if (platform.type == "edge" || platform.type == "floor" || platform.type == "crate" || platform.type == "spear" || (platform.type == "platform" && platform.th > 1) || (platform.type == "hiddenplatform" && platform.th > 1)) { 
                                    // La collision a eu lieu à droite du mur.
                                    this.enemies[idx].vx *= -1;
                                    this.enemies[idx].jumping = false;
                                    this.enemies[idx].random = Utils.randomBetween(1, 4);

                                    // L'ennemi se dirige maintenant à gauche après avoir heurté un
                                    // mur à sa droite.
                                    this.enemies[idx].direction = "left";
                                }
                            }
                        }
                    }
                }

                // Sur une plateforme
                // ------------------

                // L'ennemi est sur une plateforme, ou vient d'attérir dessus. On fait en sorte
                // qu'il ne traverse pas cette plateforme.
                if (this.enemies[idx].grounded && !this.enemies[idx].jumping) {
                    if (!this.enemies[idx].flying || (this.enemies[idx].flying && this.enemies[idx].hit)) {
                        this.enemies[idx].vy = 0;
                        if (this.enemies[idx].hit) {
                            // Le monstre est un peu sonné, il reprend ses esprits peu de temps après.
                            this.enemies[idx].vx = 0;
                            setTimeout(function() {
                                this.afterGround(idx, noJump, true);
                            }.bind(this), 1000);
                        } else {
                            this.afterGround(idx, noJump);
                        }
                    }
                } 

                // Déplacement de l'ennemi
                // -----------------------

                // Applique les paramètres de vélocité de l'ennemi sur sa position. Une valeur
                // positive déplace l'ennemi vers le bas ou la droite, une valeur négative déplace
                // l'ennemi vers le haut ou à gauche.
                this.enemies[idx].x += (this.enemies[idx].vx * dt);
                this.enemies[idx].y += (this.enemies[idx].vy * dt);

                // Vérifie si l'ennemi tombe et sort de l'écran.
                if (this.enemies[idx].y > Constants.CANVAS_HEIGHT) {
                    if (this.enemies[idx].killed) {
                        // L'ennemi est mort, qu'il repose en paix.
                        this.enemies[idx].dead = true;
                    } else {
                        // L'ennemi réapparait en haut de l'écran.
                        this.enemies[idx].y = -16;
                    }
                }

                // Même chose dans l'autre sens, si l'ennemi s'envole au-delà de l'écran, il réapparait
                // tout de suite en bas de l'écran.
                if (this.enemies[idx].flying && this.enemies[idx].y < -16) {
                    this.enemies[idx].y = Constants.CANVAS_HEIGHT;
                }
            }
        }

        // Gestion des tirs d'éclairs
        // --------------------------

        // Retire les éclairs qui sont sortis de l'écran.
        this.flashes = this.flashes.filter((flash) => !flash.destroyed);

        for (let idx in this.flashes) {
            if (!this.flashes[idx].destroyed) {
                // Déplacement de l'éclair
                // -----------------------

                // Applique les paramètres de vélocité de l'éclair sur sa position.
                this.flashes[idx].x += this.flashes[idx].vx;
                this.flashes[idx].y += this.flashes[idx].vy;

                // Gestion des collisions
                // ----------------------

                // Si l'éclair sort de l'écran, il disparait.
                if (this.flashes[idx].x < -16) {
                    this.flashes[idx].destroyed = true;
                } else if (this.flashes[idx].x > Constants.CANVAS_WIDTH) {
                    this.flashes[idx].destroyed = true;
                } else if (this.flashes[idx].y < -16) {
                    this.flashes[idx].destroyed = true;
                } else if (this.flashes[idx].y > Constants.CANVAS_HEIGHT) {
                    this.flashes[idx].destroyed = true;
                }
            }
        }
    },
    afterGround: function(idx, noJump = false, afterHit = false) {
        this.enemies[idx].hit = false;

        // A partir de maintenant, le comportement de l'ennemi diffère selon son
        // espèce.
        switch (this.enemies[idx].type) {
            case "ballo": {
                // Ballo
                // -----

                // Ballo vient d'atterir sur une plateforme. Il continue tranquillement
                // sa petite promenade.
                if (this.enemies[idx].direction == "left") {
                    this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                } else if (this.enemies[idx].direction == "right") {
                    this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                }

                break;
            }

            case "bloto": {
                // Bloto
                // -----

                // Bloto vient d'atterir sur une plateforme. Il continue tranquillement
                // sa petite promenade en direction du joueur.
                if (this.enemies[idx].direction == "left") {
                    this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                } else if (this.enemies[idx].direction == "right") {
                    this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                }

                // Si le joueur se trouve sur une plateforme juste au-dessus de lui, Bloto saute
                // pour se jeter sur lui. Bloto ne doit pas sauter quand le joueur saute pour tenter
                // de l'esquiver.
                if (!Stage.superMode) {
                    // En mode normal, il peut arriver que Bloto ne saute pas.
                    if (this.enemies[idx].random != 1) {
                        noJump = true;
                    }
                }

                if (!Player.data.jumping && !noJump) {
                    if (Player.data.y >= (this.enemies[idx].y - 64) && Player.data.y <= (this.enemies[idx].y - 32)) {
                        // Le joueur se trouve un peu plus haut par rapport à l'ennemi. On vérifie si le 
                        // le joueur est vraiment au-dessus de Bloto et non pas plus loin.
                        if (Player.data.x >= (this.enemies[idx].x - 48) && Player.data.x <= (this.enemies[idx].x - 16) && this.enemies[idx].direction == "left") {
                            // Le joueur est à gauche de Bloto. Il saute dans sa direction.
                            this.enemies[idx].jumping = true;
                            this.enemies[idx].grounded = false;
                            this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                            this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;
                        } else if (Player.data.x >= (this.enemies[idx].x + 16) && Player.data.x <= (this.enemies[idx].x + 48) && this.enemies[idx].direction == "right") {
                            // Le joueur est à droite de Bloto. Il saute dans sa direction.
                            this.enemies[idx].jumping = true;
                            this.enemies[idx].grounded = false;
                            this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                            this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;
                        }
                    }
                }

                break;
            }

            case "zebulon": {
                // Zebulon
                // -------

                // Zebulon vient d'atterir sur une plateforme. Il va rester immobile pendant
                // un très court laps de temps avant de sauter à nouveau.
                this.enemies[idx].vx = 0;
                if (this.enemies[idx].idleTime === 0) {
                    this.enemies[idx].idleTime = 30 + Utils.randomBetween(15, 30);
                }

                break;
            }

            case "motan": {
                // Motan
                // -----

                // Motan vient d'atterir sur une plateforme. Il continue tranquillement
                // sa petite promenade.
                if (this.enemies[idx].direction == "left") {
                    this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                } else if (this.enemies[idx].direction == "right") {
                    this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                }

                // Si le joueur se trouve sur une plateforme juste au-dessus de lui, Motan peut
                // décider de sauter pour surgir devant lui. Motan peut sauter si le joueur saute
                // au-dessus de lui pour l'esquiver.
                if (!Stage.superMode) {
                    // En mode normal, il peut arriver que Motan ne saute pas.
                    if (this.enemies[idx].random != 1) {
                        noJump = true;
                    }
                }

                if (!noJump) {
                    if (Player.data.y >= (this.enemies[idx].y - 48) && Player.data.y <= (this.enemies[idx].y - 16)) {
                        // Le joueur se trouve un peu plus haut par rapport à l'ennemi. On vérifie si le 
                        // le joueur est vraiment au-dessus de Motan et non pas plus loin.
                        if (Player.data.x >= (this.enemies[idx].x - 56) && Player.data.x <= (this.enemies[idx].x - 24) && this.enemies[idx].direction == "left") {
                            // Le joueur est à gauche de Motan. Il saute dans sa direction.
                            this.enemies[idx].jumping = true;
                            this.enemies[idx].grounded = false;
                            this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                            this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;
                        } else if (Player.data.x >= (this.enemies[idx].x + 24) && Player.data.x <= (this.enemies[idx].x + 56) && this.enemies[idx].direction == "right") {
                            // Le joueur est à droite de Motan. Il saute dans sa direction.
                            this.enemies[idx].jumping = true;
                            this.enemies[idx].grounded = false;
                            this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                            this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;
                        }
                    }
                }

                break;
            }

            case "bigmotan": {
                // Big Motan
                // ---------

                // Big Motan vient d'atterir sur une plateforme. Il continue tranquillement
                // sa petite promenade.
                if (this.enemies[idx].direction == "left") {
                    this.enemies[idx].vx = -(Constants.ENEMY_VELOCITY * 1.5);
                } else if (this.enemies[idx].direction == "right") {
                    this.enemies[idx].vx = (Constants.ENEMY_VELOCITY * 1.5);
                }

                // Si le joueur se trouve sur une plateforme juste au-dessus de lui, Big Motan ne réfléchit pas, il
                // surgit devant lui. Big Motan peut aussi sauter si le joueur saute au-dessus de lui pour l'esquiver.
                if (Player.data.y >= (this.enemies[idx].y - 48) && Player.data.y <= (this.enemies[idx].y - 16)) {
                    // Le joueur se trouve un peu plus haut par rapport à l'ennemi. On vérifie si le 
                    // le joueur est vraiment au-dessus de Motan et non pas plus loin.
                    if (Player.data.x >= (this.enemies[idx].x - 56) && Player.data.x <= (this.enemies[idx].x - 24) && this.enemies[idx].direction == "left") {
                        // Le joueur est à gauche de Motan. Il saute dans sa direction.
                        this.enemies[idx].jumping = true;
                        this.enemies[idx].grounded = false;
                        this.enemies[idx].vx = -(Constants.ENEMY_VELOCITY * 1.5);
                        this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;
                    } else if (Player.data.x >= (this.enemies[idx].x + 24) && Player.data.x <= (this.enemies[idx].x + 56) && this.enemies[idx].direction == "right") {
                        // Le joueur est à droite de Motan. Il saute dans sa direction.
                        this.enemies[idx].jumping = true;
                        this.enemies[idx].grounded = false;
                        this.enemies[idx].vx = (Constants.ENEMY_VELOCITY * 1.5);
                        this.enemies[idx].vy = -Constants.ENEMY_JUMP_VELOCITY;
                    }
                }

                break;
            }

            case "crokey": {
                // Crokey
                // ------

                // Un Crokey vient d'atterir sur une plateforme. Il va rester immobile pendant
                // un très court laps de temps avant de sauter à nouveau.
                this.enemies[idx].vx = 0;
                if (this.enemies[idx].idleTime === 0) {
                    this.enemies[idx].idleTime = 20 + Utils.randomBetween(10, 20);
                }

                break;
            }

            case "bigcrokey": {
                // Big Crokey
                // ----------

                // Un Big Crokey vient d'atterir sur une plateforme. Il va rester immobile pendant
                // un très court laps de temps avant de sauter à nouveau.
                this.enemies[idx].vx = 0;
                if (this.enemies[idx].idleTime === 0) {
                    this.enemies[idx].idleTime = 20 + Utils.randomBetween(10, 20);
                }

                break;
            }

            case "boumbo": {
                // Boumbo
                // ------

                if (this.enemies[idx].explodeTime == 0) {
                    // Boumbo vient d'atterir sur une plateforme. Il continue tranquillement
                    // sa petite promenade.
                    if (this.enemies[idx].direction == "left") {
                        this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                    } else if (this.enemies[idx].direction == "right") {
                        this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                    }
                }

                break;
            }

            case "voletta":
            case "bigvoletta": {
                // Voletta & Big Voletta
                // ---------------------

                if (afterHit) {
                    // Voletta vient de reprendre ses esprits, on définit dans quelle
                    // direction elle doit se diriger.
                    this.enemies[idx].vy = -Constants.ENEMY_VELOCITY;
                    if (this.enemies[idx].direction == "left") {
                        this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                    } else if (this.enemies[idx].direction == "right") {
                        this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                    }
                }

                break;
            }

            case "blobule": {
                // Blobule
                // -----

                if (afterHit) {
                    // Blobule vient de reprendre ses esprits, on définit dans quelle
                    // direction il doit se diriger.
                    this.enemies[idx].vy = -Constants.ENEMY_VELOCITY;
                    if (this.enemies[idx].direction == "left") {
                        this.enemies[idx].vx = -Constants.ENEMY_VELOCITY;
                    } else if (this.enemies[idx].direction == "right") {
                        this.enemies[idx].vx = Constants.ENEMY_VELOCITY;
                    }
                }

                break;
            }
        }
    },

    // Gestion des éclairs
    // ===================

    throwFlash: function(direction, x, y, vx, vy) {
        // Créé un éclair. Celui-ci va se déplacer vers la gauche ou vers la droite, en
        // fonction de la direction de l'ennemi.
        this.flashes.push({
            x: x,
            y: y,
            vx: (Constants.FLASH_SPEED * vx),
            vy: (Constants.FLASH_SPEED * vy),
            w: 16,
            h: 16,
            direction: direction,
            destroyed: false,
        });
    },
});
