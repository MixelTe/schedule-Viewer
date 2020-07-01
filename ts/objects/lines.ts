export class Lines
{
    private width: number;
    private height: number;

    private oneHour: number;
    private body: SVGGElement;
    private lines: LineF[];
    private linesMap: Map<SVGPathElement, LineF> = new Map();
    private clipRect: SVGRectElement;
    private changeHeightAndRecreate: (newHeight: number, scroll: number, zoom: number) => void;
    private functionsForLines: FunctionsForLines = <FunctionsForLines>{};
    private drawEmptyLines = false;
    private showLineAfterEnd = false;

    constructor(body: SVGGElement, bodyPrm: Rect, defs:SVGDefsElement, axis: Rect, oneHour: number, zoom = 1, changeHeightAndRecreate: (newHeight: number, scroll: number, zoom: number) => void)
    {
        this.body = body;
        this.oneHour = oneHour;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;
        this.changeHeightAndRecreate = changeHeightAndRecreate;

        const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        clipPath.id = "graficLinesClip";
        defs.appendChild(clipPath);
        this.clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        clipPath.appendChild(this.clipRect);

        this.lines = [{ color: "red", width: 20, dasharray: [10, 10], real: false, start: 0, end: 0, autoColor: true }];
        this.recreateLines(axis, 0, zoom);

        this.body.addEventListener("click", (e) => this.bodyClick(e));
    }

    public recreateLines(axis: Rect, scroll: number, zoom: number)
    {
        this.linesMap.clear();
        this.body.innerHTML = "";

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
            if (el.real)
            {
                line = this.createRealPath(i, axis, spaces, zoom);
            }
            else
            {
                line = this.createPath(i, axis, spaces, zoom);
            }
            this.linesMap.set(line, el)
            this.body.appendChild(line);
        };
    }
    private createPath(index: number, axis: Rect, spaces: number, zoom: number)
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
        for (let i = 0; i < axis.width / (interval + duration); i++)
        {
            if (i * (interval + duration) > el.end * oneSecond) break;
            path += `
            h ${duration}
            m ${interval} 0`
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
            if (!this.showLineAfterEnd && nextX > el.end * oneSecond) break;
            path += `
            ${dx}
            M ${nextX} ${axis.y + axis.height - spaces * index}`
        }
        line.setAttribute("d", path);

        return line;
    }
    public createLine(interval: number, duration: number, start: number, end: number, color?: string | undefined)
    {
        this.lines.push({ color: color || "", width: 16, dasharray: [interval, duration], real: false, start, end, autoColor: color == undefined });;
        this.colorizeLines();
    }
    public createRealLine(interval: number, durations: number[], start: number, end: number)
    {
        this.lines.push({ color: "", width: 16, dasharray: [interval, durations], real: true, start, end, autoColor: true });
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

    private bodyClick(e: MouseEvent)
    {
        const target = e.target;
        if (target == null) return;
        if (!(target instanceof SVGPathElement)) return;
        const line = this.linesMap.get(target);
        if (line == undefined) throw new Error(`line not found: ${target}`);
        const lineData = {
            interval: line.dasharray[0],
            duration: line.dasharray[1],
            start: line.start,
            end: line.end,
            color: line.color,
            autoColor: line.autoColor,
            real: line.real,
        }
        this.functionsForLines.selectLine(lineData, target);
    }
    public changeLine(data: DataToLineChange, key: SVGPathElement)
    {
        console.log("change");
        let line = this.linesMap.get(key);
        if (line == undefined) throw new Error(`line not found: ${key}`);

        line.dasharray[0] = data.interval;
        line.dasharray[1] = data.duration;
        line.start = data.start;
        line.end = data.end;
        line.color = data.color;
        line.autoColor = data.autoColor;
        line.real = data.real;
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
        this.lines = [{ color: "red", width: 20, dasharray: [10, 10], real: false, start: 0, end: 0, autoColor: true }];
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
