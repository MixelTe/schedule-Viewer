import { Coordinates } from "./objects/coordinates.js";

export class scheduleViewer
{
    private svgBody: SVGSVGElement;

    private parametrs = { x: 50, y: 50, width: 0, height: 0 };

    private coordinates: Coordinates;
    private coordinatesBody = document.createElementNS("http://www.w3.org/2000/svg", "g");
    private altPressed = false;
    private oneHour = 60;
    private zoom = 80;
    private zoomMin = 0.6;
    private zoomMax = 100;
    private zoomSpeed = 2;

    constructor(svg: SVGSVGElement)
    {
        this.svgBody = svg;
        this.svgBody.setAttribute("width", `${this.oneHour * 25 + this.parametrs.x + 50}`);
        const scgBCR = this.svgBody.getBoundingClientRect()

        this.parametrs.width = this.oneHour * 25;
        this.parametrs.height = scgBCR.height - this.parametrs.y - 50;

        {
            this.svgBody.appendChild(this.coordinatesBody);
            this.coordinates = new Coordinates(this.coordinatesBody, this.parametrs, this.oneHour);
        }
        this.svgBody.addEventListener("wheel", (e) => { if (this.altPressed) this.mouseWheel(e) });
        document.addEventListener("keydown", (e) => {if (e.key == "Alt") this.altPressed = true;});
        document.addEventListener("keyup", (e) =>   {if (e.key == "Alt") this.altPressed = false;});
    }

    mouseWheel(e: WheelEvent)
    {
        e.preventDefault();
        const dy = e.deltaY;
        const dz = (dy / Math.abs(dy)) * -1;

        this.zoom = Math.max(Math.min(this.zoom + dz * this.zoomSpeed, this.zoomMax), this.zoomMin);
        this.zoom = Math.round(this.zoom * 100) / 100;
        console.log(this.zoom);

        const newWidth = this.oneHour * 25 * this.zoom + this.parametrs.x + 50;
        this.svgBody.setAttribute("width", `${newWidth}`);
        this.parametrs.width = this.oneHour * 25 * this.zoom;
        this.coordinates.zoomIt(this.zoom, this.parametrs.width);
    }
}