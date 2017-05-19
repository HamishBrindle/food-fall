/**
 * sound.js
 * Sound effects and music for Food Fall!
 *
 * Created by Hamish Brindle on 2017-05-05.
 */

var gameSFX = new Howl({
    src: ['assets/sound/SFX-8bit.mp3'],
    sprite: {
        point: [4600, 1000],
        gameOver: [6000, 1500],
    },
    volume: 0.15
});

var menuSound = new Howl({
    src: ['assets/sound/SFX-menu.wav'],
    sprite: {
        menu: [0, 3000],
    },
    volume: 0.25
});

var music = new Howl({
    src: ['assets/sound/music-fall-together.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.5,
    onend: function() {
        console.log('Finished!');
    }
});

var portalSFX = new Howl({
    src: ['assets/sound/SFX-portal.mp3'],
    sprite: {
        portal: [0, 10000],
    },
    volume: 0.25
});

function muteSound() {
    music.pause();
    gameSFX.volume(0);
    menuSound.volume(0);
    portalSFX.volume(0);
}

function unmuteSound() {
    music.play();
    gameSFX.volume(0.5);
    menuSound.volume(0.5);
    portalSFX.volume(0.5);
}

