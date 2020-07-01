export class Lines
{
    private width: number;
    private height: number;

    private oneHour: number;
    private body: SVGGElement;
    private overBody: SVGGElement;
    private lines: LineF[];
    private linesMap: Map<SVGLineElement, LineF> = new Map();
    private clipRect: SVGRectElement;
    private changeHeightAndRecreate: (newHeight: number, scroll: number, zoom: number) => void;
    private functionsForLines: FunctionsForLines = <FunctionsForLines>{};
    private drawEmptyLines = false;
    private showLineAfterEnd = false;

    private overLineOpacity = 0;
    private overLineOpacityMouseOver = 0.2;
    private overLineOpacitySelected = 0.4;
    private overLineCustomColor = false;

    constructor(body: SVGGElement, bodyPrm: Rect, overBody: SVGGElement, defs: SVGDefsElement, axis: Rect, oneHour: number, zoom = 1, changeHeightAndRecreate: (newHeight: number, scroll: number, zoom: number) => void)
    {
        this.body = body;
        this.overBody = overBody;
        this.oneHour = oneHour;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;
        this.changeHeightAndRecreate = changeHeightAndRecreate;

        const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        clipPath.id = "graficLinesClip";
        defs.appendChild(clipPath);
        this.clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        clipPath.appendChild(this.clipRect);

        const gradientEl = function (this: Lines)
        {
            const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            linearGradient.id = "ScheduleViewer-Grafic-Coordinates-linearGradient_Select";

            const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop1.setAttribute("offset", "0%");
            stop1.style.stopColor = "Highlight";
            stop1.style.stopOpacity = `${this.overLineOpacitySelected}`;
            linearGradient.appendChild(stop1);

            const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop2.setAttribute("offset", "100%");
            stop2.style.stopColor = "Highlight";
            stop2.style.stopOpacity = `${this.overLineOpacity}`;
            linearGradient.appendChild(stop2);

            return linearGradient;
        }.bind(this)()
        defs.appendChild(gradientEl);


        this.lines = [{ color: "red", width: 20, dasharray: [10, 10], real: false, start: 0, end: 0, autoColor: true, selected: false }];
        this.recreateLines(axis, 0, zoom);

        this.overBody.addEventListener("click", (e) => this.overBodyClick(e));
        this.overBody.addEventListener("mouseover", (e) => this.overBodyMouse(e, "over"));
        this.overBody.addEventListener("mouseout", (e) => this.overBodyMouse(e, "out"));
    }

    public recreateLines(axis: Rect, scroll: number, zoom: number)
    {
        this.linesMap.clear();
        this.body.innerHTML = "";
        this.overBody.innerHTML = "";

        let spaces = Math.floor((axis.height) / (Math.max(this.lines.length, 2)));
        if (spaces < 20)
        {
            spaces = 20;
            // console.log(axis);
            this.changeHeightAndRecreate((this.lines.length + 3) * spaces, scroll, zoom);
        }

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
            this.overBody.appendChild(overline);
        };
    }
    private createSimplePath(index: number, axis: Rect, spaces: number, zoom: number)
    {
        const el = this.lines[index];
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute("stroke", `${el.color}`);
        line.setAttribute("stroke-width", `${el.width}`);
        line.setAttribute("clip-path", "url(#graficLinesClip)");

        const oneSecond = (this.oneHour / 60 / 60 * zoom);
        let path = `M ${axis.x + el.start * oneSecond} ${axis.y + axis.height - spaces * index} `;
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
            h ${duration}
            M ${nextX} ${axis.y + axis.height - spaces * index}`
            if (!this.showLineAfterEnd && nextX > el.end * oneSecond) break;
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


        const oneSecond = (this.oneHour / 60 / 60 * zoom);
        let path = `M ${axis.x + el.start * oneSecond} ${axis.y + axis.height - spaces * index} `;
        const interval = el.dasharray[0] * oneSecond;
        if (typeof el.dasharray[1] != "object") throw new Error("Number");
        const durations = el.dasharray[1];

        for (let i = 0, x = 1; i < axis.width / interval; i++, x++)
        {
            const duration = durations[i];
            let dx = `h ${duration * oneSecond}`;
            if (typeof duration != "number" || duration / duration != 1)
            {
                if (this.drawEmptyLines || duration == 0) dx = "v1"
                else break;
            }
            if (duration / el.dasharray[0] > 1)
            {
                x = x + Math.floor(duration / el.dasharray[0])
            }
            const nextX = axis.x + interval * x + el.start * oneSecond;
            path += `
            ${dx}
            M ${nextX} ${axis.y + axis.height - spaces * index}`
            if (!this.showLineAfterEnd && nextX > el.end * oneSecond) break;
        }
        line.setAttribute("d", path);

        return line;
    }
    private createOverPath(index: number, axis: Rect, spaces: number)
    {
        const el = this.lines[index];
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        if (this.overLineCustomColor) line.setAttribute("stroke", `${el.color}`);
        else line.setAttribute("stroke", "Highlight");
        if (el.selected)
        {
            line.setAttribute("stroke-opacity", `${this.overLineOpacitySelected}`);
            line.id = "ScheduleViewer-Grafic-Lines-selected";
        }
        else line.setAttribute("stroke-opacity", `${this.overLineOpacity}`);
        line.setAttribute("stroke-width", `${spaces}`);
        line.setAttribute("clip-path", "url(#graficLinesClip)");
        line.setAttribute("x1", `${axis.x}`);
        line.setAttribute("x2", `${axis.x + axis.width}`);
        line.setAttribute("y1", `${axis.y + axis.height - spaces * index}`);
        line.setAttribute("y2", `${axis.y + axis.height - spaces * index}`);
        return line;
    }
    public createLine(interval: number, duration: number, start: number, end: number, color?: string | undefined)
    {
        this.lines.push({ color: color || "", width: 16, dasharray: [interval, duration], real: false, start, end, autoColor: color == undefined, selected: false  });;
        this.colorizeLines();
    }
    public createRealLine(interval: number, durations: number[], start: number, end: number)
    {
        this.lines.push({ color: "", width: 16, dasharray: [interval, durations], real: true, start, end, autoColor: true, selected: false  });
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
    private getRnd(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    private overBodyClick(e: MouseEvent)
    {
        const target = e.target;
        if (target == null) return;
        if (!(target instanceof SVGLineElement)) return;
        const line = this.linesMap.get(target);
        if (line == undefined) throw new Error(`line not found: ${target}`);
        line.selected = true;
        target.setAttribute("stroke-opacity", `${this.overLineOpacitySelected}`);
        const selectedLines = this.overBody.getElementsByClassName("ScheduleViewer-Grafic-Lines-selected");
        for (let i = 0; i < selectedLines.length; i++) {
            const el = selectedLines[i];
            el.setAttribute("stroke-opacity", `${this.overLineOpacity}`);
            el.classList.remove("ScheduleViewer-Grafic-Lines-selected");
        }
        target.classList.add("ScheduleViewer-Grafic-Lines-selected");

        this.functionsForLines.selectLine(line);
    }
    private overBodyMouse(e: MouseEvent, eType: "over" | "out")
    {
        const target = e.target;
        if (target == null) return;
        if (!(target instanceof SVGLineElement)) return;

        if (!target.classList.contains("ScheduleViewer-Grafic-Lines-selected"))
        {
            switch (eType) {
                case "over":
                    target.setAttribute("stroke-opacity", `${this.overLineOpacityMouseOver}`);
                    break;

                case "out":
                    target.setAttribute("stroke-opacity", `${this.overLineOpacity}`);
                    break;

                default: throw new Error();
            }
        }
    }
    public changeLine(data: DataToLineChange, line: LineF)
    {
        if (line == undefined) throw new Error(`line not found: ${line}`);
        line.selected = false;

        line.dasharray[0] = data.interval;
        if (!line.real) line.dasharray[1] = data.duration;
        line.start = data.start;
        line.end = data.end;
        line.color = data.color;
        line.autoColor = data.autoColor;
    }
    public removeLine(line: LineF)
    {
        if (line == undefined) throw new Error(`line not found: ${line}`);
        const lineIndex = this.lines.indexOf(line);
        this.lines.splice(lineIndex, 1);
    }

    public changeClip(axis: Rect, scroll: number)
    {
        this.clipRect.setAttribute("x", `${axis.x + scroll + 2}`);
        this.clipRect.setAttribute("y", `${axis.y}`);
        this.clipRect.setAttribute("width", `${axis.width - scroll}`);
        this.clipRect.setAttribute("height", `${axis.height}`);
    }
    public resetLines()
    {
        this.lines = [{ color: "red", width: 20, dasharray: [10, 10], real: false, start: 0, end: 0, autoColor: true, selected: false  }];
    }
    public getLines()
    {
        return this.lines;
    }
    public setFunctionsForLines(functions: FunctionsForLines)
    {
        this.functionsForLines = functions;
    }
}
