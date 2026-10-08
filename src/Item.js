import App from "@/App.js";
import Constants from "@/Constants.js";
import Data from "@/Data.js";
import Effect from "@/Effect.js";
import Enemy from "@/Enemy.js";
import Graphics from "@/Graphics.js";
import Player from "@/Player.js";
import Sound from "@/Sound.js";
import Stage from "@/Stage.js";
import Utils from "@/Utils.js";

import sprItems from "@assets/img/items.png";
import sprFood from "@assets/img/food.png";
import sprBomb from "@assets/img/bomb.png";
import sprStars from "@assets/img/stars.png";

import sndDiamond from "@assets/snd/diamond.ogg";
import sndItem from "@assets/snd/item.ogg";
import sndCollect from "@assets/snd/collect.ogg";
import sndFood from "@assets/snd/food.ogg";
import sndStageClear from "@assets/snd/stageclear.ogg";
import sndBall from "@assets/snd/ball.ogg";
import sndTeleport from "@assets/snd/teleport.ogg";

/* Ce fichier impélemente toutes les fonctions permettant de gérer les items comme les
 * bonus ou la nourriture.
 */
export default ({
    // Variables
    // =========

    imgItems: null,
    imgFood: null,
    imgStars: null,
    imgBomb: null,

    sndDiamond: null,
    sndItem: null,
    sndCollect: null,
    sndFood: null,
    sndStageClear: null,
    sndBall: null,
    sndTeleport: null,

    items: [],
    currentTime: 0,
    currentAnimTime: 0,
    animCycle: 0,

    scepterCreated: false,
    chestCreated: false,
    blueRingCreated: false,
    redRingCreated: false,

    balls: [],

    // Fonctions
    // =========

    init: async function() {
        // Chargement des ressources.
        this.imgItems = await Graphics.loadAsset(sprItems);
        this.imgFood = await Graphics.loadAsset(sprFood);
        this.imgStars = await Graphics.loadAsset(sprStars);
        this.imgBomb = await Graphics.loadAsset(sprBomb);

        this.sndDiamond = await Sound.loadAsset(sndDiamond);
        this.sndItem = await Sound.loadAsset(sndItem);
        this.sndCollect = await Sound.loadAsset(sndCollect);
        this.sndFood = await Sound.loadAsset(sndFood);
        this.sndStageClear = await Sound.loadAsset(sndStageClear);
        this.sndBall = await Sound.loadAsset(sndBall);
        this.sndTeleport = await Sound.loadAsset(sndTeleport);
    },
    create: function(type, x = 0, y = 0, vx = 0, vy = 0) {
        let itemType = type;

        if (!Stage.sandboxMode) {
            if (type == Constants.ITEM_RANDOM && Stage.number <= 2) {
                // On ne créé aucun item dans les tous premiers niveaux.
                return;
            }
        }

        if (type == Constants.ITEM_FOOD) {
            // Détermine quelle denrée nous allons créer. Les denrées alimentaires redonnent un peu
            // d'énergie au joueur.
            itemType = Utils.randomBetween(Constants.ITEM_CHERRY, Constants.ITEM_WATERMELON);
        } else if (type == Constants.ITEM_RANDOM) {
            // Détermine quel item nous allons créer.
            itemType = Utils.randomBetween(Constants.ITEM_HEART, Constants.ITEM_UMBRELLA);
        } else if (type == Constants.ITEM_DIAMOND) {
            // Détermine quel couleur de diamant nous allons créer.
            itemType = Utils.randomBetween(Constants.ITEM_PURPLE_DIAMOND, Constants.ITEM_ORANGE_DIAMOND);
        } else if (type == Constants.ITEM_BONUS_GEM) {
            // Détermine quel couleur de diamant nous allons créer.
            itemType = Utils.randomBetween(Constants.ITEM_BONUS_GEM1, Constants.ITEM_BONUS_GEM5);
        } 

        if (itemType == Constants.ITEM_POTION && App.settings.invincibility) {
            // On ne créé pas de potion magique si le joueur a activé l'invincibilité permanente dans le
            // menu de triche
            return;
        }

        if (itemType == Constants.ITEM_BOMB && Player.maxBombs >= Constants.MAX_BOMBS) {
            // On ne créé pas de nouvelle bombe si le joueur peut en poser le maximum.
            return;
        }

        if (itemType == Constants.ITEM_UMBRELLA) {
            if (Stage.number <= 4) {
                // On ne créé pas de parapluie dans tous les premiers niveaux.
                return;
            } else if (Stage.number >= 22 && Stage.number <= 24) {
                // On ne créé pas de parapluie avant le premier boss.
                return;
            } else if (Stage.number >= 47 && Stage.number <= 49) {
                // On ne créé pas de parapluie avant le second boss.
                return;
            } else if (Stage.number >= 72 && Stage.number <= 74) {
                // On ne créé pas de parapluie avant le troisième boss.
                return;
            } else if (itemType == Constants.ITEM_UMBRELLA && Stage.number >= (Data.stages.length - 10)) {
                // On ne créé pas de parapluie dans tous les derniers niveaux, sinon on va avoir
                // un souci.
                return;
            } else if (Stage.testMode || App.demo) {
                // On ne créé pas de parapluie non plus en mode test, ni en mode démo.
                return;
            }
        }

        if (itemType == Constants.ITEM_REMOTE && Player.hasRemote) {
            // On ne créé pas de télécommande si le joueur l'a déjà.
            return;
        }

        if (itemType == Constants.ITEM_RED_SCEPTER || itemType == Constants.ITEM_BLUE_SCEPTER) {
            if (this.scepterCreated) {
                // Il y a déjà eu un sceptre de créé dans ce niveau. On n'en recrée pas d'autre.
                return;
            } else {
                this.scepterCreated = true;
            }
        }

        if (itemType == Constants.ITEM_CHEST) {
            if (this.chestCreated || this.diamondsRain) {
                // Il y a déjà eu un coffre de créé dans ce niveau. On n'en recrée pas d'autre.
                return;
            } else {
                this.chestCreated = true;
            }
        }

        if (itemType == Constants.ITEM_BLUE_RING) {
            if (this.blueRingCreated) {
                // Il y a déjà eu une bague anti-monstres de créé dans ce niveau. On n'en recrée
                // pas d'autre.
                return;
            } else {
                this.blueRingCreated = true;
            }
        }

        if (itemType == Constants.ITEM_RED_RING) {
            if (this.redRingCreated) {
                // Il y a déjà eu une bague anti-bombes de créé dans ce niveau. On n'en recrée 
                // pas d'autre.
                return;
            } else {
                this.redRingCreated = true;
            }
        }

        // Créé l'item.
        this.items.push({
            x: x,
            y: y,
            w: 16,
            h: 16,
            dx: 0,
            dy: 0,
            vx: (vx * Constants.ITEM_VELOCITY),
            vy: (vy * Constants.ITEM_VELOCITY),
            type: itemType,
            lifeTime: 0,
            destroyed: false,
            grounded: false,
            noGravity: false,
            falling: false,
            ready: false,
        });

        // Joue un son.
        Sound.play(this.sndItem);
    },
    createDiamond: function(x, y, noDelay = false) {
        // Détermine quel couleur de diamant que nous allons créer.
        let itemType = Utils.randomBetween(Constants.ITEM_PURPLE_DIAMOND, Constants.ITEM_ORANGE_DIAMOND);

        // Créé le diamant.
        let delay = (noDelay ? 1 : (250 + Utils.randomBetween(100, 250)));
        setTimeout(function() {
            this.items.push({
                x: (x * 8),
                y: (y * 8),
                w: 16,
                h: 16,
                dx: 0,
                dy: 0,
                vx: 0,
                vy: 0,
                type: itemType,
                lifeTime: 0,
                destroyed: false,
                grounded: false,
                noGravity: true,
                falling: false,
                ready: true,
            });
        }.bind(this), delay);
    },
    createFalling: function(type) {
        let itemType = type;

        // Détermine quel couleur de diamant.
        if (type == Constants.ITEM_RANDOM) {
            // Détermine quel item nous allons créer.
            itemType = Utils.randomBetween(Constants.ITEM_HEART, Constants.ITEM_BONUS_GEM5);
        } else if (type == Constants.ITEM_DIAMOND) {
            // Détermine quel couleur de diamant nous allons créer.
            itemType = Utils.randomBetween(Constants.ITEM_PURPLE_DIAMOND, Constants.ITEM_ORANGE_DIAMOND);
        } else if (type == Constants.ITEM_BONUS_GEM) {
            // Détermine quel couleur de diamant nous allons créer.
            itemType = Utils.randomBetween(Constants.ITEM_BONUS_GEM1, Constants.ITEM_BONUS_GEM5);
        } 

        if (itemType == Constants.ITEM_POTION && App.settings.invincibility) {
            // On ne créé pas de potion magique si le joueur a activé l'invincibilité permanente dans le
            // menu de triche
            itemType = Constants.ITEM_HOURGLASS;
        }

        if (itemType == Constants.ITEM_BOMB && Player.maxBombs >= Constants.MAX_BOMBS) {
            // On ne créé pas de nouvelle bombe si le joueur peut en poser le maximum.
            itemType = Constants.ITEM_HEART;
        }

        if (itemType == Constants.ITEM_UMBRELLA) {
            if (Stage.number <= 4) {
                // On ne créé pas de parapluie dans tous les premiers niveaux.
                itemType = Constants.ITEM_HOURGLASS;
            } else if (Stage.number >= 22 && Stage.number <= 24) {
                // On ne créé pas de parapluie avant le premier boss.
                itemType = Constants.ITEM_HOURGLASS;
            } else if (Stage.number >= 47 && Stage.number <= 49) {
                // On ne créé pas de parapluie avant le second boss.
                itemType = Constants.ITEM_HOURGLASS;
            } else if (Stage.number >= 72 && Stage.number <= 74) {
                // On ne créé pas de parapluie avant le troisième boss.
                itemType = Constants.ITEM_HOURGLASS;
            } else if (Stage.number >= (Data.stages.length - 10)) {
                // On ne créé pas de parapluie dans tous les derniers niveaux, sinon on va avoir
                // un souci.
                itemType = Constants.ITEM_HEART;
            } else if (Stage.testMode) {
                // On ne créé pas de parapluie non plus en mode test.
                itemType = Constants.ITEM_HEART;
            }
        }

        if (itemType == Constants.ITEM_REMOTE && Player.hasRemote) {
            // On ne créé pas de télécommande si le joueur l'a déjà.
            itemType = Constants.ITEM_HEART;
        }

        if (itemType == Constants.ITEM_RED_SCEPTER || itemType == Constants.ITEM_BLUE_SCEPTER) {
            if (this.scepterCreated) {
                // Il y a déjà eu un sceptre de créé dans ce niveau. On n'en recrée pas d'autre.
                itemType = Constants.ITEM_HOURGLASS;
            } else {
                this.scepterCreated = true;
            }
        }

        if (itemType == Constants.ITEM_CHEST) {
            if (this.chestCreated || this.diamondsRain) {
                // Il y a déjà eu un coffre de créé dans ce niveau. On n'en recrée pas d'autre.
                itemType = Constants.ITEM_HEART;
            } else {
                this.chestCreated = true;
            }
        }

        if (itemType == Constants.ITEM_BLUE_RING) {
            if (this.blueRingCreated) {
                // Il y a déjà eu une bague anti-monstres de créé dans ce niveau. On n'en recrée
                // pas d'autre.
                itemType = Constants.ITEM_HOURGLASS;
            } else {
                this.blueRingCreated = true;
            }
        }

        if (itemType == Constants.ITEM_RED_RING) {
            if (this.redRingCreated) {
                // Il y a déjà eu une bague anti-bombes de créé dans ce niveau. On n'en recrée 
                // pas d'autre.
                itemType = Constants.ITEM_HOURGLASS;
            } else {
                this.redRingCreated = true;
            }
        }

        // Détermine sur quelle plateforme l'item va atterir.
        let platforms = Stage.platforms.filter((platform) => (platform.enabled && (platform.type == "floor" || platform.type == "platform" || platform.type == "hiddenplatform" || platform.type == "crate") && platform.th == 1));
        if (platforms.length > 0) {
            let idx = Utils.randomBetween(0, (platforms.length - 1));
            let item = {
                x: 0,
                y: 0,
                w: 16,
                h: 16,
                dx: 0,
                dy: 0,
                vx: 0,
                vy: (0.5 * Constants.ITEM_VELOCITY),
                type: itemType,
                lifeTime: 0,
                destroyed: false,
                grounded: false,
                noGravity: false,
                falling: true,
                ready: false,
            };

            do {
                let positionOK = true;

                // Choisit une position au hasard.
                let dx = Utils.randomBetween(platforms[idx].tx, (platforms[idx].tx + platforms[idx].tw - 2));
                let dy = (platforms[idx].ty - 2);

                item.x = (dx * 8);
                item.y = (dy * 8);
                item.dx = (dx * 8);
                item.dy = (dy * 8);

                // Vérifie si cette position n'est pas occupée par une caisse en bois ou une
                // plateforme.
                for (let platform of Stage.platforms) {
                    if (Utils.isOverlapping(item, platform)) {
                        // Cette position est occupée par une caisse en bois ou une plateforme. 
                        // On ne créé donc pas d'item à cet endroit.
                        positionOK = false;
                    }
                }

                if (!positionOK) {
                    continue;
                }
            } while (false);

            // Créé le diamant.
            item.y = -16;
            this.items.push(item);
        }
    },
    createBall: function(x, y) {
        // Créé une balle magique qui va rebondir partout dans le niveau. Cette balle a la particularité
        // d'éliminer tout monstre entrant en contact avec elle.
        let i = Utils.randomBetween(1, 2);
        this.balls.push({
            x: x,
            y: y,
            w: 16,
            h: 16,
            vx: (i == 1 ? -0.5 : 0.5) * Constants.BALL_VELOCITY,
            vy: (-0.5 * Constants.BALL_VELOCITY),
            destroyed: false,
        });
    },
    createDiamondsRain: function() {
        // Créé une pluie de diamants. 
        for (let i = 0; i < Constants.MAX_DIAMONDS_RAIN; i++) {
            setTimeout(function() {
                // Créé un joyau qui va tomber du ciel vers une plateforme.
                this.createFalling(Constants.ITEM_DIAMOND);
            }.bind(this), (i * 125));
        }
    },
    destroy: function() {
        // Vide la liste des items.
        this.items = [];

        // Vide la liste des boules d'énergie.
        this.balls = [];

        // Réinitialise certaines variables.
        this.scepterCreate = false;
        this.chestCreated = false;
        this.blueRingCreated = false;
        this.redRingCreated = false;
    },
    pickUp: function(item) {
        let idx = this.items.indexOf(item);
        if (idx >= 0) {
            if (this.items[idx].ready) {
                // Créé un effet visuel qui illustre le fait que l'item a été collecté.
                let i = Utils.randomBetween(1, 2);
                Effect.createItem(this.items[idx].x, this.items[idx].y, this.items[idx].type);

                // Traitement de l'item.
                switch (this.items[idx].type) {
                    // Diamants et joyaux
                    // ==================

                    case Constants.ITEM_PURPLE_DIAMOND: 
                    case Constants.ITEM_GREEN_DIAMOND:
                    case Constants.ITEM_BLUE_DIAMOND:
                    case Constants.ITEM_ORANGE_DIAMOND: {
                        // Diamant coloré
                        // --------------

                        // Le joueur vient de ramasser un diamant.
                        Player.diamonds++;
                        if (Player.diamonds > Constants.MAX_DIAMONDS_PER_STAGE) {
                            Player.diamonds = Constants.MAX_DIAMONDS_PER_STAGE;
                        }
                        Player.totalDiamonds++;
                        if (Player.diamonds > Constants.MAX_DIAMONDS) {
                            Player.diamonds = Constants.MAX_DIAMONDS;
                        }

                        if (Stage.diamondsLeft > 0) {
                            Stage.diamondsLeft--;
                            if (Stage.diamondsLeft == 0) {
                                // Tous les diamants ont été récoltés, les monstres qui restent à l'écran
                                // sont éliminés automatiquement.
                                Enemy.killAll("heart");

                                // Fait scintiller le fond de l'écran.
                                Effect.twinkle();

                                // Le niveau est terminé.
                                Effect.createText(this.items[idx].x + 16, this.items[idx].y, "STAGE\nCLEAR!");

                                // Joue un son.
                                Sound.play(this.sndStageClear);

                                // Supprime tous les items présents à l'écran, sauf les diamants et la bouffe.
                                this.removeItems();

                                // Si le joueur est invincible, il ne l'est plus.
                                Player.isInvincible = false;
                                Player.data.invincibleTimer = 0;
                            } else {
                                // Un diamant rapporte 1000 points.
                                Stage.score += 1000;
                                Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");
                            }
                        } else {
                            // Tout diamant supplémentaire récolté rapporte 1000 points.
                            Stage.score += 1000;
                            Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");
                        }

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }

                        // Joue un son.
                        Sound.play(this.sndDiamond);

                        break;
                    }

                    case Constants.ITEM_BONUS_GEM1:
                    case Constants.ITEM_BONUS_GEM2:
                    case Constants.ITEM_BONUS_GEM3:
                    case Constants.ITEM_BONUS_GEM4:
                    case Constants.ITEM_BONUS_GEM5: {
                        // Pierres précieuses
                        // ------------------

                        if (!Stage.isBonusLevel) {
                            // Le joueur vient de ramasser une pierre précieuse avec une lettre dessus.
                            // Il y a 5 pierres à récolter. Une fois réunies, ces pierres forment
                            // le mot "MEAOW" et déclenchent une pluie de diamants-chat.
                            let idx2 = (this.items[idx].type - Constants.ITEM_BONUS_GEM1);
                            Stage.specialGems[idx2] = true;

                            // Vérifie si le joueur a collecté les 5 pierres.
                            let allCollected = true;
                            for (let i = 0; i < 5; i++) {
                                if (!Stage.specialGems[i]) {
                                    allCollected = false;
                                }
                            }

                            if (allCollected) {
                                // Les 5 pierres ont été récoltées. Le joueur voit la capacité de sa barre d'énergie augmenter d'un coeur.
                                if (Player.maxEnergy <= Constants.MAX_ENERGY) {
                                    Player.maxEnergy += 2;
                                    Player.energy = Player.maxEnergy;
                                }

                                return;
                            }

                            // Joue un son.
                            Sound.play(this.sndCollect);

                            // Un diamant rapporte 2000 points.
                            Stage.score += 2000;
                            Effect.createText(this.items[idx].x + 16, this.items[idx].y, "2000");

                            if (Stage.score > Constants.MAX_SCORE) {
                                Stage.score = Constants.MAX_SCORE;
                            }
                        }

                        break;
                    }

                    // Bonus
                    // =====

                    case Constants.ITEM_HEART: {
                        // Coeur
                        // -----

                        // Le coeur apporte 1 point d'énergie au joueur.
                        if (Player.energy < Player.maxEnergy) {
                            Player.energy += 2;
                            if (Player.energy > Player.maxEnergy) {
                                Player.energy = Player.maxEnergy;
                            }
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_HOURGLASS: {
                        // Sablier
                        // -------

                        // Le sablier ajoute quelques précieuses secondes au compteur du chronomètre.
                        let i = Utils.randomBetween(1, 4);
                        if (i == 1) {
                            // Ajoute 45 secondes au compteur.
                            Stage.time += 45;
                            Effect.createText(this.items[idx].x + 16, this.items[idx].y, "+45\nSECONDS");
                        } else if (i == 2) {
                            // Ajoute 30 secondes au compteur.
                            Stage.time += 30;
                            Effect.createText(this.items[idx].x + 16, this.items[idx].y, "+30\nSECONDS");
                        } else if (i == 3) {
                            // Ajoute 15 secondes au compteur.
                            Stage.time += 15;
                            Effect.createText(this.items[idx].x + 16, this.items[idx].y, "+15\nSECONDS");
                        } else {
                            // Ajoute 20 secondes au compteur.
                            Stage.time += 20;
                            Effect.createText(this.items[idx].x + 16, this.items[idx].y, "+20\nSECONDS");
                        }

                        if (Stage.time >= Constants.MAX_TIME) {
                            Stage.time = Constants.MAX_TIME;
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_POTION: {
                        // Potion magique
                        // --------------

                        // La potion rend le joueur invincible pendant un court laps de temps.
                        Player.isInvincible = true;
                        Player.data.invincibleTimer = (Constants.INVINCIBLE_TIME * 8);
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "MAGIC\nPOTION");

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_RED_RING: {
                        // Bague anti-explosion
                        // --------------------

                        // Le joueur obtient une bague qui va le protéger des explosions. Cette protection
                        // reste active jusqu'au niveau suivant.
                        Player.bombShield = true;

                        // Ce bonus rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_BLUE_RING: {
                        // Bague anti-monstres
                        // -------------------

                        // Le joueur obtient une bague qui va le protéger des attaques des monstres. Cette
                        // protection reste active jusqu'au niveau suivant.
                        Player.enemyShield = true;

                        // Ce bonus rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_REMOTE: {
                        // Télécommande
                        // ------------

                        // Le joueur obtient une télécommande qui va lui permettre de déclencher manuellement
                        // l'explosion des bombes. Cette protection reste active pendant toute la partie.
                        Player.hasRemote = true;

                        // Ce bonus rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_BOMB: {
                        // Bombe supplémentaire
                        // --------------------

                        // Le joueur obtient une bombe supplémentaire. Cela veut dire qu'il pourra en poser
                        // simultanément une nouvelle, sans attendre que la ou les précédentes bombes
                        // n'explosent.
                        Player.maxBombs++;
                        if (Player.maxBombs > Constants.MAX_BOMBS) {
                            Player.maxBombs = Constants.MAX_BOMBS;
                        }

                        // Ce bonus rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_UMBRELLA: {
                        // Parapluie
                        // ---------

                        // Le joueur vient de récolter un parapluie. Celui-ci le transporte 3 niveaux plus
                        // loin. 
                        if (Stage.number < (Data.stages.length - 4)) {
                            Effect.createText(this.items[idx].x, this.items[idx].y, "+3\nLEVELS");

                            // Prépare le joueur à rentrer dans sa bulle.
                            App.px = Player.data.x;
                            App.py = Player.data.y;
                            App.pmovedx = false;
                            App.pmovedy = false;
                            
                            // On passe tout de suite au niveau suivant.
                            Stage.stagesToPass = 2;
                            Stage.next();

                            // Joue deux sons.
                            Sound.play(this.sndCollect);
                            Sound.play(this.sndTeleport);

                            return;
                        }

                        break;
                    }

                    case Constants.ITEM_CHEST: {
                        // Coffre de diamants
                        // ------------------

                        // Le coffre fera apparaître une pluie de diamants quand tous les diamants nécessaires
                        // pour finir le niveau auront été récoltés.
                        Stage.diamondsRain = true;

                        // Le coffre rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_BLUE_SCEPTER: {
                        // Sceptre magique du tonnerre
                        // ---------------------------

                        // Ce sceptre magique, une fois récolté, fait trembler l'écran et élimine tous les
                        // monstres présents.
                        Enemy.killAll("food");

                        // Fait trembler et scintiller l'écran.
                        Effect.shake();
                        Effect.twinkle();

                        // Ce sceptre rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    case Constants.ITEM_RED_SCEPTER: {
                        // Sceptre magique de feu
                        // ----------------------

                        // Ce sceptre, une fois récoltée, créé une boule d'énergie qui va rebondir partout
                        // dans le niveau. Cette boule d'énergie est capable d'éliminer tous les monstres présents
                        // dans le niveau.
                        this.createBall(this.items[idx].x, this.items[idx].y);

                        // Ramasser un anneau bleu rapporte 1000 points.
                        Stage.score += 1000;
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "1000");

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }

                        // Joue un son.
                        Sound.play(this.sndCollect);

                        break;
                    }

                    // Divers
                    // ======

                    case Constants.ITEM_CHERRY:
                    case Constants.ITEM_APPLE:
                    case Constants.ITEM_RED_MUSHROOM:  
                    case Constants.ITEM_CARROT:
                    case Constants.ITEM_PEER: 
                    case Constants.ITEM_GREEN_MUSHROOM:
                    case Constants.ITEM_STRAWBERRY:
                    case Constants.ITEM_GRAPE:  
                    case Constants.ITEM_PEPPER:
                    case Constants.ITEM_ORANGE:
                    case Constants.ITEM_LEMON:
                    case Constants.ITEM_WATERMELON: {
                        // Nourriture
                        // ----------

                        // La nourriture apporte 100 points supplémentaire.
                        Stage.score += 100;
                        Effect.createText(this.items[idx].x + 16, this.items[idx].y, "100");

                        if (Stage.score > Constants.MAX_SCORE) {
                            Stage.score = Constants.MAX_SCORE;
                        }
                        
                        // Pour regagner un point d'énergie, il suffit juste de manger 5 fruits et/ou légumes
                        // de suite.
                        Player.food++;
                        if (Player.food > 5) {
                            Player.food = 0;
                            if (Player.energy < Constants.MAX_ENERGY) {
                                Player.energy++;
                            }
                        }

                        // Joue un son.
                        Sound.play(this.sndFood);

                        break;
                    }

                    default: {
                        // L'item est inconnu.
                        break;
                    }
                }

                // L'item a été ramassé par le joueur. Il disparaît de l'écran.
                this.items[idx].destroyed = true;
            }
        }
    },
    removeItems: function() {
        // Retire tous les bonus de l'écran.
        for (let idx in this.items) {
            if (!this.items[idx].destroyed && this.items[idx].type >= Constants.ITEM_HOURGLASS && this.items[idx].type <= Constants.ITEM_UMBRELLA) {
                this.items[idx].destroyed = true;
            }
        }

        // Retire toutes les boules d'énergie.
        this.balls = [];
    },
    draw: function(dt) {
        // Dessine les boules d'énergie.
        for (let ball of this.balls) {
            if (ball.destroyed) {
                continue;
            }

            // Dessine la boule d'énergie.
            let sx = 16;
            if (this.animCycle == 1 || this.animCycle == 3) {
                sx = 0;
            } else if (this.animCycle == 2) {
                sx = 32;
            }
            Graphics.drawImagePart(this.imgBomb, ball.x, ball.y, sx, 48, 16, 16);
        }

        // Dessine les items.
        for (let item of this.items) {
            if (!item.destroyed) {
                if (item.ready) {
                    // Est-ce qu'on doit dessiner un item ou de la nourriture.
                    let itemType = item.type, isFood = false;
                    if (itemType >= Constants.ITEM_CHERRY) {
                        // On doit dessiner de la nourriture.
                        itemType -= (Constants.ITEM_CHERRY - 1);
                        isFood = true;
                    }

                    // Dessine l'item.
                    let x = (((itemType - 1) % 4) * 16);
                    let y = ((Math.ceil(itemType / 4) - 1) * 16);
                    if (isFood) {
                        Graphics.drawImagePart(this.imgFood, item.x, item.y, x, y, 16, 16);
                    } else {
                        Graphics.drawImagePart(this.imgItems, item.x, item.y, x, y, 16, 16);
                    }
                } else {
                    // L'item n'étant pas encore tombé, on ignore ce que c'est. On dessine à la place
                    // une étoile qui tourne et qui scintille.
                    let x = (this.animCycle * 16);
                    Graphics.drawImagePart(this.imgStars, item.x, item.y, x, 0, 16, 16);
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

        // Gestion du cycle de vie des items
        // ---------------------------------

        if (time > this.currentTime) {
            this.currentTime = (1000 + time);

            // Décrémente le compteur de chaque item.
            for (let idx in this.items) {
                if (this.items[idx].ready && !this.items[idx].destroyed && this.items[idx].lifeTime > 0) {
                    // Décrémente le compteur.
                    this.items[idx].lifeTime--;

                    // L'item est détruit si le compteur atteint 0.
                    if (this.items[idx].lifeTime === 0) {
                        this.items[idx].destroyed = true;
                    }
                }
            }
        }

        // Gestion des boules d'énergies
        // -----------------------------

        for (let idx in this.balls) {
            if (this.balls[idx].destroyed) {
                continue;
            }

            // Préparatifs pour la détection de collisions
            // -------------------------------------------

            let shapeTop = { x: this.balls[idx].x + 2, y: this.balls[idx].y, w: 12, h: 2, vx: 0, vy: 0 };
            let shapeBottom = { x: this.balls[idx].x + 2, y: this.balls[idx].y + this.balls[idx].h - 1, w: 12, h: 2, vx: 0, vy: 0 };
            let shapeLeft = { x: this.balls[idx].x, y: this.balls[idx].y + 2, w: 2, h: 12, vx: 0, vy: 0 };
            let shapeRight = { x: this.balls[idx].x + this.balls[idx].w - 1, y: this.balls[idx].y + 2, w: 2, h: 12, vx: 0, vy: 0 };

            // Gestion des rebonds sur les murs
            // --------------------------------

            // Vérifie si la boule d'énergie entre en collision avec un mur ou une plateforme.
            for (let platform of Stage.platforms) {
                if (!platform.enabled) {
                    continue;
                }

                // Détecte une collision sous ou au-dessus de la boule d'énergie.
                if ((this.balls[idx].vy > 0 && Utils.isOverlapping(shapeBottom, platform)) || (this.balls[idx].vy < 0 && Utils.isOverlapping(shapeTop, platform))) {
                    // La collision a eu lieu en haut ou en bas du mur. La boule d'énergie 
                    // va tout simplement dans la direction opposée.
                    this.balls[idx].vy *= -1;

                    // Joue un son.
                    Sound.play(this.sndBall);
                }

                // Détecte une collision de chaque côté du joueur.
                if ((this.balls[idx].vx < 0 && Utils.isOverlapping(shapeLeft, platform)) || (this.balls[idx].vx > 0 && Utils.isOverlapping(shapeRight, platform))) {
                    // La collision a eu lieu à gauche ou à droite du mur. La boule d'énergie 
                    // va tout simplement dans la direction opposée.
                    this.balls[idx].vx *= -1;
                    
                    // Joue un son.
                    Sound.play(this.sndBall);
                }
            }

            // Gestion des collisions sur les ennemis
            // --------------------------------------

            for (let enemy of Enemy.enemies) {
                if (!enemy.killed) {
                    // Vérifie si il y a eu collision entre la boule d'énergie et le monstre.
                    if (Utils.isOverlapping(this.balls[idx], enemy)) {
                        // La collision a bien eu lieu entre la boule d'énergie et le monstre, ce dernier est éliminé.
                        let i = Utils.randomBetween(1, 2);
                        Enemy.kill((i == 1 ? "left" : "right"), enemy, "food");

                        if (Enemy.enemiesLeft == 0) {
                            // Il n'y a plus de monstres présents dans le niveau. La boule d'énergie disparait.
                            this.balls[idx].destroyed = true;
                        }

                        break;
                    }
                }
            }

            // Déplacement de la boule d'énergie
            // ---------------------------------

            // Fait déplacer la boule d'énergie.
            this.balls[idx].x += (this.balls[idx].vx * dt);
            this.balls[idx].y += (this.balls[idx].vy * dt);

            // Vérifie si la boule d'énergie tombe et sort de l'écran.
            if (this.balls[idx].y > Constants.CANVAS_HEIGHT) {
                // La boule d'énergie réapparait en haut de l'écran.
                this.balls[idx].y = -16;
            }

            // Même chose dans l'autre sens, si la boule d'énergie s'envole au-delà de l'écran, elle réapparait
            // tout de suite en bas de l'écran.
            if (this.balls[idx].y < -16) {
                this.balls[idx].y = Constants.CANVAS_HEIGHT;
            }
        }

        // Retire de la liste les boules d'énergie qui ont disparu suite à l'élimination de tous
        // les monstres.
        this.balls = this.balls.filter((ball) => !ball.destroyed);

        // Apparition des items
        // --------------------

        for (let idx in this.items) {
            if (!this.items[idx].noGravity && !this.items[idx].destroyed) {
                // L'item a l'apparence d'une étoile tournante et scintillante. Il est soumis à la
                // gravité. Dès que cet item atterit sur une plateforme, l'item sera divulgé.

                // Préparatifs pour la détection de collisions
                // -------------------------------------------

                let shapeBottom = { x: this.items[idx].x + 2, y: this.items[idx].y + this.items[idx].h - 1, w: 12, h: 2, vx: 0, vy: 0 };
                let shapeLeft = { x: this.items[idx].x, y: this.items[idx].y + 2, w: 2, h: 12, vx: 0, vy: 0 };
                let shapeRight = { x: this.items[idx].x + this.items[idx].w - 1, y: this.items[idx].y + 2, w: 2, h: 12, vx: 0, vy: 0 };

                // Détection des collisions
                // ------------------------

                for (let platform of Stage.platforms) {
                    if (!platform.enabled) {
                        continue;
                    }

                    if (platform.type != "ceiling" && platform.type != "hiddenceiling") {
                        if (!this.items[idx].falling) {
                            // Détecte une collision de chaque côté de l'item.
                            if ((this.items[idx].vx < 0 && Utils.isOverlapping(shapeLeft, platform)) || (this.items[idx].vx > 0 && Utils.isOverlapping(shapeRight, platform))) {
                                if (platform.type == "edge" || platform.type == "floor" || platform.type == "hiddenfloor" || platform.type == "platform" || platform.type == "hiddenplatform" || platform.type == "crate") {
                                    if ((this.items[idx].vx > 0 && (this.items[idx].x + this.items[idx].w - 2) < platform.x) || this.items[idx].vx < 0 && this.items[idx].x > (platform.x + platform.w - 2)) {
                                        // La collision a eu lieu à gauche ou à droite de la plateforme. L'item va
                                        // dans la direction opposée.
                                        this.items[idx].vx *= -1;
                                    }
                                }
                            } else {
                                // Détecte une collision sous l'item.
                                if (this.items[idx].vy > 0 && Utils.isOverlapping(shapeBottom, platform)) {
                                    if ((this.items[idx].y + this.items[idx].h - 2) < platform.y) {
                                        // La collision a eu lieu sur un mur ou sur une plateforme. L'item a atteint 
                                        // sa position finale. Il n'en bougera plus.
                                        this.items[idx].vx = 0;
                                        this.items[idx].vy = 0;
                                        this.items[idx].y = platform.y - this.items[idx].h;
                                        this.items[idx].grounded = true;
                                        this.items[idx].ready = true;

                                        if (this.items[idx].type !== Constants.ITEM_PURPLE_DIAMOND && this.items[idx].type !== Constants.ITEM_GREEN_DIAMOND &&
                                            this.items[idx].type !== Constants.ITEM_BLUE_DIAMOND && this.items[idx].type !== Constants.ITEM_ORANGE_DIAMOND) {
                                            // Cet item restera disponible pendant quelques secondes. Après, il
                                            // disparaîtra pour toujours.
                                            this.items[idx].lifeTime = Constants.ITEM_LIFETIME;
                                        }
                                    }
                                } else {
                                    if (this.items[idx].vy > 0) {
                                        this.items[idx].grounded = false;
                                    }
                                }
                            }

                            // On fait en sorte qu'une bombe ne sorte jamais des limites du niveau.
                            if (this.items[idx].x < 16 && this.items[idx].vx < 0) {
                                this.items[idx].x = 16
                                this.items[idx].vx *= -1;
                                this.items[idx].vy = 0;
                            }
                            if (this.items[idx].x > (Constants.CANVAS_WIDTH - 32) && this.items[idx].vx > 0) {
                                this.items[idx].x = (Constants.CANVAS_WIDTH - 32)
                                this.items[idx].vx *= -1;
                                this.items[idx].vy = 0;
                            }
                        }
                    }
                }

                // Applique les paramètres de vélocité de l'item sur sa position. Une valeur
                // positive déplace l'item vers le bas ou la droite, une valeur négative déplace
                // l'item vers le haut ou à gauche.
                this.items[idx].x += (this.items[idx].vx * dt);
                this.items[idx].y += (this.items[idx].vy * dt);

                if (!this.items[idx].falling) {
                    // Gère la gravité de l'item.
                    if (this.items[idx].vy < Constants.ITEM_MAX_VELOCITY) {
                        this.items[idx].vy += (Constants.ITEM_GRAVITY * dt);
                    }

                    // On évite que l'item ne sorte des limites de l'écran.
                    if (this.items[idx].x < 16 || this.items[idx].x > Constants.CANVAS_WIDTH - 16) {
                        this.items[idx].vx *= -1;
                    }

                    // L'item est sur une plateforme, ou vient d'attérir dessus. On fait en sorte
                    // qu'il ne traverse pas cette plateforme.
                    if (this.items[idx].grounded) {
                        this.items[idx].vy = 0;
                    }
                }

                if (!this.items[idx].falling) {
                    // Si l'item sort de l'écran, il n'est pas perdu. Il réapparait tout de suite
                    // en haut.
                    if (this.items[idx].y > Constants.CANVAS_HEIGHT) {
                        this.items[idx].y = -16;
                    }
                } else {
                    // Si l'item atteint sa position finale, il sera dévoilé.
                    if (this.items[idx].y > this.items[idx].dy) {
                        this.items[idx].vy = 0;
                        this.items[idx].y = this.items[idx].dy;
                        this.items[idx].ready = true;
                        this.items[idx].grounded = true;
                        this.items[idx].falling = false;
                    }

                    // Si l'item sort de l'écran, il est perdu.
                    if (this.items[idx].y > Constants.CANVAS_HEIGHT) {
                        this.items[idx].destroyed = true;
                    }
                }
            }
        }

        // Retire les items qui ont été détruit.
        this.items = this.items.filter((item) => !item.destroyed);
    }
});
