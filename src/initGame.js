import makeSection from "./components/section";
import { COLORS, ZOOM_MAX_BOUND, ZOOM_MIN_BOUND } from "./constants";
import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx"
import { store, cameraZoomValueAtom } from "./store";

export default async function initGame() {
    // any game initialisation code can go here
    // we create the object k, which is the kaplay context which in turn will be used to call kaplay API functions
    const k = makeKaplayCtx();

    k.loadFont("ibm-regular", "./fonts/IBMPlexSans-Regular.ttf");
    k.loadFont("ibm-bold", "./fonts/IBMPlexSans-Bold.ttf");


    k.loadSprite("room", "./sprites/trialRoom.png");
    k.loadSprite("bookshelf", "./sprites/bookshelf.png");
    k.loadSprite("bed", "./sprites/bed.png");
    k.loadSprite("diningTable", "./sprites/DiningTable.png");
    k.loadSprite("leftChair", "./sprites/leftFacingChair.png");
    k.loadSprite("rightChair", "./sprites/rightFacingChair.png");

    k.loadSprite("horizontalWall", "./sprites/horizontalWall.png");
    k.loadSprite("verticalWall", "./sprites/verticalWall.png");

    // load background music
    k.loadSound("backgroundMusic", "./audio/backgroundAudio.mp3");

    // Load your grass tile
    k.loadSprite("grass-tile", "./sprites/grass.png");

    // Create ONE large tiled background instead of many small ones
    k.add([
        k.sprite("grass-tile", { 
            tiled: true,
            width: 3000,
            height: 3000
        }),
        k.pos(k.center().x - 1500, k.center().y - 1500),  // Offset by half width/height
        k.anchor("topleft"),  // Change anchor to topleft
        k.z(-2000),
    ]);
    
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

    // this is for the camera zoom
    const setInitCamZoomValue = () => {
        if (k.width() < 1000) {
            k.camScale(k.vec2(0.5));
            store.set(cameraZoomValueAtom, 0.5);
            return;
        }
        k.camScale(k.vec2(0.8));
        store.set(cameraZoomValueAtom, 0.8);
    };
    setInitCamZoomValue();
    
    k.onUpdate(() => {
        const cameraZoomValue = store.get(cameraZoomValueAtom);
        if (cameraZoomValue !== k.camScale().x) k.camScale(k.vec2(cameraZoomValue));
    });

    // Define room dimensions and scale
    const ROOM_WIDTH = 256;
    const ROOM_HEIGHT = 256;
    const ROOM_SCALE = 5; // or 5, whichever looks better

    // Define where the wall ends (as a percentage from the top)
    // Adjust this value based on where your wall ends
    const WALL_HEIGHT_PERCENTAGE = 0.25; // 20% of the room is wall

    // Add the room sprite with scale
    const room = k.add([
        k.sprite("room"),
        k.pos(k.center()),
        k.anchor("center"),
        k.scale(ROOM_SCALE),
        k.z(-1000),
    ]);

    // Calculate room boundaries
    const scaledWidth = ROOM_WIDTH * ROOM_SCALE;
    const scaledHeight = ROOM_HEIGHT * ROOM_SCALE;
    const wallHeight = scaledHeight * WALL_HEIGHT_PERCENTAGE;

    // Different padding for each side if needed
    const PADDING_HORIZONTAL = 30; // Left and right
    const PADDING_VERTICAL = 50;   // Top and bottom

    const roomBounds = {
        left: k.center().x - scaledWidth / 2 + PADDING_HORIZONTAL,
        right: k.center().x + scaledWidth / 2 - PADDING_HORIZONTAL,
        top: k.center().y - scaledHeight / 2 + wallHeight + PADDING_VERTICAL,
        bottom: k.center().y + scaledHeight / 2 - PADDING_VERTICAL,
    };


    // makeSection(
    //     k, 
    //     k.vec2(k.center().x, k.center().y - 400), 
    //     "About", 
    //     (parent) => {} );

    // create the player at the center of the screen with a speed of 800 units
    // pass floor boundaries to constrain movement
    makePlayer(k, k.vec2(k.center()), 800, roomBounds);
}
