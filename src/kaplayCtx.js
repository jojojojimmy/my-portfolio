// this is where we initialise kaplay game library
import Kaplay from 'kaplay';

export default function makeKaplayCtx() {
    return Kaplay({
        // by making global false, we can only use kaplay functions via the kaplayCtx object
        global: false,
        // setting it to 2 helps with sharper quality on any display
        pixelDensity: 2,
        // this is done to make touch devices(i.e phones) to work like mouse devices
        touchToMouse: true,
        // Set it to False when in production
        debug: true,
        debugKey: 'f5',
        // this is the div where kaplay will put its ui elements in the canvas element in index.html
        canvas: document.getElementById('game-canvas'),
    });
}