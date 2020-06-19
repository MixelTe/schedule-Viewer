export class Coordinates
{
    private width: number;
    private height: number;

    public axis = { x: 0, y: 0, width: 0, height: 0, svgEl: <SVGPolylineElement>{}, color: "black", sWidth: 3 };
    private scale = {
        hours: { els: <any>[], color: [240, 100, 27], width: 2, height: 25, fontSize: 20, fontFamily: "Verdana, sans-serif" },
        minutes: { els: <any>[], color: [240, 100, 50], width: 1, height: 20, fontSize: 13, fontFamily: "Verdana, sans-serif" },
        seconds: { els: <any>[], color: [210, 100, 40], width: 1, height: 15, fontSize: 10, fontFamily: "Verdana, sans-serif" },
        separateLine: {x: 200, visible: false, color: "orange", width: 1, dasharray: "10, 8", el: <SVGLineElement>{}, lock: false, active: true},
        zoomFixPoint: {second: 0, color: "red", radius: 4},
    }
    private minutesSteps = [1, 5, 10, 20, 30, 60];
    private secondsSteps = [1, 5, 10, 20, 30, 60];
    private oneHour: number;
    private body: SVGGElement;
    private changeSVGHeight: (newHeight: number) => void;

    constructor(body: SVGGElement, bodyPrm: Rect, oneHour: number, zoom = 1, translate = 0, changeSVGHeight: (newHeight: number) => void)
    {
        this.body = body;
        this.oneHour = oneHour;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;
        this.changeSVGHeight = changeSVGHeight;

        this.axis.x = 10;
        this.axis.y = 10;
        this.axis.width = this.width;
        this.axis.height = this.height - 65;

        this.recreateScale(zoom, translate);
        body.addEventListener("mouseover", (e) => this.showSeparateLine(e, false))
        body.addEventListener("click", (e) => this.showSeparateLine(e))
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
            const number = this.createNumber(xh, y, i, this.scale.hours);

            this.body.appendChild(line);
            this.body.appendChild(number);
            number.setAttribute("x", `${xh - number.getBoundingClientRect().width / 2}`);

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
                                let changes: { heght: number, color: [] } | {} = {}
                                if (index % 10 == 0 && this.secondsSteps[o] < 5)
                                {
                                    changes = {
                                        height: this.scale.minutes.height + 7,
                                        // color: [this.scale.minutes.color[0], this.scale.minutes.color[1], this.scale.minutes.color[2] - 10],
                                    }
                                }

                                const line = this.createLine(xm, y, this.scale.minutes, changes);
                                const number = this.createNumber(xm, y, j, this.scale.minutes, changes);

                                this.body.appendChild(line);
                                this.body.appendChild(number);
                                number.setAttribute("x", `${xm - number.getBoundingClientRect().width / 2}`);
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
                                            let changes: { heght: number, color: [] } | {} = {}
                                            if (index % 10 == 0 && this.secondsSteps[k] < 5)
                                            {
                                                changes = {
                                                    height: this.scale.minutes.height + 6,
                                                    // color: [this.scale.minutes.color[0], this.scale.minutes.color[1], this.scale.minutes.color[2] - 10],
                                                }
                                            }
                                            else if (index % 5 == 0 && this.secondsSteps[k] < 5)
                                            {
                                                changes = {
                                                    height: this.scale.minutes.height + 2,
                                                    // color: [this.scale.minutes.color[0], this.scale.minutes.color[1], this.scale.minutes.color[2] - 10],
                                                }
                                            }

                                            const xs = xm + this.oneHour / 60 / 60 * l * zoom;
                                            if (xs > this.width + translate) break;
                                            if (xs < this.axis.x + translate) continue;
                                            const line = this.createLine(xs, y, this.scale.seconds, changes);
                                            const number = this.createNumber(xs, y, l, this.scale.seconds, changes);

                                            this.body.appendChild(line);
                                            this.body.appendChild(number);
                                            number.setAttribute("x", `${xs - number.getBoundingClientRect().width / 2}`);
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

        const separateLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        separateLine.setAttribute("x1", `${this.scale.separateLine.x}`);
        separateLine.setAttribute("x2", `${this.scale.separateLine.x}`);
        separateLine.setAttribute("y1", `${this.axis.y}`);
        separateLine.setAttribute("y2", `${this.axis.y + this.axis.height}`);
        separateLine.setAttribute("stroke", `${this.scale.separateLine.color}`);
        separateLine.setAttribute("stroke-width", `${this.scale.separateLine.width}`);
        separateLine.setAttribute("stroke-dasharray", `${this.scale.separateLine.dasharray}`);
        this.scale.separateLine.el = separateLine;
        this.body.appendChild(separateLine);
        if (!this.scale.separateLine.visible) this.scale.separateLine.el.setAttribute("display", `none`);
    }

    private createLine(x: number, y: number, parametrs: {height: number, width: number, color: number[]}, changeParametrs = {})
    {
        const newParametrs = Object.assign({}, parametrs, changeParametrs);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", `${x}`);
        line.setAttribute("y1", `${y - newParametrs.height / 3}`);
        line.setAttribute("x2", `${x}`);
        line.setAttribute("y2", `${y + newParametrs.height / 2}`);
        line.setAttribute("stroke", `hsl(${newParametrs.color[0]}, ${newParametrs.color[1]}%, ${newParametrs.color[2]}%)`);
        line.setAttribute("fill", `transparent`);
        line.setAttribute("stroke-width", `${newParametrs.width}`);
        return line;
    }
    private createNumber(x: number, y: number, value: number, parametrs: {fontSize: number, height: number, color: number[], fontFamily: string}, changeParametrs = {})
    {
        const newParametrs = Object.assign({}, parametrs, changeParametrs);
        const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
        number.setAttribute("x", `${x}`);
        number.setAttribute("y", `${y + newParametrs.fontSize + newParametrs.height / 2}`);
        number.setAttribute("font-size", `${newParametrs.fontSize}`);
        number.setAttribute("font-family", `${newParametrs.fontFamily}`);
        number.setAttribute("fill", `hsl(${newParametrs.color[0]}, ${newParametrs.color[1]}%, ${newParametrs.color[2]}%)`);
        number.innerHTML = `${value}`;
        return number;
    }

    public changeZoomFixPoint(second: number)
    {
        this.scale.zoomFixPoint.second = second;
    }

    private showSeparateLine(e: MouseEvent, lock = true)
    {
        const el = e.target;
        if (el != null && this.scale.separateLine.active)
        {
            if (!lock && !this.scale.separateLine.lock || lock)
            {
                if (el instanceof SVGLineElement)
                {
                    const x = e.offsetX;
                    this.scale.separateLine.x = x;
                    this.scale.separateLine.visible = true;
                    if (lock) this.scale.separateLine.lock = true;

                    this.scale.separateLine.el.setAttribute("x1", `${x}`);
                    this.scale.separateLine.el.setAttribute("x2", `${x}`);
                    this.scale.separateLine.el.setAttribute("display", `inline`);
                }
                else
                {
                    this.scale.separateLine.visible = false;
                    if (lock) this.scale.separateLine.lock = false;
                    this.scale.separateLine.el.setAttribute("display", `none`);
                }
            }
        }
    }

    public changeHeightAndRecreate(newHeight: number, translate: number, zoom: number)
    {
        this.axis.height = newHeight - 65;
        this.changeSVGHeight(newHeight - 20);
        this.recreateScale(zoom, translate);
    }
}