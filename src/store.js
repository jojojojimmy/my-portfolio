// an atom is a piece of data you want to have a setter and getter for and want to make sharable between components
import { atom, createStore } from "jotai";

// isSocialModalVisibleAtom is the box which appears when the user interacts with a social media icon
// it will consist of a title, a link to the social media platform, and buttons to select yes or no
export const isSocialModalVisibleAtom = atom(false);
// the selectedLinkAtom is the link to the social media platform that the user has selected
export const selectedLinkAtom = atom(null);
// the selectedPlatformDetailsAtom is the details of the social media platform that the user has selected
export const selectedPlatformDetailsAtom = atom("");

// the isEmailModalVisibleAtom is the box which appears when the user interacts with the email icon
export const isEmailModalVisibleAtom = atom(false);
// the emailAtom is the email address which the user can copy to their clipboard
export const emailAddressAtom = atom("")

export const isProjectModalVisibleAtom = atom(false);
export const chosenProjectDataAtom = atom({
    title: "",
    links: [{ id: 0, name: " ", link: " "}],
});

// create a store to hold all the atoms 
export const store = createStore();