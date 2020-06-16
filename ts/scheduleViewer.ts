import { Coordinates } from "./objects/coordinates.js";

export class scheduleViewer
{
    private svgBody: SVGSVGElement;

    private coordinates: Coordinates;
    private coordinatesBody = document.createElementNS("http://www.w3.org/2000/svg", "g");
    private altPressed = false;
    private oneHour = 60;
    private zoom = 20;
    private zoomMin = 0.6;
    private zoomMax = 1500;
    private zoomSpeed = 2;

    constructor(svg: SVGSVGElement)
    {
        this.svgBody = svg;
        const scgBCR = this.svgBody.getBoundingClientRect()

        const parametrs = { x: 50, y: 50, width: 0, height: 0 };
        parametrs.width = this.oneHour * 25;
        parametrs.height = scgBCR.height - parametrs.y - 50;

        {
            this.svgBody.appendChild(this.coordinatesBody);
            this.coordinates = new Coordinates(this.coordinatesBody, parametrs, this.oneHour, this.zoom);
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

        let speed = this.zoomSpeed;
        if (this.zoom > 70) speed *= 4;
        if (this.zoom > 200) speed *= 4;
        this.zoom = Math.max(Math.min(this.zoom + dz * speed, this.zoomMax), this.zoomMin);
        this.zoom = Math.round(this.zoom * 100) / 100;
        console.log(this.zoom);

        this.coordinates.recreateScale(this.coordinatesBody, this.zoom);
    }
}