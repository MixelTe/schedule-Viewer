export class Lines
{
    private width: number;
    private height: number;

    private oneHour: number;
    private body: SVGGElement;
    private lines: { y: number, color: string, width: number, dasharray: string }[];
    private clipRect: SVGRectElement;

    constructor(body: SVGGElement, bodyPrm: Rect, defs:SVGDefsElement, axis: Rect, oneHour: number, zoom = 1)
    {
        this.body = body;
        this.oneHour = oneHour;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;

        const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        clipPath.id = "graficLinesClip";
        defs.appendChild(clipPath);
        this.clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.clipRect.setAttribute("x", `${axis.x}`);
        this.clipRect.setAttribute("y", `${axis.y}`);
        this.clipRect.setAttribute("width", `${axis.width}`);
        this.clipRect.setAttribute("height", `${axis.height}`);
        clipPath.appendChild(this.clipRect);

        this.lines = [];
        this.recreateLines(axis, 0);
    }

    public recreateLines(axis: Rect, scroll: number)
    {
        this.body.innerHTML = "";

        this.clipRect.setAttribute("x", `${axis.x + scroll}`);
        this.clipRect.setAttribute("y", `${axis.y}`);
        this.clipRect.setAttribute("width", `${axis.width - scroll}`);
        this.clipRect.setAttribute("height", `${axis.height}`);

        this.lines.forEach(el => {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", `${axis.x}`);
            line.setAttribute("x2", `${axis.x + axis.width}`);
            line.setAttribute("y1", `${el.y}`);
            line.setAttribute("y2", `${el.y}`);
            line.setAttribute("stroke", `${el.color}`);
            line.setAttribute("stroke-width", `${el.width}`);
            line.setAttribute("stroke-dasharray", `${el.dasharray}`);
            line.setAttribute("clip-path", "url(#graficLinesClip)");
            this.body.appendChild(line);
        });
    }
    public createLine(parametrs: { y: number, color: string, width: number, dasharray: string }, axis: Rect, scroll: number)
    {
        this.lines.push({ y: parametrs.y, color: parametrs.color, width: parametrs.width, dasharray: parametrs.dasharray });
        this.recreateLines(axis, scroll);
    }
}