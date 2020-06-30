import { Grafic } from "./objects/grafic.js";
import { SettingsMenu } from "./objects/settingsMenu.js";

export class scheduleViewer
{
    private body: HTMLDivElement;

    private graficBody = document.createElement("div");
    private grafic: Grafic

    private settingsMenuBody = document.createElement("div");
    private settingsMenu: SettingsMenu


    constructor(body: HTMLDivElement)
    {
        this.body = body;
        this.body.style.position = "relative";
        this.body.style.overflow = "hidden";
        this.body.style.display = "flex";
        this.body.style.userSelect = "none";

        {
            const settingsMenuWidth = 310;
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