import { useAtom } from "jotai";
import { isEmailModalVisibleAtom, emailAddressAtom} from "../store";


export default function EmailModal() {
    const [isVisible, setIsVisible] = useAtom(isEmailModalVisibleAtom); // isVisible controls whether the modal is shown or hidden
    const emailAddress = useAtomValue(emailAddressAtom); // emailAddress holds the email address to be copied

    const [onCopyMessage, setOnCopyMessage] = useState(""); // this will hold a message to show when the email is copied

    const buttons = [
        // each button has an id, name, and handler function that defines what happens when the button is clicked
        {
            id : 0,
            name: "Copy Email",
            handler: () => {
                // copy the email address to clipboard
                navigator.clipboard.writeText(emailAddress);
                setOnCopyMessage("Email copied to clipboard!");
            },
        },
        {
            id : 1,
            name: "Close",
            handler: () => {
                setIsVisible(false);
                setOnCopyMessage(""); // reset the copy message when closing
            },
        },
    ];

    return (
        isVisible && 
        <div className = "modal">
            <div className = "modal-content">
                <h1> Contact Me</h1>
                <span>{emailAddress}</span>
                {onCopyMessage && <p>{onCopyMessage}</p>}
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