import makeSection from "./components/section";
import { COLORS } from "./constants";
import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx"
// import { store } from "./store";

export default async function initGame() {
    // any game initialisation code can go here
    // we create the object k, which is the kaplay context which in turn will be used to call kaplay API functions
    const k = makeKaplayCtx();

    k.loadFont("ibm-regular", "./fonts/IBMPlexSans-Regular.ttf");
    k.loadFont("ibm-bold", "./fonts/IBMPlexSans-Bold.ttf");


    k.loadSprite("floor", "./sprites/floor.png");

    // load background music
    k.loadSound("backgroundMusic", "./audio/backgroundAudio.mp3");

    // the load sprite has parameters (key, path, options)
    // key - the name by which we will refer to this sprite later
    // path - the path to the image file
    // options - an object where we can set various options like frameWidth, frameHeight, etc
    k.loadSprite("me", "./sprites/jojo.png", {
        // specifying how many rows and columns the sprite sheet has
        sliceX: 4,
        sliceY: 8,
        // we can specify the animations using the anims option
        // all animations that have more than one frame, we should let loop to true
        anims: {
            "walk-down-idle": 0,
            "walk-down": { from: 0, to: 3, loop: true },

            "walk-left-idle": 4,
            "walk-left": { from: 4, to: 7, loop: true },
            
            "walk-right-idle": 8,
            "walk-right": { from: 8, to: 11, loop: true },

            "walk-up-idle": 12,            
            "walk-up": { from: 12, to: 15, loop: true },

            "walk-right-down-idle": 16,
            "walk-right-down": { from: 16, to: 19, loop: true },
            
            "walk-left-down-idle": 20,
            "walk-left-down": { from: 20, to: 23, loop: true },

            "walk-left-up-idle": 24,
            "walk-left-up": { from: 24, to: 27, loop: true },

            "walk-right-up-idle": 28,
            "walk-right-up": { from: 28, to: 31, loop: true },
        },
        // using shaders for tiled background and other elements can help improve performance
    });

    // Define floor dimensions - this will be the playable area
    const FLOOR_WIDTH = 2000;
    const FLOOR_HEIGHT = 2000;
    
    // Add wooden floor background sprite
    const floor = k.add([
        k.sprite("floor", { width: FLOOR_WIDTH, height: FLOOR_HEIGHT }),
        k.pos(k.center()),
        k.anchor("center"),
        k.z(-1000),  // ensures it's behind everything
    ]);

    // Calculate floor boundaries (relative to floor center)
    const floorBounds = {
        left: k.center().x - FLOOR_WIDTH / 2,
        right: k.center().x + FLOOR_WIDTH / 2,
        top: k.center().y - FLOOR_HEIGHT / 2,
        bottom: k.center().y + FLOOR_HEIGHT / 2,
    };

    makeSection(
        k, 
        k.vec2(k.center().x, k.center().y - 400), 
        "About", 
        (parent) => {} );

    // create the player at the center of the screen with a speed of 800 units
    // pass floor boundaries to constrain movement
    makePlayer(k, k.vec2(k.center()), 800, floorBounds);
}
