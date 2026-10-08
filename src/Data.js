import Constants from "@/Constants.js";

export default ({
    // Variables
    // ---------

    // Liste des niveaux.
    stages: [
        // Ecran-titre
        // -----------
        {
            color: 21,
            time: 999,
            open: true,
            platforms: [
                { x: 10, y: 18, w: 16, h: 1, type: "platform" },
                { x: 10, y: 12, w: 16, h: 1, type: "platform" },
                { x: 2, y: 18, w: 4, h: 1, type: "platform" },
                { x: 2, y: 12, w: 4, h: 1, type: "platform" },
                { x: 30, y: 18, w: 4, h: 1, type: "platform" },
                { x: 30, y: 12, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 14, y: 16, type: "boumbo", direction: "right" },
                { x: 20, y: 10, type: "boumbo", direction: "left" },
            ],
            crates: [
                { x: 12, y: 16, size: "small" },
                { x: 22, y: 16, size: "small" },
                { x: 16, y: 8, size: "big" },
                { x: 2, y: 10, size: "small" },
                { x: 32, y: 10, size: "small" },
            ],
        },

        // Niveau 1
        // --------
        {
            color: 1,
            time: 60,
            open: false,
            platforms: [
                { x: 10, y: 18, w: 16, h: 1, type: "platform" },
                { x: 14, y: 12, w: 8, h: 1, type: "platform" },
                { x: 2, y: 16, w: 4, h: 1, type: "platform" },
                { x: 30, y: 16, w: 4, h: 1, type: "platform" },
                { x: 2, y: 10, w: 6, h: 1, type: "platform" },
                { x: 28, y: 10, w: 6, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 4, y: 8, type: "motan", direction: "right" },
                { x: 30, y: 8, type: "motan", direction: "left" },
                { x: 17, y: 8, type: "motan", direction: "right" },
            ],
            crates: [
                { x: 2, y: 14, size: "small" },
                { x: 32, y: 14, size: "small" },
                { x: 17, y: 10, size: "small" },
            ],
        },

        // Niveau 2
        // --------
        {
            color: 6,
            time: 90,
            open: false,
            platforms: [
                { x: 15, y: 10, w: 6, h: 1, type: "platform" },
                { x: 9, y: 15, w: 6, h: 1, type: "platform" },
                { x: 21, y: 15, w: 6, h: 1, type: "platform" },
                { x: 15, y: 20, w: 6, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 17, y: 8, type: "motan", direction: "left" },
                { x: 11, y: 13, type: "motan", direction: "left" },
                { x: 23, y: 13, type: "motan", direction: "right" },
            ],
            crates: [
                { x: 9, y: 13, size: "small" },
                { x: 25, y: 13, size: "small" },
                { x: 15, y: 22, size: "small" },
                { x: 19, y: 22, size: "small" },
            ],
        },

        // Niveau 3
        // --------
        {
            color: 2,
            time: 90,
            open: true,
            platforms: [
                { x: 16, y: 8, w: 4, h: 1, type: "platform" },
                { x: 12, y: 12, w: 4, h: 1, type: "platform" },
                { x: 20, y: 12, w: 4, h: 1, type: "platform" },
                { x: 6, y: 16, w: 6, h: 1, type: "platform" },
                { x: 24, y: 16, w: 6, h: 1, type: "platform" },
                { x: 2, y: 20, w: 4, h: 1, type: "platform" },
                { x: 12, y: 20, w: 12, h: 1, type: "platform" },
                { x: 30, y: 20, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 13, y: 10, type: "motan", direction: "left" },
                { x: 21, y: 10, type: "ballo", direction: "right" },
                { x: 7, y: 14, type: "ballo", direction: "left" },
                { x: 27, y: 14, type: "motan", direction: "right" }
            ],
            crates: [
                { x: 16, y: 16, size: "big" },
                { x: 10, y: 14, size: "small" },
                { x: 24, y: 14, size: "small" },
                { x: 16, y: 6, size: "small" },
                { x: 18, y: 6, size: "small" },
            ],
        },

        // Niveau 4
        // --------
        {
            color: 8,
            time: 90,
            open: true,
            platforms: [
                { x: 10, y: 8, w: 6, h: 1, type: "platform" },
                { x: 20, y: 8, w: 6, h: 1, type: "platform" },
                { x: 16, y: 13, w: 4, h: 1, type: "platform" },
                { x: 10, y: 9, w: 1, h: 3, type: "platform" },
                { x: 25, y: 9, w: 1, h: 3, type: "platform" },
                { x: 2, y: 8, w: 4, h: 1, type: "platform" },
                { x: 30, y: 8, w: 4, h: 1, type: "platform" },
                { x: 6, y: 18, w: 4, h: 1, type: "platform" },
                { x: 26, y: 18, w: 4, h: 1, type: "platform" },
                { x: 16, y: 18, w: 4, h: 6, type: "platform" },
                { x: 14, y: 18, w: 2, h: 1, type: "platform" },
                { x: 20, y: 18, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 17, y: 11, type: "ballo", direction: "left" },
                { x: 12, y: 6, type: "ballo", direction: "left" },
                { x: 22, y: 6, type: "ballo", direction: "right" },
                { x: 6, y: 16, type: "ballo", direction: "left" },
                { x: 28, y: 16, type: "ballo", direction: "right" },
            ],
            crates: [
                { x: 2, y: 6, size: "small" },
                { x: 32, y: 6, size: "small" },
                { x: 8, y: 16, size: "small" },
                { x: 26, y: 16, size: "small" },
                { x: 16, y: 14, size: "big" },
            ],
        },

        // Niveau 5
        // --------
        {
            color: 3,
            time: 90,
            open: true,
            platforms: [
                { x: 10, y: 8, w: 6, h: 1, type: "platform" },
                { x: 20, y: 12, w: 6, h: 1, type: "platform" },
                { x: 10, y: 16, w: 6, h: 1, type: "platform" },
                { x: 20, y: 20, w: 6, h: 1, type: "platform" },
                { x: 2, y: 8, w: 2, h: 1, type: "platform" },
                { x: 30, y: 8, w: 4, h: 1, type: "platform" },
                { x: 2, y: 16, w: 2, h: 1, type: "platform" },
                { x: 30, y: 16, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 12, y: 6, type: "zebulon", direction: "left" },
                { x: 22, y: 10, type: "zebulon", direction: "right" },
                { x: 12, y: 14, type: "zebulon", direction: "left" },
                { x: 22, y: 18, type: "zebulon", direction: "right" },
            ],
            crates: [
                { x: 16, y: 20, size: "big" },
                { x: 20, y: 18, size: "small" },
                { x: 14, y: 14, size: "small" },
                { x: 20, y: 10, size: "small" },
                { x: 14, y: 6, size: "small" },
            ],
        },

        // Niveau 6
        // --------
        {
            color: 4,
            time: 90,
            open: true,
            platforms: [
                { x: 10, y: 8, w: 16, h: 1, type: "platform" },
                { x: 2, y: 16, w: 6, h: 1, type: "platform" },
                { x: 28, y: 16, w: 6, h: 1, type: "platform" },
                { x: 14, y: 19, w: 8, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 12, y: 6, type: "zebulon", direction: "left" },
                { x: 22, y: 6, type: "zebulon", direction: "right" },
                { x: 4, y: 14, type: "zebulon", direction: "right" },
                { x: 30, y: 14, type: "zebulon", direction: "left" },
            ],
            crates: [
                { x: 14, y: 15, size: "big" },
                { x: 18, y: 15, size: "big" },
                //{ x: 16, y: 4, size: "big" },
                { x: 2, y: 14, size: "small" },
                { x: 32, y: 14, size: "small" },
            ],
        },

        // Niveau 7
        // --------
        {
            color: 5,
            time: 120,
            open: false,
            platforms: [
                { x: 8, y: 12, w: 20, h: 1, type: "platform" },
                { x: 15, y: 10, w: 1, h: 10, type: "platform" },
                { x: 20, y: 10, w: 1, h: 10, type: "platform" },
                { x: 2, y: 20, w: 4, h: 1, type: "platform" },
                { x: 2, y: 16, w: 2, h: 1, type: "platform" },
                { x: 30, y: 20, w: 4, h: 1, type: "platform" },
                { x: 32, y: 16, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 12, y: 6, type: "voletta", direction: "left" },
                { x: 8, y: 8, type: "voletta", direction: "left" },
                { x: 22, y: 6, type: "voletta", direction: "right" },
                { x: 26, y: 8, type: "voletta", direction: "right" },
            ],
            crates: [
                { x: 16, y: 8, size: "big" },
                { x: 2, y: 18, size: "small" },
                { x: 32, y: 18, size: "small" },
            ],
        },

        // Niveau 8
        // --------
        {
            color: 7,
            time: 90,
            open: false,
            platforms: [
                { x: 6, y: 9, w: 6, h: 1, type: "platform" },
                { x: 6, y: 19, w: 6, h: 1, type: "platform" },
                { x: 15, y: 14, w: 6, h: 1, type: "platform" },
                { x: 24, y: 9, w: 6, h: 1, type: "platform" },
                { x: 24, y: 19, w: 6, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 7, y: 7, type: "motan", direction: "right" },
                { x: 10, y: 15, type: "motan", direction: "left" },
                { x: 27, y: 7, type: "motan", direction: "left" },
                { x: 24, y: 15, type: "motan", direction: "right" },
            ],
            crates: [
                { x: 16, y: 20, size: "big" },
                { x: 16, y: 12, size: "small" },
                { x: 18, y: 12, size: "small" },
                { x: 10, y: 17, size: "small" },
                { x: 24, y: 17, size: "small" },
            ],
        },

        // Niveau 9
        // --------
        {
            color: 10,
            time: 120,
            open: true,
            platforms: [
                { x: 10, y: 8, w: 6, h: 1, type: "platform" },
                { x: 10, y: 9, w: 1, h: 3, type: "platform" },
                { x: 20, y: 8, w: 6, h: 1, type: "platform" },
                { x: 25, y: 9, w: 1, h: 3, type: "platform" },
                { x: 10, y: 16, w: 1, h: 4, type: "platform" },
                { x: 10, y: 20, w: 6, h: 1, type: "platform" },
                { x: 20, y: 20, w: 6, h: 1, type: "platform" },
                { x: 25, y: 16, w: 1, h: 4, type: "platform" },
            ],
            enemies: [
                { x: 12, y: 10, type: "voletta", direction: "right" },
                { x: 12, y: 17, type: "voletta", direction: "right" },
                { x: 22, y: 10, type: "voletta", direction: "left" },
                { x: 22, y: 17, type: "voletta", direction: "left" },
                { x: 17, y: 13, type: "voletta", direction: "left" },
            ],
            crates: [
                { x: 16, y: 20, size: "big" },
                /*{ x: 11, y: 18, size: "small" },
                { x: 23, y: 18, size: "small" },*/
            ],
        },

        // Niveau 10
        // ---------
        {
            color: 1,
            time: 90,
            open: true,
            platforms: [
                { x: 2, y: 14, w: 4, h: 1, type: "platform" },
                { x: 30, y: 14, w: 4, h: 1, type: "platform" },
                { x: 10, y: 9, w: 4, h: 1, type: "platform" },
                { x: 22, y: 9, w: 4, h: 1, type: "platform" },
                { x: 6, y: 19, w: 6, h: 1, type: "platform" },
                { x: 24, y: 19, w: 6, h: 1, type: "platform" },
                { x: 14, y: 14, w: 8, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 4, y: 12, type: "bloto", direction: "right" },
                { x: 30, y: 12, type: "bloto", direction: "left" },
                { x: 12, y: 7, type: "bloto", direction: "left" },
                { x: 22, y: 7, type: "bloto", direction: "right" },
            ],
            crates: [
                { x: 16, y: 20, size: "big" },
                { x: 16, y: 10, size: "big" },
            ],
        },

        // Niveau 11
        // ---------
        {
            color: 9,
            time: 120,
            open: true,
            platforms: [
                { x: 10, y: 9, w: 6, h: 1, type: "platform" },
                { x: 20, y: 9, w: 6, h: 1, type: "platform" },
                { x: 2, y: 14, w: 6, h: 1, type: "platform" },
                { x: 28, y: 14, w: 6, h: 1, type: "platform" },
                { x: 16, y: 14, w: 4, h: 1, type: "platform" },
                { x: 10, y: 19, w: 6, h: 1, type: "platform" },
                { x: 20, y: 19, w: 6, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 8, y: 23, type: "voletta", direction: "right" },
                { x: 26, y: 23, type: "voletta", direction: "left" },
                { x: 10, y: 7, type: "bloto", direction: "right" },
                { x: 24, y: 7, type: "bloto", direction: "left" },
                { x: 14, y: 17, type: "ballo", direction: "left" },
                { x: 20, y: 17, type: "ballo", direction: "right" },
            ],
            crates: [
                { x: 2, y: 12, size: "small" },
                { x: 2, y: 10, size: "small" },
                { x: 32, y: 12, size: "small" },
                { x: 32, y: 10, size: "small" },
            ],
        },

        // Niveau 12
        // ---------
        {
            color: 11,
            time: 120,
            open: false,
            platforms: [
                { x: 7, y: 10, w: 22, h: 1, type: "platform" },
                { x: 6, y: 9, w: 1, h: 2, type: "platform" },
                { x: 28, y: 9, w: 1, h: 2, type: "platform" },
                { x: 16, y: 15, w: 4, h: 1, type: "platform" },
                { x: 16, y: 20, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 9, y: 8, type: "voletta", direction: "left" },
                { x: 11, y: 8, type: "voletta", direction: "left" },
                { x: 13, y: 8, type: "voletta", direction: "left" },
                { x: 15, y: 8, type: "voletta", direction: "left" },
                { x: 17, y: 8, type: "voletta", direction: "left" },
                { x: 19, y: 8, type: "voletta", direction: "left" },
            ],
            crates: [
                { x: 22, y: 8, size: "small" },
                { x: 24, y: 6, size: "big" },
                { x: 30, y: 20, size: "big" },
                { x: 30, y: 16, size: "big" },
                { x: 28, y: 22, size: "small" },
                { x: 28, y: 20, size: "small" },
                { x: 26, y: 22, size: "small" },
            ],
        },

        // Niveau 13
        // ---------
        {
            color: 12,
            time: 120,
            open: true,
            platforms: [
                { x: 7, y: 16, w: 4, h: 1, type: "platform" },
                { x: 16, y: 10, w: 4, h: 1, type: "platform" },
                { x: 25, y: 16, w: 4, h: 1, type: "platform" }, 
            ],
            enemies: [
                { x: 8, y: 14, type: "voletta", direction: "left" },
                { x: 17, y: 8, type: "blobule", direction: "left" },
                { x: 17, y: 14, type: "voletta", direction: "right" },
                { x: 26, y: 14, type: "voletta", direction: "right" },
            ],
            crates: [
                { x: 16, y: 20, size: "big" },
                { x: 16, y: 16, size: "big" },
            ],
        },

        // Niveau 14
        // ---------
        {
            color: 3,
            time: 120,
            open: true,
            platforms: [
                { x: 10, y: 10, w: 4, h: 1, type: "platform" }, 
                { x: 22, y: 10, w: 4, h: 1, type: "platform" },
                { x: 2, y: 18, w: 4, h: 1, type: "platform" },
                { x: 6, y: 14, w: 4, h: 1, type: "platform" },
                { x: 26, y: 14, w: 4, h: 1, type: "platform" },
                { x: 30, y: 18, w: 4, h: 1, type: "platform" }, 
                { x: 16, y: 18, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 3, y: 6, type: "voletta", direction: "right" },
                { x: 31, y: 6, type: "voletta", direction: "left" },
                { x: 9, y: 12, type: "voletta", direction: "right" },
                { x: 25, y: 12, type: "voletta", direction: "left" },
                { x: 13, y: 4, type: "bloto", direction: "right" },
                { x: 21, y: 4, type: "bloto", direction: "left" },
            ],
            crates: [
                { x: 16, y: 14, size: "big" },
                { x: 16, y: 20, size: "big" },
            ],
        },

        // Niveau 15
        // ---------
        {
            color: 20,
            time: 90,
            open: true,
            platforms: [
                { x: 16, y: 9, w: 4, h: 1, type: "platform" },
                { x: 14, y: 14, w: 8, h: 1, type: "platform" },
                { x: 10, y: 19, w: 16, h: 1, type: "platform" },
                { x: 4, y: 8, w: 4, h: 1, type: "platform" },
                { x: 28, y: 8, w: 4, h: 1, type: "platform" },
                { x: 6, y: 13, w: 4, h: 1, type: "platform" },
                { x: 26, y: 13, w: 4, h: 1, type: "platform" },
                { x: 2, y: 18, w: 4, h: 1, type: "platform" },
                { x: 30, y: 18, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 16, y: 7, type: "bloto", direction: "left" },
                { x: 18, y: 7, type: "bloto", direction: "right" },
                { x: 8, y: 11, type: "bloto", direction: "right" },
                { x: 24, y: 11, type: "bloto", direction: "left" },
                { x: 14, y: 17, type: "bloto", direction: "left" },
                { x: 20, y: 17, type: "bloto", direction: "right" },
            ],
            crates: [],
        },

        // Niveau 16
        // ---------
        {
            color: 19,
            time: 150,
            open: true,
            platforms: [
                { x: 8, y: 18, w: 6, h: 1, type: "platform" }, 
                { x: 22, y: 18, w: 6, h: 1, type: "platform" }, 
                { x: 13, y: 13, w: 1, h: 5, type: "platform" }, 
                { x: 22, y: 13, w: 1, h: 5, type: "platform" }, 
                { x: 2, y: 10, w: 4, h: 1, type: "platform" }, 
                { x: 30, y: 10, w: 4, h: 1, type: "platform" }, 
            ],
            enemies: [
                { x: 10, y: 6, type: "voletta", direction: "right" },
                { x: 24, y: 6, type: "voletta", direction: "left" },
                { x: 8, y: 10, type: "voletta", direction: "right" },
                { x: 26, y: 10, type: "voletta", direction: "left" },
                { x: 8, y: 14, type: "voletta", direction: "right" },
                { x: 26, y: 14, type: "voletta", direction: "left" },
                { x: 17, y: 18, type: "blobule", direction: "left" },
            ],
            crates: [
                { x: 2, y: 8, size: "small" },
                { x: 32, y: 8, size: "small" },
                { x: 16, y: 20, size: "big" },
            ],
        },

        // Niveau 17
        // ---------
        {
            color: 9,
            time: 120,
            open: true,
            platforms: [
                { x: 2, y: 9, w: 6, h: 1, type: "platform" },
                { x: 28, y: 9, w: 6, h: 1, type: "platform" },
                { x: 15, y: 9, w: 6, h: 1, type: "platform" },
                { x: 2, y: 14, w: 4, h: 1, type: "platform" },
                { x: 30, y: 14, w: 4, h: 1, type: "platform" },
                { x: 14, y: 14, w: 8, h: 1, type: "platform" },
                { x: 2, y: 19, w: 2, h: 1, type: "platform" },
                { x: 32, y: 19, w: 2, h: 1, type: "platform" },
                { x: 13, y: 19, w: 10, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 11, y: 6, type: "voletta", direction: "left" },
                { x: 23, y: 6, type: "voletta", direction: "right" },
                { x: 3, y: 12, type: "zebulon", direction: "right" },
                { x: 31, y: 12, type: "zebulon", direction: "left" },
                { x: 17, y: 22, type: "motan", direction: "left" },
            ],
            crates: [
                { x: 16, y: 7, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 18, y: 7, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 16, y: 15, size: "big" },
            ],
        },

        // Niveau 18
        // ---------
        {
            color: 4,
            time: 120,
            open: true,
            platforms: [
                { x: 6, y: 8, w: 6, h: 1, type: "platform" },
                { x: 10, y: 11, w: 6, h: 1, type: "platform" },
                { x: 14, y: 14, w: 6, h: 1, type: "platform" },
                { x: 18, y: 17, w: 6, h: 1, type: "platform" },
                { x: 22, y: 20, w: 6, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 6, y: 6, type: "bloto", direction: "right" },
                { x: 10, y: 9, type: "bloto", direction: "right" },
                { x: 14, y: 12, type: "bloto", direction: "right" },
                { x: 18, y: 15, type: "bloto", direction: "right" },
                { x: 22, y: 18, type: "bloto", direction: "right" },
            ],
            crates: [],
        },

        // Niveau 19
        // ---------
        {
            color: 11,
            time: 120,
            open: true,
            platforms: [
                { x: 2, y: 8, w: 13, h: 1, type: "platform" },
                { x: 21, y: 8, w: 13, h: 1, type: "platform" },
                { x: 15, y: 8, w: 1, h: 6, type: "platform" },
                { x: 20, y: 8, w: 1, h: 6, type: "platform" },
                { x: 6, y: 18, w: 4, h: 1, type: "platform" },
                { x: 26, y: 18, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 4, y: 6, type: "blobule", direction: "right" },
                { x: 32, y: 6, type: "blobule", direction: "left" },
            ],
            crates: [
                { x: 16, y: 20, size: "big" },
                { x: 16, y: 16, size: "big" },
                { x: 16, y: 12, size: "big" },
                { x: 16, y: 8, size: "big" },
            ],
        },

        // Niveau 20
        // ---------
        {
            color: 20,
            time: 150,
            open: false,
            platforms: [
                { x: 2, y: 12, w: 4, h: 1, type: "platform" },
                { x: 30, y: 12, w: 4, h: 1, type: "platform" },
                { x: 16, y: 16, w: 4, h: 1, type: "platform" },
                { x: 8, y: 20, w: 4, h: 1, type: "platform" },
                { x: 24, y: 20, w: 4, h: 1, type: "platform" },
                { x: 14, y: 10, w: 8, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 14, y: 8, type: "voletta", direction: "left" },
                { x: 11, y: 11, type: "voletta", direction: "left" },
                { x: 11, y: 14, type: "voletta", direction: "left" },
                { x: 14, y: 17, type: "voletta", direction: "left" },
                { x: 20, y: 8, type: "voletta", direction: "right" },
                { x: 23, y: 11, type: "voletta", direction: "right" },
                { x: 23, y: 14, type: "voletta", direction: "right" },
                { x: 20, y: 17, type: "voletta", direction: "right" },
            ],
            crates: [],
        },

        // Niveau 21
        // ---------
        {
            color: 5,
            time: 120,
            open: false,
            platforms: [
                { x: 6, y: 8, w: 24, h: 1, type: "platform" },
                { x: 2, y: 16, w: 12, h: 1, type: "platform" },
                { x: 22, y: 16, w: 12, h: 1, type: "platform" },
                { x: 2, y: 20, w: 6, h: 1, type: "platform" },
                { x: 12, y: 20, w: 4, h: 1, type: "platform" },
                { x: 20, y: 20, w: 4, h: 1, type: "platform" },
                { x: 28, y: 20, w: 6, h: 1, type: "platform" },
                { x: 2, y: 12, w: 8, h: 1, type: "platform" },
                { x: 14, y: 12, w: 8, h: 1, type: "platform" },
                { x: 26, y: 12, w: 8, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 8, y: 14, type: "ballo", direction: "left" },
                { x: 26, y: 14, type: "ballo", direction: "right" },
                { x: 17, y: 9, type: "voletta", direction: "right" },
                { x: 3, y: 6, type: "ballo", direction: "left" },
                { x: 31, y: 6, type: "ballo", direction: "right" },
            ],
            crates: [
                { x: 8, y: 20, size: "big" },
                { x: 16, y: 20, size: "big" },
                { x: 24, y: 20, size: "big" },
                { x: 10, y: 12, size: "big" },
                { x: 22, y: 12, size: "big" },
                { x: 2, y: 8, size: "big" },
                { x: 30, y: 8, size: "big" },
                { x: 14, y: 16, size: "big" },
                { x: 18, y: 16, size: "big" },
            ],
        },

        // Niveau 22
        // ---------
        {
            color: 7,
            time: 120,
            open: false,
            platforms: [
                { x: 18, y: 8, w: 2, h: 2, type: "platform" },
                { x: 16, y: 12, w: 2, h: 2, type: "platform" },
                { x: 18, y: 16, w: 2, h: 2, type: "platform" },
                { x: 16, y: 20, w: 2, h: 2, type: "platform" },
            ],
            enemies: [
                { x: 10, y: 10, type: "voletta", direction: "left" },
                { x: 10, y: 10, type: "voletta", direction: "right" },
                { x: 24, y: 10, type: "voletta", direction: "left" },
                { x: 24, y: 10, type: "voletta", direction: "right" },
            ],
            crates: [],
        },

        // Niveau 23
        // ---------
        {
            color: 16,
            time: 90,
            open: true,
            platforms: [
                { x: 8, y: 9, w: 20, h: 1, type: "platform" },
                { x: 8, y: 14, w: 20, h: 1, type: "platform" },
                { x: 8, y: 19, w: 20, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 20, y: 7, type: "motan", direction: "left" },
                { x: 24, y: 7, type: "ballo", direction: "right" },
                { x: 19, y: 12, type: "motan", direction: "left" },
                { x: 23, y: 12, type: "ballo", direction: "right" },
                { x: 18, y: 17, type: "motan", direction: "left" },
                { x: 22, y: 17, type: "ballo", direction: "right" },
            ],
            crates: [],
        },

        // Niveau 24
        // ---------
        {
            color: 1,
            time: 90,
            open: true,
            platforms: [
                { x: 2, y: 8, w: 4, h: 1, type: "platform" },
                { x: 16, y: 8, w: 4, h: 1, type: "platform" },
                { x: 30, y: 8, w: 4, h: 1, type: "platform" },
                { x: 6, y: 12, w: 4, h: 1, type: "platform" },
                { x: 26, y: 12, w: 4, h: 1, type: "platform" },
                { x: 10, y: 16, w: 4, h: 1, type: "platform" },
                { x: 22, y: 16, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 2, y: 6, type: "zebulon", direction: "right" },
                { x: 4, y: 6, type: "zebulon", direction: "right" },
                { x: 30, y: 6, type: "zebulon", direction: "left" },
                { x: 32, y: 6, type: "zebulon", direction: "left" },
                { x: 16, y: 6, type: "zebulon", direction: "left" },
                { x: 18, y: 6, type: "zebulon", direction: "right" },
            ],
            crates: [
                { x: 16, y: 20, size: "big" },
            ],
        },

        // Niveau 25
        // ---------
        {
            color: 8,
            time: 120,
            open: true,
            platforms: [
                { x: 8, y: 10, w: 6, h: 1, type: "platform" }, 
                { x: 22, y: 10, w: 6, h: 1, type: "platform" }, 
                { x: 14, y: 8, w: 2, h: 1, type: "platform" }, 
                { x: 20, y: 8, w: 2, h: 1, type: "platform" }, 
                { x: 6, y: 12, w: 2, h: 1, type: "platform" }, 
                { x: 4, y: 14, w: 2, h: 1, type: "platform" }, 
                { x: 2, y: 16, w: 2, h: 1, type: "platform" }, 
                { x: 28, y: 12, w: 2, h: 1, type: "platform" }, 
                { x: 30, y: 14, w: 2, h: 1, type: "platform" }, 
                { x: 32, y: 16, w: 2, h: 1, type: "platform" }, 
                { x: 8, y: 16, w: 2, h: 1, type: "platform" }, 
                { x: 10, y: 18, w: 2, h: 1, type: "platform" }, 
                { x: 12, y: 20, w: 2, h: 1, type: "platform" }, 
                { x: 14, y: 22, w: 2, h: 1, type: "platform" }, 
                { x: 26, y: 16, w: 2, h: 1, type: "platform" }, 
                { x: 24, y: 18, w: 2, h: 1, type: "platform" }, 
                { x: 22, y: 20, w: 2, h: 1, type: "platform" }, 
                { x: 20, y: 22, w: 2, h: 1, type: "platform" }, 
                { x: 16, y: 14, w: 4, h: 1, type: "platform" }, 
            ],
            enemies: [
                { x: 14, y: 6, type: "ballo", direction: "left" },
                { x: 20, y: 6, type: "ballo", direction: "right" },
                { x: 8, y: 14, type: "ballo", direction: "right" },
                { x: 26, y: 14, type: "ballo", direction: "left" },
            ],
        },

        // Niveau 26
        // ---------
        {
            color: 17,
            time: 150,
            open: false,
            platforms: [
                { x: 10, y: 19, w: 16, h: 1, type: "platform" },
                { x: 14, y: 14, w: 8, h: 1, type: "platform" },
                { x: 6, y: 9, w: 4, h: 1, type: "platform" },
                { x: 26, y: 9, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 14, y: 12, type: "crokey", direction: "right" },
                { x: 20, y: 12, type: "crokey", direction: "left" },
                { x: 17, y: 17, type: "crokey", direction: "right" },
            ],
            crates: [
                { x: 8, y: 7, size: "small" },
                { x: 26, y: 7, size: "small" },
            ],
        },

        // Niveau 27
        // ---------
        {
            color: 11,
            time: 90,
            open: false,
            platforms: [
                { x: 2, y: 19, w: 2, h: 1, type: "platform" },
                { x: 2, y: 14, w: 4, h: 1, type: "platform" },
                { x: 2, y: 9, w: 4, h: 1, type: "platform" },
                { x: 32, y: 19, w: 2, h: 1, type: "platform" },
                { x: 30, y: 14, w: 4, h: 1, type: "platform" },
                { x: 30, y: 9, w: 4, h: 1, type: "platform" },
                { x: 10, y: 9, w: 2, h: 1, type: "platform" },
                { x: 24, y: 9, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 16, y: 10, type: "zebulon", direction: "left" },
                { x: 18, y: 10, type: "zebulon", direction: "right" },
                { x: 14, y: 12, type: "zebulon", direction: "left" },
                { x: 20, y: 12, type: "zebulon", direction: "right" },
            ],
            crates: [
                { x: 8, y: 20, size: "big" },
                { x: 12, y: 20, size: "big" },
                { x: 16, y: 20, size: "big" },
                { x: 20, y: 20, size: "big" },
                { x: 24, y: 20, size: "big" },
                { x: 12, y: 16, size: "big" },
                { x: 16, y: 16, size: "big" },
                { x: 20, y: 16, size: "big" },
                { x: 16, y: 12, size: "big" },
                { x: 6, y: 22, size: "small" },
                { x: 10, y: 18, size: "small" },
                { x: 14, y: 14, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 28, y: 22, size: "small" },
                { x: 24, y: 18, size: "small" },
                { x: 20, y: 14, size: "small", itemType: Constants.ITEM_DIAMOND },
            ],
        },

        // Niveau 28
        // ---------
        {
            color: 18,
            time: 120,
            open: true,
            platforms: [
                { x: 9, y: 9, w: 1, h: 1, type: "platform" },
                { x: 7, y: 14, w: 1, h: 1, type: "platform" },
                { x: 9, y: 19, w: 1, h: 1, type: "platform" },
                { x: 16, y: 9, w: 4, h: 1, type: "platform" },
                { x: 12, y: 14, w: 4, h: 1, type: "platform" },
                { x: 20, y: 14, w: 4, h: 1, type: "platform" },
                { x: 16, y: 19, w: 4, h: 1, type: "platform" },
                { x: 26, y: 9, w: 1, h: 1, type: "platform" },
                { x: 28, y: 14, w: 1, h: 1, type: "platform" },
                { x: 26, y: 19, w: 1, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 8, y: 7, type: "ballo", direction: "left" },
                { x: 26, y: 7, type: "ballo", direction: "right" },
                { x: 8, y: 17, type: "bloto", direction: "right" },
                { x: 26, y: 17, type: "bloto", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 29
        // ---------
        {
            color: 9,
            time: 60,
            open: false,
            platforms: [
                { x: 15, y: 8, w: 6, h: 2, type: "platform" },
                { x: 14, y: 9, w: 2, h: 3, type: "platform" },
                { x: 20, y: 9, w: 2, h: 5, type: "platform" },
                { x: 18, y: 13, w: 3, h: 2, type: "platform" },
                { x: 17, y: 14, w: 2, h: 3, type: "platform" },
                { x: 17, y: 18, w: 2, h: 2, type: "platform" },
            ],
            enemies: [
                { x: 13, y: 7, type: "voletta", direction: "left" },
                { x: 15, y: 6, type: "voletta", direction: "left" },
                { x: 18, y: 11, type: "voletta", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 30
        // ---------
        {
            color: 8,
            time: 120,
            open: true,
            platforms: [
                { x: 10, y: 11, w: 6, h: 1, type: "platform" },
                { x: 10, y: 7, w: 1, h: 4, type: "platform" },
                { x: 15, y: 7, w: 1, h: 4, type: "platform" },
                { x: 20, y: 11, w: 6, h: 1, type: "platform" },
                { x: 20, y: 7, w: 1, h: 4, type: "platform" },
                { x: 25, y: 7, w: 1, h: 4, type: "platform" },
                { x: 15, y: 19, w: 6, h: 1, type: "platform" },
                { x: 15, y: 15, w: 1, h: 4, type: "platform" },
                { x: 20, y: 15, w: 1, h: 4, type: "platform" },
                { x: 5, y: 19, w: 6, h: 1, type: "platform" },
                { x: 5, y: 15, w: 1, h: 4, type: "platform" },
                { x: 10, y: 15, w: 1, h: 4, type: "platform" },
                { x: 25, y: 19, w: 6, h: 1, type: "platform" },
                { x: 25, y: 15, w: 1, h: 4, type: "platform" },
                { x: 30, y: 15, w: 1, h: 4, type: "platform" },
            ],
            enemies: [
                { x: 12, y: 9, type: "bloto", direction: "right" },
                { x: 22, y: 9, type: "bloto", direction: "left" },
                { x: 17, y: 17, type: "bloto", direction: "left" },
                { x: 7, y: 17, type: "bloto", direction: "right" },
                { x: 27, y: 17, type: "bloto", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 31
        // ---------
        {
            color: 6,
            time: 90,
            open: false,
            platforms: [
                { x: 16, y: 18, w: 8, h: 1, type: "platform" },
                { x: 24, y: 12, w: 6, h: 1, type: "platform" },
                { x: 12, y: 8, w: 12, h: 1, type: "platform" },
                { x: 6, y: 12, w: 6, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 16, y: 16, type: "crokey", direction: "left" },
                { x: 26, y: 10, type: "crokey", direction: "left" },
                { x: 10, y: 10, type: "crokey", direction: "right" },
            ],
            crates: [
                { x: 8, y: 22, size: "small" },
                { x: 10, y: 22, size: "small" },
                { x: 12, y: 22, size: "small" },
                { x: 14, y: 22, size: "small" },
                { x: 18, y: 16, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 20, y: 16, size: "small" },
                { x: 22, y: 16, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 26, y: 10, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 28, y: 10, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 28, y: 22, size: "small" },
                { x: 30, y: 20, size: "big" },
                { x: 6, y: 10, size: "small" },
                { x: 8, y: 10, size: "small" },
                { x: 16, y: 4, size: "big" },
            ],
        },

        // Niveau 32
        // ---------
        {
            color: 6,
            time: 120,
            open: true,
            platforms: [
                { x: 10, y: 8, w: 2, h: 1, type: "platform" },
                { x: 24, y: 8, w: 2, h: 1, type: "platform" },
                { x: 10, y: 20, w: 2, h: 1, type: "platform" },
                { x: 24, y: 20, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 10, y: 6, type: "blobule", direction: "right" },
                { x: 24, y: 6, type: "blobule", direction: "left" },
                { x: 10, y: 18, type: "blobule", direction: "right" },
                { x: 24, y: 18, type: "blobule", direction: "left" },
            ],
            crates: [
                { x: 16, y: 20, size: "big" },
            ],
        },

        // Niveau 33
        // ---------
        {
            color: 5,
            time: 120,
            open: true,
            platforms: [
                { x: 2, y: 14, w: 6, h: 1, type: "platform" },
                { x: 28, y: 14, w: 6, h: 1, type: "platform" },
                { x: 8, y: 19, w: 2, h: 1, type: "platform" },
                { x: 26, y: 19, w: 2, h: 1, type: "platform" },
                { x: 10, y: 9, w: 6, h: 1, type: "platform" },
                { x: 20, y: 9, w: 6, h: 1, type: "platform" },
                { x: 16, y: 14, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 4, y: 12, type: "boumbo", direction: "right" },
                { x: 30, y: 12, type: "boumbo", direction: "left" },
                { x: 14, y: 7, type: "boumbo", direction: "right" },
                { x: 20, y: 7, type: "boumbo", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 34
        // ---------
        {
            color: 12,
            time: 120,
            open: true,
            platforms: [
                { x: 16, y: 7, w: 4, h: 1, type: "platform" },
                { x: 12, y: 11, w: 4, h: 1, type: "platform" },
                { x: 20, y: 11, w: 4, h: 1, type: "platform" },
                { x: 2, y: 15, w: 8, h: 1, type: "platform" },
                { x: 26, y: 15, w: 8, h: 1, type: "platform" },
                { x: 14, y: 19, w: 8, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 16, y: 5, type: "crokey", direction: "left" },
                { x: 18, y: 5, type: "crokey", direction: "right" },
                { x: 16, y: 13, type: "crokey", direction: "left" },
                { x: 18, y: 13, type: "crokey", direction: "right" },
            ],
            crates: [
                { x: 16, y: 15, size: "big" },
                { x: 2, y: 13, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 32, y: 13, size: "small", itemType: Constants.ITEM_DIAMOND },
            ],
        },

        // Niveau 35
        // ---------
        {
            color: 3,
            time: 30,
            open: true,
            platforms: [
                { x: 16, y: 23, w: 4, h: 1, type: "spear" },
                { x: 8, y: 23, w: 2, h: 1, type: "spear" },
                { x: 26, y: 23, w: 2, h: 1, type: "spear" },
                { x: 8, y: 19, w: 2, h: 1, type: "platform" },
                { x: 26, y: 19, w: 2, h: 1, type: "platform" },
                { x: 14, y: 19, w: 8, h: 1, type: "platform" },
                { x: 14, y: 18, w: 2, h: 1, type: "spear" },
                { x: 20, y: 18, w: 2, h: 1, type: "spear" },
                { x: 6, y: 14, w: 4, h: 1, type: "platform" },
                { x: 26, y: 14, w: 4, h: 1, type: "platform" },
                { x: 6, y: 13, w: 2, h: 1, type: "spear" },
                { x: 28, y: 13, w: 2, h: 1, type: "spear" },
                { x: 2, y: 9, w: 4, h: 1, type: "platform" },
                { x: 30, y: 9, w: 4, h: 1, type: "platform" },
                { x: 12, y: 9, w: 12, h: 1, type: "platform" },
                { x: 12, y: 8, w: 4, h: 1, type: "spear" },
                { x: 20, y: 8, w: 4, h: 1, type: "spear" },
                { x: 12, y: 8, w: 4, h: 1, type: "spear" },
            ],
            enemies: [
                { x: 12, y: 6, type: "bloto", direction: "left" },
                { x: 22, y: 6, type: "bloto", direction: "right" },
                { x: 14, y: 16, type: "bloto", direction: "left" },
                { x: 20, y: 16, type: "bloto", direction: "right" },
            ],
            crates: [
                { x: 16, y: 15, size: "big" },
                { x: 2, y: 7, size: "small" },
                { x: 32, y: 7, size: "small" },
            ],
        },

        // Niveau 36
        // ---------
        {
            color: 17,
            time: 120,
            open: true,
            platforms: [
                { x: 6, y: 9, w: 4, h: 1, type: "platform" },
                { x: 6, y: 8, w: 2, h: 1, type: "spear" },
                { x: 10, y: 12, w: 2, h: 1, type: "platform" },
                { x: 8, y: 15, w: 2, h: 1, type: "platform" },
                { x: 14, y: 15, w: 2, h: 1, type: "platform" },
                { x: 26, y: 9, w: 4, h: 1, type: "platform" },
                { x: 28, y: 8, w: 2, h: 1, type: "spear" },
                { x: 24, y: 12, w: 2, h: 1, type: "platform" },
                { x: 26, y: 15, w: 2, h: 1, type: "platform" },
                { x: 20, y: 15, w: 2, h: 1, type: "platform" },
                { x: 16, y: 18, w: 4, h: 1, type: "platform" },
                { x: 16, y: 17, w: 4, h: 1, type: "spear" },
                { x: 10, y: 21, w: 4, h: 1, type: "platform" },
                { x: 22, y: 21, w: 4, h: 1, type: "platform" },
                { x: 17, y: 9, w: 2, h: 1, type: "platform" },
                { x: 10, y: 20, w: 2, h: 1, type: "spear" },
                { x: 24, y: 20, w: 2, h: 1, type: "spear" },
            ],
            enemies: [
                { x: 8, y: 7, type: "boumbo", direction: "right" },
                { x: 26, y: 7, type: "boumbo", direction: "right" },
                { x: 14, y: 13, type: "bloto", direction: "left" },
                { x: 20, y: 13, type: "bloto", direction: "right" },
                { x: 12, y: 18, type: "ballo", direction: "right" },
                { x: 22, y: 18, type: "ballo", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 37
        // ---------
        {
            color: 14,
            time: 120,
            open: true,
            platforms: [
                { x: 10, y: 9, w: 8, h: 1, type: "platform" },
                { x: 18, y: 14, w: 8, h: 1, type: "platform" },
                { x: 30, y: 19, w: 4, h: 1, type: "platform" },
                { x: 2, y: 19, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 4, y: 6, type: "blobule", direction: "right" },
                { x: 30, y: 10, type: "blobule", direction: "left" },
                { x: 26, y: 20, type: "blobule", direction: "left" },
            ],
            crates: [
                { x: 10, y: 5, size: "big" },
                { x: 22, y: 10, size: "big" },
                { x: 16, y: 20, size: "big" },
                { x: 30, y: 15, size: "big" },
                { x: 2, y: 15, size: "big" },
            ],
        },

        // Niveau 38
        // ---------
        {
            color: 9,
            time: 120,
            open: true,
            platforms: [
                { x: 2, y: 10, w: 6, h: 1, type: "platform" },
                { x: 14, y: 10, w: 8, h: 1, type: "platform" },
                { x: 28, y: 10, w: 6, h: 1, type: "platform" },
                { x: 8, y: 15, w: 6, h: 1, type: "platform" },
                { x: 22, y: 15, w: 6, h: 1, type: "platform" },
                { x: 16, y: 20, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 14, y: 4, type: "bloto", direction: "left" },
                { x: 20, y: 4, type: "bloto", direction: "right" },
                { x: 2, y: 4, type: "bloto", direction: "right" },
                { x: 32, y: 4, type: "bloto", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 39
        // ---------
        {
            color: 13,
            time: 120,
            open: true,
            platforms: [
                { x: 6, y: 9, w: 2, h: 1, type: "platform" },
                { x: 6, y: 14, w: 2, h: 1, type: "platform" },
                { x: 6, y: 19, w: 2, h: 1, type: "platform" },
                { x: 28, y: 9, w: 2, h: 1, type: "platform" },
                { x: 28, y: 14, w: 2, h: 1, type: "platform" },
                { x: 28, y: 19, w: 2, h: 1, type: "platform" },
                { x: 17, y: 9, w: 2, h: 1, type: "platform" },
                { x: 17, y: 14, w: 2, h: 1, type: "platform" },
                { x: 17, y: 19, w: 2, h: 1, type: "platform" },
                { x: 10, y: 7, w: 4, h: 1, type: "platform" },
                { x: 10, y: 12, w: 4, h: 1, type: "platform" },
                { x: 10, y: 17, w: 4, h: 1, type: "platform" },
                { x: 22, y: 7, w: 4, h: 1, type: "platform" },
                { x: 22, y: 12, w: 4, h: 1, type: "platform" },
                { x: 22, y: 17, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 6, y: 7, type: "bloto", direction: "right" },
                { x: 28, y: 7, type: "bloto", direction: "left" },
                { x: 6, y: 12, type: "bloto", direction: "right" },
                { x: 28, y: 12, type: "bloto", direction: "left" },
                { x: 6, y: 17, type: "bloto", direction: "right" },
                { x: 28, y: 17, type: "bloto", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 40
        // ---------
        {
            color: 11,
            time: 120,
            open: true,
            platforms: [
                { x: 8, y: 14, w: 8, h: 1, type: "platform" },
                { x: 12, y: 13, w: 4, h: 1, type: "spear" },
                { x: 20, y: 14, w: 8, h: 1, type: "platform" },
                { x: 20, y: 13, w: 4, h: 1, type: "spear" },
                { x: 16, y: 9, w: 4, h: 1, type: "platform" },
                { x: 16, y: 23, w: 4, h: 1, type: "spear" },
                { x: 2, y: 19, w: 4, h: 1, type: "platform" },
                { x: 30, y: 19, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 16, y: 5, type: "motan", direction: "left" },
                { x: 18, y: 5, type: "motan", direction: "right" },
                { x: 8, y: 12, type: "voletta", direction: "left" },
                { x: 26, y: 12, type: "voletta", direction: "right" },
            ],
            crates: [
                { x: 16, y: 7, size: "small" },
                { x: 18, y: 7, size: "small" },
                { x: 6, y: 22, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 28, y: 22, size: "small", itemType: Constants.ITEM_DIAMOND },
            ],
        },

        // Niveau 41
        // ---------
        {
            color: 15,
            time: 150,
            open: true,
            platforms: [
                { x: 9, y: 20, w: 1, h: 4, type: "platform" },
                { x: 26, y: 20, w: 1, h: 4, type: "platform" },
                { x: 9, y: 10, w: 1, h: 6, type: "platform" },
                { x: 26, y: 10, w: 1, h: 6, type: "platform" },
                { x: 16, y: 10, w: 4, h: 1, type: "platform" },
                { x: 16, y: 15, w: 4, h: 1, type: "platform" },
                { x: 14, y: 20, w: 8, h: 1, type: "platform" },
                { x: 2, y: 10, w: 2, h: 1, type: "platform" },
                { x: 7, y: 15, w: 2, h: 1, type: "platform" },
                { x: 2, y: 20, w: 2, h: 1, type: "platform" },
                { x: 32, y: 10, w: 2, h: 1, type: "platform" },
                { x: 27, y: 15, w: 2, h: 1, type: "platform" },
                { x: 32, y: 20, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 2, y: 8, type: "zebulon", direction: "right" },
                { x: 32, y: 8, type: "zebulon", direction: "left" },
                { x: 16, y: 8, type: "ballo", direction: "left" },
                { x: 18, y: 8, type: "ballo", direction: "right" },
                { x: 17, y: 22, type: "voletta", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 42
        // ---------
        {
            color: 16,
            time: 90,
            open: true,
            platforms: [
                { x: 4, y: 10, w: 6, h: 1, type: "platform" },
                { x: 10, y: 14, w: 4, h: 1, type: "platform" },
                { x: 14, y: 18, w: 2, h: 1, type: "platform" },
                { x: 20, y: 18, w: 2, h: 1, type: "platform" },
                { x: 22, y: 14, w: 4, h: 1, type: "platform" },
                { x: 26, y: 10, w: 6, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 6, y: 8, type: "ballo", direction: "right" },
                { x: 28, y: 8, type: "ballo", direction: "left" },
                { x: 12, y: 12, type: "ballo", direction: "right" },
                { x: 22, y: 12, type: "ballo", direction: "left" },
            ],
            crates: [
                { x: 4, y: 8, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 30, y: 8, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 16, y: 18, size: "big" },
                { x: 16, y: 22, size: "small", itemType: Constants.ITEM_DIAMOND },
                { x: 18, y: 22, size: "small", itemType: Constants.ITEM_DIAMOND },
            ],
        },

        // Niveau 43
        // ---------
        {
            color: 18,
            time: 60,
            open: true,
            platforms: [
                { x: 4, y: 15, w: 2, h: 1, type: "platform" },
                { x: 30, y: 15, w: 2, h: 1, type: "platform" },
                { x: 8, y: 10, w: 2, h: 1, type: "platform" },
                { x: 26, y: 10, w: 2, h: 1, type: "platform" },
                { x: 6, y: 17, w: 4, h: 1, type: "platform" },
                { x: 26, y: 17, w: 4, h: 1, type: "platform" },
                { x: 16, y: 15, w: 4, h: 1, type: "platform" },
                { x: 10, y: 5, w: 2, h: 1, type: "platform" },
                { x: 24, y: 5, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 4, y: 13, type: "blobule", direction: "right" },
                { x: 30, y: 13, type: "blobule", direction: "left" },
                { x: 8, y: 8, type: "motan", direction: "right" },
                { x: 26, y: 8, type: "motan", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 44
        // ---------
        {
            color: 16,
            time: 90,
            open: true,
            platforms: [
                { x: 10, y: 6, w: 4, h: 1, type: "platform" },
                { x: 22, y: 6, w: 4, h: 1, type: "platform" },
                { x: 10, y: 21, w: 4, h: 1, type: "platform" },
                { x: 22, y: 21, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 10, y: 18, type: "voletta", direction: "right" },
                { x: 12, y: 16, type: "voletta", direction: "right" },
                { x: 14, y: 14, type: "voletta", direction: "right" },
                { x: 20, y: 14, type: "voletta", direction: "left" },
                { x: 22, y: 16, type: "voletta", direction: "left" },
                { x: 24, y: 18, type: "voletta", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 45
        // ---------
        {
            color: 20,
            time: 30,
            open: true,
            platforms: [
                { x: 8, y: 8, w: 1, h: 9, type: "platform" },
                { x: 5, y: 16, w: 3, h: 1, type: "platform" },
                { x: 27, y: 8, w: 1, h: 9, type: "platform" },
                { x: 28, y: 16, w: 3, h: 1, type: "platform" },
                { x: 16, y: 8, w: 4, h: 1, type: "platform" },
                { x: 15, y: 12, w: 6, h: 1, type: "platform" },
                { x: 14, y: 16, w: 8, h: 1, type: "platform" },
                { x: 13, y: 20, w: 10, h: 1, type: "platform" },
                { x: 2, y: 8, w: 3, h: 1, type: "platform" },
                { x: 31, y: 8, w: 3, h: 1, type: "platform" },
                { x: 2, y: 12, w: 3, h: 1, type: "platform" },
                { x: 31, y: 12, w: 3, h: 1, type: "platform" },
                { x: 9, y: 8, w: 2, h: 1, type: "platform" },
                { x: 25, y: 8, w: 2, h: 1, type: "platform" },
                { x: 9, y: 12, w: 1, h: 1, type: "platform" },
                { x: 26, y: 12, w: 1, h: 1, type: "platform" },
                { x: 5, y: 20, w: 4, h: 1, type: "platform" },
                { x: 27, y: 20, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 9, y: 6, type: "bloto", direction: "right" },
                { x: 25, y: 6, type: "bloto", direction: "left" },
                { x: 2, y: 10, type: "motan", direction: "right" },
                { x: 32, y: 10, type: "motan", direction: "left" },
                { x: 6, y: 14, type: "ballo", direction: "right" },
                { x: 28, y: 14, type: "ballo", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 46
        // ---------
        {
            color: 12,
            time: 150,
            open: true,
            platforms: [
                { x: 4, y: 7, w: 2, h: 6, type: "platform" },
                { x: 30, y: 7, w: 2, h: 6, type: "platform" },
                { x: 8, y: 12, w: 4, h: 1, type: "platform" },
                { x: 24, y: 12, w: 4, h: 1, type: "platform" },
                { x: 12, y: 14, w: 2, h: 1, type: "platform" },
                { x: 22, y: 14, w: 2, h: 1, type: "platform" },
                { x: 14, y: 7, w: 2, h: 1, type: "platform" },
                { x: 20, y: 7, w: 2, h: 1, type: "platform" },
                { x: 16, y: 18, w: 4, h: 1, type: "platform" },
                { x: 10, y: 22, w: 2, h: 1, type: "platform" },
                { x: 24, y: 22, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 4, y: 5, type: "boumbo", direction: "right" },
                { x: 30, y: 5, type: "boumbo", direction: "left" },
                { x: 10, y: 10, type: "voletta", direction: "left" },
                { x: 24, y: 10, type: "voletta", direction: "right" },
                { x: 16, y: 16, type: "ballo", direction: "left" },
                { x: 18, y: 16, type: "ballo", direction: "right" },
            ],
            crates: [],
        },

        // Niveau 47
        // ---------
        {
            color: 21,
            time: 90,
            open: true,
            platforms: [
                { x: 8, y: 8, w: 2, h: 13, type: "platform" },
                { x: 26, y: 8, w: 2, h: 13, type: "platform" },
                { x: 16, y: 8, w: 4, h: 13, type: "platform" },
                { x: 2, y: 8, w: 4, h: 1, type: "platform" },
                { x: 4, y: 14, w: 4, h: 1, type: "platform" },
                { x: 2, y: 20, w: 4, h: 1, type: "platform" },
                { x: 30, y: 8, w: 4, h: 1, type: "platform" },
                { x: 28, y: 14, w: 4, h: 1, type: "platform" },
                { x: 30, y: 20, w: 4, h: 1, type: "platform" },
                { x: 12, y: 8, w: 2, h: 1, type: "platform" },
                { x: 12, y: 14, w: 2, h: 1, type: "platform" },
                { x: 12, y: 20, w: 2, h: 1, type: "platform" },
                { x: 22, y: 8, w: 2, h: 1, type: "platform" },
                { x: 22, y: 14, w: 2, h: 1, type: "platform" },
                { x: 22, y: 20, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 8, y: 6, type: "motan", direction: "left" },
                { x: 26, y: 6, type: "motan", direction: "right" },
                { x: 12, y: 12, type: "blobule", direction: "right" },
                { x: 22, y: 12, type: "blobule", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 48
        // ---------
        {
            color: 11,
            time: 90,
            open: true,
            platforms: [
                { x: 4, y: 8, w: 8, h: 1, type: "platform" },
                { x: 2, y: 12, w: 6, h: 1, type: "platform" },
                { x: 6, y: 16, w: 4, h: 1, type: "platform" },
                { x: 10, y: 20, w: 2, h: 1, type: "platform" },
                { x: 24, y: 8, w: 8, h: 1, type: "platform" },
                { x: 28, y: 12, w: 6, h: 1, type: "platform" },
                { x: 26, y: 16, w: 4, h: 1, type: "platform" },
                { x: 24, y: 20, w: 2, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 8, y: 6, type: "motan", direction: "left" },
                { x: 26, y: 6, type: "motan", direction: "right" },
                { x: 4, y: 10, type: "motan", direction: "right" },
                { x: 30, y: 10, type: "motan", direction: "left" },
                { x: 10, y: 18, type: "voletta", direction: "right" },
                { x: 24, y: 18, type: "voletta", direction: "left" },
            ],
            crates: [],
        },

        // Niveau 49
        // ---------
        {
            color: 22,
            time: 120,
            open: true,
            platforms: [
                { x: 10, y: 8, w: 2, h: 1, type: "platform" },
                { x: 24, y: 8, w: 2, h: 1, type: "platform" },
                { x: 10, y: 18, w: 2, h: 1, type: "platform" },
                { x: 24, y: 18, w: 2, h: 1, type: "platform" },
                { x: 2, y: 13, w: 4, h: 1, type: "platform" },
                { x: 30, y: 13, w: 4, h: 1, type: "platform" },
                { x: 16, y: 13, w: 4, h: 1, type: "platform" },
            ],
            enemies: [
                { x: 10, y: 6, type: "voletta", direction: "left" },
                { x: 10, y: 6, type: "voletta", direction: "right" },
                { x: 24, y: 6, type: "voletta", direction: "left" },
                { x: 24, y: 6, type: "voletta", direction: "right" },
                { x: 10, y: 16, type: "voletta", direction: "left" },
                { x: 10, y: 16, type: "voletta", direction: "right" },
                { x: 24, y: 16, type: "voletta", direction: "left" },
                { x: 24, y: 16, type: "voletta", direction: "right" },
            ],
            crates: [],
        },

        // Niveau 50
        // ---------
        {
            color: 21,
            time: 240,
            open: true,
            platforms: [
                { x: 8, y: 17, w: 2, h: 1, type: "spear" },
                { x: 16, y: 17, w: 4, h: 1, type: "spear" },
                { x: 26, y: 17, w: 2, h: 1, type: "spear" },
                { x: 16, y: 18, w: 4, h: 6, type: "platform" },
                { x: 12, y: 18, w: 2, h: 1, type: "platform" },
                { x: 22, y: 18, w: 2, h: 1, type: "platform" },
                { x: 8, y: 18, w: 2, h: 2, type: "platform" },
                { x: 26, y: 18, w: 2, h: 2, type: "platform" },
                { x: 10, y: 11, w: 2, h: 1, type: "spear" },
                { x: 24, y: 11, w: 2, h: 1, type: "spear" },
                { x: 14, y: 12, w: 8, h: 1, type: "platform" },
                { x: 10, y: 12, w: 2, h: 2, type: "platform" },
                { x: 24, y: 12, w: 2, h: 2, type: "platform" },
                { x: 6, y: 7, w: 4, h: 1, type: "platform" },
                { x: 26, y: 7, w: 4, h: 1, type: "platform" },
                { x: 2, y: 14, w: 4, h: 1, type: "platform" },
                { x: 30, y: 14, w: 4, h: 1, type: "platform" },
                /* { x: 16, y: 4, w: 4, h: 4, type: "platform" }, */
            ],
            enemies: [
                { x: 4, y: 12, type: "voletta", direction: "right" },
                { x: 30, y: 12, type: "blobule", direction: "left" },
                { x: 8, y: 5, type: "motan", direction: "left" },
                { x: 26, y: 5, type: "bloto", direction: "right" },
                { x: 14, y: 10, type: "zebulon", direction: "right" },
                { x: 20, y: 10, type: "crokey", direction: "left" },
                { x: 12, y: 16, type: "boumbo", direction: "right" },
                { x: 22, y: 16, type: "ballo", direction: "left" },
            ],
            crates: [],
        }
    ]
});
