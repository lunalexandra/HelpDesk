import { HelpDesk } from "./HelpDesk";

const container = document.querySelector(".container");
const form = new HelpDesk(container);

form.bindToDOM();
form.onClick();
