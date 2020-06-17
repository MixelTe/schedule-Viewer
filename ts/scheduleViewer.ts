import { Coordinates } from "./objects/coordinates.js";

export class scheduleViewer
{
    private body: HTMLDivElement;
    private svgDiv = document.createElement("div");
    private svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    private coordinates: Coordinates;
    private coordinatesBody = document.createElementNS("http://www.w3.org/2000/svg", "g");
    private zoomActive = false;
    private oneHour = 60;
    private zoom = 2;
    private zoomMin = 0.6;
    private zoomMax = 1500;
    private zoomSpeed = 1;
    private zoomFix = { second: 0, delta: 0 };
    private lastTime = 0;

    constructor(body: HTMLDivElement)
    {
        this.body = body;
        this.body.style.overflow = "hidden";

        this.svg.style.height = "100%";
        this.svgDiv.style.height = "calc(100% - 0px)";
        this.svgDiv.style.width = "calc(100% - 0px)";
        this.svgDiv.style.overflowX = "scroll";
        this.svgDiv.style.overflowY = "hidden";
        this.body.appendChild(this.svgDiv);
        this.svgDiv.appendChild(this.svg);

        const scgBCR = this.svgDiv.getBoundingClientRect();
        this.svgDiv.style.height = `${scgBCR.height}px`;
        this.svgDiv.style.width = `${scgBCR.width}px`;

        this.zoom = Math.max(Math.min(scgBCR.width / (this.oneHour * 25)), this.zoomMin);
        this.svg.style.width = `${this.oneHour * this.zoom * 25}`;
        {
            this.svg.appendChild(this.coordinatesBody);
            this.coordinates = new Coordinates(this.coordinatesBody, scgBCR, this.oneHour, this.zoom);
        }
        this.svg.addEventListener("wheel", (e) => { if (this.zoomActive) this.mouseWheel(e) });
        this.svg.addEventListener("click", (e) => this.mouseClick(e, true));
        this.svgDiv.addEventListener("scroll", () => this.scrollDiv());
        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => { if (e.code == "KeyZ") this.zoomActive = false; });
    }

    mouseWheel(e: WheelEvent)
    {
        e.preventDefault();
        const curTime = new Date().getTime();
        if (curTime - this.lastTime > 300)
        {
            this.mouseClick(e);
        }
        this.lastTime = curTime;

        const dy = e.deltaY;
        const dz = (dy / Math.abs(dy)) * -1;

        let speed = this.zoomSpeed;
        if (this.zoom > 70) speed *= 4;
        if (this.zoom > 200) speed *= 4;
        this.zoom = Math.max(Math.min(this.zoom + dz * speed, this.zoomMax), this.zoomMin);
        this.zoom = Math.round(this.zoom * 100) / 100;
        // console.log(this.zoom);

        this.svg.style.width = `${Math.max(this.oneHour * this.zoom * 25, this.svgDiv.getBoundingClientRect().width)}`;

        const zoomFixPointX = this.zoomFix.second * (this.oneHour / 60 / 60 * this.zoom)
        const newTranslate = zoomFixPointX - this.zoomFix.delta;

        this.svgDiv.scroll(newTranslate, 0)
        if (this.svgDiv.scrollLeft == 0) this.zoomFix.delta = zoomFixPointX;
        this.coordinates.recreateScale(this.zoom, this.svgDiv.scrollLeft);
    }
    mouseClick(e: MouseEvent, needRecreate = false)
    {
        const x = e.offsetX - this.coordinates.axis.x;
        const xAbs = e.offsetX - this.svgDiv.scrollLeft;
        const second = Math.floor(x / (this.oneHour / 3600 * this.zoom));
        this.zoomFix.delta = xAbs;
        this.zoomFix.second = second;
        this.coordinates.changeZoomFixPoint(second);
        if (needRecreate) this.coordinates.recreateScale(this.zoom, this.svgDiv.scrollLeft);
        // console.log(second);
    }
    keyDown(e: KeyboardEvent)
    {
        switch (e.key) {
            case "ArrowLeft":
                this.svg.setAttribute("width", `${this.svg.getBoundingClientRect().width - 10}`);
                break;

            case "ArrowRight":
                this.svg.setAttribute("width", `${this.svg.getBoundingClientRect().width + 10}`);
                break;

            default:
                break;
        }
        switch (e.code) {
            case "KeyZ":
                this.zoomActive = true;
                break;
        }
    }
    scrollDiv()
    {
        const zoomFixPointX = this.zoomFix.second * (this.oneHour / 60 / 60 * this.zoom)
        const scrollLeft = this.svgDiv.scrollLeft;
        const width = this.svgDiv.getBoundingClientRect().width;

        if (zoomFixPointX - scrollLeft < 0 || zoomFixPointX - scrollLeft > width)
        {
            let x;
            if (zoomFixPointX - scrollLeft < 0)
            {
                x = scrollLeft;
            }
            else
            {
                x = scrollLeft + width - this.coordinates.axis.x;
            }
            const second = Math.floor(x / (this.oneHour / 3600 * this.zoom));
            this.zoomFix.second = second;
            this.coordinates.changeZoomFixPoint(second);
        }
        this.zoomFix.delta = zoomFixPointX - scrollLeft;

        this.coordinates.recreateScale(this.zoom, scrollLeft);
    }
}