export default ({
    context: null,
    enabled: true,
    sounds: [],

    loadAsset: async function(assetName) {
        let index = 0;

        try {
            if (!this.context) {
                // Initialisation de l'API Web Audio.
                this.context = new AudioContext({ latencyHint: "interactive" });
            }

            // Chargement du fichier.
            const response = await fetch(assetName);
            const buffer = await response.arrayBuffer();

            // Décodage du fichier.
            const decodedBuffer = await this.context.decodeAudioData(buffer.slice(0));

            // Créé la structure de données du son.
            let sound = {
                name: assetName,
                buffer: decodedBuffer,
                source: null,
                isPlaying: false,
            };
            index = this.sounds.push(sound);
        } catch(e) {
            console.error("Sound.loadAsset() = ", e);
        }

        return index;
    },
    play: function(soundIndex) {
        if (soundIndex && this.enabled) {
            this.playAnyway(soundIndex);
        }
    },
    playAnyway: async function(soundIndex) {
        if (soundIndex) {
            let idx = (soundIndex - 1);

            // Récupère la structure du son.
            if (this.sounds[idx].source) {
                // Si il y a déjà une source en train d'être joué, on arrête la lecture.
                this.sounds[idx].source.stop(0) 
                this.sounds[idx].source.disconnect();
                this.sounds[idx].source = null;
            }
            
            // Création de la source.
            const source = this.context.createBufferSource();
            source.buffer = this.sounds[idx].buffer;
            source.connect(this.context.destination);

            // Enregistrement de la source.
            this.sounds[idx].source = source;

            // Lance la lecture.
            this.sounds[idx].isPlaying = true;
            source.start(); 
            source.onended = () => {
                this.sounds[idx].isPlaying = false;
            }
        }
    }
});
