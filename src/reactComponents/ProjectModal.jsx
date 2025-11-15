import { useAtomValue, useAtom } from "jotai";
import { isProjectModalVisibleAtom, chosenProjectDataAtom } from "../store";

export default function ProjectModal() {
    const projectData = useAtomValue(chosenProjectDataAtom); // projectData holds the details of the chosen project
    const [isVisible, setIsVisible] = useAtom(isProjectModalVisibleAtom); // isVisible controls whether the modal is shown or hidden

    return (
        isVisible && 
        <div className = "modal">
            <div className = "modal-content">
                <h1>{projectData.title}</h1>
                <div className="modal-buttons-container">
                    {projectData.links.map((link) => (
                        <button 
                            key={link.id} 
                            className="modal-button" 
                            onClick={() => window.open(link.link, "_blank")}
                        >
                            {link.name}
                        </button>
                    ))}
                        <button 
                        className = "modal-button" 
                        onClick={() => {
                            setIsVisible(false);
                        }}
                        >
                            Close
                        </button>
                </div>
            </div>
        </div>
    );
}