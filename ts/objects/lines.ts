export class Lines
{
    private width: number;
    private height: number;

    private oneHour: number;
    private body: SVGGElement;
    private lines = [
        { x1: 200, x2: 300, y1: 0, y2: 500, color: "lightgreen", width: 2, dasharray: "5, 5" },
        { x1: 100, x2: 500, y1: 20, y2: 700, color: "lightblue", width: 4, dasharray: "8, 3" },
    ];

    constructor(body: SVGGElement, bodyPrm: Rect, oneHour: number, zoom = 1)
    {
        this.body = body;
        this.oneHour = oneHour;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;

        this.recreateLines();
    }

    private recreateLines()
    {
        this.body.innerHTML = "";

        this.lines.forEach(el => {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", `${el.x1}`);
            line.setAttribute("x2", `${el.x2}`);
            line.setAttribute("y1", `${el.y1}`);
            line.setAttribute("y2", `${el.y2}`);
            line.setAttribute("stroke", `${el.color}`);
            line.setAttribute("stroke-width", `${el.width}`);
            line.setAttribute("stroke-dasharray", `${el.dasharray}`);
            this.body.appendChild(line);
        });
    }
}