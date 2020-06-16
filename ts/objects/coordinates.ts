export class Coordinates
{
    private width: number;
    private height: number;
    private x: number;
    private y: number;

    private DEVdisplayHours = 2;

    private axis = { x: 0, y: 0, width: 0, height: 0, svgEl: <SVGPolylineElement>{}, color: "black", sWidth: 5 };
    private scale = {
        hours: { els: <any>[], color: "black", width: 6, height: 25, fontSize: 20 },
        minutes: { els: <any>[], color: "black", width: 4, height: 20, fontSize: 15 },
        seconds: { els: <any>[], color: "black", width: 2, height: 15, fontSize: 10 },
    }
    private oneHour: number;
    private body: SVGElement;

    constructor(body: SVGElement, bodyPrm: Rect, oneHour: number, zoom = 1, translate = 0)
    {
        this.body = body;
        this.oneHour = oneHour;
        this.x = bodyPrm.x;
        this.y = bodyPrm.y;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;

        this.axis.x = this.x;
        this.axis.y = this.y;
        this.axis.width = this.width;
        this.axis.height = this.height;

        this.recreateScale(zoom, translate);
    }
    private createAxis()
    {
        const axis = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        axis.setAttribute("points",
            `${this.axis.x} ${this.axis.y}
            ${this.axis.x} ${this.axis.y + this.axis.height}
            ${this.axis.x + this.width} ${this.axis.y + this.axis.height}`
        );
        axis.setAttribute("stroke", `${this.axis.color}`);
        axis.setAttribute("fill", `transparent`);
        axis.setAttribute("stroke-width", `${this.axis.sWidth}`);
        return axis;
    }
    public recreateScale(zoom: number, translate: number)
    {
        this.axis.width = this.oneHour * 25 * zoom;

        this.body.innerHTML = "";

        this.body.appendChild(this.createAxis());

        const y = this.axis.y + this.axis.height;
        const interHour = this.oneHour * zoom;
        for (let i = 1; i <= this.DEVdisplayHours; i++)
        {
            const xh = this.axis.x + this.oneHour * i * zoom;
            const line = this.createLine(xh, y, this.scale.hours);
            const number = this.createNumber(xh-6, y, i, this.scale.hours);

            this.body.appendChild(line);
            this.body.appendChild(number);

            const xh2 = this.axis.x + this.oneHour * (i - 1) * zoom;
            for (let o = 1; o < 60; o++)
            {
                const minutsToDisplay = Math.round(60 / o);
                const interMinuts = interHour / minutsToDisplay;
                if (interMinuts >= 25)
                {
                    for (let j = 0; j < 60; j++)
                    {
                        const index = j + i * 60;
                        let xm = 0;
                        if (j % Math.round(60 / minutsToDisplay) == 0 && index % 60 != 0)
                        {
                            xm = xh2 + this.oneHour / 60 * j * zoom
                            const line = this.createLine(xm, y, this.scale.minutes);
                            const number = this.createNumber(xm-6, y, j, this.scale.minutes);

                            this.body.appendChild(line);
                            this.body.appendChild(number);
                        }
                        xm = xh2 + this.oneHour / 60 * j * zoom;
                        if (o == 1)
                        {
                            for (let k = 1; k < 60; k++)
                            {
                                const secondsToDisplay = Math.round(60 / k);
                                const interSeconds = interMinuts / secondsToDisplay;
                                if (interSeconds >= 15)
                                {
                                    for (let l = 0; l < 60; l++)
                                    {
                                        const index = l + j * 60 + i * 3600;
                                        if (l % Math.round(60 / secondsToDisplay) == 0 && index % 60 != 0)
                                        {
                                            const xs = xm + this.oneHour / 60 / 60 * l * zoom;
                                            const line = this.createLine(xs, y, this.scale.seconds);
                                            const number = this.createNumber(xs-4, y, l, this.scale.seconds);

                                            this.body.appendChild(line);
                                            this.body.appendChild(number);
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

    private createLine(x: number, y: number, parametrs: {height: number, width: number, color: string})
    {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", `${x}`);
        line.setAttribute("y1", `${y - parametrs.height / 3}`);
        line.setAttribute("x2", `${x}`);
        line.setAttribute("y2", `${y + parametrs.height / 2}`);
        line.setAttribute("stroke", `${parametrs.color}`);
        line.setAttribute("fill", `transparent`);
        line.setAttribute("stroke-width", `${parametrs.width}`);
        return line;
    }

    private createNumber(x: number, y: number, value: number, parametrs: {fontSize: number, height: number, color: string})
    {
        const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
        number.setAttribute("x", `${x}`);
        number.setAttribute("y", `${y + parametrs.fontSize + parametrs.height / 2}`);
        number.setAttribute("font-size", `${parametrs.fontSize}`);
        number.setAttribute("fill", `${parametrs.color}`);
        number.innerHTML = `${value}`;
        return number;
    }
}