import { Coordinates } from "./coordinates.js";
import { Lines } from "./lines.js";

export class Grafic
{
	private body: HTMLDivElement
	private svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	private defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

	private coordinates: Coordinates;
	private coordinatesBody = document.createElementNS("http://www.w3.org/2000/svg", "g");
	private lines: Lines;
	private linesBody = document.createElementNS("http://www.w3.org/2000/svg", "g");
	private linesOverBody = document.createElementNS("http://www.w3.org/2000/svg", "g");
	private oneHour = 60;
	private zoom = 2;
	private zoomMin = 0.6;
	private zoomMax = 1500;
	private zoomSpeed = 1.1;
	private zoomFix = { second: 0, delta: 0 };
	private lastTime = 0;
	private scrollLeftLast = 0;
	private zoomActive = false;

	constructor(body: HTMLDivElement, rightSpace: number, options?: ScheduleOptions)
	{
		this.body = body;
		this.body.style.height = "calc(100% - 0px)";
		this.body.style.width = "100%";
		this.body.style.overflowX = "scroll";
		this.body.style.overflowY = "auto";
		this.body.style.display = "inline-block";

		const scgBCR = this.body.getBoundingClientRect();
		// this.body.style.height = `${scgBCR.height}px`;
		// this.body.style.width = `${scgBCR.width}px`;

		this.body.appendChild(this.svg);
		this.svg.appendChild(this.defs);

		this.zoom = Math.max(Math.min((scgBCR.width - rightSpace) / (this.oneHour * 24 + 30)), this.zoomMin);
		this.zoomMin = this.zoom;
		this.svg.style.height = `${this.body.clientHeight - 4}`; //magic number
		this.svg.style.width = `${this.oneHour * this.zoom * 24 + 30}`;
		// console.log(this.body.clientHeight);
		{
			this.svg.appendChild(this.coordinatesBody);
			this.coordinates = new Coordinates(this.coordinatesBody, scgBCR, this.oneHour, this.zoom, 0, this.changeSVGHeight.bind(this), options);

			this.svg.appendChild(this.linesBody);
			this.svg.appendChild(this.linesOverBody);
			this.lines = new Lines(this.linesBody, scgBCR, this.linesOverBody, this.defs, this.coordinates.axis, this.oneHour, this.zoom, this.coordinates.changeHeightAndRecreate.bind(this.coordinates), options);

			for (let i = 0; i < 4; i++)
			{
				// this.lines.createLine(this.getRndInteger(1000, 2000), this.getRndInteger(1000, 9000), this.getRndInteger(0, 10000), this.getRndInteger(50000, 80000));
				// this.lines.createLine(this.getRndInteger(2000, 4000), this.getRndInteger(1000, 9000), this.getRndInteger(0, 10000), this.getRndInteger(50000, 80000));
				// this.lines.createLine(this.getRndInteger(40, 80), this.getRndInteger(10, 90), this.getRndInteger(0, 10000), this.getRndInteger(50000, 80000));
				// this.lines.createLine(this.getRndInteger(80, 120), this.getRndInteger(10, 90), this.getRndInteger(0, 10000), this.getRndInteger(50000, 80000));

				// const duractions = []
				// for (let i = 0; i < this.getRndInteger(600, 900); i++)
				// {
				//     duractions.push(this.getRndInteger(40, 160));
				// }
				// this.lines.createRealLine(60, duractions, this.getRndInteger(0, 10000), this.getRndInteger(50000, 80000));
			}
			this.lines.recreateLines(this.coordinates.axis, this.body.scrollLeft, this.zoom);
		}
		this.svg.addEventListener("wheel", (e) => { if (this.zoomActive) this.mouseWheel(e) });
		this.svg.addEventListener("click", (e) => this.mouseClick(e, true));
		this.body.addEventListener("scroll", () => this.scrollDiv());
		document.addEventListener("keydown", (e) => this.keyDown(e));
		document.addEventListener("keyup", (e) => { if (e.key == "Control") this.zoomActive = false; });
		this.body.addEventListener("mousemove", (e) => this.coordinates.svgBodyMouse(e, "move"));
		this.body.addEventListener("mouseleave", (e) => this.coordinates.svgBodyMouse(e, "leave"));
		this.body.scrollTop = parseInt(this.svg.style.height);
	}

	private mouseWheel(e: WheelEvent)
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
		// if (this.zoom > 70) speed *= 4;
		// if (this.zoom > 200) speed *= 4;
		if (dz > 0)
		{
			this.zoom = Math.max(Math.min(this.zoom * speed, this.zoomMax), this.zoomMin);
		}
		else
		{
			this.zoom = Math.max(Math.min(this.zoom / speed, this.zoomMax), this.zoomMin);
		}
		this.zoom = Math.round(this.zoom * 100) / 100;
		// console.log(this.zoom);

		this.svg.style.width = `${Math.max(this.oneHour * this.zoom * 24 + 30, this.body.getBoundingClientRect().width)}`;

		const zoomFixPointX = this.zoomFix.second * (this.oneHour / 60 / 60 * this.zoom)
		const newTranslate = zoomFixPointX - this.zoomFix.delta;

		this.body.scroll(newTranslate, this.body.scrollTop);
		if (this.body.scrollLeft == 0) this.zoomFix.delta = zoomFixPointX;
		this.coordinates.recreateScale(this.zoom, this.body.scrollLeft);
		this.lines.recreateLines(this.coordinates.axis, this.body.scrollLeft, this.zoom);
	}
	private mouseClick(e: MouseEvent, needRecreate = false)
	{
		const x = e.offsetX - this.coordinates.axis.x;
		const xAbs = e.offsetX - this.body.scrollLeft;
		const second = Math.floor(x / (this.oneHour / 3600 * this.zoom));
		this.zoomFix.delta = xAbs;
		this.zoomFix.second = second;
		this.coordinates.changeZoomFixPoint(second);
		if (needRecreate) this.coordinates.recreateScale(this.zoom, this.body.scrollLeft);
		// console.log(second);
	}
	private keyDown(e: KeyboardEvent)
	{
		switch (e.key)
		{
			case "ArrowLeft":
				this.svg.setAttribute("width", `${this.svg.getBoundingClientRect().width - 10}`);
				break;

			case "ArrowRight":
				this.svg.setAttribute("width", `${this.svg.getBoundingClientRect().width + 10}`);
				break;

			case "Control":
				this.zoomActive = true;
				break;

			default:
				break;
		}
	}
	private scrollDiv()
	{
		const zoomFixPointX = this.zoomFix.second * (this.oneHour / 60 / 60 * this.zoom)
		const scrollLeft = this.body.scrollLeft;
		if (scrollLeft == this.scrollLeftLast) return;
		this.scrollLeftLast = scrollLeft;
		const width = this.body.getBoundingClientRect().width;

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
		this.lines.changeClip(this.coordinates.axis, this.body.scrollLeft);
	}
	private changeSVGHeight(height: number)
	{
		const newHeight = Math.max(height, this.body.clientHeight - 4);
		this.svg.style.height = `${newHeight}`;
	}

	private getRndInteger(min: number, max: number)
	{
		return Math.floor(Math.random() * (max - min) + min);
	}
	private recreate()
	{
		this.coordinates.recreateScale(this.zoom, this.body.scrollLeft);
		this.lines.recreateLines(this.coordinates.axis, this.body.scrollLeft, this.zoom);
	}

	public getFunctions(): FunctionsForMenu
	{
		return {
			toggleSepLine: this.coordinates.toggleSepLine.bind(this.coordinates),
			SepLineIsActive: this.coordinates.SepLineIsActive.bind(this.coordinates),
			addSympleLine: this.lines.createLine.bind(this.lines),
			addRealLine: this.lines.createRealLine.bind(this.lines),
			recreate: this.recreate.bind(this),
			resetLines: this.lines.resetLines.bind(this.lines),
			getLines: this.lines.getLines.bind(this.lines),
			changeLine: this.lines.changeLine.bind(this.lines),
			removeLine: this.lines.removeLine.bind(this.lines),
			unselectLine: this.lines.unselectLine.bind(this.lines),
			toggleCustomSelectionColor: this.lines.toggleOverLineCustomColor.bind(this.lines),
			CustomSelectionColorIsActive: this.lines.overLineCustomColorIsActive.bind(this.lines),
			togglecompactLinePlacing: this.lines.togglecompactLinePlacing.bind(this.lines),
			compactLinePlacingIsActive: this.lines.compactLinePlacingIsActive.bind(this.lines),
		}
	}
	public setFunctionsForLines(functions: FunctionsForLines)
	{
		this.lines.setFunctionsForLines(functions);
	}
}