export class Coordinates
{
    private width: number;
    private height: number;

    public axis = { x: 0, y: 0, width: 0, height: 0, svgEl: <SVGPolylineElement>{}, color: "black", sWidth: 5 };
    private scale = {
        hours: { els: <any>[], color: [240, 100, 27], width: 6, height: 25, fontSize: 20, fontFamily: "Verdana, sans-serif" },
        minutes: { els: <any>[], color: [240, 100, 50], width: 4, height: 20, fontSize: 15, fontFamily: "Verdana, sans-serif" },
        seconds: { els: <any>[], color: [210, 100, 40], width: 2, height: 15, fontSize: 10, fontFamily: "Verdana, sans-serif" },
        zoomFixPoint: {second: 0, color: "red", radius: 4},
    }
    private minutesSteps = [1, 5, 10, 20, 30, 60];
    private secondsSteps = [1, 5, 10, 20, 30, 60];
    private oneHour: number;
    private body: SVGGElement;

    constructor(body: SVGGElement, bodyPrm: Rect, oneHour: number, zoom = 1, translate = 0)
    {
        this.body = body;
        this.oneHour = oneHour;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;

        this.axis.x = 10;
        this.axis.y = 10;
        this.axis.width = this.width;
        this.axis.height = this.height - 65;

        this.recreateScale(zoom, translate);
    }
    private createAxis(translate = 0)
    {
        const axis = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        axis.setAttribute("points",
            `${this.axis.x + translate} ${this.axis.y}
            ${this.axis.x + translate} ${this.axis.y + this.axis.height}
            ${this.axis.x + translate + this.axis.width} ${this.axis.y + this.axis.height}`
        );
        axis.setAttribute("stroke", `${this.axis.color}`);
        axis.setAttribute("fill", `transparent`);
        axis.setAttribute("stroke-width", `${this.axis.sWidth}`);
        return axis;
    }
    public recreateScale(zoom: number, translate: number)
    {
        this.axis.width = Math.max(this.oneHour * 25 * zoom, this.width);
        this.body.innerHTML = "";

        this.body.appendChild(this.createAxis(translate));

        const y = this.axis.y + this.axis.height;
        const interHour = this.oneHour * zoom;
        for (let i = 1; i <= 24; i++)
        {
            const xh = this.axis.x + this.oneHour * i * zoom;
            if (xh - interHour > this.width + translate) break;
            if (xh < this.axis.x + translate) continue;
            const line = this.createLine(xh, y, this.scale.hours);
            const number = this.createNumber(xh-6, y, i, this.scale.hours);

            this.body.appendChild(line);
            this.body.appendChild(number);

            const xh2 = this.axis.x + this.oneHour * (i - 1) * zoom;
            for (let o = 0; o < this.minutesSteps.length; o++)
            {
                const minutsToDisplay = Math.round(60 / this.minutesSteps[o]);
                const interMinuts = interHour / minutsToDisplay;
                if (interMinuts >= 25)
                {
                    for (let j = 0; j < 60; j++)
                    {
                        const index = j + i * 60;
                        const xm = xh2 + this.oneHour / 60 * j * zoom;
                        if (j % Math.round(60 / minutsToDisplay) == 0 && index % 60 != 0)
                        {
                            if (xm > this.width + translate) break;
                            if (xm > this.axis.x + translate)
                            {
                                const line = this.createLine(xm, y, this.scale.minutes);
                                const number = this.createNumber(xm - 6, y, j, this.scale.minutes);

                                this.body.appendChild(line);
                                this.body.appendChild(number);
                            }
                        }
                        if (o == 0)
                        {
                            for (let k = 0; k < this.secondsSteps.length; k++)
                            {
                                const secondsToDisplay = Math.round(60 / this.secondsSteps[k]);
                                const interSeconds = interMinuts / secondsToDisplay;
                                if (interSeconds >= 15)
                                {
                                    for (let l = 0; l < 60; l++)
                                    {
                                        const index = l + j * 60 + i * 3600;
                                        if (l % Math.round(60 / secondsToDisplay) == 0 && index % 60 != 0)
                                        {
                                            const xs = xm + this.oneHour / 60 / 60 * l * zoom;
                                            if (xs > this.width + translate) break;
                                            if (xs < this.axis.x + translate) continue;
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

        const zoomFixPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        zoomFixPoint.setAttribute("cx", `${this.axis.x + this.scale.zoomFixPoint.second * (this.oneHour / 60 / 60 * zoom)}`);
        zoomFixPoint.setAttribute("cy", `${this.axis.y + this.axis.height}`);
        zoomFixPoint.setAttribute("r", `${this.scale.zoomFixPoint.radius}`);
        zoomFixPoint.setAttribute("fill", `${this.scale.zoomFixPoint.color}`);
        // this.body.appendChild(zoomFixPoint);
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

    public changeZoomFixPoint(second: number)
    {
        this.scale.zoomFixPoint.second = second;
    }
}