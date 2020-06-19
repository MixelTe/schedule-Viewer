export class Lines
{
    private width: number;
    private height: number;

    private oneHour: number;
    private body: SVGGElement;
    private lines: { color: string, width: number, dasharray: number[] }[];
    private clipRect: SVGRectElement;
    private changeHeightAndRecreate: (newHeight: number, scroll: number, zoom: number) => void;

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

        this.lines = [{color: "red", width: 20, dasharray: [10, 10]}];
        this.recreateLines(axis, 0, zoom);
    }

    public recreateLines(axis: Rect, scroll: number, zoom: number)
    {
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


        for (let i = 1; i < this.lines.length; i++) {
            const el = this.lines[i];
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", `${axis.x}`);
            line.setAttribute("x2", `${axis.x + axis.width}`);
            line.setAttribute("y1", `${axis.y + axis.height - spaces * i}`);
            line.setAttribute("y2", `${axis.y + axis.height - spaces * i}`);
            line.setAttribute("stroke", `${el.color}`);
            line.setAttribute("stroke-width", `${el.width}`);
            line.setAttribute("stroke-dasharray", `
            ${el.dasharray[0] * (this.oneHour / 60 / 60 * zoom)},
            ${el.dasharray[1] * (this.oneHour / 60 / 60 * zoom)}`);
            line.setAttribute("clip-path", "url(#graficLinesClip)");
            this.body.appendChild(line);
        };
    }
    public createLine(parametrs: { dasharray: number[] })
    {
        this.lines.push({ color: "", width: 16, dasharray: parametrs.dasharray });
        const colorStep = 360 / this.lines.length;
        const colors = [""];
        for (let i = 1; i < this.lines.length; i++)
        {
            colors.push(`hsl(${this.getRnd(colorStep * (i - 1), colorStep * i)}, ${100}%, ${Math.floor(this.getRnd(40, 60))}%)`);
        }
        for (let i = 1; i < this.lines.length; i++)
        {
            const colorIndex = Math.floor(this.getRnd(1, colors.length));
            this.lines[i].color = colors[colorIndex];
            colors.splice(colorIndex, 1);
        }
    }
    private getRnd(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}