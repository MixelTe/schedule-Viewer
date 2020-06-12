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

    constructor(body: SVGElement, bodyPrm: Rect, oneHour: number)
    {
        this.oneHour = oneHour;
        this.x = bodyPrm.x;
        this.y = bodyPrm.y;
        this.width = bodyPrm.width;
        this.height = bodyPrm.height;

        this.axis.x = this.x;
        this.axis.y = this.y;
        this.axis.width = this.width;
        this.axis.height = this.height;

        this.axis.svgEl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        this.axis.svgEl.setAttribute("points", this.createAxisPoints());
        this.axis.svgEl.setAttribute("stroke", `${this.axis.color}`);
        this.axis.svgEl.setAttribute("fill", `transparent`);
        this.axis.svgEl.setAttribute("stroke-width", `${this.axis.sWidth}`);
        body.appendChild(this.axis.svgEl);

        this.createScale(body);
        this.hideSystem(1);
    }
    private createAxisPoints()
    {
        return `${this.axis.x} ${this.axis.y}
                ${this.axis.x} ${this.axis.y + this.axis.height}
                ${this.axis.x + this.axis.width} ${this.axis.y + this.axis.height}`
    }
    private createScale(body: SVGElement)
    {
        for (let i = 1; i <= this.DEVdisplayHours; i++)
        {
            const xh = this.axis.x + this.oneHour * i;
            const y = this.axis.y + this.axis.height;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", `${xh}`);
            line.setAttribute("y1", `${y - this.scale.hours.height / 3}`);
            line.setAttribute("x2", `${xh}`);
            line.setAttribute("y2", `${y + this.scale.hours.height / 2}`);
            line.setAttribute("stroke", `${this.scale.hours.color}`);
            line.setAttribute("fill", `transparent`);
            line.setAttribute("stroke-width", `${this.scale.hours.width}`);

            const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
            number.setAttribute("x", `${xh - 6}`);
            number.setAttribute("y", `${y + this.scale.hours.fontSize + this.scale.hours.height / 2}`);
            number.setAttribute("font-size", `${this.scale.hours.fontSize}`);
            number.setAttribute("fill", `${this.scale.hours.color}`);
            number.innerHTML = `${i}`;

            this.scale.hours.els[i] = { line, number };
            body.appendChild(this.scale.hours.els[i].line);
            body.appendChild(this.scale.hours.els[i].number);

            const xh2 = this.axis.x + this.oneHour * (i - 1);
            for (let o = 0; o < 60; o++)
            {
                const xm = xh2 + this.oneHour / 60 * o;
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", `${xm}`);
                line.setAttribute("y1", `${y - this.scale.minutes.height / 3}`);
                line.setAttribute("x2", `${xm}`);
                line.setAttribute("y2", `${y + this.scale.minutes.height / 2}`);
                line.setAttribute("stroke", `${this.scale.minutes.color}`);
                line.setAttribute("fill", `transparent`);
                line.setAttribute("stroke-width", `${this.scale.minutes.width}`);
                line.setAttribute("display", "none");

                const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
                number.setAttribute("x", `${xm - 6}`);
                number.setAttribute("y", `${y + this.scale.minutes.fontSize + this.scale.minutes.height / 2}`);
                number.setAttribute("font-size", `${this.scale.minutes.fontSize}`);
                number.setAttribute("fill", `${this.scale.minutes.color}`);
                number.setAttribute("display", "none");
                number.innerHTML = `${o}`;

                const index = o + i * 60;
                this.scale.minutes.els[index] = { line, number };
                body.appendChild(this.scale.minutes.els[index].line);
                body.appendChild(this.scale.minutes.els[index].number);

                for (let j = 0; j < 60; j++)
                {
                    const xs = xm + this.oneHour / 60 / 60 * j;
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", `${xs}`);
                    line.setAttribute("y1", `${y - this.scale.seconds.height / 3}`);
                    line.setAttribute("x2", `${xs}`);
                    line.setAttribute("y2", `${y + this.scale.seconds.height / 2}`);
                    line.setAttribute("stroke", `${this.scale.seconds.color}`);
                    line.setAttribute("fill", `transparent`);
                    line.setAttribute("stroke-width", `${this.scale.seconds.width}`);
                    line.setAttribute("display", "none");

                    const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    number.setAttribute("x", `${xs - 4}`);
                    number.setAttribute("y", `${y + this.scale.seconds.fontSize + this.scale.seconds.height / 2}`);
                    number.setAttribute("font-size", `${this.scale.seconds.fontSize}`);
                    number.setAttribute("fill", `${this.scale.seconds.color}`);
                    number.setAttribute("display", "none");
                    number.innerHTML = `${j}`;

                    const index = j + i * 3600 + o * 60;
                    this.scale.seconds.els[index] = { line, number };
                    body.appendChild(this.scale.seconds.els[index].line);
                    body.appendChild(this.scale.seconds.els[index].number);
                }
            }
        }
    }
    
    public zoomIt(zoom: number, newWidth: number)
    {
        this.width = newWidth;
        this.axis.width = this.width;

        this.axis.svgEl.setAttribute("points", this.createAxisPoints());

        for (let i = 1; i <= this.DEVdisplayHours; i++)
        {
            const xh = this.axis.x + this.oneHour * i * zoom;
            const line = this.scale.hours.els[i].line;
            line.setAttribute("x1", `${xh}`);
            line.setAttribute("x2", `${xh}`);

            const number = this.scale.hours.els[i].number;
            number.setAttribute("x", `${xh - 6}`);

            const xh2 = this.axis.x + this.oneHour * (i - 1) * zoom;
            for (let o = 0; o < 60; o++)
            {
                const index = o + i * 60;
                const xm = xh2 + this.oneHour / 60 * o * zoom

                const line = this.scale.minutes.els[index].line;
                line.setAttribute("x1", `${xm}`);
                line.setAttribute("x2", `${xm}`);
                const number = this.scale.minutes.els[index].number;
                number.setAttribute("x", `${xm - 6}`);

                for (let j = 0; j < 60; j++)
                {
                    const index = j + i * 3600 + o * 60;
                    const xs = xm + this.oneHour / 60 / 60 * j * zoom;

                    const line = this.scale.seconds.els[index].line;
                    line.setAttribute("x1", `${xs}`);
                    line.setAttribute("x2", `${xs}`);
                    const number = this.scale.seconds.els[index].number;
                    number.setAttribute("x", `${xs - 4}`);
                }
            }
        }
        this.hideSystem(zoom);
    }

    private hideSystem(zoom: number)
    {
        const interHour = this.oneHour * zoom;
        for (let i = 1; i < 60; i++)
        {
            const minutsToDisplay = Math.round(60 / i);
            const interMinuts = interHour / minutsToDisplay;
            if (interMinuts >= 25)
            {
                for (let o = 1; o <= this.DEVdisplayHours; o++)
                {
                    for (let j = 0; j < 60; j++)
                    {
                        const index = j + o * 60;
                        if (j % Math.round(60 / minutsToDisplay) == 0 && index % 60 != 0)
                        {
                            const line = this.scale.minutes.els[index].line;
                            line.setAttribute("display", "inline");
                            const number = this.scale.minutes.els[index].number;
                            number.setAttribute("display", "inline");
                        }
                        else
                        {
                            const line = this.scale.minutes.els[index].line;
                            line.setAttribute("display", "none");
                            const number = this.scale.minutes.els[index].number;
                            number.setAttribute("display", "none");
                        }
                        if (i == 1)
                        {
                            for (let k = 1; k < 60; k++)
                            {
                                const secondsToDisplay = Math.round(60 / k);
                                const interSeconds = interMinuts / secondsToDisplay;
                                if (interSeconds >= 15)
                                {
                                    for (let l = 0; l < 60; l++)
                                    {
                                        const index = l + j * 60 + o * 3600;
                                        if (l % Math.round(60 / secondsToDisplay) == 0 && index % 60 != 0)
                                        {
                                            const line = this.scale.seconds.els[index].line;
                                            line.setAttribute("display", "inline");
                                            const number = this.scale.seconds.els[index].number;
                                            number.setAttribute("display", "inline");
                                        }
                                        else
                                        {
                                            const line = this.scale.seconds.els[index].line;
                                            line.setAttribute("display", "none");
                                            const number = this.scale.seconds.els[index].number;
                                            number.setAttribute("display", "none");
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    }
}