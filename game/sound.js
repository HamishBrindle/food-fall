/**
 * sound.js
 * Sound effects and music for Food Fall!
 *
 * Created by Hamish Brindle on 2017-05-05.
 */

var coin = new Howl({
    src: ['assets/sound/SFX-coin.wav'],
    sprite: {
        coin: [0, 3000],
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

function muteSound() {
    music.pause();
    coin.volume(0);
    menuSound.volume(0);
}

function unmuteSound() {
    music.play();
    coin.volume(0.5);
    menuSound.volume(0.5);
}

