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
            const settingsMenuWidth = 300;
            this.body.appendChild(this.graficBody);
            this.grafic = new Grafic(this.graficBody, settingsMenuWidth);

            this.body.appendChild(this.settingsMenuBody);
            this.settingsMenu = new SettingsMenu(this.settingsMenuBody, settingsMenuWidth, this.grafic.getFunctions());
        }
    }
}