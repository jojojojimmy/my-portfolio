import CameraController from "./reactComponents/CameraController";

export default function ReactUI() {

    return (
        <>
        {/* bring the UI components here */}
        <p className= "controls-message"> Tap/Click around to move </p>
        <CameraController />
        </>
    );
}
