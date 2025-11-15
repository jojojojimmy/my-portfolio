import { isSocialModalVisibleAtom } from ",,/store";
import { useAtom, useAtomValue } from "jotai";

export default function SocialModal() {

    // useAtom is used to read and write the value of an atom (state) in Jotai
    // useAtomValue is used to read the value of an atom without the ability to write to it
    const [isVisible, setIsVisible] = useAtom(isSocialModalVisibleAtom); // isVisible controls whether the modal is shown or hidden
    const selectedLink = useAtomValue(selectedLinkAtom); // selectedLink holds the URL of the link to be opened
    const selectedLinkDescription = useAtomValue(selectedLinkAtom); // selectedLinkDescription holds a description of the selected link

    const buttons = [
        // each button has an id, name, and handler function that defines what happens when the button is clicked
        {
            id : 0,
            name: "Yes",
            handler: () => {
                // if yes is clicked, open the selected link in a new browser tab and close the modal
                window.open(selectedLink, "_blank");
                setIsVisible(false);
            },
        },
        {
            id : 1,
            name: "No",
            handler: () => {
                setIsVisible(false);
            },
        },
    ];

    // we give the div a className in order to put styling on it via CSS
    return (
        isVisible && 
        <div className = "modal">
            <div className = "modal-content">
                <h1> Would you like to open this link?</h1>
                <span>{selectedLink}</span>
                <p>{selectedLinkDescription}</p>
                <div className = "modal-buttons-container">
                    {buttons.map((button) => (
                        <button key={button.id} className= "modal-button" onClick={button.handler}>
                            {button.name}
                        </button>
                    ))}
                </div>
            </div>
    </div>);
}
