import Bomb from "@/Bomb.js";
import Constants from "@/Constants.js";
import Data from "@/Data.js";
import Effect from "@/Effect.js";
import Enemy from "@/Enemy.js";
import Graphics from "@/Graphics.js";
import Input from "@/Input.js";
import Item from "@/Item.js";
import Player from "@/Player.js";
import Sound from "@/Sound.js";
import Stage from "@/Stage.js";
import Storage from "@/Storage.js";
import Utils from "@/Utils.js";

import sprLogo from "@assets/img/bombergemini.png";
import sprHud from "@assets/img/hud.png";
import sprItems from "@assets/img/items.png";
import sprPlayer from "@assets/img/player.png";
import sprEnemies from "@assets/img/enemies.png";
import sprBubble from "@assets/img/bubble.png";
import sprBomb from "@assets/img/bomb.png";
import sprStars from "@assets/img/stars.png";

import sndSelect from "@assets/snd/select.ogg";
import sndConfirm from "@assets/snd/confirm.ogg";
import sndGameOver from "@assets/snd/gameover.ogg";
import sndPlant from "@assets/snd/plant.ogg";
import sndTimeCount from "@assets/snd/timecount.ogg";
import sndReady from "@assets/snd/ready.ogg";
import sndStageClear from "@assets/snd/stageclear.ogg";

/* App.js
 *
 * Il s'agit du fichier principal de l'application. Il gère les transitions entre écrans, 
 * les contrôles et l'affichage de chaque écran.
 */
export default ({
    // Variables
    // =========

    imgHud: null,
    imgItems: null,
    imgPlayer: null,
    imgEnemies: null,
    imgBubble: null,
    imgLogo: null,
    imgBomb: null,
    imgStars: null,

    sndSelect: null,
    sndConfirm: null,
    sndGameOver: null,
    sndPlant: null,
    sndTimeCount: null,
    sndReady: null,
    sndStageClear: null,

    canvas: null,
    lastTime: 0,
    settings: null,
    screen: 0,
    paused: false,
    currentTime: 0,
    currentBlinkTime: 0,
    currentScoreTime: 0,
    currentCountdownTime: 0,
    blinkState: true,
    countdown: 0,
    mode: "",
    animCycle: 0,
    currentAnimTime: 0,
    demo: false,
    debug: false,
    introPassed: false,
    tutorialPage: 0,

    currentMenuOption: 1,
    selectedStage: 1,

    fpsCounter: 0,
    fps: 0,

    // Variables utilisées pour le mode introduction et pendant les transitions 
    // d'un niveau à un autre.
    px: Constants.PLAYER_INTROX,
    py: Constants.PLAYER_INTROY,
    pangle: 0,
    pmovedx: false,
    pmovedy: false,

    dx: [ 0, 0, 0, 0 ],
    dy: [ 0, 0, 0, 0 ],
    dangle: [ 0, 60, 120, 180 ],

    rx1: 0,
    ry1: 0,
    rangle1: 0,
    rx2: 0,
    ry2: 0,
    rangle2: 180,

    // Fonctions
    // =========

    init: async function() {
        this.fps = 0;
        this.fpsCounter = 0;

        document.querySelector('meta[name="theme-color"]').setAttribute("content", "#000000");

        console.log("APP_PLATFORM = ", APP_PLATFORM);

        // Active le mode DEBUG si le jeu est lancé en mode développement via la commande "npm run dev".
        if (APP_MODE == "development") {
            this.debug = true;
        } else {
            //this.demo = true;
        }

        // Récupère le mode d'affichage.
        this.mode = Utils.getDisplayMode();

        // Définition des dimensions du canevas.
        this.updateCanvas();

        // Enregistre une fonction à l'évènement "resize" de la fenêtre qui sera
        // appelée lors du redimensionnement de celle-ci.
        window.addEventListener("resize", (e) => {
            // La taille de la fenêtre a changée, le canevas doit être redimensionné
            // lui aussi.
            this.updateCanvas();
        });

        if (APP_PLATFORM == "webapp") {
            // Enregistre une fonction à l'évènement "fullscreenchange" de la fenêtre qui
            // sera appelée lorsque l'application passe en mode plein écran ou en sort.
            window.addEventListener("fullscreenchange", (e) => {
                // L'application est passé en mode plein écran ou bien en est sortie.
                this.settings.fullScreen = (document.fullscreenElement ? true : false);
            });
        }

        // Enregistre une fonction à l'évènement "blur" de la fenêtre qui sera appelée
        // lorsque la fenêtre de l'application perdra le focus.
        window.addEventListener("blur", (e) => {
            // La fenêtre de l'application a perdue le focus.
            if (!Stage.stageLaunch && this.screen == Constants.SCREEN_GAME && Stage.diamondsLeft > 0) {
                // Met le jeu en pause.
                this.paused = true;
                this.currentMenuOption = 1;

                Graphics.resetEffects();
            }
        });

        // Initialisation des fonctions graphiques.
        await Graphics.init(this.canvas);

        // Initialisation de la gestion des commandes.
        Input.init();

        // Chargement des ressources.
        this.imgHud = await Graphics.loadAsset(sprHud);
        this.imgItems = await Graphics.loadAsset(sprItems);
        this.imgPlayer = await Graphics.loadAsset(sprPlayer);
        this.imgEnemies = await Graphics.loadAsset(sprEnemies);
        this.imgBubble = await Graphics.loadAsset(sprBubble);
        this.imgLogo = await Graphics.loadAsset(sprLogo);
        this.imgBomb = await Graphics.loadAsset(sprBomb);
        this.imgStars = await Graphics.loadAsset(sprStars);

        this.sndSelect = await Sound.loadAsset(sndSelect);
        this.sndConfirm = await Sound.loadAsset(sndConfirm);
        this.sndGameOver = await Sound.loadAsset(sndGameOver);
        this.sndPlant = await Sound.loadAsset(sndPlant);
        this.sndTimeCount = await Sound.loadAsset(sndTimeCount);
        this.sndReady = await Sound.loadAsset(sndReady);
        this.sndStageClear = await Sound.loadAsset(sndStageClear);

        // Initialisation de la gestion du joueur.
        Player.init();

        // Initialisation de la gestion des items.
        Item.init();

        // Initialisation de la gestion des ennemis.
        Enemy.init();

        // Initialisation de la gestion des bombes.
        Bomb.init();

        // Initialisation de la gestion des effets.
        Effect.init();

        // Initialisation de la gestion des tableaux.
        Stage.init();

        // Chargement des paramètres.
        this.loadSettings();

        // Tout est prêt, on affiche l'écran-titre et son menu principal.
        this.screen = Constants.SCREEN_TITLE;
        this.currentMenuOption = 1;

        // Initialise la boucle qui va s'occuper de l'affichage des sprites et de la gestion
        // de la logique du jeu.
        this.lastTime = window.performance.now();
        window.requestAnimationFrame(function(ts) {
            this.appLoop(ts);
        }.bind(this));
    },
    appLoop: function(ts) {
        window.requestAnimationFrame(function(ts) {
            this.appLoop(ts);
        }.bind(this));

        let dt = (ts - this.lastTime);
        this.lastTime = ts;

        // Appel de la fonction de traitement.
        this.update(dt);

        // Appel de la fonction de dessin.
        this.draw();
    },
    loadSettings: function() {
        // Définit les paramètres par défaut.
        Sound.enabled = true;

        this.settings = {
            sound: true,
            fps: false,
            fullScreen: false,
            startingBonus: false,
            minBombs: 1,
            invincibility: false,
            remoteBombs: false,
            keyMap: null,
            buttonMap: null,
        };

        if (Storage.exists("settings")) {
            // Chargement des paramètres stockés dans le stockage local.
            this.settings = Storage.read("settings");

            // On applique les paramètres un à un. Si un des paramètres est
            // manquant, on la définit avec une valeur par défaut.
            if (Object.hasOwn(this.settings, "sound")) {
                Sound.enabled = this.settings.sound;
            } else {
                Sound.enabled = true;
                this.settings.sound = true;
            }
            if (!Object.hasOwn(this.settings, "fps")) {
                this.settings.fps = false;
            }
            if (Object.hasOwn(this.settings, "fullScreen")) {
                if (this.settings.fullScreen) {
                    Graphics.setFullScreen(true);
                }

                // En mode webapp, il n'est pas possible d'initialiser le mode plein écran
                // dès le démarrage de l'application. L'activation du mode plein écran nécessite
                // une action manuelle.
                //this.settings.fullScreen = false;
            } else {
                this.settings.fullScreen = false;
            }
            if (!Object.hasOwn(this.settings, "startingBonus")) {
                this.settings.startingBonus = false;
            }
            if (!Object.hasOwn(this.settings, "minBombs")) {
                this.settings.minBombs = 1;
            }
            if (!Object.hasOwn(this.settings, "invincibility")) {
                this.settings.invincibility = false;
            }
            if (!Object.hasOwn(this.settings, "remoteBombs")) {
                this.settings.remoteBombs = false;
            }

            // Redéfinit les contrôles du clavier et de la manette.
            if (Object.hasOwn(this.settings, "keyMap")) {
                Input.keyMap = this.settings.keyMap;
            }
            if (Object.hasOwn(this.settings, "buttonMap")) {
                Input.buttonMap = this.settings.buttonMap;
            }
        }
    },
    saveSettings: function() {
        // Enregistrement des paramètres.
        this.settings.sound = Sound.enabled;
        this.settings.keyMap = Input.keyMap;
        this.settings.buttonMap = Input.buttonMap;
        Storage.write("settings", this.settings);
    },
    updateCanvas: function() {
        // Récupère les dimensions de la fenêtre.
        let width = window.innerWidth, height = window.innerHeight;
        this.canvas = document.querySelector("#app");

        if (width > height) {
            // Mode paysage.
            this.canvas.style.height = height + "px";
            let ratio = (height / Constants.CANVAS_HEIGHT);
            this.canvas.style.width = (Constants.CANVAS_WIDTH * ratio) + "px";
        } else {
            // Mode portrait.
            this.canvas.style.width = width + "px";
            let ratio = (width / Constants.CANVAS_WIDTH);
            this.canvas.style.height = (Constants.CANVAS_HEIGHT * ratio) + "px";
        }
    },
    startGame: function(nr = 1, testMode = false) {
        // Affiche l'écran du jeu.
        this.screen = Constants.SCREEN_GAME;
        this.paused = false;
        this.diamonds = 0;

        // Commence la partie au premier niveau.
        Stage.reset(nr, (testMode ? "test" : "normal"));
        Player.destroy();
        Bomb.reset();
        Enemy.destroy();
        Item.destroy();
        Effect.destroy();

        // Le joueur débute la partie avec une barre d'énergie pleine et aucun bonus actif.
        Player.energy = Constants.START_ENERGY;
        Player.maxEnergy = Constants.START_ENERGY;
        Player.bombShield = false;
        Player.enemyShield = false;
        Player.hasRemote = this.settings.remoteBombs;
        if (this.settings.minBombs < 1) {
            Player.maxBombs = 1;
        } else if (this.settings.minBombs > Constants.MAX_BOMBS) {
            Player.maxBombs = Constants.MAX_BOMBS;
        } else {
            Player.maxBombs = this.settings.minBombs;
        }
    },
    startSandbox: function() {
        // Affiche l'écran du jeu.
        this.screen = Constants.SCREEN_GAME;
        this.paused = false;
        this.diamonds = 0;

        // Commence la partie au premier niveau.
        Stage.reset(0, "sandbox");
        Player.destroy();
        Bomb.reset();
        Enemy.destroy();
        Item.destroy();
        Effect.destroy();

        // Le joueur débute la partie avec une barre d'énergie pleine et aucun bonus actif.
        Player.energy = Constants.START_ENERGY;
        Player.maxEnergy = Constants.START_ENERGY;
        Player.bombShield = false;
        Player.enemyShield = false;
        Player.hasRemote = false;
        Player.maxBombs = Constants.MAX_BOMBS;
    },
    drawAnimation: function(anim) {
        switch (anim) {
            case 1: {
                // Animation 1 : écran "A suivre"
                // ------------------------------

                let ex = 0, px = 16;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    ex = 16;
                    px = 0;
                } else if (this.animCycle == 2) {
                    ex = 32;
                    px = 32;
                }

                // Dessine le joueur en train de courir.
                Graphics.drawImagePart(this.imgPlayer, (21 * 8), (7 * 8), px, 0, 16, 16);

                // Dessine trois ennemis qui poursuivent le joueur.
                Graphics.drawImagePart(this.imgEnemies, (9 * 8), (7 * 8), ex, 64, 16, 16);
                Graphics.drawImagePart(this.imgEnemies, (12 * 8), (7 * 8), ex, 0, 16, 16);
                Graphics.drawImagePart(this.imgEnemies, (15 * 8), (7 * 8), ex, 32, 16, 16);

                break;
            }

            case 2: {
                // Animation 2 : écran d'introduction
                // ----------------------------------

                // Dessine la bulle.
                let sx = 32;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    sx = 0;
                } else if (this.animCycle == 2) {
                    sx = 64;
                }
                Graphics.drawImagePart(this.imgBubble, this.px - 8, this.py - 8, sx, 0, 32, 32);

                // Dessine Misty à l'intérieur.
                Graphics.drawImagePart(this.imgPlayer, this.px, this.py, 0, 0, 16, 16);

                break;
            }

            case 3: {
                // Animation 3 : écran de fin de partie
                // ------------------------------------

                let ex = 0;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    ex = 16;
                } else if (this.animCycle == 2) {
                    ex = 32;
                }

                // Dessine le joueur K.O.
                Graphics.drawImagePart(this.imgPlayer, (16 * 8), (7 * 8), 48, 0, 16, 16);

                // Dessine les petites étoiles au-dessus du joueur.
                Graphics.drawImagePart(this.imgBomb, (16 * 8) + 4 + this.rx1, (7 * 8) - 8 + this.ry1, 120, 0, 8, 8);
                Graphics.drawImagePart(this.imgBomb, (16 * 8) + 4 + this.rx2, (7 * 8) - 8 + this.ry2, 120, 0, 8, 8);

                // Dessine des monstres autour du joueur.
                Graphics.drawImagePart(this.imgEnemies, (11 * 8), (7 * 8), ex, 64, 16, 16);
                Graphics.drawImagePart(this.imgEnemies, (8 * 8), (7 * 8), ex, 32, 16, 16);
                Graphics.drawImagePart(this.imgEnemies, (21 * 8), (7 * 8), ex, 16, 16, 16);
                Graphics.drawImagePart(this.imgEnemies, (24 * 8), (7 * 8), ex, 0, 16, 16);

                break;
            }

            case 4: {
                // Animation 4 : écran des félicitations
                // -------------------------------------

                let px = 16;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    px = 0;
                } else if (this.animCycle == 2) {
                    px = 32;
                }

                // Dessine le joueur en train de marcher.
                Graphics.drawImagePart(this.imgPlayer, (16 * 8), (7 * 8), px, 0, 16, 16);

                // Dessine les diamants qui tournent autour du joueur.
                for (let i = 0; i < 4; i++) {
                    Graphics.drawImagePart(this.imgItems, this.dx[i], this.dy[i], (16 * i), 0, 16, 16);
                }

                break;
            }

            case 5: {
                // Animation 5 : écran-titre
                // -------------------------

                // Dessine Gemini en train de sauter sur le logo avec une bombe dans la main.
                let lx = 16;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    lx = 0;
                } else if (this.animCycle == 2) {
                    lx = 32;
                }
                Graphics.drawImagePart(this.imgBomb, (Constants.CANVAS_WIDTH / 2) - 90, (5 * 8) - 20, lx, 16, 16, 16);
                Graphics.drawImagePart(this.imgPlayer, (Constants.CANVAS_WIDTH / 2) - 100, (5 * 8) - 8, 80, 0, 16, 16);

                // Dessine quelques petits diamants en-dessous le logo.
                let dy = 0;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    dy = 2;
                } else if (this.animCycle == 2) {
                    dy = 4;
                }
                Graphics.drawImagePart(this.imgItems, (Constants.CANVAS_WIDTH / 2) + 48, (5 * 8) + 56 + dy, 0, 0, 16, 16);
                Graphics.drawImagePart(this.imgItems, (Constants.CANVAS_WIDTH / 2) + 32, (5 * 8) + 52 + (8 - dy), 16, 0, 16, 16);
                Graphics.drawImagePart(this.imgItems, (Constants.CANVAS_WIDTH / 2) + 16, (5 * 8) + 56 + dy, 32, 0, 16, 16);
                Graphics.drawImagePart(this.imgItems, (Constants.CANVAS_WIDTH / 2), (5 * 8) + 52 + (8 - dy), 48, 0, 16, 16);

                // Dessine quelques ennemis.
                let ex = 0;
                if (this.animCycle == 1 || this.animCycle == 3) {
                    ex = 16;
                } else if (this.animCycle == 2) {
                    ex = 32;
                }
                Graphics.drawImagePart(this.imgEnemies, (Constants.CANVAS_WIDTH / 2) + 32, (5 * 8) - 14, ex, 64, 16, 16);
                Graphics.drawImagePart(this.imgEnemies, (Constants.CANVAS_WIDTH / 2) + 48, (5 * 8) - 14, ex, 16, 16, 16);
                Graphics.drawImagePart(this.imgEnemies, (Constants.CANVAS_WIDTH / 2) + 64, (5 * 8) - 14, ex, 0, 16, 16);

                break;
            }
        }
    },
    updateAnimation: function(anim, dt) {
        switch (anim) {
            case 2: {
                // Animation 2 : écran d'introduction
                // ----------------------------------

                if (Stage.stageLaunch) {
                    // D'un niveau à un autre
                    // ======================
        
                    if (Stage.stagesToPass == 0) {
                        // Déplace le joueur à l'intérieur de sa bulle vers sa position de départ.
                        if (!this.pmovedx) {
                            if (this.px > Constants.PLAYER_STARTX) {
                                this.px -= (0.1 * dt);
                            } else {
                                this.px = Constants.PLAYER_STARTX;
                                this.pmovedx = true;
                            }
                        }
                        if (!this.pmovedy) {
                            if (this.py < Constants.PLAYER_STARTY) {
                                this.py += (0.1 * dt);
                            } else {
                                this.py = Constants.PLAYER_STARTY;
                                this.pmovedy = true;
                            }
                        }
        
                        if (this.pmovedx && this.pmovedy && Stage.stageNextOffset == 0) {
                            // Le joueur a atteint sa position de départ. On peut commencer la partie.
                            Stage.stageLaunch = false;
                        }
                    }
                } else {
                    // Pendant l'écran titre
                    // =====================
        
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
                    }
            
                    // Déplace la bulle en cercle.
                    this.px = Constants.PLAYER_INTROX + (Math.cos(this.pangle) * 32);
                    this.py = Constants.PLAYER_INTROY + (Math.sin(this.pangle) * 32);
                    this.pangle += (0.0035 * dt);
                    if (this.pangle >= 360) {
                        this.pangle = 0;
                    }
                }

                break;
            }

            case 4: {
                // Animation 4 : écran des félicitations
                // -------------------------------------

                // Déplace le diamant.
                for (let i = 0; i < 4; i++) {
                    this.dx[i] = (16 * 8) + (Math.cos(this.dangle[i]) * 32);
                    this.dy[i] = (7 * 8) + (Math.sin(this.dangle[i]) * 32);
                    this.dangle[i] += (0.0035 * dt);
                    if (this.dangle[i] >= 360) {
                        this.dangle[i] = (this.dangle[i] - 360);
                    }
                }

                break;
            }
        }
    },
    drawHUD: function() {
        // Dessine des rectangle noirs en haut et en bas de l'écran, juste derrière le HUD.
        // Cela permet, pendant la transition de niveau, de faire en sorte que les éléments
        // de décors ne passent pas derrière le HUD.
        Graphics.drawRectangle(0, 0, Constants.CANVAS_WIDTH, 24, "#000000");
        Graphics.drawRectangle(0, (Constants.CANVAS_HEIGHT - 16), Constants.CANVAS_WIDTH, 16, "#000000");

        // Le HUD est inscrit par-dessus ces rectangles noirs.
        if (this.screen == Constants.SCREEN_GAME || this.screen == Constants.SCREEN_INTRO) {
            // Affiche la jauge d'énergie du joueur.
            Graphics.drawString(1, 0, "GEMINI");
            for (let i = 1; i <= (Player.maxEnergy / 2); i++) {
                Graphics.drawImagePart(this.imgHud, (i * 8), 8, 8, 0, 8, 8);
            }
            for (let i = 1; i <= Player.energy; i++) {
                let x = (Math.ceil(i / 2) * 8);
                if (i % 2 == 1) {
                    Graphics.drawImagePart(this.imgHud, x, 8, 0, 0, 3, 8);
                } else {
                    Graphics.drawImagePart(this.imgHud, x, 8, 0, 0, 8, 8);
                }
            }

            if (!Stage.sandboxMode) {
                // Affiche le nombre de diamants récoltés.
                //Graphics.drawImagePart(this.imgHud, (12 * 8), (1 * 8), 0, 8, 8, 8);
                Graphics.drawString(13, 0, "GEMS");
                if (Stage.diamondsLeft == 0) {
                    Graphics.drawString(12, 1, Utils.padZeros(Player.diamonds, 2) + "/--");
                } else {
                    Graphics.drawString(12, 1, Utils.padZeros(Player.diamonds, 2) + "/" + Utils.padZeros(Stage.diamonds, 2));
                }
            }

            // Affiche le score de la partie en haut à gauche de l'écran.
            Graphics.drawString(30, 0, "SCORE");
            Graphics.drawString(27, 1, Utils.padZeros(Stage.score, 8));

            // Affiche le temps restant en haut à droite de l'écran.
            Graphics.drawString(20, 0, "TIME");
            Graphics.drawString(21, 1, Utils.padZeros(Stage.time, 3));

            // Affiche les 5 diamants colorés en bas de l'écran. Quand un de ces diamants est récolté
            // par le joueur, il s'affiche en bas.
            if (Stage.specialGems[0]) {
                Graphics.drawImagePart(this.imgItems, (13 * 8), (25 * 8), 48, 48, 16, 16);
            } else {
                Graphics.drawImagePart(this.imgHud, (13 * 8), (25 * 8), 16, 0, 16, 16);
            }
            if (Stage.specialGems[1]) {
                Graphics.drawImagePart(this.imgItems, (15 * 8), (25 * 8), 0, 64, 16, 16);
            } else {
                Graphics.drawImagePart(this.imgHud, (15 * 8), (25 * 8), 16, 0, 16, 16);
            }
            if (Stage.specialGems[2]) {
                Graphics.drawImagePart(this.imgItems, (17 * 8), (25 * 8), 16, 64, 16, 16);
            } else {
                Graphics.drawImagePart(this.imgHud, (17 * 8), (25 * 8), 16, 0, 16, 16);
            }
            if (Stage.specialGems[3]) {
                Graphics.drawImagePart(this.imgItems, (19 * 8), (25 * 8), 32, 64, 16, 16);
            } else {
                Graphics.drawImagePart(this.imgHud, (19 * 8), (25 * 8), 16, 0, 16, 16);
            }
            if (Stage.specialGems[4]) {
                Graphics.drawImagePart(this.imgItems, (21 * 8), (25 * 8), 48, 64, 16, 16);
            } else {
                Graphics.drawImagePart(this.imgHud, (21 * 8), (25 * 8), 16, 0, 16, 16);
            }
        }
    },
    draw: function() {
        // Efface le contenu du canevas.
        Graphics.clear();

        switch (this.screen) {
            case Constants.SCREEN_TITLE: {
                // Ecran-titre
                // -----------

                // Dessine les effets spéciaux. On se sert de cela pour afficher une pluie d'étoiles
                // en arrière-plan.
                Effect.draw();

                // Dessine le logo du jeu au centre.
                Graphics.drawImage(this.imgLogo, (Constants.CANVAS_WIDTH / 2) - 92, (5 * 8));
                if (this.demo && this.blinkState) {
                    // Si le mode démonstration est activé, on affiche la mention DEMO en-dessous du
                    // logo du jeu.
                    Graphics.drawString(12, 10, "demo version");
                }

                // Dessine une animation qui ajout un peu de vie au logo du jeu.
                //this.drawAnimation(5);

                if (this.debug) {
                    // Si le mode debug est activé, on affiche le numéro de version en bas à droite 
                    // de l'écran.
                    Graphics.drawString(35 - (Constants.VERSION.length / 2), 26, Constants.VERSION, "tiny");
                }

                // Affiche le meilleur score en haut de l'écran.
                Graphics.drawString(9, 1, "top score " + Utils.padZeros(Stage.highScore, 8));

                // Affiche le menu.
                Graphics.drawString(13, 16, "START GAME");
                Graphics.drawString(13, 18, "OPTIONS");
                Graphics.drawString(13, 20, "ABOUT");
                if (this.mode != "browser") {
                    Graphics.drawString(13, 22, "EXIT");
                }

                // Affiche la petite flèche de sélection.
                let y = ((this.currentMenuOption - 1) * 2);
                Graphics.drawString(11, (16  + y), String.fromCharCode(127));

                // Affiche le copyright en bas de l'écran.
                //Graphics.drawString(7, 24, "(C) 2024 FREDERIC FERET");
                //Graphics.drawString(9, 25, "ALL RIGHTS RESERVED");

                break;
            }

            case Constants.SCREEN_GAME: {
                // Ecran du jeu
                // ------------

                // Dessine le niveau.
                Stage.draw();

                // Dessine le HUD.
                this.drawHUD();

                // Dessine les items.
                Item.draw();

                // Dessine le joueur.
                Player.draw();

                // Dessine les ennemis.
                Enemy.draw();

                // Dessine les bombes.
                Bomb.draw();

                // Dessine les effets.
                Effect.draw();

                if (Stage.stageLaunch) {
                    // Pendant les transitions d'un niveau à un autre, Misty se retrouve dans sa bulle et
                    // se dirige vers le point de départ. On dessine ici la bulle avec Misty à
                    // l'intérieur.
                    this.drawAnimation(2);
                }

                // Si le jeu est en pause, on affiche la mention "PAUSE" au centre
                // de l'écran avec un menu.
                if (this.paused) {
                    Graphics.drawString(15, 10, "pause");

                    // Affiche le menu de pause.
                    Graphics.drawString(14, 16, "RESUME");
                    Graphics.drawString(14, 18, "END GAME");

                    // Affiche la petite flèche de sélection.
                    let y = ((this.currentMenuOption - 1) * 2);
                    Graphics.drawString(12, (16 + y), String.fromCharCode(127));
                }

                if ((Stage.diamondsLeft === 0 || Stage.time === 0) && Stage.isBonusLevel) {
                    Graphics.drawString(5, 8, Player.diamonds + " DIAMONDS COLLECTED");
                    Graphics.drawString(7, 10, Player.diamonds + " x 1000 = " + (Player.diamonds * 1000) + " POINTS");
                }

                break;
            }

            case Constants.SCREEN_GAME_OVER: {
                // Ecran de fin de partie
                // ----------------------

                // Dessine une animation montrant le joueur inanimé avec 4 monstres autour.
                this.drawAnimation(3);

                // Affiche la mention "GAME OVER" au centre de l'écran.
                Graphics.drawString(12, 12, "GAME OVER");

                // Affiche le menu.
                Graphics.drawString(14, 16, "RETRY");
                Graphics.drawString(14, 18, "END GAME");
                
                // Affiche la petite flèche de sélection.
                let y = ((this.currentMenuOption - 1) * 2);
                Graphics.drawString(12, (16 + y), String.fromCharCode(127));

                break;
            }

            case Constants.SCREEN_CONGRATS: {
                // Ecran des félicitations
                // -----------------------

                // Affiche un message de félicitations au centre de l'écran.
                Graphics.drawString(9, 12, "CONGRATULATIONS!");

                Graphics.drawString(8, 15, "YOU HAVE COLLECTED");
                Graphics.drawString(11, 16, Utils.padSpaces(Player.totalDiamonds, 4) + " GEMS.");

                Graphics.drawString(14, 20, "END GAME");
                Graphics.drawString(12, 20, String.fromCharCode(127));

                // Dessine une animation montrant le joueur entouré de diamants.
                this.drawAnimation(4);

                break;
            }

            case Constants.SCREEN_THANKS: {
                // Fin de la démonstration
                // -----------------------

                // Dessine une animation montrant le joueur en train d'être poursuivi par un groupe
                // de 3 monstres.
                this.drawAnimation(1);

                // La démonstration est terminée. On affiche la mention "A suivre" au centre de l'écran.
                Graphics.drawString(8, 12, "TO BE CONTINUED...");

                Graphics.drawString(8, 15, "THANKS FOR PLAYING!");
                Graphics.drawString(14, 20, "END GAME");
                Graphics.drawString(12, 20, String.fromCharCode(127));

                break;
            }

            case Constants.SCREEN_INTRO: {
                // Introduction
                // ------------

                // Dessine le HUD.
                this.drawHUD();

                // Affiche la petite histoire.
                Graphics.drawString(5, 4, "YOU ARE ENTERING THE GEMS");
                Graphics.drawString(3, 6, "CAVE. COLLECT AS MANY GEMS AS");
                Graphics.drawString(2, 8, "POSSIBLE. BEWARE OF MONSTERS!!!");
                Graphics.drawString(13, 12, "GOOD LUCK!");

                // A l'écran d'introduction, Misty se trouve dans une sorte de bulle qui fait des mouvements
                // circulaires, un peu comme dans Bubble Bobble en début de partie. On dessine ici les mouvements
                // la bulle avec Misty à l'intérieur.
                this.drawAnimation(2);

                break;
            }

            case Constants.SCREEN_OPTIONS: {
                // Ecran des options
                // -----------------

                // Dessine les effets spéciaux. On se sert de cela pour afficher une pluie d'étoiles
                // en arrière-plan.
                Effect.draw();

                // Affiche le menu.
                Graphics.drawString(7, 6, "options");
                Graphics.drawString(7, 8, "BACK");
                if (Input.controls == Constants.CTRL_KEYBOARD) {
                    Graphics.drawString(7, 10, "KEYBOARD CONTROLS");
                } else {
                    Graphics.drawString(7, 10, "GAMEPAD CONTROLS");
                }
                Graphics.drawString(7, 12, "SOUND FX            " + (Sound.enabled ? "on" : "off"));
                Graphics.drawString(7, 14, "FULLSCREEN MODE     " + (this.settings.fullScreen ? "on" : "off"));
                Graphics.drawString(7, 16, "SHOW FRAME RATE     " + (this.settings.fps ? "on" : "off"));
                Graphics.drawString(7, 18, "GAME TWEAKS");
                if (this.debug) {
                    Graphics.drawString(7, 20, "TEST STAGE " + Utils.padZeros(this.selectedStage, 2));
                }

                // Affiche la petite flèche de sélection.
                let y = ((this.currentMenuOption - 1) * 2);
                Graphics.drawString(5, (8 + y), String.fromCharCode(127));

                break;
            }

            case Constants.SCREEN_TWEAKS: {
                // Menu de triche
                // --------------

                // Dessine les effets spéciaux. On se sert de cela pour afficher une pluie d'étoiles
                // en arrière-plan.
                Effect.draw();

                // Affiche le menu.
                Graphics.drawString(7, 8, "game tweaks");
                Graphics.drawString(7, 10, "BACK");
                Graphics.drawString(7, 12, "STARTING BONUS ITEM " + (this.settings.startingBonus ? "on" : "off"));
                Graphics.drawString(7, 14, "MINIMUM BOMBS       " + Utils.padZeros(this.settings.minBombs, 2));
                Graphics.drawString(7, 16, "INVINCIBILITY       " + (this.settings.invincibility ? "on" : "off"));
                Graphics.drawString(7, 18, "REMOTE BOMBS        " + (this.settings.remoteBombs ? "on" : "off"));

                // Affiche la petite flèche de sélection.
                let y = ((this.currentMenuOption - 1) * 2);
                Graphics.drawString(5, (10 + y), String.fromCharCode(127));

                break;
            }

            case Constants.SCREEN_ABOUT: {
                // Version de l'application
                // ------------------------

                // Dessine les effets spéciaux. On se sert de cela pour afficher une pluie d'étoiles
                // en arrière-plan.
                Effect.draw();

                // Dessine le logo du jeu au centre.
                Graphics.drawImage(this.imgLogo, (Constants.CANVAS_WIDTH / 2) - 92, (5 * 8));

                Graphics.drawString(17, 24, "BACK");
                Graphics.drawString(15, 24, String.fromCharCode(127));

                // Affiche la version de l'application.
                let version = "VERSION " + Constants.VERSION;
                Graphics.drawString(18 - Math.ceil(version.length / 2), 14, version);

                // Affiche le copyright.
                Graphics.drawString(8, 16, "PROGRAMMING, GRAPHICS");
                Graphics.drawString(9, 17, "AND SOUND DESIGN BY");
                Graphics.drawString(11, 18, "FREDERIC FERET.");
                Graphics.drawString(5, 20, "COPYRIGHT (C) 2025 F.FERET");
                Graphics.drawString(8, 21, "ALL RIGHTS RESERVED.");

                break;
            }

            case Constants.SCREEN_KBD_CONTROLS: {
                // Ecran de redéfinition des contrôles (clavier)
                // ---------------------------------------------

                // Dessine les effets spéciaux. On se sert de cela pour afficher une pluie d'étoiles
                // en arrière-plan.
                Effect.draw();

                // Affiche le menu.
                Graphics.drawString(4, 2, "keyboard controls");
                Graphics.drawString(4, 4, "BACK");
                Graphics.drawString(4, 6, "MOVE/MENU LEFT     " + (Input.keyMap["KeyLeft"].toLowerCase()));
                Graphics.drawString(4, 8, "MOVE/MENU RIGHT    " + (Input.keyMap["KeyRight"].toLowerCase()));
                Graphics.drawString(4, 10, "MENU UP            " + (Input.keyMap["KeyUp"].toLowerCase()));
                Graphics.drawString(4, 12, "MENU DOWN          " + (Input.keyMap["KeyDown"].toLowerCase()));
                Graphics.drawString(4, 14, "FIRE/SELECT        " + (Input.keyMap["KeyFire"].toLowerCase()));
                Graphics.drawString(4, 16, "JUMP               " + (Input.keyMap["KeyAction1"].toLowerCase()));
                Graphics.drawString(4, 18, "THROW BOMB/BACK    " + (Input.keyMap["KeyAction2"].toLowerCase()));
                Graphics.drawString(4, 20, "USE REMOTE         " + (Input.keyMap["KeyAction3"].toLowerCase()));
                Graphics.drawString(4, 22, "PAUSE/RESUME       " + (Input.keyMap["KeyPause"].toLowerCase()));
                Graphics.drawString(4, 24, "SET DEFAULT CONTROLS");

                // Affiche la petite flèche de sélection.
                let y = ((this.currentMenuOption - 1) * 2);
                Graphics.drawString(2, (4 + y), String.fromCharCode(127));

                break;
            }

            case Constants.SCREEN_PAD_CONTROLS: {
                // Ecran de redéfinition des contrôles (manette)
                // ---------------------------------------------

                // Dessine les effets spéciaux. On se sert de cela pour afficher une pluie d'étoiles
                // en arrière-plan.
                Effect.draw();

                // Affiche le menu.
                Graphics.drawString(4, 2, "gamepad controls");
                Graphics.drawString(4, 4, "BACK");
                Graphics.drawString(4, 6, "MOVE/MENU LEFT        LEFT");
                Graphics.drawString(4, 8, "MOVE/MENU RIGHT       RIGHT");
                Graphics.drawString(4, 10, "MENU UP               UP");
                Graphics.drawString(4, 12, "MENU DOWN             DOWN");
                Graphics.drawString(4, 14, "JUMP/SELECT           " + (Input.buttonsText[Input.buttonMap["KeyAction1"]]));
                Graphics.drawString(4, 16, "THROW BOMB            " + (Input.buttonsText[Input.buttonMap["KeyAction2"]]));
                Graphics.drawString(4, 18, "USE REMOTE            " + (Input.buttonsText[Input.buttonMap["KeyAction3"]]));
                Graphics.drawString(4, 20, "PAUSE/RESUME          MENU");
                Graphics.drawString(4, 22, "SET DEFAULT CONTROLS");
                
                // Affiche la petite flèche de sélection.
                let y = ((this.currentMenuOption - 1) * 2);
                Graphics.drawString(2, (4 + y), String.fromCharCode(127));

                break;
            }
        }

        // Affiche le nombre d'images dessinées par seconde.
        if (this.settings.fps) {
            Graphics.drawString(0, 26, "FPS = " + Utils.padZeros(this.fps, 3), "tiny");
        }
    },
    update: function(dt) { 
        this.fpsCounter++;
        let time = window.performance.now();

        // Gestion du clignotement du texte
        // --------------------------------

        if (time > this.currentBlinkTime) {
            this.currentBlinkTime = (500 + time);
            this.blinkState = !this.blinkState;

            // On gère ici la pluie d'étoiles filantes qui anime l'écran des options.
            if (this.screen == Constants.SCREEN_TITLE || this.screen == Constants.SCREEN_OPTIONS || this.screen == Constants.SCREEN_TWEAKS || this.screen == Constants.SCREEN_ABOUT || this.screen == Constants.SCREEN_KBD_CONTROLS || this.screen == Constants.SCREEN_PAD_CONTROLS) {
                // Créé une étoile qui va traverser l'écran de haut en bas.
                Effect.createStar("star");
            }
        }

        // Gestion des animations
        // ----------------------

        if (time > this.currentAnimTime) {
            this.currentAnimTime = (125 + time);

            // Incrémente le compteur. 
            this.animCycle += 1;
            if (this.animCycle > 3) {
                // Le compteur repart de zéro.
                this.animCycle = 0;
            }

            // Gère en même temps les déplacements des petites étoiles qui s'affichent au-dessus
            // de la tête du joueur quand il est un peu sonné.
            this.rx1 = (Math.cos(this.rangle1) * 6);
            this.ry1 = (Math.sin(this.rangle1) * 3);
            this.rx2 = (Math.cos(this.rangle2) * 6);
            this.ry2 = (Math.sin(this.rangle2) * 3);
            this.rangle1 += (0.05 * dt);
            this.rangle2 += (0.05 * dt);
            if (this.rangle1 >= 360) {
                this.rangle1 = (this.rangle1 - 360);
            }
            if (this.rangle2 >= 360) {
                this.rangle2 = (this.rangle2 - 360);
            }
        }

        // Gestion des chronomètres
        // ------------------------

        // Le premier chronomètre se lance au début du niveau. Le joueur doit vaincre tous
        // les ennemis présents dans le niveau avant que ce chronomètre n'atteigne 0. Dès
        // qu'il atteint 0, le joueur perd une vie.
        if (time > this.currentTime) {
            this.currentTime = (1000 + time);

            this.fps = this.fpsCounter;
            this.fpsCounter = 0;
            
            if (this.screen == Constants.SCREEN_GAME && !this.paused && Stage.ready) {
                if (Stage.time > 0) {
                    if (!Stage.isBonusLevel || (Stage.isBonusLevel == Stage.diamondsLeft > 0)) {
                        // Décrémente le compteur.
                        Stage.time -= 1;
                    }

                    if (Stage.time === 0 && !Stage.isBonusLevel && Stage.diamondsLeft > 0 /* && Enemy.enemiesLeft > 0 */) {
                        // Si le compteur à atteint 0, la partie est terminée.
                        Player.hit(Player.data.direction, "timeout");
                    }

                    if (Stage.time === 0 && Stage.isBonusLevel) {
                        // Joue un son.
                        Sound.play(this.sndStageClear);

                        // Tous les diamants disparaissent.
                        Item.destroy();

                        // Le joueur passera au niveau suivant dans 8 secondes.
                        this.countdown = 8;
                    }
                }
            }

            // On gère ici la pluie de diamants qui anime l'écran des options.
            if (this.screen == Constants.SCREEN_TITLE || this.screen == Constants.SCREEN_OPTIONS || this.screen == Constants.SCREEN_TWEAKS || this.screen == Constants.SCREEN_ABOUT || this.screen == Constants.SCREEN_KBD_CONTROLS || this.screen == Constants.SCREEN_PAD_CONTROLS) {
                // Créé une étoile qui va traverser l'écran de haut en bas.
                Effect.createStar("diamond");
            }
        }
    
        // Le second chronomètre se lance à la fin du niveau après que le joueur ait
        // vaincu tous les ennemis présents dans le niveau. Le joueur aura quelques
        // secondes pour ramasser tous les items possibles avant le passage au
        // niveau suivant.
        if (time > this.currentCountdownTime) {
            this.currentCountdownTime = (1000 + time);

            if (this.countdown > 0) {
                // Décrémente le compteur.
                this.countdown--;

                if (this.countdown === 0) {
                    if (this.screen == Constants.SCREEN_INTRO) {
                        // Que la partie commence !
                        this.startGame();
                    }

                    if (this.screen == Constants.SCREEN_GAME) {
                        if (Stage.isBonusLevel || (!Stage.isBonusLevel && Stage.diamondsLeft === 0)) {
                            if (Stage.testMode) {
                                // Le niveau est terminé, on retourne au menu principal.
                                this.screen = Constants.SCREEN_OPTIONS;
                                this.currentMenuOption = 7;
                            } else {
                                // Le joueur a fini le niveau, on passe au suivant où bien on affiche l'écran
                                // des félicitations.
                                if (Stage.number >= (Data.stages.length - 1)) {
                                    // Affiche l'écran des félicitations.
                                    this.screen = Constants.SCREEN_CONGRATS;

                                    // Détermine le meilleur score.
                                    if (Stage.score > Stage.highScore) {
                                        Stage.highScore = Stage.score;
                                    }

                                    // Sauvegarde le meilleur score dans le stockage local.
                                    Storage.write("hiscore", Stage.highScore);
                                } else {
                                    if (this.demo && Stage.number >= Constants.MAX_STAGES_DEMO) {
                                        // La démonstration est terminée.
                                        this.screen = Constants.SCREEN_THANKS;

                                        // Détermine le meilleur score.
                                        if (Stage.score > Stage.highScore) {
                                            Stage.highScore = Stage.score;
                                        }

                                        // Sauvegarde le meilleur score dans le stockage local.
                                        Storage.write("hiscore", Stage.highScore);
                                    } else {
                                        // Prépare le déplacement du joueur avant la transition vers le niveau
                                        // suivant.
                                        this.px = Player.data.x;
                                        this.py = Player.data.y;
                                        this.pmovedx = false;
                                        this.pmovedy = false;

                                        // Le compteur à atteint 0. On passe au niveau suivant.
                                        Stage.next();
                                        Player.destroy();
                                        Bomb.reset();
                                        Enemy.destroy();
                                        Item.destroy();
                                        Effect.destroy();
                                    }
                                }
                            }
                        } else if (Player.data && Player.data.dead && Player.energy === 0) {
                            if (Stage.testMode) {
                                // Si le joueur a été vaincu, on retourne directement à l'écran des options.
                                this.screen = Constants.SCREEN_OPTIONS;
                                this.currentMenuOption = 7;
                            } else {
                                // Si le joueur a été vaincu, on affiche l'écran de fin de partie.
                                this.screen = Constants.SCREEN_GAME_OVER;
                                this.currentMenuOption = 1;

                                // Joue un son.
                                Sound.play(this.sndGameOver);

                                // Détermine le meilleur score.
                                if (Stage.score > Stage.highScore) {
                                    Stage.highScore = Stage.score;
                                }

                                // Sauvegarde le meilleur score dans le stockage local.
                                Storage.write("hiscore", Stage.highScore);
                            }
                        }
                    }
                }
            }
        }

        // Gestion du décompte du temps restant à la fin du niveau
        // -------------------------------------------------------

        // Quand le joueur a vaincu tous les ennemis présents dans le niveau, un décompte du
        // nombre de secondes restantes au chronomètre est effectué. Le joueur gagne 10 points
        // par seconde restante.
        if (time > this.currentScoreTime) {
            this.currentScoreTime = (32 + time);
            
            if (!Stage.isBonusLevel && this.countdown > 0 && Stage.time > 0 && Stage.diamondsLeft === 0 /* && Enemy.enemiesLeft === 0 */) {
                // Décrémente le compteur.
                Stage.time -= 1;

                // Incrémente le score de 10 points.
                Stage.score += 10;
                if (Stage.score > Constants.MAX_SCORE) {
                    Stage.score = Constants.MAX_SCORE;
                }

                if (Stage.time > 0) {
                    // Joue un son.
                    Sound.play(this.sndTimeCount);
                } else {
                    // Joue un son.
                    Sound.play(this.sndReady);
                }
            }
        }

        // Partie principale
        // -----------------

        // Gestion des appuis sur les boutons des manettes physiques
        Input.pollGamePads();

        switch (this.screen) {
            case Constants.SCREEN_TITLE: {
                // Ecran-titre
                // -----------

                // Gère les déplacement des effets spéciaux.
                Effect.update(dt);

                if (Input.isKeyPressed("KeyAction2")) {
                    // Retourne à l'écran-titre.
                    this.screen = Constants.SCREEN_TITLE;

                    // Joue un son.
                    Sound.play(this.sndSelect);
                }

                if (Input.isKeyPressed("KeyUp")) {
                    if (this.currentMenuOption > 1) {
                        // Sélectionne l'option précédente.
                        this.currentMenuOption--;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyDown")) {
                    if (this.currentMenuOption < (this.mode == "browser" ? 3 : 4)) {
                        // Sélectionne l'option suivante.
                        this.currentMenuOption++;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyFire")) {
                    switch (this.currentMenuOption) {
                        case 1: {
                            // Replace le joueur et sa bulle en haut de l'écran.
                            this.px = Constants.PLAYER_INTROX;
                            this.py = Constants.PLAYER_INTROY;
                            this.pmovedx = false;
                            this.pmovedy = false;

                            if (this.introPassed) {
                                // Que la partie commence !
                                this.startGame();
                            } else {
                                // Affiche l'écran d'introduction.
                                this.screen = Constants.SCREEN_INTRO;
                                this.countdown = 5;
                                this.introPassed = true;
                                Player.energy = Constants.START_ENERGY;
                                Player.maxEnergy = Constants.START_ENERGY;
                            }

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 2: {
                            // Affiche l'écran des options.
                            this.screen = Constants.SCREEN_OPTIONS;
                            this.currentMenuOption = 1;

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 3: {
                            // Affiche des informations sur la version de l'application et
                            // sur celui qui l'a fait !
                            this.screen = Constants.SCREEN_ABOUT;

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 4: {
                            // Ferme l'application.
                            switch (APP_PLATFORM) {
                                case "webapp": {
                                    // Web application (PWA)
                                    // ---------------------

                                    window.close();

                                    break;
                                }

                                case "windows": {
                                    // Windows (via NeutralinoJS)
                                    // --------------------------

                                    Neutralino.app.exit();

                                    break;
                                }
                            }

                            break;
                        }
                    }
                }

                break;
            }

            case Constants.SCREEN_GAME: {
                // Ecran du jeu
                // ------------

                if (!this.paused && Stage.stageLaunch) {
                    // Pendant les transitions d'un niveau à un autre, Misty se retrouve dans sa bulle et
                    // se dirige vers le point de départ. On gère ici les déplacements de cette
                    // bulle.
                    this.updateAnimation(2, dt);
                }

                if (Stage.ready && this.countdown === 0 && Stage.diamondsLeft === 0 /* && Enemy.enemiesLeft === 0 */) {
                    if (Stage.diamondsRain) {
                        // Tous les ennemis du niveau sont vaincus, on donne 12 secondes au joueur pour
                        // ramasser les quelques items qui restent, ainsi que tous les diamants de la pluie qui
                        // arrive.
                        this.countdown = 12;

                        // Créé une pluie de diamants.
                        Item.createDiamondsRain();
                    } else {
                        if (Stage.number == (Data.stages.length - 1)) {
                            // C'est le dernier niveau. Le joueur a 20 secondes pour ramasser les diamants qui tombent
                            // du ciel.
                            this.countdown = 20;
                        } else {
                            // Tous les ennemis du niveau sont vaincus, on donne 8 secondes au joueur pour
                            // ramasser les quelques items qui restent.
                            this.countdown = 8;
                        }
                    }

                    // Retire tous les bonus encore présents à l'écran.
                    Item.removeItems();
                }

                if (!this.paused) {
                    // Gère toute la logique autour des ennemis et des items.
                    Stage.update(dt);

                    // Gère les déplacements du joueur.
                    Player.update(dt);

                    // Gère les déplacements des ennemis.
                    Enemy.update(dt);

                    // Gère les déplacements des bombes.
                    Bomb.update(dt);

                    // Gère les items.
                    Item.update(dt);

                    // Gère les effets visuels.
                    Effect.update(dt);
                }

                if (!Stage.stageLaunch) {
                    if (Input.isKeyPressed("KeyPause")) {
                        // Il n'est plus possible de faire pause une fois tous les ennemis
                        // vaincus, une transition vers le prochain niveau va démarrer dans
                        // quelques secondes.
                        if (this.countdown === 0) {
                            if (this.paused) {
                                // On reprend la partie.
                                this.paused = false;
                            } else {
                                // Met le jeu en pause.
                                this.paused = true;
                                this.currentMenuOption = 1;

                                Graphics.resetEffects();
                            }

                            // Joue un son.
                            Sound.play(this.sndSelect);
                        }
                    }
                }

                if (Input.isKeyPressed("KeyUp")) {
                    if (this.paused) {
                        if (this.currentMenuOption > 1) {
                            // On passe à l'option précédente.
                            this.currentMenuOption--

                            // Joue un son.
                            Sound.play(this.sndSelect);
                        } else {
                            // Joue un son.
                            Sound.play(this.sndPlant);
                        }
                    }
                }

                if (Input.isKeyPressed("KeyDown")) {
                    if (this.paused) {
                        if (this.currentMenuOption < 2) {
                            // On passe à l'option suivante.
                            this.currentMenuOption++

                            // Joue un son.
                            Sound.play(this.sndSelect);
                        } else {
                            // Joue un son.
                            Sound.play(this.sndPlant);
                        }
                    }
                }

                if (Input.isKeyPressed("KeyFire")) {
                    if (this.paused) {
                        switch (this.currentMenuOption) {
                            case 1: {
                                // On reprend la partie.
                                this.paused = false;

                                // Joue un son.
                                Sound.play(this.sndSelect);

                                break;
                            }

                            case 2: {
                                // Le joueur a décidé de quitter la partie en cours.
                                if (Stage.testMode || Stage.sandboxMode) {
                                    // On retourne à l'écran des options.
                                    this.screen = Constants.SCREEN_OPTIONS;
                                    this.currentMenuOption = 7;
                                } else {
                                    // On retourne au menu principal.
                                    this.screen = Constants.SCREEN_TITLE;
                                    this.currentMenuOption = 1;
                                }
    
                                // On supprime toute donnée en cours de partie. Le score ne sera 
                                // pas sauvegardé.
                                Player.destroy();
                                Bomb.reset();
                                Enemy.destroy();
                                Item.destroy();
                                Effect.destroy();

                                // Joue un son.
                                Sound.play(this.sndGameOver);

                                break;
                            }
                        }
                    }
                }

                break;
            }

            case Constants.SCREEN_GAME_OVER: {
                // Ecran de fin de partie
                // ----------------------

                if (Input.isKeyPressed("KeyUp")) {
                    if (this.currentMenuOption > 1) {
                        // On passe à l'option précédente.
                        this.currentMenuOption--

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyDown")) {
                    if (this.currentMenuOption < 2) {
                        // On passe à l'option suivante.
                        this.currentMenuOption++

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyFire")) {
                    switch (this.currentMenuOption) {
                        case 1: {
                            if (Stage.testMode) {
                                // Retourne au menu des options.
                                this.screen = Constants.SCREEN_OPTIONS;
                                this.currentMenuOption = 7;
                            } else {
                                // On relance une nouvelle partie.
                                this.startGame();
                            }
        
                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 2: {
                            // On retourne au menu principal.
                            this.screen = Constants.SCREEN_TITLE;
                            this.currentMenuOption = 1;

                            // On supprime toute donnée en cours.
                            Player.destroy();
                            Bomb.reset();
                            Bomb.reset();
                            Enemy.destroy();
                            Item.destroy();
                            Effect.destroy();

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }
                    }
                }

                break;
            }

            case Constants.SCREEN_CONGRATS:
            case Constants.SCREEN_THANKS: {
                // Ecran des félicitations + Fin de la démonstration
                // -------------------------------------------------

                if (this.screen == Constants.SCREEN_CONGRATS) {
                    // Anime Misty dans sa bulle.
                    this.updateAnimation(4, dt);
                }

                if (Input.isKeyPressed("KeyFire")) {
                    // On retourne au menu principal.
                    this.screen = Constants.SCREEN_TITLE;
                    this.currentMenuOption = 1;

                    // On supprime toute donnée en cours.
                    Player.destroy();
                    Bomb.reset();
                    Enemy.destroy();
                    Item.destroy();
                    Effect.destroy();

                    // Joue un son.
                    Sound.play(this.sndConfirm);
                }

                break;
            }

            case Constants.SCREEN_INTRO: {
                // Introduction
                // ------------

                // A l'écran d'introduction, Misty se trouve dans une sorte de bulle qui fait des mouvements
                // circulaires, un peu comme dans Bubble Bobble en début de partie. On gère ici les mouvements
                // de cette bulle.
                this.updateAnimation(2, dt);

                if (Input.isKeyPressed("KeyFire")) {
                    // Que la partie commence !
                    this.countdown = 0;
                    this.startGame();
                }

                break;
            }

            case Constants.SCREEN_OPTIONS: {
                // Ecran des options
                // -----------------

                // Gère les déplacement des effets spéciaux.
                Effect.update(dt);

                if (Input.isKeyPressed("KeyUp")) {
                    if (this.currentMenuOption > 1) {
                        // Sélectionne l'option précédente.
                        this.currentMenuOption--;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyDown")) {
                    if (this.currentMenuOption < (this.debug ? 7 : 6)) {
                        // Sélectionne l'option suivante.
                        this.currentMenuOption++;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyLeft")) {
                    if (this.currentMenuOption == 3) {
                        // Active/désactive les effets sonores.
                        Sound.enabled = !Sound.enabled;

                        // Joue un son.
                        Sound.playAnyway(this.sndSelect);
                    } else if (this.currentMenuOption == 4) {
                        // Active/désactive le mode plein écran. 
                        this.settings.fullScreen = !this.settings.fullScreen;
                        Graphics.setFullScreen(this.settings.fullScreen);

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else if (this.currentMenuOption == 5) {
                        // Active/désactive l'affichage du FPS. 
                        this.settings.fps = !this.settings.fps;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else if (this.currentMenuOption == 7) {
                        if (this.selectedStage > 0) {
                            // Sélectionne le niveau précédent.
                            this.selectedStage--;

                            // Joue un son.
                            Sound.play(this.sndSelect);
                        } else {
                            // Joue un son.
                            Sound.play(this.sndPlant);
                        }
                    }
                }

                if (Input.isKeyPressed("KeyRight")) {
                    if (this.currentMenuOption == 3) {
                        // Active/désactive les effets sonores.
                        Sound.enabled = !Sound.enabled;

                        // Joue un son.
                        Sound.playAnyway(this.sndSelect);
                    } else if (this.currentMenuOption == 4) {
                        // Active/désactive le mode plein écran. 
                        this.settings.fullScreen = !this.settings.fullScreen;
                        Graphics.setFullScreen(this.settings.fullScreen);

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else if (this.currentMenuOption == 5) {
                        // Active/désactive l'affichage du FPS. 
                        this.settings.fps = !this.settings.fps;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else if (this.currentMenuOption == 7) {
                        if (this.selectedStage < (Data.stages.length - 1)) {
                            // Sélectionne le niveau suivant.
                            this.selectedStage++;

                            // Joue un son.
                            Sound.play(this.sndSelect);
                        } else {
                            // Joue un son.
                            Sound.play(this.sndPlant);
                        }
                    }
                }

                if (Input.isKeyPressed("KeyFire")) {
                    switch (this.currentMenuOption) {
                        case 1: {
                            // Sauvegarde des paramètres.
                            this.saveSettings();

                            // On retourne au menu principal.
                            this.screen = Constants.SCREEN_TITLE;
                            this.currentMenuOption = 2;

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 2: {
                            // Affiche le menu de redéfinition des contrôles.
                            if (Input.controls == Constants.CTRL_KEYBOARD) {
                                this.screen = Constants.SCREEN_KBD_CONTROLS;
                            } else {
                                this.screen = Constants.SCREEN_PAD_CONTROLS;
                            }
                            this.currentMenuOption = 1;

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 3: {
                            // Active/désactive les effets sonores.
                            Sound.enabled = !Sound.enabled;

                            // Joue un son.
                            Sound.playAnyway(this.sndSelect);

                            break;
                        }

                        case 4: {
                            // Active/désactive le mode plein écran.
                            this.settings.fullScreen = !this.settings.fullScreen;
                            Graphics.setFullScreen(this.settings.fullScreen);
    
                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 5: {
                            // Affiche/masque le nombre d'images dessinées par seconde.
                            this.settings.fps = !this.settings.fps;
    
                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 6: {
                            // Affiche le menu de triche.
                            this.screen = Constants.SCREEN_TWEAKS;
                            this.currentMenuOption = 1;
    
                            // Joue un son.
                            Sound.play(this.sndSelect);
                        
                            break;
                        }

                        case 7: {
                            if (this.selectedStage) {
                                // Lance une partie rapide au niveau qui a été sélectionné.
                                this.startGame(this.selectedStage, true);

                                // Joue un son.
                                Sound.play(this.sndConfirm);
                            } else {
                                // Lance le bac à sable.
                                this.startSandbox();
                            }

                            break;
                        }
                    }
                }

                break;
            }

            case Constants.SCREEN_TWEAKS: {
                // Menu de triche
                // --------------

                // Gère les déplacement des effets spéciaux.
                Effect.update(dt);

                if (Input.isKeyPressed("KeyUp")) {
                    if (this.currentMenuOption > 1) {
                        // Sélectionne l'option précédente.
                        this.currentMenuOption--;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyDown")) {
                    if (this.currentMenuOption < 5) {
                        // Sélectionne l'option suivante.
                        this.currentMenuOption++;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyLeft")) {
                    if (this.currentMenuOption == 2) {
                        // Active/désactive l'item bonus à chaque début de niveau.
                        this.settings.startingBonus = !this.settings.startingBonus;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else if (this.currentMenuOption == 3) {
                        if (this.settings.minBombs > 1) {
                            // Décrémente le nombre de bombes minimum accordé au joueur en début
                            // de partie.
                            this.settings.minBombs--;

                            // Joue un son.
                            Sound.play(this.sndSelect);
                        } else {
                            // Joue un son.
                            Sound.play(this.sndPlant);
                        }
                    } else if (this.currentMenuOption == 4) {
                        // Active/désactive l'invincibilité permanente.
                        this.settings.invincibility = !this.settings.invincibility;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else if (this.currentMenuOption == 5) {
                        // Active/désactive l'item bonus à chaque début de niveau.
                        this.settings.remoteBombs = !this.settings.remoteBombs;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    }
                }

                if (Input.isKeyPressed("KeyRight")) {
                    if (this.currentMenuOption == 2) {
                        // Active/désactive l'item bonus à chaque début de niveau.
                        this.settings.startingBonus = !this.settings.startingBonus;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else if (this.currentMenuOption == 3) {
                        if (this.settings.minBombs < 3) {
                            // Incrémente le nombre de bombes minimum accordé au joueur en début
                            // de partie. Le nombre maximum de bombes que peut avoir le joueur en
                            // début de partie est de 3, c'est bien assez !
                            this.settings.minBombs++;

                            // Joue un son.
                            Sound.play(this.sndSelect);
                        } else {
                            // Joue un son.
                            Sound.play(this.sndPlant);
                        }
                    } else if (this.currentMenuOption == 4) {
                        // Active/désactive l'invincibilité permanente.
                        this.settings.invincibility = !this.settings.invincibility;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else if (this.currentMenuOption == 5) {
                        // Active/désactive l'item bonus à chaque début de niveau.
                        this.settings.remoteBombs = !this.settings.remoteBombs;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    }
                }

                if (Input.isKeyPressed("KeyFire")) {
                    switch (this.currentMenuOption) {
                        case 1: {
                            // On retourne au menu des options.
                            this.screen = Constants.SCREEN_OPTIONS;
                            this.currentMenuOption = 6;

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 2: {
                            // Active/désactive l'item bonus à chaque début de niveau.
                            this.settings.startingBonus = !this.settings.startingBonus;

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 3: {
                            // Incrémente le nombre de bombes minimum accordé au joueur en début
                            // de partie. Le nombre maximum de bombes que peut avoir le joueur en
                            // début de partie est de 3, c'est bien assez !
                            this.settings.minBombs++;
                            if (this.settings.minBombs > 3) {
                                this.settings.minBombs = 1;

                            }

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 4: {
                            // Active/désactive l'invincibilité permanente.
                            this.settings.invincibility = !this.settings.invincibility;
    
                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 5: {
                            // Active/désactive l'item bonus à chaque début de niveau.
                            this.settings.remoteBombs = !this.settings.remoteBombs;
    
                            // Joue un son.
                            Sound.play(this.sndSelect);
                        
                            break;
                        }
                    }
                }

                break;
            }

            case Constants.SCREEN_ABOUT: {
                // Version de l'application
                // ------------------------

                // Gère les déplacement des effets spéciaux.
                Effect.update(dt);

                if (Input.isKeyPressed("KeyFire")) {
                    // On retourne au menu principal.
                    this.screen = Constants.SCREEN_TITLE;
                    this.currentMenuOption = 3;

                    // Joue un son.
                    Sound.play(this.sndConfirm);
                }

                break;
            }

            case Constants.SCREEN_KBD_CONTROLS: {
                // Ecran de redéfinition des contrôles (clavier)
                // ---------------------------------------------

                // Gère les déplacement des effets spéciaux.
                Effect.update(dt);

                if (Input.isKeyPressed("KeyUp")) {
                    if (this.currentMenuOption > 1) {
                        // Sélectionne l'option précédente.
                        this.currentMenuOption--;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyDown")) {
                    if (this.currentMenuOption < 11) {
                        // Sélectionne l'option suivante.
                        this.currentMenuOption++;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyFire")) {
                    switch (this.currentMenuOption) {
                        case 1: {
                            // On retourne au menu des options.
                            this.screen = Constants.SCREEN_OPTIONS;
                            this.currentMenuOption = 2;

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 2: {
                            // Redéfinition de la touche GAUCHE.
                            Input.keyMap["KeyLeft"] = "?";
                            Input.keyRedefine = "KeyLeft";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 3: {
                            // Redéfinition de la touche DROITE.
                            Input.keyMap["KeyRight"] = "?";
                            Input.keyRedefine = "KeyRight";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 4: {
                            // Redéfinition de la touche HAUT.
                            Input.keyMap["KeyUp"] = "?";
                            Input.keyRedefine = "KeyUp";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 5: {
                            // Redéfinition de la touche BAS.
                            Input.keyMap["KeyDown"] = "?";
                            Input.keyRedefine = "KeyDown";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 6: {
                            // Redéfinition de la touche FIRE.
                            Input.keyMap["KeyFire"] = "?";
                            Input.keyRedefine = "KeyFire";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 7: {
                            // Redéfinition de la touche ACTION 1.
                            Input.keyMap["KeyAction1"] = "?";
                            Input.keyRedefine = "KeyAction1";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 8: {
                            // Redéfinition de la touche ACTION 2.
                            Input.keyMap["KeyAction2"] = "?";
                            Input.keyRedefine = "KeyAction2";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 9: {
                            // Redéfinition de la touche ACTION 3.
                            Input.keyMap["KeyAction3"] = "?";
                            Input.keyRedefine = "KeyAction3";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 10: {
                            // Redéfinition de la touche PAUSE.
                            Input.keyMap["KeyPause"] = "?";
                            Input.keyRedefine = "KeyPause";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 11: {
                            // Réinitialise les contrôles par défaut.
                            Input.restoreDefaults("keyboard");

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }
                    }
                }

                break;
            }

            case Constants.SCREEN_PAD_CONTROLS: {
                // Ecran de redéfinition des contrôles (manette)
                // ---------------------------------------------

                // Gère les déplacement des effets spéciaux.
                Effect.update(dt);

                if (Input.isKeyPressed("KeyUp")) {
                    if (this.currentMenuOption > 1) {
                        // Sélectionne l'option précédente.
                        this.currentMenuOption--;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyDown")) {
                    if (this.currentMenuOption < 10) {
                        // Sélectionne l'option suivante.
                        this.currentMenuOption++;

                        // Joue un son.
                        Sound.play(this.sndSelect);
                    } else {
                        // Joue un son.
                        Sound.play(this.sndPlant);
                    }
                }

                if (Input.isKeyPressed("KeyFire")) {
                    switch (this.currentMenuOption) {
                        case 1: {
                            // On retourne au menu des options.
                            this.screen = Constants.SCREEN_OPTIONS;
                            this.currentMenuOption = 2;

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }

                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 9: {
                            // Joue un son.
                            Sound.play(this.sndPlant);

                            break;
                        }

                        case 6: {
                            // Redéfinition de la touche ACTION 1.
                            Input.buttonMap["KeyAction1"] = "?";
                            Input.buttonRedefine = "KeyAction1";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 7: {
                            // Redéfinition de la touche ACTION 2.
                            Input.buttonMap["KeyAction2"] = "?";
                            Input.buttonRedefine = "KeyAction2";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 8: {
                            // Redéfinition de la touche ACTION 3.
                            Input.buttonMap["KeyAction3"] = "?";
                            Input.buttonRedefine = "KeyAction3";

                            // Joue un son.
                            Sound.play(this.sndSelect);

                            break;
                        }

                        case 10: {
                            // Réinitialise les contrôles par défaut.
                            Input.restoreDefaults("gamepad");

                            // Joue un son.
                            Sound.play(this.sndConfirm);

                            break;
                        }
                    }
                }
            }
        }

        //Input.ack();
    }
});
