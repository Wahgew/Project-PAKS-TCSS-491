/**
 * Manages audio for the game, including background music and volume control.
 * Handles different music for menus vs gameplay with random playlist selection.
 */
class Audiomanager {
    constructor() {
        // Initialize audio elements
        this.menuMusic = new Audio('./sounds/elevator-music-main.mp3');
        this.menuMusic.loop = true;

        // Create playlist for in-game music
        this.gamePlaylist = [
            './sounds/Airport-Lounge.mp3',
            './sounds/bossa-antigua.mp3',
            './sounds/elevator-ride.mp3',
            './sounds/jazz-bossa-nova.mp3',
            './sounds/love-on-hold-monument.mp3',
            './sounds/swingin.mp3',
            './sounds/the-executive-lounge.mp3',
            './sounds/the-funny-bunch.mp3'
        ];

        this.currentGameMusic = new Audio();
        this.currentTrackIndex = -1;

        // Set default volume
        this.volume = 0.2;
        this.isMuted = false;

        // Initialize audio state
        this.isMenuMusicPlaying = false;
        this.isGameMusicPlaying = false;

        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // When a game track ends, play the next one
        this.currentGameMusic.addEventListener('ended', () => {
            this.playNextGameTrack();
        });
    }

    /**
     * Updates the volume for all audio elements
     * @param {number} value - Volume level between 0 and 1
     */
    setVolume(value) {
        this.volume = value;

        if (!this.isMuted) {
            this.menuMusic.volume = this.volume;
            this.currentGameMusic.volume = this.volume;
        }

        // Save volume preference to localStorage
        localStorage.setItem('gameVolume', this.volume);

        console.log(`Volume set to: ${this.volume}`);
    }

    /**
     * Toggles mute state for all audio
     */
    toggleMute() {
        this.isMuted = !this.isMuted;

        this.menuMusic.volume = this.isMuted ? 0 : this.volume;
        this.currentGameMusic.volume = this.isMuted ? 0 : this.volume;

        console.log(`Audio ${this.isMuted ? 'muted' : 'unmuted'}`);

        return this.isMuted;
    }

    /**
     * Starts playing the menu music
     */
    playMenuMusic() {
        if (this.isGameMusicPlaying) {
            this.stopGameMusic();
        }

        if (!this.isMenuMusicPlaying) {
            this.menuMusic.volume = this.isMuted ? 0 : this.volume;
            this.menuMusic.currentTime = 0;
            this.menuMusic.play().catch(error => {
                console.error("Error playing menu music:", error);
            });
            this.isMenuMusicPlaying = true;
            console.log("Menu music started");
        }
    }

    /**
     * Stops the menu music
     */
    stopMenuMusic() {
        if (this.isMenuMusicPlaying) {
            this.menuMusic.pause();
            this.menuMusic.currentTime = 0;
            this.isMenuMusicPlaying = false;
            console.log("Menu music stopped");
        }
    }

    /**
     * Starts playing a random track from the game playlist
     */
    playGameMusic() {
        if (this.isMenuMusicPlaying) {
            this.stopMenuMusic();
        }

        if (this.isGameMusicPlaying) {
            this.currentGameMusic.pause();
        }

        // Select a random track that's different from the last one
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.gamePlaylist.length);
        } while (newIndex === this.currentTrackIndex && this.gamePlaylist.length > 1);

        this.currentTrackIndex = newIndex;
        this.currentGameMusic.src = this.gamePlaylist[this.currentTrackIndex];
        this.currentGameMusic.volume = this.isMuted ? 0 : this.volume;
        this.currentGameMusic.play().catch(error => {
            console.error("Error playing game music:", error);
        });

        this.isGameMusicPlaying = true;
        console.log(`Now playing game track: ${this.gamePlaylist[this.currentTrackIndex]}`);
    }

    /**
     * Plays the next track in the game playlist
     */
    playNextGameTrack() {
        if (this.isGameMusicPlaying) {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.gamePlaylist.length;
            this.currentGameMusic.src = this.gamePlaylist[this.currentTrackIndex];
            this.currentGameMusic.volume = this.isMuted ? 0 : this.volume;
            this.currentGameMusic.play().catch(error => {
                console.error("Error playing next game track:", error);
            });

            console.log(`Now playing game track: ${this.gamePlaylist[this.currentTrackIndex]}`);
        }
    }

    /**
     * Stops the game music
     */
    stopGameMusic() {
        if (this.isGameMusicPlaying) {
            this.currentGameMusic.pause();
            this.currentGameMusic.currentTime = 0;
            this.isGameMusicPlaying = false;
            console.log("Game music stopped");
        }
    }

    /**
     * Loads volume setting from localStorage if available
     */
    loadVolumeSettings() {
        const savedVolume = localStorage.getItem('gameVolume');
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
            this.setVolume(this.volume);
            console.log(`Loaded saved volume: ${this.volume}`);
        }
    }
}

// Create a global instance
window.AUDIO_MANAGER = new Audiomanager();