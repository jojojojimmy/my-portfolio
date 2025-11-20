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

    // Load your grass tile
    k.loadSprite("grass-tile", "./sprites/grass.png");

    k.loadSprite("room", "./sprites/trialRoom.png");
    k.loadSprite("leftWall", "./sprites/leftWall.png");
    k.loadSprite("rightWall", "./sprites/rightWall.png");
    k.loadSprite("plant", "./sprites/plant.png");
    k.loadSprite("painting", "./sprites/painting.png");
    k.loadSprite("studyTable", "./sprites/studyTable.png");
    k.loadSprite("studyChair", "./sprites/studyChair.png");
    k.loadSprite("carpet", "./sprites/carpet.png");
    k.loadSprite("lamp", "./sprites/lamp.png");
    k.loadSprite("couch", "./sprites/couch.png");
    k.loadSprite("television", "./sprites/Television.png");
    k.loadSprite("kitchenCounter1", "./sprites/kitchenCounter1.png");
    k.loadSprite("kitchenCounter2", "./sprites/kitchenCounter2.png");
    k.loadSprite("stove", "./sprites/stove.png");
    k.loadSprite("bed", "./sprites/bed.png");
    k.loadSprite("shelf", "./sprites/shelf.png");
    k.loadSprite("bookshelf", "./sprites/bookshelf.png")
    k.loadSprite("diningTable", "./sprites/DiningTable.png");
    k.loadSprite("leftFacingChair", "./sprites/leftFacingChair.png");
    k.loadSprite("rightFacingChair", "./sprites/rightFacingChair.png");

    // load background music
    k.loadSound("backgroundMusic", "./audio/backgroundAudio.mp3");



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
    const PADDING_TOP = -40 ; // negative padding to get closer to the wall 

    const roomBounds = {
        left: k.center().x - scaledWidth / 2 + PADDING_HORIZONTAL,
        right: k.center().x + scaledWidth / 2 - PADDING_HORIZONTAL,
        top: k.center().y - scaledHeight / 2 + wallHeight + PADDING_TOP,
        bottom: k.center().y + scaledHeight / 2 - PADDING_VERTICAL,
    };


    // add the leftWall which has dimensions 128x65
    k.add([
        k.sprite("leftWall"),
        k.pos(k.center().x - 300 , k.center().y + 65),
        k.anchor("center"),
        k.scale(ROOM_SCALE),
        k.z(0),
        // add a collider to the wall to prevent the player from walking through it
        // .area() is used to add a collider to a game object
        k.area({ shape: new k.Rect(k.vec2(0, -10),128 ,60) }),
        // .body() is used to add a physics body to a game object
        // isStatic: true makes the body immovable
        k.body({ isStatic: true }),
        // .outline() is used to draw an outline around the collider for debugging purposes
        k.outline(2, COLORS.color2),
        "leftWall",
    ]);


    // add the rightWall with dimensions 96x66
    k.add([
        k.sprite("rightWall"),
        k.pos(k.center().x + 380 , k.center().y + 65),
        k.anchor("center"),
        k.scale(ROOM_SCALE),
        k.z(0),
        // add a collider to the wall to prevent the player from walking through it
        // the k.vec2(0, -5) is used to offset the collider slightly upwards to better fit the wall sprite
        // this does it such that only the bottom part of the collider is moved up while the top part remains in the same position
        k.area({ shape: new k.Rect(k.vec2(0, -10),96, 60) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "rightWall",
    ])

    // add plant decorations of dimensions 21x39
    k.add([
        k.sprite("plant"),
        k.pos(k.center().x - 150 , k.center().y + 70),
        k.scale(ROOM_SCALE),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),21 ,34) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "plant1"
    ]);

    k.add([
        k.sprite("painting"),
        k.pos(k.center().x + 460 , k.center().y),
        k.scale(ROOM_SCALE),
        k.z(0),
        "painting"
    ])

    // add the study table decoration of dimensions 32x32
    k.add([
        k.sprite("studyTable"),
        k.pos(k.center().x + 320 , k.center().y + 190),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -10),32 ,32) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "studyTable"
    ])

    // add the study chair decoration of dimensions 18x29
    k.add([
        k.sprite("studyChair"),
        k.pos(k.center().x + 320 , k.center().y + 250),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),18 ,29) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "studyChair"
    ])

    // load the carpet sprite of dimensions 52x60

    k.add([
        k.sprite("carpet"),
        k.pos(k.center().x - 375 , k.center().y + 380),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        "carpet"
    ])

    // add the couch sprite of dimensions 60x45
    k.add([
        k.sprite("couch"),
        k.pos(k.center().x - 375, k.center().y + 490),
        k.scale(ROOM_SCALE - 1),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),60 ,40) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "couch"
    ])

    // add the lamp sprite of dimensions 11x36
    k.add([
        k.sprite("lamp"),
        k.pos(k.center().x - 560 , k.center().y + 170),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0),11 ,36) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "lamp"
    ])

    // add the television with dimensions 48x32
    k.add([
        k.sprite("television"),
        k.pos(k.center().x - 370 , k.center().y + 190),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),48 ,27) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "television"
    ])

    // add kitchenCounter1 with dimensions 64x18
    k.add([
        k.sprite("kitchenCounter1"),
        k.pos(k.center().x + 380 , k.center().y - 305),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),64 ,14) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "kitchenCounter1"
    ])

    // // add kitchenCounter2 with dimensions 16x31
    k.add([
        k.sprite("kitchenCounter2"),
        k.pos(k.center().x + 580 , k.center().y - 272),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),16 ,26) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "kitchenCounter2"
    ])

    // add stove with dimensions 32x31
    k.add([
        k.sprite("stove"),
        k.pos(k.center().x + 140 , k.center().y - 340),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),32 ,31) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "stove"
    ])

    // add bed with dimensions 32x64
    k.add([
        k.sprite("bed"),
        k.pos(k.center().x + 530 , k.center().y + 270),
        k.scale(ROOM_SCALE-1),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),32 ,60) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "bed"
    ])

    // add the bookshelf with dimensions 64x47
    k.add([
        k.sprite("bookshelf"),
        k.pos(k.center().x - 160 , k.center().y - 510),
        k.scale(ROOM_SCALE),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5), 32, 47) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "bookshelf"
    ])

    // add the dining table with dimensions 39x42
    k.add([
        k.sprite("diningTable"),
        k.pos(k.center().x - 390, k.center().y - 215),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),39 ,30) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "diningTable"
    ])

    // add the left facing chair with dimensions 11x24
    k.add([
        k.sprite("leftFacingChair"),
        k.pos(k.center().x - 240 , k.center().y - 200),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),11 ,20) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "leftFacingChair"
    ])

    // add the right facing chair with dimensions 11x24
    k.add([
        k.sprite("rightFacingChair"),
        k.pos(k.center().x - 535 , k.center().y - 200),
        k.scale(ROOM_SCALE),
        k.anchor("center"),
        k.z(0),
        k.area({ shape: new k.Rect(k.vec2(0, -5),11 ,20) }),
        k.body({ isStatic: true }),
        k.outline(2, COLORS.color2),
        "rightFacingChair"
    ])



    // makeSection(
    //     k, 
    //     k.vec2(k.center().x, k.center().y - 400), 
    //     "About", 
    //     (parent) => {} );

    // create the player at the center of the screen with a speed of 900 units
    // pass floor boundaries to constrain movement
    makePlayer(k, k.vec2(k.center()), 900, roomBounds);
}
