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
    private translate = 0;
    private translateMin = 0;
    private translateMax = 200;
    private translateSpeed = 1;

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
        document.addEventListener("keydown", (e) => this.keyDown(e));
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

        this.coordinates.recreateScale(this.zoom, this.translate);
    }
    keyDown(e: KeyboardEvent)
    {
        switch (e.key) {
            case "Alt":
                this.altPressed = true;
                break;

            case "ArrowDown":
                this.translate = Math.max(this.translate - this.translateSpeed, this.translateMin);
                this.coordinates.recreateScale(this.zoom, this.translate);
                break;

            case "ArrowUp":
                this.translate = Math.min(this.translate + this.translateSpeed, this.translateMax);
                this.coordinates.recreateScale(this.zoom, this.translate);
                break;

            case "ArrowLeft":
                this.svgBody.setAttribute("width", `${this.svgBody.getBoundingClientRect().width - 10}`);
                break;

            case "ArrowRight":
                this.svgBody.setAttribute("width", `${this.svgBody.getBoundingClientRect().width + 10}`);
                break;

            default:
                break;
        }
        console.log(this.translate);
    }
}