import { Grafic } from "./objects/grafic.js";
export class scheduleViewer {
    constructor(body) {
        this.graficBody = document.createElement("div");
        this.body = body;
        this.body.style.overflow = "hidden";
        {
            this.body.appendChild(this.graficBody);
            this.grafic = new Grafic(this.graficBody);
        }
    }
        }
