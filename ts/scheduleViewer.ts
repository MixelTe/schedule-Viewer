import { Coordinates } from "./objects/coordinates.js";

export class scheduleViewer
{
    private className_main: string;
    private className_grafic: string;

    private svgBody: SVGSVGElement;
    private body_width: number;
    private body_height: number;

    private graficPrm = { x: 0, y: 0, width: 0, height: 0 };
    private graficBody = document.createElementNS("http://www.w3.org/2000/svg", "g");
    private coordinates: Coordinates;
    private graficMap = new Map<EventTarget, any>();

    constructor(svg: SVGSVGElement)
    {
        this.svgBody = svg;
        this.className_main = this.svgBody.id + "scheduleViewer";
        this.className_grafic = this.className_main + "grafic";

        const scgBCR = this.svgBody.getBoundingClientRect()
        this.body_width = scgBCR.width;
        this.body_height = scgBCR.height;
        this.svgBody.setAttribute("transform", "scale(1 -1)");

        this.graficPrm.x = 50;
        this.graficPrm.y = 50;
        this.graficPrm.width = scgBCR.width - 100;
        this.graficPrm.height = scgBCR.height - 100;

        {
            this.svgBody.appendChild(this.graficBody);
            this.coordinates = new Coordinates(this.graficBody, this.graficPrm, this.graficMap);
        }
        this.graficBody.addEventListener("click", (e) =>
        {
            if (e.target != null) console.log(this.graficMap.get(e.target));
        })
    }
}