export class Coordinates
{
    private width: number;
    private height: number;
    private x: number;
    private y: number;

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
        this.hideSystem(1, true);
    }
    private createScale(body: SVGElement)
    {
        for (let i = 1; i <= 1; i++)
        {
            let x = this.axis.x + this.oneHour * i;
            const y = this.axis.y + this.axis.height;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", `${x}`);
            line.setAttribute("y1", `${y - this.scale.hours.height / 3}`);
            line.setAttribute("x2", `${x}`);
            line.setAttribute("y2", `${y + this.scale.hours.height / 2}`);
            line.setAttribute("stroke", `${this.scale.hours.color}`);
            line.setAttribute("fill", `transparent`);
            line.setAttribute("stroke-width", `${this.scale.hours.width}`);

            const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
            number.setAttribute("x", `${x - 6}`);
            number.setAttribute("y", `${y + this.scale.hours.fontSize + this.scale.hours.height / 2}`);
            number.setAttribute("font-size", `${this.scale.hours.fontSize}`);
            number.setAttribute("fill", `${this.scale.hours.color}`);
            number.innerHTML = `${i}`;

            this.scale.hours.els[i] = { line, number };
            body.appendChild(this.scale.hours.els[i].line);
            body.appendChild(this.scale.hours.els[i].number);

            x = this.axis.x + this.oneHour * (i - 1);
            for (let o = 0; o < 60; o++)
            {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", `${x + this.oneHour / 60 * o}`);
                line.setAttribute("y1", `${y - this.scale.minutes.height / 3}`);
                line.setAttribute("x2", `${x + this.oneHour / 60 * o}`);
                line.setAttribute("y2", `${y + this.scale.minutes.height / 2}`);
                line.setAttribute("stroke", `${this.scale.minutes.color}`);
                line.setAttribute("fill", `transparent`);
                line.setAttribute("stroke-width", `${this.scale.minutes.width}`);
                line.setAttribute("display", "none");

                const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
                number.setAttribute("x", `${x + this.oneHour / 60 * o - 6}`);
                number.setAttribute("y", `${y + this.scale.minutes.fontSize + this.scale.minutes.height / 2}`);
                number.setAttribute("font-size", `${this.scale.minutes.fontSize}`);
                number.setAttribute("fill", `${this.scale.minutes.color}`);
                number.setAttribute("display", "none");
                number.innerHTML = `${o}`;

                this.scale.minutes.els[o + i*60] = { line, number };
                body.appendChild(this.scale.minutes.els[o + i*60].line);
                body.appendChild(this.scale.minutes.els[o + i * 60].number);

                const xsec = x + this.oneHour / 60 * o;
                for (let j = 0; j < 60; j++)
                {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", `${xsec + this.oneHour / 60 / 60 * j}`);
                    line.setAttribute("y1", `${y - this.scale.seconds.height / 3}`);
                    line.setAttribute("x2", `${xsec + this.oneHour / 60 / 60 * j}`);
                    line.setAttribute("y2", `${y + this.scale.seconds.height / 2}`);
                    line.setAttribute("stroke", `${this.scale.seconds.color}`);
                    line.setAttribute("fill", `transparent`);
                    line.setAttribute("stroke-width", `${this.scale.seconds.width}`);
                    line.setAttribute("display", "none");

                    const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    number.setAttribute("x", `${xsec + this.oneHour / 60 / 60 * j - 4}`);
                    number.setAttribute("y", `${y + this.scale.seconds.fontSize + this.scale.seconds.height / 2}`);
                    number.setAttribute("font-size", `${this.scale.seconds.fontSize}`);
                    number.setAttribute("fill", `${this.scale.seconds.color}`);
                    number.setAttribute("display", "none");
                    number.innerHTML = `${j}`;

                    this.scale.seconds.els[j + i*3600 + o*60] = { line, number };
                    body.appendChild(this.scale.seconds.els[j + i*3600 + o*60].line);
                    body.appendChild(this.scale.seconds.els[j + i*3600 + o*60].number);
                }
            }
        }
    }
    private createAxisPoints()
    {
        return `${this.axis.x} ${this.axis.y}
                ${this.axis.x} ${this.axis.y + this.axis.height}
                ${this.axis.x + this.axis.width} ${this.axis.y + this.axis.height}`
    }

    public zoomIt(zoom: number, newWidth: number)
    {
        this.width = newWidth;
        this.axis.width = this.width;

        this.axis.svgEl.setAttribute("points", this.createAxisPoints());

        for (let i = 1; i <= 1; i++)
        {
            let x = this.axis.x + this.oneHour * i * zoom;
            const line = this.scale.hours.els[i].line;
            line.setAttribute("x1", `${x}`);
            line.setAttribute("x2", `${x}`);

            const number = this.scale.hours.els[i].number;
            number.setAttribute("x", `${x - 6}`);

            x = this.axis.x + this.oneHour * (i - 1) * zoom;
            for (let o = 0; o < 60; o++)
            {
                const line = this.scale.minutes.els[o + i*60].line;
                line.setAttribute("x1", `${x + this.oneHour / 60 * o * zoom}`);
                line.setAttribute("x2", `${x + this.oneHour / 60 * o * zoom}`);
                const number = this.scale.minutes.els[o + i*60].number;
                number.setAttribute("x", `${x + this.oneHour / 60 * o * zoom - 6}`);

                const xsec = x + this.oneHour / 60 * o * zoom;
                for (let j = 0; j < 60; j++)
                {
                    const line = this.scale.seconds.els[j + i*3600 + o*60].line;
                    line.setAttribute("x1", `${xsec + this.oneHour / 60 / 60 * j * zoom}`);
                    line.setAttribute("x2", `${xsec + this.oneHour / 60 / 60 * j * zoom}`);
                    const number = this.scale.seconds.els[j + i*3600 + o*60].number;
                    number.setAttribute("x", `${xsec + this.oneHour / 60 / 60 * j * zoom - 4}`);
                }
            }
        }
        this.hideSystem(zoom);
    }

    private hideSystem(zoom: number, onStart?: boolean)
    {
        const interHour = this.oneHour * zoom;
        for (let i = 1; i < 60; i++)
        {
            const minutsToDisplay = Math.round(60 / i);
            const interMinuts = interHour / minutsToDisplay;
            if (interMinuts >= 25)
            {
                for (let o = 1; o <= 1; o++)
                {
                    for (let j = 0; j < 60; j++)
                    {
                        if (j % Math.round(60 / minutsToDisplay) == 0 && (j + o * 60) % 60 != 0)
                        {
                            const line = this.scale.minutes.els[j + o * 60].line;
                            line.setAttribute("display", "inline");
                            const number = this.scale.minutes.els[j + o * 60].number;
                            number.setAttribute("display", "inline");
                        }
                        else
                        {
                            const line = this.scale.minutes.els[j + o * 60].line;
                            line.setAttribute("display", "none");
                            const number = this.scale.minutes.els[j + o * 60].number;
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
                                        if (l % Math.round(60 / secondsToDisplay) == 0 && (l + j * 60 + o * 360) % 60 != 0)
                                        {
                                            const line = this.scale.seconds.els[l + j * 60 + o * 3600].line;
                                            line.setAttribute("display", "inline");
                                            const number = this.scale.seconds.els[l + j * 60 + o * 3600].number;
                                            number.setAttribute("display", "inline");
                                        }
                                        else
                                        {
                                            const line = this.scale.seconds.els[l + j * 60 + o * 3600].line;
                                            line.setAttribute("display", "none");
                                            const number = this.scale.seconds.els[l + j * 60 + o * 3600].number;
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