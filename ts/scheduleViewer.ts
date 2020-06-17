import { Coordinates } from "./objects/coordinates.js";

export class scheduleViewer
{
    private body: HTMLDivElement;
    private svgDiv = document.createElement("div");
    private svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

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

        this.svg.style.height = "100%";
        this.svgDiv.style.height = "calc(100% - 50px)";
        this.svgDiv.style.width = "calc(100% - 50px)";
        this.svgDiv.style.overflowX = "scroll";
        this.svgDiv.style.overflowY = "hidden";
        this.body.appendChild(this.svgDiv);
        this.svgDiv.appendChild(this.svg);

        const scgBCR = this.svgDiv.getBoundingClientRect()
        this.zoom = Math.max(Math.min(scgBCR.width / (this.oneHour * 25)), this.zoomMin);
        this.svg.style.width = `${this.oneHour * this.zoom * 25}`;
        console.log(this.zoom);
        {
            this.svg.appendChild(this.coordinatesBody);
            this.coordinates = new Coordinates(this.coordinatesBody, scgBCR, this.oneHour, this.zoom);
        }
        this.svg.addEventListener("wheel", (e) => { if (this.altPressed) this.mouseWheel(e) });
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

        this.svg.style.width = `${Math.max(this.oneHour * this.zoom * 25, this.svgDiv.getBoundingClientRect().width)}`;
        this.coordinates.recreateScale(this.zoom, this.translate);
    }
    keyDown(e: KeyboardEvent)
    {
        switch (e.key) {
            case "Alt":
                this.altPressed = true;
                break;

            case "ArrowLeft":
                this.svg.setAttribute("width", `${this.svg.getBoundingClientRect().width - 10}`);
                break;

            case "ArrowRight":
                this.svg.setAttribute("width", `${this.svg.getBoundingClientRect().width + 10}`);
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