import { Grafic } from "./objects/grafic.js";
import { SettingsMenu } from "./objects/settingsMenu.js";
export class scheduleViewer {
    constructor(body) {
        this.graficBody = document.createElement("div");
        this.settingsMenuBody = document.createElement("div");
        this.body = body;
        this.body.style.position = "relative";
        this.body.style.overflow = "hidden";
        this.body.style.display = "flex";
        this.body.style.userSelect = "none";
        {
            const settingsMenuWidth = 300;
            this.body.appendChild(this.graficBody);
            this.grafic = new Grafic(this.graficBody, settingsMenuWidth);
            this.body.appendChild(this.settingsMenuBody);
            this.settingsMenu = new SettingsMenu(this.settingsMenuBody, settingsMenuWidth, this.grafic.getFunctions());
        }
        this.body.addEventListener("drop", (e) => this.settingsMenu.mainBodyDrop.bind(this.settingsMenu)(e, this.grafic.getFunctions()));
        this.body.addEventListener("dragover", (e) => this.settingsMenu.mainBodyDragover.bind(this.settingsMenu)(e));
        this.body.addEventListener("dragleave", this.settingsMenu.mainBodyDragleave.bind(this.settingsMenu));
    }
}
