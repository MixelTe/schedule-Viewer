import { Coordinates } from "./objects/coordinates.js";

export class scheduleViewer
{
    private body: HTMLDivElement;
    private svgDiv = document.createElement("div");
    private svgBody = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    private coordinates: Coordinates;
    private coordinatesBody = document.createElementNS("http://www.w3.org/2000/svg", "g");
    private altPressed = false;
    private oneHour = 60;
    private zoom = 2;
    private zoomMin = 0.4;
    private zoomMax = 1500;
    private zoomSpeed = 1;
    private translate = 0;

    constructor(body: HTMLDivElement)
    {
        this.body = body;
        const scgBCR = this.body.getBoundingClientRect()

        this.svgBody.style.height = "100%";
        this.svgDiv.style.height = "100%";
        this.svgDiv.style.width = "100%";
        this.svgDiv.style.overflowX = "scroll";
        this.svgDiv.style.overflowY = "hidden";
        this.body.appendChild(this.svgDiv);
        this.svgDiv.appendChild(this.svgBody);

        const parametrs = { x: 50, y: 50, width: 0, height: 0 };
        parametrs.width = scgBCR.width - scgBCR.x - parametrs.x;
        parametrs.height = scgBCR.height - parametrs.y - 70;

        this.zoom = parametrs.width / (this.oneHour * 25);
        this.svgBody.style.width = `${this.oneHour * this.zoom * 25 + parametrs.x}`;
        console.log(this.zoom);
        {
            this.svgBody.appendChild(this.coordinatesBody);
            this.coordinates = new Coordinates(this.coordinatesBody, parametrs, this.oneHour, this.zoom);
        }
        this.svgBody.addEventListener("wheel", (e) => { if (this.altPressed) this.mouseWheel(e) });
        this.svgDiv.addEventListener("scroll", () => this.scrollDiv());
        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => { if (e.key == "Alt") this.altPressed = false; });
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
        // console.log(this.zoom);

        this.svgBody.style.width = `${this.oneHour * this.zoom * 25 + this.coordinates.x}`;
        this.coordinates.recreateScale(this.zoom, this.translate);
    }
    keyDown(e: KeyboardEvent)
    {
        switch (e.key) {
            case "Alt":
                this.altPressed = true;
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
        // console.log(this.translate);
    }
    scrollDiv()
    {
        this.translate = this.svgDiv.scrollLeft;
        this.coordinates.recreateScale(this.zoom, this.translate);
    }
}