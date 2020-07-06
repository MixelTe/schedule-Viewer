export class Lines
{
	private width: number;
	private height: number;

	private oneHour: number;
	private body: SVGGElement;
	private overBody: SVGGElement;
	private nameBody: SVGGElement;
	private lines: LineF[];
	private linesMap: Map<SVGRectElement, LineF> = new Map();
	private clipRect: SVGRectElement;
	private changeHeightAndRecreate: (newHeight: number, scroll: number, zoom: number) => void;
	private functionsForLines: FunctionsForLines = <FunctionsForLines>{};
	private showLineAfterEnd = false;
	private compactLinePlacing = false;
	private compactPlacingOnTop = true;
	private lineNamesOnStart = false;
	private minSpace = 40;

	private overLineOpacity = 0;
	private overLineOpacityMouseOver = 0.2;
	private overLineOpacitySelected = 0.5;
	private overLineCustomColor = true;
	private overLineLinearGradient: { select: {array: SVGStopElement[]}, over: {array: SVGStopElement[]}} | undefined;

	constructor(body: SVGGElement, bodyPrm: Rect, overBody: SVGGElement, nameBody: SVGGElement, defs: SVGDefsElement, axis: Rect, oneHour: number, zoom = 1, changeHeightAndRecreate: (newHeight: number, scroll: number, zoom: number) => void, options?: ScheduleOptions)
	{
		this.body = body;
		this.overBody = overBody;
		this.nameBody = nameBody;
		this.oneHour = oneHour;
		this.width = bodyPrm.width;
		this.height = axis.height;
		this.changeHeightAndRecreate = changeHeightAndRecreate;

		const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
		clipPath.id = "graficLinesClip";
		defs.appendChild(clipPath);
		this.clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		clipPath.appendChild(this.clipRect);

		const createGradient = function (this: Lines, stopArray: {array: SVGStopElement[]}, id: string)
		{
			const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
			linearGradient.id = id;
			linearGradient.setAttribute("gradientTransform", "rotate(90)")

			const createStop = function (pos: number, opacity: number)
			{
				const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
				stop.setAttribute("offset", `${pos}%`);
				stop.setAttribute("stop-color", "Highlight");
				stop.setAttribute("stop-opacity", `${opacity}`);
				return stop;
			}

			stopArray.array = [
				createStop(0, 0),
				createStop(10, 100),
				createStop(80, 100),
				createStop(100, 0)];
			linearGradient.appendChild(stopArray.array[0]);
			linearGradient.appendChild(stopArray.array[1]);
			linearGradient.appendChild(stopArray.array[2]);
			linearGradient.appendChild(stopArray.array[3]);

			return linearGradient;
		}.bind(this);
		this.overLineLinearGradient = {over: {array: []}, select: {array: []}};
		defs.appendChild(createGradient(this.overLineLinearGradient.select, "ScheduleViewer-Grafic-Coordinates-linearGradient_Select"))
		defs.appendChild(createGradient(this.overLineLinearGradient.over, "ScheduleViewer-Grafic-Coordinates-linearGradient_Over"))

		this.lines = [{ color: "red", width: 20, dasharray: [10, 10], real: false, start: 0, end: 0, autoColor: true, selected: false, name: "DevLine" }];
		this.setOptions(options);
		this.recreateLines(axis, 0, zoom);

		this.overBody.addEventListener("click", (e) => this.overBodyClick(e));
		this.overBody.addEventListener("mouseover", (e) => this.overBodyMouse(e, "over"));
		this.overBody.addEventListener("mouseout", (e) => this.overBodyMouse(e, "out"));
	}
	public setOptions(options?: ScheduleOptions)
	{
		if (options?.showRealLineAfterEnd != undefined && typeof options.showRealLineAfterEnd == "boolean") this.showLineAfterEnd = options.showRealLineAfterEnd;
		if (options?.compactLinePlacing != undefined && typeof options.compactLinePlacing == "boolean") this.compactLinePlacing = options.compactLinePlacing;
		if (options?.selectionCustomColor != undefined && typeof options.selectionCustomColor == "boolean") this.overLineCustomColor = options.selectionCustomColor;
		if (options?.compactPlacingAlignIsTop != undefined && typeof options.compactPlacingAlignIsTop == "boolean") this.compactPlacingOnTop = options.compactPlacingAlignIsTop;
		if (options != undefined && typeof options.lineNamesOnStart == "boolean") this.lineNamesOnStart = options.lineNamesOnStart;
	}
	public getOptions()
	{
		return {
			showRealLineAfterEnd: this.showLineAfterEnd,
			compactLinePlacing: this.compactLinePlacing,
			selectionCustomColor: this.overLineCustomColor,
			compactPlacingAlignIsTop: this.compactPlacingOnTop,
			lineNamesOnStart: this.lineNamesOnStart,
		};
	}
	public setLines(newLines: LineF[])
	{
		this.lines = newLines;
	}

	public recreateLines(axis: Rect, scroll: number, zoom: number)
	{
		this.linesMap.clear();
		this.body.innerHTML = "";
		this.overBody.innerHTML = "";
		this.nameBody.innerHTML = "";

		let spaces = Math.floor((this.height) / (Math.max(this.lines.length, 2)));
		if (this.compactLinePlacing) spaces = 0;
		if (spaces < this.minSpace)
		{
			spaces = this.minSpace;
			// console.log(axis);
		}
		this.changeHeightAndRecreate((this.lines.length - 1) * spaces, scroll, zoom);
		this.clipRect.setAttribute("x", `${axis.x + scroll + 2}`);
		this.clipRect.setAttribute("y", `${axis.y}`);
		this.clipRect.setAttribute("width", `${axis.width - scroll}`);
		this.clipRect.setAttribute("height", `${axis.height}`);
		// console.log(this.clipRect);


		for (let i = 1; i < this.lines.length; i++)
		{
			const el = this.lines[i];
			let line;
			let overline;
			if (el.real)
			{
				line = this.createRealPath(i, axis, spaces, zoom);
			}
			else
			{
				line = this.createSimplePath(i, axis, spaces, zoom);
			}
			overline = this.createOverPath(i, axis, spaces);
			this.linesMap.set(overline, el)
			this.body.appendChild(line);
			this.nameBody.appendChild(this.createLineText(i, axis, spaces, zoom, scroll));
			this.overBody.appendChild(overline);
		};
	}
	private createLineText(index: number, axis: Rect, spaces: number, zoom: number, scroll: number)
	{
		const el = this.lines[index];
		let x;
		if (this.lineNamesOnStart) x = Math.max(axis.x + el.start * (this.oneHour / 60 / 60 * zoom), axis.x + scroll);
		else x = axis.x + scroll;
		let y;
		if (this.compactPlacingOnTop) y = axis.y + spaces * index - (el.width / 2 + 2);
		else y = axis.y + axis.height - spaces * index - (el.width / 2 + 2);
		const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("stroke", "black");
		text.innerHTML = el.name;
		text.setAttribute("x", `${x}`);
		text.setAttribute("y", `${y}`);
		text.style.fontFamily = "Verdana, sans-serif";
		return text;
	}
	private createSimplePath(index: number, axis: Rect, spaces: number, zoom: number)
	{
		const el = this.lines[index];
		const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
		line.setAttribute("stroke", `${el.color}`);
		line.setAttribute("stroke-width", `${el.width}`);
		line.setAttribute("clip-path", "url(#graficLinesClip)");

		let y;
		if (this.compactPlacingOnTop) y = axis.y + spaces * index;
		else y = axis.y + axis.height - spaces * index;
		const oneSecond = (this.oneHour / 60 / 60 * zoom);
		let path = `M ${axis.x + el.start * oneSecond} ${y} `;
		const interval = el.dasharray[0] * oneSecond;
		if (typeof el.dasharray[1] != "number") throw new Error("NaN");
		const duration = el.dasharray[1] * oneSecond;

		for (let i = 0, x = 1; i < axis.width / interval; i++, x++)
		{
			if (el.dasharray[1] / el.dasharray[0] > 1)
			{
				x = x + Math.floor(el.dasharray[1] / el.dasharray[0]);
			}
			const nextX = axis.x + interval * x + el.start * oneSecond;
			path += `
            h ${Math.max(duration, 1)}
            M ${nextX} ${y}`
			if (nextX > el.end * oneSecond + axis.x) break;
		}
		line.setAttribute("d", path);

		return line;
	}
	private createRealPath(index: number, axis: Rect, spaces: number, zoom: number)
	{
		const el = this.lines[index];
		const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
		line.setAttribute("stroke", `${el.color}`);
		line.setAttribute("stroke-width", `${el.width}`);
		line.setAttribute("clip-path", "url(#graficLinesClip)");

		let y;
		if (this.compactPlacingOnTop) y = axis.y + spaces * index;
		else y = axis.y + axis.height - spaces * index;
		const oneSecond = (this.oneHour / 60 / 60 * zoom);
		let path = `M ${axis.x + el.start * oneSecond} ${y} `;
		const interval = el.dasharray[0] * oneSecond;
		if (typeof el.dasharray[1] != "object") throw new Error("Number");
		const durations = el.dasharray[1];

		for (let i = 0, x = 1; i < axis.width / interval; i++, x++)
		{
			const duration = durations[i];
			let dx = `h ${Math.max(duration * oneSecond, 1)}`;
			if (typeof duration != "number" || duration / duration != 1)
			{
				if (duration == 0) dx = "v1"
				else break;
			}
			if (duration / el.dasharray[0] > 1)
			{
				x = x + Math.floor(duration / el.dasharray[0])
			}
			const nextX = axis.x + interval * x + el.start * oneSecond;
			path += `
            ${dx}
            M ${nextX} ${y}`
			if (!this.showLineAfterEnd && nextX > el.end * oneSecond + axis.x) break;
		}
		line.setAttribute("d", path);

		return line;
	}
	private createOverPath(index: number, axis: Rect, spaces: number)
	{
		const el = this.lines[index];
		const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.setAttribute("stroke", `${el.color}`);
		rect.setAttribute("stroke-width", "0px");
		rect.setAttribute("fill", "url(#ScheduleViewer-Grafic-Coordinates-linearGradient_Over)");
		if (el.selected)
		{
			rect.setAttribute("fill-opacity", `${this.overLineOpacitySelected}`);
			rect.classList.add("ScheduleViewer-Grafic-Lines-selected");
			rect.setAttribute("fill", "url(#ScheduleViewer-Grafic-Coordinates-linearGradient_Select)");
		}
		else rect.setAttribute("fill-opacity", `${this.overLineOpacity}`);
		rect.setAttribute("clip-path", "url(#graficLinesClip)");
		rect.setAttribute("x", `${axis.x}`);
		let y;
		if (this.compactPlacingOnTop) y = axis.y + spaces * index;
		else y = axis.y + axis.height - spaces * index;
		rect.setAttribute("y", `${y - spaces / 2}`);
		rect.setAttribute("width", `${axis.width}`);
		rect.setAttribute("height", `${spaces}`);
		return rect;
	}
	public createLine(interval: number, duration: number, start: number, end: number, name: string, color?: string | undefined, autoColor = true)
	{
		this.lines.push({ color: color || "", name, width: 16, dasharray: [interval, duration], real: false, start, end, autoColor: autoColor, selected: false });
		this.colorizeLines();
	}
	public createRealLine(interval: number, durations: number[], start: number, end: number, name: string, color?: string | undefined, autoColor = true)
	{
		this.lines.push({ color: color || "", name, width: 16, dasharray: [interval, durations], real: true, start, end, autoColor: autoColor, selected: false });
		this.colorizeLines();
	}
	private colorizeLines()
	{
		const colorStep = 360 / this.lines.length;
		const colors = [""];
		for (let i = 1; i < this.lines.length; i++)
		{
			colors.push(`hsl(${this.getRnd(colorStep * (i - 1), colorStep * i)}, ${100}%, ${Math.floor(this.getRnd(40, 60))}%)`);
		}
		for (let i = 1; i < this.lines.length; i++)
		{
			const line = this.lines[i];
			const colorIndex = Math.floor(this.getRnd(1, colors.length));
			if (line.autoColor) line.color = colors[colorIndex];
			colors.splice(colorIndex, 1);
		}
	}
	private getRnd(min: number, max: number)
	{
		return Math.random() * (max - min) + min;
	}

	public clickOutside(e: MouseEvent)
	{
		this.functionsForLines.unSelectLine(e);
	}
	private overBodyClick(e: MouseEvent)
	{
		const target = e.target;
		if (target == null) return;
		if (!(target instanceof SVGRectElement)) return;
		const line = this.linesMap.get(target);
		if (line == undefined) throw new Error(`line not found: ${target}`);
		const selectedLines = this.overBody.getElementsByClassName("ScheduleViewer-Grafic-Lines-selected");
		for (let i = selectedLines.length - 1; i >= 0; i--)
		{
			const el = selectedLines[i];
			el.setAttribute("fill-opacity", `${this.overLineOpacity}`);
			el.setAttribute("fill", "url(#ScheduleViewer-Grafic-Coordinates-linearGradient_Over)");
			el.classList.remove("ScheduleViewer-Grafic-Lines-selected");
		}
		if (this.overLineLinearGradient != undefined)
		{
			this.overLineLinearGradient.select.array.forEach(el =>
			{
				if (this.overLineCustomColor) el.setAttribute("stop-color", target.getAttribute("stroke") || "HighLight");
				else el.setAttribute("stop-color", "HighLight");
			});
		}
		this.lines.forEach(el => {
			el.selected = false;
		});
		line.selected = true;
		target.setAttribute("fill", "url(#ScheduleViewer-Grafic-Coordinates-linearGradient_Select)");
		target.setAttribute("fill-opacity", `${this.overLineOpacitySelected}`);
		target.classList.add("ScheduleViewer-Grafic-Lines-selected");

		this.functionsForLines.selectLine(line);
	}
	private overBodyMouse(e: MouseEvent, eType: "over" | "out")
	{
		const target = e.target;
		if (target == null) return;
		if (!(target instanceof SVGRectElement)) return;

		if (this.overLineLinearGradient != undefined)
		{
			this.overLineLinearGradient.over.array.forEach(el =>
			{
				if (this.overLineCustomColor) el.setAttribute("stop-color", target.getAttribute("stroke") || "HighLight");
				else el.setAttribute("stop-color", "HighLight");
			});
		}
		if (!target.classList.contains("ScheduleViewer-Grafic-Lines-selected"))
		{
			switch (eType)
			{
				case "over":
					target.setAttribute("fill-opacity", `${this.overLineOpacityMouseOver}`);
					break;

				case "out":
					target.setAttribute("fill-opacity", `${this.overLineOpacity}`);
					break;

				default: throw new Error();
			}
		}
	}
	public changeLine(data: DataToLineChange, line: LineF)
	{
		if (line == undefined) throw new Error(`line not found: ${line}`);

		line.dasharray[0] = data.interval;
		if (!line.real) line.dasharray[1] = data.duration;
		line.name = data.name;
		line.start = data.start;
		line.end = data.end;
		line.color = data.color;
		line.autoColor = data.autoColor;
	}
	public removeLine(line: LineF)
	{
		const lineIndex = this.lines.indexOf(line);
		if (lineIndex == -1) throw new Error(`line not found: ${line}`);
		this.lines.splice(lineIndex, 1);
	}
	public unselectLine(line: LineF)
	{
		line.selected = false;
	}

	public onScrollMove(axis: Rect, scroll: number, zoom: number)
	{
		this.nameBody.innerHTML = "";
		let spaces = Math.floor((this.height) / (Math.max(this.lines.length, 2)));
		if (this.compactLinePlacing) spaces = 0;
		if (spaces < this.minSpace) spaces = this.minSpace;
		for (let i = 1; i < this.lines.length; i++)
		{
			this.nameBody.appendChild(this.createLineText(i, axis, spaces, zoom, scroll));
		};

		this.clipRect.setAttribute("x", `${axis.x + scroll + 2}`);
		this.clipRect.setAttribute("y", `${axis.y}`);
		this.clipRect.setAttribute("width", `${axis.width - scroll}`);
		this.clipRect.setAttribute("height", `${axis.height}`);
	}
	public resetLines()
	{
		this.lines = [{ color: "red", width: 20, dasharray: [10, 10], real: false, start: 0, end: 0, autoColor: true, selected: false, name: "DevLine" }];
	}
	public getLines()
	{
		return this.lines;
	}
	public overLineCustomColorIsActive()
	{
		return this.overLineCustomColor;
	}
	public compactLinePlacingIsActive()
	{
		return this.compactLinePlacing;
	}
	public setFunctionsForLines(functions: FunctionsForLines)
	{
		this.functionsForLines = functions;
	}
}
