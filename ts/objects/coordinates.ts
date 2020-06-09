export class Coordinates
{
    private width: number;
    private height: number;
    private x: number;
    private y: number;

    private axis = { x: 0, y: 0, width: 0, height: 0, svgEl: <SVGPolylineElement>{}, color: "black", sWidth: 5 };

    constructor(body: SVGElement, bodyPrm: Rect, map: Map<EventTarget, any>)
    {
        this.x = bodyPrm.x;
        this.y = bodyPrm.y;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;

        this.axis.x = this.x;
        this.axis.y = this.y;
        this.axis.width = this.width;
        this.axis.height = this.height;

        this.axis.svgEl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        this.axis.svgEl.setAttribute("points", this.createPoints(
            [
                this.axis.x, this.axis.height + this.axis.y,
                this.axis.x, this.axis.y,
                this.axis.width + this.axis.x, this.axis.y
            ]));

        this.axis.svgEl.setAttribute("stroke", `${this.axis.color}`);
        this.axis.svgEl.setAttribute("fill", `transparent`);
        this.axis.svgEl.setAttribute("stroke-width", `${this.axis.sWidth}`);
        map.set(this.axis.svgEl, this.axis);
        body.appendChild(this.axis.svgEl);

    }
    createPoints(points: number[])
    {
        let newPoints = "";
        points.forEach(el =>
        {
            newPoints += el + " ";
        });
        return newPoints
    }
}