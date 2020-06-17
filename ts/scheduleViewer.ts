import { Grafic } from "./objects/grafic.js";

export class scheduleViewer
{
    private body: HTMLDivElement;
    private graficBody = document.createElement("div");
    private grafic: Grafic


    constructor(body: HTMLDivElement)
    {
        this.body = body;
        this.body.style.overflow = "hidden";

        {
            this.body.appendChild(this.graficBody);
            this.grafic = new Grafic(this.graficBody);
        }
    }
}