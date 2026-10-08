import App from "@/App.js";
import Bomb from "@/Bomb.js";
import Constants from "@/Constants.js";
import Data from "@/Data.js";
import Effect from "@/Effect.js";
import Enemy from "@/Enemy.js";
import Graphics from "@/Graphics.js";
import Item from "@/Item.js";
import Player from "@/Player.js";
import Sound from "@/Sound.js";
import Storage from "@/Storage.js";
import Utils from "@/Utils.js";

import sprTileset from "@assets/img/tileset.png";

import sndNextStage from "@assets/snd/nextstage.ogg";
import sndReady from "@assets/snd/ready.ogg";

export default ({
    // Variables
    // =========

    imgTileset: null,

    sndNextStage: null,
    sndReady: null,

    score: 0,
    highScore: 0,
    time: 0,

    number: 0,
    stagePrevOffset: 0,
    stageNextOffset: 0,
    stageLaunch: false,
    ready: false,
    isBonusLevel: false,
    diamondsRain: false,
    testMode: false,
    sandboxMode: false,
    superMode: false,

    diamondsLeft: 0,
    stagesToPass: 0,

    specialGems: [ false, false, false, false, false ],

    // Configuration du niveau. Ce tableau contient la liste des murs et autres 
    // éléments de décors qui constitue le niveau actuel.
    platforms: [],

    // Configuration du niveau précédent. Ce tableau est uniquement utile pendant
    // la transition d'un niveau à un autre.
    platformsPrev: [],

    // Fonctions
    // =========

    init: async function() {
        // Chargement des ressources.
        this.imgTileset = await Graphics.loadAsset(sprTileset);

        this.sndNextStage = await Sound.loadAsset(sndNextStage);
        this.sndReady = await Sound.loadAsset(sndReady);

        // Chargement du meilleur score.
        this.highScore = 0;
        if (Storage.exists("hiscore")) {
            this.highScore = Storage.read("hiscore");
        }

        if (this.highScore > Constants.MAX_SCORE) {
            this.highScore = Constants.MAX_SCORE;
        }
    },
    showTitle: function() {
        // Affiche le niveau 0 qui correspond à l'écran-titre,
        this.number = 0;
        this.stagePrevOffset = 0,
        this.stageNextOffset = 0,
        this.stageLaunch = false;
        this.isBonusLevel = false;
        this.diamondsRain = false;
        this.ready = true;
        Player.diamonds = 0;
        Player.totalDiamonds = 0;
        this.setup();

        Graphics.resetEffects();
    },
    reset: function(nr = 1, mode = "normal") {
        this.platformsPrev = [];

        // Définit le premier niveau à jouer.
        this.number = nr;

        // En début de partie, il n'y a aucun diamant spécial récolté.
        for (let i = 0; i < 5; i++) {
            this.specialGems[i] = false;
        }

        // Prépare la transition entre le niveau 0 qui correspond à l'écran-titre et 
        // le premier niveau.
        switch (mode) {
            case "sandbox": {
                // Mode bac à sable
                // ----------------

                this.stagePrevOffset = -216;
                this.stageNextOffset = 0;
                this.stageLaunch = false;
                this.testMode = false;
                this.sandboxMode = true;

                break;
            }

            case "test": {
                // Mode de test
                // ------------

                this.stagePrevOffset = -216;
                this.stageNextOffset = 0;
                this.stageLaunch = false;
                this.testMode = true;
                this.sandboxMode = false;

                break;
            }

            case "normal": {
                // Mode normal
                // -----------

                this.stagePrevOffset = 0;
                this.stageNextOffset = 216;
                this.stageLaunch = true;
                this.testMode = false;
                this.sandboxMode = false;

                break;
            }
        }

        this.ready = false;
        this.isBonusLevel = false;
        this.diamondsRain = false;
        this.stagesToPass = 0;
        Player.diamonds = 0;
        Player.totalDiamonds = 0;
        Player.food = 0;
        Player.isInvincible = false;
        this.setup();

        // Joue un son.
        if (mode == "normal") {
            Sound.play(this.sndNextStage);
        }
    },
    next: function(nr = 1) {
        // On supprime tous les items et tous les ennemis qui restent.
        Item.destroy();
        Enemy.destroy();
        Player.destroy();
        Bomb.reset();

        // Vérifie si toutes les pierres précieuses spéciales ont été collectées au
        // niveau précédent.
        let allCollected = true;
        for (let i = 0; i < 5; i++) {
            if (!this.specialGems[i]) {
                allCollected = false;
            }
        }

        if (allCollected) {
            // Tous les pierres précieuses ont été collectées, on réinitialise le tableau qui stockait
            // l'état de chaque pierre.
            for (let i = 0; i < 5; i++) {
                this.specialGems[i] = false;
            }
        }

        // Sauvegarde les éléments de décor du niveau précédent. On en aura besoin
        // pour dessiner une transition parfaite entre le niveau précédent et celui 
        // qui suit.
        this.platformsPrev = [...this.platforms];

        // Passe au prochain niveau.
        this.number += nr;

        // Prépare la transition entre le précédent niveau et le suivant. Une pluie de diamants
        // aura lieu à la fin du dernier niveau.
        this.stagePrevOffset = 0,
        this.stageNextOffset = 216,
        this.stageLaunch = true;
        this.ready = false;
        this.isBonusLevel = false;
        this.diamondsRain = false;
        Player.diamonds = 0;
        Player.isInvincible = false;
        this.setup();

        if (this.stagesToPass == 0) {
            // Joue un son.
            Sound.play(this.sndNextStage);
        }
    },
    setup: function() {
        this.isBonusLevel = false;

        // Définit l'architecture du niveau : le sol, le plafond, les murs de chaque côté, les
        // plateformes.
        this.setupPlatforms(Data.stages[this.number]);

        // Supprime tous les items qui trainent encore à l'écran.
        Item.destroy();

        // Créé les caisses en bois.
        let diamondCrates = 0;
        if ("crates" in Data.stages[this.number]) {
            // Recopie la liste des caisses en bois à placer dans le niveau.
            let crates = [...Data.stages[this.number].crates];

            for (let crate of crates) {
                let itemType = "";

                // Une caisse en bois peut contenir un item bien particulier.
                if ("itemType" in crate) {
                    itemType = crate.itemType;

                    // Comptabilise le nombre de caisses qui contiennent un diamant.
                    if (itemType == Constants.ITEM_DIAMOND || (itemType >= Constants.ITEM_PURPLE_DIAMOND && itemType <= Constants.ITEM_ORANGE_DIAMOND)) {
                        diamondCrates++;
                    }
                }

                // Construit la structure de données de la caisse en bois.
                this.platforms.push({
                    x: (crate.x * 8),
                    y: (crate.y * 8),
                    w: (crate.size == "small" ? 16 : 32),
                    h: (crate.size == "small" ? 16 : 32),
                    tx: crate.x,
                    ty: crate.y,
                    tw: (crate.size == "small" ? 1 : 2),
                    th: (crate.size == "small" ? 1 : 2),
                    vx: 0,
                    vy: 0,
                    type: "crate",
                    size: crate.size,
                    itemType: itemType,
                    grounded: false,
                    enabled: true,
                });
            }
        }

        // S'agit-il d'un niveau bonus ?
        if ("bonus" in Data.stages[this.number]) {
            let isBonus = Data.stages[this.number].bonus;
            if (isBonus) {
                this.isBonusLevel = true;
                this.diamondsRain = false;
                Player.diamonds = 0;

                // Estime le nombre de diamants que le joueur devra récolter en 30 secondes.
                this.diamondsLeft = this.diamonds = this.setupDiamonds(true);
            }
        }

        // Initialise le temps restant.
        this.time = Data.stages[this.number].time;

        if (!this.isBonusLevel) {
            // Détermine le nombre de diamants à récolter pour passer au niveau suivant. Ici, on compte
            // le nombre de monstres à éliminer auquel on additionne le nombre de caisses en bois qui
            // contiennent un diamant.
            this.diamondsLeft = 0;
            for (let enemy of Data.stages[this.number].enemies) {
                this.diamondsLeft += (enemy.type.startsWith("big") ? 4 : 1);
            }
            this.diamondsLeft += diamondCrates;
            if (this.diamondsLeft > Constants.MAX_DIAMONDS_PER_STAGE) {
                this.diamondsLeft = Constants.MAX_DIAMONDS_PER_STAGE;
            }
            this.diamonds = this.diamondsLeft;
        }
    },
    setupBonusLevel: function() {
        this.isBonusLevel = true;
        this.diamondsRain = false;
        Player.diamonds = 0;

        // Supprime tout monstre encore présent à l'écran.
        Enemy.killAll("nothing");

        // Supprime tous les items qui trainent encore à l'écran.
        Item.destroy();

        // Supprime toutes les bombes.
        Bomb.reset();

        // Remplit le niveau de diamants. Le joueur aura 30 secondes pour ramasser le plus de
        // diamants possibles.
        this.diamondsLeft = this.diamonds = this.setupDiamonds();
        this.time = Constants.BONUS_TIME;
    },
    setupDiamonds: function(estimate = false) {
        let diamondsCreated = 0;

        // On remplit le niveau de diamants.
        for (let y = 4; y <= 22; y += 3) {
            for (let x = 2; x <= 32; x += 3) {
                let diamond = { x: (x * 8), y: (y * 8), w: 16, h: 16 };

                // Vérifie si l'emplacement est libre.
                let ok = true;
                for (let platform of this.platforms) {
                    if (Utils.isOverlapping(diamond, platform)) {
                        // L'emplacement est occupé par une plateforme ou une caisse en bois.
                        ok = false;
                    }
                }

                if (ok) {
                    if (!estimate) {
                        // Créé le diamant.
                        Item.createDiamond(x, y);
                    }
                    
                    diamondsCreated++;
                }
            }
        }

        return diamondsCreated;
    },
    setupPlatforms: function(levelData) {
        // Recopie la liste des platformes.
        let platforms = [...levelData.platforms];

        // Rajoute le plafond et le sol dans la liste.
        if (levelData.open) {
            // D'abord, on ajoute le plafond.
            platforms.push({ x: 2, y: 3, w: 8, h: 1, type: "ceiling" });
            platforms.push({ x: 16, y: 3, w: 4, h: 1, type: "ceiling" });
            platforms.push({ x: 26, y: 3, w: 8, h: 1, type: "ceiling" });

            // Ensuite, le sol.
            platforms.push({ x: 2, y: 24, w: 8, h: 1, type: "floor" });
            platforms.push({ x: 16, y: 24, w: 4, h: 1, type: "floor" });
            platforms.push({ x: 26, y: 24, w: 8, h: 1, type: "floor" });

            // Pour éviter que les ennemis volants ne s'échappent pas sur les côtés quand
            // ils passent de bas en haut ou vice-versa, on rajoute des murs invisibles.
            platforms.push({ x: 2, y: -2, w: 8, h: 5, type: "hiddenceiling" });
            platforms.push({ x: 16, y: -2, w: 4, h: 5, type: "hiddenceiling" });
            platforms.push({ x: 26, y: -2, w: 8, h: 5, type: "hiddenceiling" });
            platforms.push({ x: 2, y: 25, w: 8, h: 4, type: "hiddenfloor" });
            platforms.push({ x: 16, y: 25, w: 4, h: 4, type: "hiddenfloor" });
            platforms.push({ x: 26, y: 25, w: 8, h: 4, type: "hiddenfloor" });
        } else {
            // Rajoute le plafond.
            platforms.push({ x: 2, y: 3, w: 32, h: 1, type: "ceiling" });

            // Rajoute le sol.
            platforms.push({ x: 2, y: 24, w: 32, h: 1, type: "floor" });
        }

        // Rajoute le grand mur de gauche.
        platforms.push({ x: 0, y: 0, w: 2, h: 27, type: "edge" });

        // Rajoute le grand mur de droite.
        platforms.push({ x: 34, y: 0, w: 2, h: 27, type: "edge" });

        // Initialise la liste des plateformes.
        this.platforms = [];
        for (let platform of platforms) {
            // Construit la structure de données de la plateforme.
            this.platforms.push({
                x: (platform.x * 8),
                y: (platform.y * 8),
                w: (platform.w * 8),
                h: (platform.h * 8),
                tx: platform.x,
                ty: platform.y,
                tw: platform.w,
                th: platform.h,
                vx: 0,
                vy: 0,
                type: platform.type,
                size: "",
                itemType: "",
                grounded: false,
                enabled: true,
            });
        }
    },
    destroyWoodenCrates: function(x, y) {
        let shape = { x: (x - 8), y: (y - 8), w: 32, h: 32 };

        // Détruit toutes les caisses en bois situés autour de la position spécifiée.
        for (let idx in this.platforms) {
            let platform = this.platforms[idx];
            if (platform.enabled && platform.type == "crate") {
                if (Utils.isOverlapping(shape, platform)) {
                    if (platform.size == "small") {
                        // La petite caisse en bois explose en plusieurs petits morceaux.
                        Effect.createRumble(platform.x, platform.y, -0.25, -1.5);
                        Effect.createRumble(platform.x + 8, platform.y, 0.25, -1.5);
                        Effect.createRumble(platform.x, platform.y + 8, -0.5, -1);
                        Effect.createRumble(platform.x + 8, platform.y + 8, 0.5, -1);

                        if (this.diamondsLeft > 0 && !this.isBonusLevel) {
                            if (platform.itemType) {
                                // Les petites caisses ne peuvent contenir qu'un seul objet. Ici, le type d'objet est 
                                // définit. Dans ce cas, on le créé.
                                let i = Utils.randomBetween(1, 2);
                                Item.create(platform.itemType, this.platforms[idx].x, this.platforms[idx].y, (i == 1 ? -0.5 : 0.5), -1.5);
                            } else {
                                // Les petites caisses ne peuvent contenir qu'un seul objet. On détermine si
                                // on va créer un item ou bien une pierre miaulante.
                                let i = Utils.randomBetween(1, 8);
                                if (i >= 1 && i <= 4) {
                                    let i = Utils.randomBetween(1, 2);
                                    if (Enemy.enemiesLeft > 0) {
                                        // La caisse en bois contient un item.
                                        Item.create(Constants.ITEM_RANDOM, this.platforms[idx].x, this.platforms[idx].y, (i == 1 ? -0.5 : 0.5), -1.5);
                                    } else {
                                        // La caisse en bois contient de la nourriture.
                                        Item.create(Constants.ITEM_FOOD, this.platforms[idx].x, this.platforms[idx].y, (i == 1 ? -0.5 : 0.5), -1.5);
                                    }
                                } else if (i == 5) {
                                    // La caisse en bois contient une pierre miaulante.
                                    let i = Utils.randomBetween(1, 2);
                                    Item.create(Constants.ITEM_BONUS_GEM, this.platforms[idx].x, this.platforms[idx].y, (i == 1 ? -0.5 : 0.5), -1.5);
                                }
                            }
                        }
                    } else if (platform.size == "big") {
                        // La grosse caisse en bois explose en plusieurs petits morceaux.
                        Effect.createRumble(platform.x, platform.y, -0.25, -1.5);
                        Effect.createRumble(platform.x + 12, platform.y, -0.125, -1.6);
                        Effect.createRumble(platform.x + 12, platform.y, 0.125, -1.6);
                        Effect.createRumble(platform.x + 24, platform.y, 0.25, -1.5);
                        Effect.createRumble(platform.x, platform.y + 12, -0.5, -1);
                        Effect.createRumble(platform.x + 12, platform.y + 12, -0.25, -1.1);
                        Effect.createRumble(platform.x + 12, platform.y + 12, 0.25, -1.1);
                        Effect.createRumble(platform.x + 24, platform.y + 12, 0.5, -1);
                        Effect.createRumble(platform.x, platform.y + 24, -0.75, -0.75);
                        Effect.createRumble(platform.x + 12, platform.y + 24, -0.5, -0.85);
                        Effect.createRumble(platform.x + 12, platform.y + 24, 0.5, -0.85);
                        Effect.createRumble(platform.x + 24, platform.y + 24, 0.75, -0.75);

                        if (this.diamondsLeft > 0 && !this.isBonusLevel) {
                            // Les grosses caisses peuvent contenir plusieurs items. On détermine si on va
                            // créer un item, une pierre miaulante, ou bien beaucoup de nourriture.
                            let i = Utils.randomBetween(1, 12);
                            if (i >= 1 && i <= 4) {
                                let i = Utils.randomBetween(1, 2);
                                if (Enemy.enemiesLeft > 0) {
                                    // La caisse en bois contient un item.
                                    Item.create(Constants.ITEM_RANDOM, this.platforms[idx].x, this.platforms[idx].y, (i == 1 ? -0.5 : 0.5), -1.5);
                                } else {
                                    // La caisse en bois contient de la nourriture.
                                    Item.create(Constants.ITEM_FOOD, this.platforms[idx].x, this.platforms[idx].y, (i == 1 ? -0.5 : 0.5), -1.5);
                                }
                            } else if (i == 5) {
                                // La caisse en bois contient une pierre miaulante.
                                let i = Utils.randomBetween(1, 2);
                                Item.create(Constants.ITEM_BONUS_GEM, this.platforms[idx].x, this.platforms[idx].y, (i == 2 ? -0.5 : 0.5), -1.5);
                            } else if (i == 6) {
                                // La caisse en bois est bourrée de nourriture.
                                Item.create(Constants.ITEM_FOOD, this.platforms[idx].x, this.platforms[idx].y, -0.5, -1.5);
                                Item.create(Constants.ITEM_FOOD, this.platforms[idx].x, this.platforms[idx].y, 0.5, -1.5);
                                Item.create(Constants.ITEM_FOOD, this.platforms[idx].x, this.platforms[idx].y, -0.75, -1.25);
                                Item.create(Constants.ITEM_FOOD, this.platforms[idx].x, this.platforms[idx].y, 0.75, -1.25);
                            } 
                        }
                    }

                    // La caisse en bois est détruite.
                    this.platforms[idx].enabled = false;
                }
            }
        }
    },
    drawTile1x1: function(range, x, y, offset = 0) {
        let dx = (x * 8), dy = (y * 8) + offset;
        let r = Math.floor((range - 1) / 2);
        let rx = 16, ry = (r * 16) + 8;

        if ((range - 1) % 2) {
            rx += 24;
        }

        // Dessine la tuile.
        Graphics.drawImagePart(this.imgTileset, dx, dy, rx, ry, 8, 8);
    },
    drawTile2x2: function(range, x, y, offset = 0) {
        let dx = (x * 8), dy = (y * 8) + offset;
        let r = Math.floor((range - 1) / 2);
        let rx = 0, ry = (r * 16);

        if ((range - 1) % 2) {
            rx += 24;
        }

        // Dessine la tuile.
        Graphics.drawImagePart(this.imgTileset, dx, dy, rx, ry, 16, 16);
    },
    drawSpears: function(x, y, w, offset = 0) {
        for (let dx = 0; dx < w; dx++) {
            // Dessine le pic.
            Graphics.drawImagePart(this.imgTileset, ((x + dx) * 8), (y * 8) + offset, 72, 56, 8, 8);
        }
    },
    drawThinPlatform: function(range, x, y, w, h, offset = 0) {
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                this.drawTile1x1(range, x + dx, y + dy, offset);
            }
        }
    },
    drawEdge: function(range, x, y, w, h, offset = 0) {
        for (let dy = 0; dy < h; dy += 2) {
            for (let dx = 0; dx < w; dx += 2) {
                this.drawTile2x2(range, x + dx, y + dy, offset);
            }
        }
    },
    drawBackPlatform: function(x, y, w, h, offset = 0) {
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) { 
                Graphics.drawImagePart(this.imgTileset, ((x + dx) * 8), ((y + dy) * 8) + offset, 64, 48, 8, 8);
            }
        }
    },
    drawBackPillar: function(x, y, w, h, offset = 0) {
        for (let dy = 0; dy < h; dy += 2) {
            for (let dx = 0; dx < w; dx += 2) {
                Graphics.drawImagePart(this.imgTileset, ((x + dx) * 8), ((y + dy) * 8) + offset, 48, 48, 16, 16);
            }
        }
    },
    drawWoodenCrate: function(x, y, offset = 0) {
        Graphics.drawImagePart(this.imgTileset, x, y + offset, 64, 32, 16, 16);
    },
    drawBigWoodenCrate: function(x, y, offset = 0) {
        Graphics.drawImagePart(this.imgTileset, x, y + offset, 48, 0, 32, 32);
    },
    drawBackWoodenCrate: function(x, y, offset = 0) {
        Graphics.drawImagePart(this.imgTileset, (x * 8), (y * 8) + offset, 48, 32, 16, 16);
    },
    drawBackBigWoodenCrate: function(x, y, offset = 0) {
        Graphics.drawImagePart(this.imgTileset, (x * 8), (y * 8) + offset, 48, 64, 32, 32);
    },
    draw: function() {
        // Transition de niveaux
        // ---------------------

        // Récupère les couleurs du niveau actuel.
        let color = Data.stages[this.number].color;

        // Récupère la couleur du niveau précédent.
        let prevColor = 0;
        if (this.number > 1) {
            prevColor = Data.stages[(this.number - 1)].color;
        }

        // En mode "super", les couleurs changent.
        if (this.superMode) {
            color = (Constants.MAX_COLORS - color);
        }
        if (this.superMode && this.number > 1) {
            prevColor = (Constants.MAX_COLORS - prevColor);
        }

        // Pendant la transition de niveaux, on affiche le niveau précédent. Celui-ci
        // est déplacé vers le haut de l'écran pendant que le niveau suivant arrive par
        // le bas de l'écran.

        if (this.stageLaunch && this.number > 1) {
            // Dessine les pilliers en arrière-plan.
            this.drawBackPlatform(2, 10, 8, 1, this.stagePrevOffset);
            this.drawBackPlatform(12, 10, 12, 1, this.stagePrevOffset);
            this.drawBackPlatform(26, 10, 8, 1, this.stagePrevOffset);
            this.drawBackPlatform(2, 20, 8, 1, this.stagePrevOffset);
            this.drawBackPlatform(12, 20, 12, 1, this.stagePrevOffset);
            this.drawBackPlatform(26, 20, 8, 1, this.stagePrevOffset);
            this.drawBackPillar(10, 3, 2, 21, this.stagePrevOffset);
            this.drawBackPillar(24, 3, 2, 21, this.stagePrevOffset);
            this.drawBackWoodenCrate(14, 18, this.stagePrevOffset);
            this.drawBackBigWoodenCrate(16, 16, this.stagePrevOffset);
            this.drawBackWoodenCrate(30, 8, this.stagePrevOffset);
            this.drawBackBigWoodenCrate(18, 6, this.stagePrevOffset);
            this.drawBackBigWoodenCrate(26, 16, this.stagePrevOffset);
            this.drawBackWoodenCrate(3, 18, this.stagePrevOffset);

            // Dessine les limites du niveau.
            this.drawEdge(prevColor, 0, 3, 2, 21, this.stagePrevOffset);
            this.drawEdge(prevColor, 34, 3, 2, 21, this.stagePrevOffset);

            // Dessine les éléments du décor comme les plateformes et les murs, qui constituent le niveau.
            for (let platform of this.platformsPrev) {
                if (!platform.enabled) {
                    continue;
                }

                // Dessine la plateforme.
                if (platform.type == "platform" || platform.type == "fakeplatform") {
                    this.drawThinPlatform(prevColor, platform.tx, platform.ty, platform.tw, platform.th, this.stagePrevOffset);
                }
                if (platform.type == "floor" || platform.type == "ceiling") {
                    this.drawThinPlatform(prevColor, platform.tx, platform.ty, platform.tw, platform.th, this.stagePrevOffset);
                }

                if (platform.type == "crate") {
                    // Il s'agit d'une caisse en bois.
                    if (platform.size == "small") {
                        // Dessine la petite caisse en bois.
                        this.drawWoodenCrate(platform.x, platform.y, this.stagePrevOffset);
                    } else if (platform.size == "big") {
                        // Dessine la grosse caisse en bois.
                        this.drawBigWoodenCrate(platform.x, platform.y, this.stagePrevOffset);
                    }
                }

                if (platform.type == "spear") {
                    // La plateforme est une rangée de pics. 
                    this.drawSpears(platform.tx, platform.ty, platform.tw, this.stagePrevOffset)

                    break;
                }
            }

            // Affiche le numéro du niveau en haut au centre de l'écran.
            Graphics.drawStringNotTiled((17 * 8), (3 * 8) + this.stagePrevOffset, Utils.padZeros((this.number - 1), 2));
        }

        // Affichage du niveau
        // -------------------

        // Dessine l'arrière-plan du niveau, constitué de deux grands pilliers, de deux étagères avec
        // des caisses en bois dessus.
        this.drawBackPlatform(2, 10, 8, 1, this.stageNextOffset);
        this.drawBackPlatform(12, 10, 12, 1, this.stageNextOffset);
        this.drawBackPlatform(26, 10, 8, 1, this.stageNextOffset);
        this.drawBackPlatform(2, 20, 8, 1, this.stageNextOffset);
        this.drawBackPlatform(12, 20, 12, 1, this.stageNextOffset);
        this.drawBackPlatform(26, 20, 8, 1, this.stageNextOffset);
        this.drawBackPillar(10, 3, 2, 21, this.stageNextOffset);
        this.drawBackPillar(24, 3, 2, 21, this.stageNextOffset);
        this.drawBackWoodenCrate(14, 18, this.stageNextOffset);
        this.drawBackBigWoodenCrate(16, 16, this.stageNextOffset);
        this.drawBackWoodenCrate(30, 8, this.stageNextOffset);
        this.drawBackBigWoodenCrate(18, 6, this.stageNextOffset);
        this.drawBackBigWoodenCrate(26, 16, this.stageNextOffset);
        this.drawBackWoodenCrate(3, 18, this.stageNextOffset);

        // Dessine les limites du niveau.
        this.drawEdge(color, 0, 3, 2, 21, this.stageNextOffset);
        this.drawEdge(color, 34, 3, 2, 21, this.stageNextOffset);

        // Dessine les éléments du décor comme les plateformes et les murs, qui 
        // constituent le niveau.
        for (let platform of this.platforms) {
            if (!platform.enabled) {
                continue;
            }

            switch (platform.type) {
                case "platform":
                case "fakeplatform": {
                    // Il s'agit d'une plateforme toute simple. Le joueur peut la traverser
                    // par en dessous.
                    this.drawThinPlatform(color, platform.tx, platform.ty, platform.tw, platform.th, this.stageNextOffset);

                    break;
                }

                case "floor": {
                    // Il s'agit d'un sol. Ce type de mur n'est pas traversable par en-dessous.
                    this.drawThinPlatform(color, platform.tx, platform.ty, platform.tw, platform.th, this.stageNextOffset);

                    break;
                }

                case "ceiling": {
                    // Il s'agit d'un faux mur. Le joueur ne peut pas rentrer en collision avec
                    // ce mur. Il est notamment utilisé pour délimiter le haut du niveau.
                    this.drawThinPlatform(color, platform.tx, platform.ty, platform.tw, platform.th, this.stageNextOffset);

                    break;
                }
                
                case "crate": {
                    // Il s'agit d'une caisse en bois.
                    if (platform.size == "small") {
                        // Dessine la petite caisse en bois.
                        this.drawWoodenCrate(platform.x, platform.y, this.stageNextOffset);
                    } else if (platform.size == "big") {
                        // Dessine la grosse caisse en bois.
                        this.drawBigWoodenCrate(platform.x, platform.y, this.stageNextOffset);
                    }

                    break;
                }

                case "spear": {
                    // La plateforme est une rangée de pics. 
                    this.drawSpears(platform.tx, platform.ty, platform.tw, this.stageNextOffset)

                    break;
                }

                default: {
                    // Si le type de mur est inconnu, alors il sera considéré comme un mur
                    // invisible.
                    break;
                }
            }
        }

        // Affiche le numéro du niveau en haut au centre de l'écran.
        Graphics.drawStringNotTiled((17 * 8), (3 * 8) + this.stageNextOffset, Utils.padZeros(this.number, 2));
    },
    update: function(dt) {
        if (this.stageLaunch) {
            // Gestion de la transition de niveaux
            // -----------------------------------

            let speed = (this.stagesToPass > 0 ? (Constants.STAGE_TRANSITION_SPEED * 2) : Constants.STAGE_TRANSITION_SPEED);

            // C'est ici qu'est géré la transition d'un niveau à un autre.
            // On fait disparaître le niveau précédent par le haut de l'écran.
            this.stagePrevOffset -= (speed * dt);

            // On fait apparaître le niveau suivant par le bas de l'écran.
            this.stageNextOffset -= (speed * dt);

            if (this.stageNextOffset < 0) {
                // La transition est terminée.
                this.stageNextOffset = 0;

                if (this.stagesToPass > 0) {
                    // Il reste encore des niveaux à passer.
                    this.stagesToPass--;

                    // On passe au suivant.
                    this.next();
                }
            }

            return;
        } else {
            if (!this.ready) {
                if (!this.sandboxMode && !this.isBonusLevel) {
                    // Prépare l'arrivée des ennemis. Ceux-ci apparaissent par le haut de l'écran et descende 
                    // dans le niveau jusqu'à leur position finale.
                    Enemy.setup();
                }

                if (this.isBonusLevel) {
                    // Le niveau est un niveau bonus, on créé des diamants dans tout le niveau à 
                    // chaque emplacement libre.
                    this.setupDiamonds();
                }

                // Initialise le joueur en définissant sa position initiale, soit en bas à 
                // gauche de l'écran.
                Player.setup();

                // Initialise les bombes.
                Bomb.reset();

                // Termine l'initialisation du niveau en disposant quelques diamants ici et là
                // dans le niveau.
                //this.setupBonusLevel();

                // Test sceptre de feu.
                //Item.createFalling(Constants.ITEM_RED_SCEPTER);

                // Test sceptre du tonnerre.
                //Item.createFalling(Constants.ITEM_BLUE_SCEPTER);

                // Test parapluie.
                //Item.createFalling(Constants.ITEM_UMBRELLA);

                // Test potion magique.
                //Item.createFalling(Constants.ITEM_POTION);

                if (!this.isBonusLevel) {
                    if (App.settings.startingBonus) {
                        // Un item au hasard apparait en début de partie.
                        Item.createFalling(Constants.ITEM_RANDOM);
                    } else if (this.number == (Data.stages.length - 1)) {
                        // Au dernier niveau, on créé un coffre. C'est cadeau !
                        Item.createFalling(Constants.ITEM_CHEST);
                    }
                }

                // Tout est prêt, on peut commencer à jouer. Le joueur est maniable à partir de 
                // maintenant, même si les ennemis ne sont pas encore tous arrivés dans le niveau.
                this.ready = true;

                // Joue un son.
                //Sound.play(this.sndReady);

                if (!document.hasFocus()) {
                    // Met le jeu en pause.
                    App.paused = true;
                    App.currentMenuOption = 1;
    
                    Graphics.resetEffects();
                }
            } else {
                // Gestion des caisses en bois
                // ---------------------------

                for (let idx in this.platforms) {
                    if (this.platforms[idx].enabled && this.platforms[idx].type == "crate") {
                        this.platforms[idx].grounded = false;

                        // Gère les collisions entre les caisses en bois et les autres caisses et/ou les
                        // plateformes.
                        for (let platform of this.platforms) {
                            if (!platform.enabled) {
                                continue;
                            }
                            if (platform.type == "ceiling" || platform.type == "hiddenceiling") {
                                continue;
                            }
                            if (platform.x == this.platforms[idx].x && platform.y == this.platforms[idx].y && platform.type == this.platforms[idx].type) {
                                continue;
                            }

                            // Détermine dans quelle direction la collision a eu lieu.
                            let shapeBottom = { x: this.platforms[idx].x + 2, y: this.platforms[idx].y + this.platforms[idx].h - 1, w: 12, h: 2, vx: 0, vy: 0 };
                            if (Utils.isOverlapping(shapeBottom, platform, true)) {
                                // La collision a eu lieu sur un mur ou sur une plateforme. La caisse en bois ne se
                                // brisera pas.
                                this.platforms[idx].y = platform.y - this.platforms[idx].h;
                                this.platforms[idx].vx = 0;
                                this.platforms[idx].vy = 0;
                                this.platforms[idx].grounded = true;

                                /*if (this.platforms[idx].vy > (Constants.ITEM_GRAVITY * 2)) {
                                    this.platforms[idx].enabled = false;
                                    if (this.platforms[idx].size == "small") {
                                        // La petite caisse en bois explose en plusieurs petits morceaux.
                                        Effect.createRumble(this.platforms[idx].x, this.platforms[idx].y, -0.25, -1.5);
                                        Effect.createRumble(this.platforms[idx].x + 8, this.platforms[idx].y, 0.25, -1.5);
                                        Effect.createRumble(this.platforms[idx].x, this.platforms[idx].y + 8, -0.5, -1);
                                        Effect.createRumble(this.platforms[idx].x + 8, this.platforms[idx].y + 8, 0.5, -1);
                                    } else if (this.platforms[idx].size == "big") {
                                        // La grosse caisse en bois explose en plusieurs petits morceaux.
                                        Effect.createRumble(this.platforms[idx].x, this.platforms[idx].y, -0.25, -1.5);
                                        Effect.createRumble(this.platforms[idx].x + 12, this.platforms[idx].y, -0.125, -1.6);
                                        Effect.createRumble(this.platforms[idx].x + 12, this.platforms[idx].y, 0.125, -1.6);
                                        Effect.createRumble(this.platforms[idx].x + 24, this.platforms[idx].y, 0.25, -1.5);
                                        Effect.createRumble(this.platforms[idx].x, this.platforms[idx].y + 12, -0.5, -1);
                                        Effect.createRumble(this.platforms[idx].x + 12, this.platforms[idx].y + 12, -0.25, -1.1);
                                        Effect.createRumble(this.platforms[idx].x + 12, this.platforms[idx].y + 12, 0.25, -1.1);
                                        Effect.createRumble(this.platforms[idx].x + 24, this.platforms[idx].y + 12, 0.5, -1);
                                        Effect.createRumble(this.platforms[idx].x, this.platforms[idx].y + 24, -0.75, -0.75);
                                        Effect.createRumble(this.platforms[idx].x + 12, this.platforms[idx].y + 24, -0.5, -0.85);
                                        Effect.createRumble(this.platforms[idx].x + 12, this.platforms[idx].y + 24, 0.5, -0.85);
                                        Effect.createRumble(this.platforms[idx].x + 24, this.platforms[idx].y + 24, 0.75, -0.75);
                                    }
                                }*/
                            }
                        }

                        // Gère la gravité de la caisse en bois.
                        if (this.platforms[idx].vy < Constants.BOMB_MAX_VELOCITY) {
                            this.platforms[idx].vy += Constants.BOMB_GRAVITY;
                        }

                        // La caisse est sur une plateforme ou une autre caisse, ou vient d'attérir 
                        // dessus. On fait en sorte qu'il ne traverse pas cette plateforme.
                        if (this.platforms[idx].grounded) {
                            this.platforms[idx].vy = 0;
                        }

                        // Applique les paramètres de vélocité de la caisse sur sa position. Une valeur
                        // positive déplace la caisse vers le bas ou la droite, une valeur négative déplace
                        // la caisse vers le haut ou à gauche.
                        this.platforms[idx].x += (this.platforms[idx].vx * dt);
                        this.platforms[idx].y += (this.platforms[idx].vy * dt);

                        // Si une caisse tombe au-délà du niveau, elle sera perdue.
                        if (this.platforms[idx].y > Constants.CANVAS_HEIGHT) {
                            this.platforms[idx].enabled = false;
                        }
                    }
                }

                // Retire les caisses en bois et les plateformes qui ne sont plus actifs.
                this.platforms = this.platforms.filter((platform) => platform.enabled);
            }
        }
    }
});
