import { store, isSocialModalVisibleAtom, isEmailModalVisibleAtom, isProjectModalVisibleAtom} from "../store";

export default function makePlayer(k, posVec2, speed, floorBounds = null) {
    const player = k.add([
        // k.sprite is used to add a sprite component to the game object with animation "walk-down-idle" as the default animation
        k.sprite("me", { anim: "walk-down-idle" }),
        // k.area is used to add a collision area to the game object which means it can interact with other game objects that have collision areas
        k.area({ shape: new k.Rect(k.vec2(0), 5, 10)}),
        // k.scale is used to scale the size of the sprite by a factor of 8 (so it appears larger on the screen)
        k.scale(3),
        // k.anchor is used to set the anchor point of the sprite to its center (so it rotates and scales around its center)
        // which means the position of the player will be based on its center point
        k.anchor("center"),
        // k.body is used to add a physics body to the game object so it can move and be affected by forces
        k.body(),
        k.pos(posVec2),
        "me",
        {
            direction: k.vec2(0, 0),
            directionName: "walk-down",
        },
    ]);

    // player movement logic

    // isMouseDown variable to track if mouse button is pressed or touch is active
    let isMouseDown = false;
    // get the game canvas element from DOM
    const game = document.getElementById('game-canvas');
    
    // focusout event to handle when the game canvas loses focus (e.g., user switches tabs) and stop movement
    game.addEventListener('focusout', () => {
        isMouseDown = false;
    });

    // mousedown event is triggered when the mouse button is pressed down
    game.addEventListener('mousedown', () => {
        isMouseDown = true;
    });

    // mouse up event is triggered when the mouse button is released
    game.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // touchstart event is triggered when a touch point is placed on the touch surface which indicates the start of a touch interaction
    game.addEventListener('touchstart', () => {
        isMouseDown = true;
    });

    // touchend event is triggered when a touch point is removed from the touch surface which indicates the end of a touch interaction
    game.addEventListener('touchend', () => {
        isMouseDown = false;
    });

    // onUpdate function is called every frame to update the player's position and animation based on mouse or touch input
    player.onUpdate(() => { 
        // camPos is the current position of the camera in the game world
        // .eq checks if the camera position is equal to the player's position
        if (!k.camPos().eq(player.pos)) {
            // k.tween smoothly transitions the camera position to the player's position over 0.2 seconds using a linear easing function
            // easings linear means the speed of the transition is constant throughout the duration of the tween
            k.tween(
                k.camPos(), 
                player.pos, 
                0.2, 
                (newPos) => k.camPos(newPos), 
                k.easings.linear
            );
        }

        if (store.get(isSocialModalVisibleAtom) || store.get(isEmailModalVisibleAtom) || store.get(isProjectModalVisibleAtom)) {
            // we return here so that the player does not move when any modal is open
            return;
        }

        // reset player direction to zero vector because we will recalculate it based on current mouse or touch position
        player.direction = k.vec2(0, 0);
        // worldMousePos is the position of the mouse in the game world coordinates (not screen coordinates) by converting the screen mouse position using k.toWorld function
        const worldMousePos = k.toWorld(k.mousePos());

        // if isMouseDown is true, calculate the direction vector from player position to worldMousePos and normalize it to get a unit vector
        // this direction vector will be used to move the player towards the mouse or touch position
        if (isMouseDown) {
            player.direction = worldMousePos.sub(player.pos).unit();
        }
        
        // what this does is determine the direction name based on the x and y components of the direction vector
        // and this direction name is used to select the appropriate walking animation for the player
        if (player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")) 
        {
            // this checks if the player is not moving (direction is zero vector) and the current animation is not an idle animation
            player.play(`${player.directionName}-idle`);
            return;
        }

        // The following conditionals check the x and y components of the direction vector to determine which direction the player is moving in 
        // and sets the directionName property accordingly so the correct walking animation can be played based on movement direction
        // Up
        if (player.direction.y < -0.8 && Math.abs(player.direction.x) < 0.4) {
            player.directionName = "walk-up";
        }

        // Down
        else if (player.direction.y > 0.8 && Math.abs(player.direction.x) < 0.4) {
            player.directionName = "walk-down";
        }

        // Right
        else if (player.direction.x > 0.8 && Math.abs(player.direction.y) < 0.4) {
            player.directionName = "walk-right";
        }

        // Left
        else if (player.direction.x < -0.8 && Math.abs(player.direction.y) < 0.4) {
            player.directionName = "walk-left";
        }

        // Diagonal Right-Up
        else if (player.direction.x > 0.4 && player.direction.y < -0.4) {
            player.directionName = "walk-right-up";
        }

        // Diagonal Left-Up
        else if (player.direction.x < -0.4 && player.direction.y < -0.4) {
            player.directionName = "walk-left-up";
        }

        // Diagonal Right-Down
        else if (player.direction.x > 0.4 && player.direction.y > 0.4) {
            player.directionName = "walk-right-down";
        }

        // Diagonal Left-Down
        else if (player.direction.x < -0.4 && player.direction.y > 0.4) {
            player.directionName = "walk-left-down";
        }

        // Play animation only if changed
        if (player.getCurAnim().name !== player.directionName) {
            player.play(player.directionName);
        }

        // In top-down games, you move faster diagonally, so to maintain consistent speed in all directions,
        // we scale the speed by 1/sqrt(2) when moving diagonally (both x and y components of direction are non-zero)
        if (player.direction.x !== 0 && player.direction.y !== 0) 
        {
            player.move(player.direction.scale((1/Math.sqrt(2)) * speed))
        } else {
            // move the player in the direction of the calculated vector scaled by the speed
            player.move(player.direction.scale(speed));
        }

        // Constrain player movement within floor boundaries if they exist
        if (floorBounds) {
            // Get player sprite dimensions for boundary checking (accounting for scale)
            const playerWidth = 5 * 3; // area width * scale
            const playerHeight = 10 * 3; // area height * scale
            const halfWidth = playerWidth / 2;
            const halfHeight = playerHeight / 2;

            // Clamp player position to stay within floor boundaries
            const clampedX = Math.max(
                floorBounds.left + halfWidth,
                Math.min(floorBounds.right - halfWidth, player.pos.x)
            );
            const clampedY = Math.max(
                floorBounds.top + halfHeight,
                Math.min(floorBounds.bottom - halfHeight, player.pos.y)
            );

            // Update player position if it was clamped
            if (clampedX !== player.pos.x || clampedY !== player.pos.y) {
                player.pos.x = clampedX;
                player.pos.y = clampedY;
            }
        }
    })

    return player;
}