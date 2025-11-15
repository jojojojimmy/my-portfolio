import { COLORS } from "../constants";

export default function makeSection(k, posVec2, sectionName, onCollide = null) {
    // onCollide is an optional parameter which is a function that will be called when the player collides with this section
    const section = k.add([
        // this will be the 
        k.rect(200, 200, { radius : 10 }), 
        // the anchor component is used such that the game object's is drawn from its center
        k.anchor("center"),
        // the area component is used to give the game object a hitbox to detect collisions with other game objects
        k.area(),
        // the pos component sets the position of the game object
        k.pos(posVec2),
        // color is used to set the color of the rectangle
        k.color(COLORS.color3),
        // this is the tag that we will use to identify this game object for collision detection
        sectionName,
    ]);

    // to add children to a game object, we use the add method on that exisitng game object
    section.add([
        k.text(sectionName, { font: "ibm-bold", size: 50 }),
        k.color(COLORS.color1), 
        k.anchor("center"), 
        k.pos(0, -150), 
    ]);

    if (onCollide) {
        // onCollideController will handle what happens when the player collides with this section of the game
        const onCollideController = section.onCollide("me", () => {
            // since we only want this to happen once, we call cancel on the onCollideController to stop further collision detection
            onCollide(section);
            onCollideController.cancel();
        });
    }

    return section;
}

