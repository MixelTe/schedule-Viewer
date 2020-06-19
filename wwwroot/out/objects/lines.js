export class Lines {
    constructor(body, bodyPrm, defs, axis, oneHour, zoom = 1, changeHeightAndRecreate) {
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
        this.lines = [{ color: "red", width: 20, dasharray: [10, 10], real: false }];
        this.recreateLines(axis, 0, zoom);
    }
    recreateLines(axis, scroll, zoom) {
        this.body.innerHTML = "";
        let spaces = Math.floor((axis.height) / (Math.max(this.lines.length, 2)));
        if (spaces < 20) {
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
            if (this.lines[i].real) {
                this.body.appendChild(this.createRealPath(i, axis, spaces, zoom));
            }
            else {
                this.body.appendChild(this.createPath(i, axis, spaces, zoom));
            }
        }
        ;
    }
    createPath(index, axis, spaces, zoom) {
        const el = this.lines[index];
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute("stroke", `${el.color}`);
        line.setAttribute("stroke-width", `${el.width}`);
        line.setAttribute("clip-path", "url(#graficLinesClip)");
        let path = `M ${axis.x} ${axis.y + axis.height - spaces * index} `;
        const interval = el.dasharray[0] * (this.oneHour / 60 / 60 * zoom);
        if (typeof el.dasharray[1] != "number")
            throw new Error("NaN");
        const duration = el.dasharray[1] * (this.oneHour / 60 / 60 * zoom);
        for (let i = 0; i < axis.width / (interval + duration); i++) {
            path += `
            h ${interval}
            m ${duration} 0`;
        }
        line.setAttribute("d", path);
        return line;
    }
    createRealPath(index, axis, spaces, zoom) {
        const el = this.lines[index];
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute("stroke", `${el.color}`);
        line.setAttribute("stroke-width", `${el.width}`);
        line.setAttribute("clip-path", "url(#graficLinesClip)");
        let path = `M ${axis.x} ${axis.y + axis.height - spaces * index} `;
        const interval = el.dasharray[0] * (this.oneHour / 60 / 60 * zoom);
        if (typeof el.dasharray[1] != "object")
            throw new Error("Number");
        const durations = el.dasharray[1];
        for (let i = 0, x = 1; i < axis.width / interval; i++, x++) {
            const duration = durations[i];
            let dx = `h ${duration * (this.oneHour / 60 / 60 * zoom)}`;
            if (typeof duration != "number" || duration / duration != 1) {
                dx = "v1";
            }
            if (duration / el.dasharray[0] > 1) {
                x = x + Math.floor(duration / el.dasharray[0]);
            }
            const nextX = axis.y + interval * x;
            path += `
            ${dx}
            M ${nextX} ${axis.y + axis.height - spaces * index}`;
        }
        line.setAttribute("d", path);
        return line;
    }
    createLine(interval, duration) {
        this.lines.push({ color: "", width: 16, dasharray: [interval, duration], real: false });
        const colorStep = 360 / this.lines.length;
        const colors = [""];
        for (let i = 1; i < this.lines.length; i++) {
            colors.push(`hsl(${this.getRnd(colorStep * (i - 1), colorStep * i)}, ${100}%, ${Math.floor(this.getRnd(40, 60))}%)`);
        }
        for (let i = 1; i < this.lines.length; i++) {
            const colorIndex = Math.floor(this.getRnd(1, colors.length));
            this.lines[i].color = colors[colorIndex];
            colors.splice(colorIndex, 1);
        }
    }
    createRealLine(interval, durations) {
        this.lines.push({ color: "", width: 16, dasharray: [interval, durations], real: true });
        const colorStep = 360 / this.lines.length;
        const colors = [""];
        for (let i = 1; i < this.lines.length; i++) {
            colors.push(`hsl(${this.getRnd(colorStep * (i - 1), colorStep * i)}, ${100}%, ${Math.floor(this.getRnd(40, 60))}%)`);
        }
        for (let i = 1; i < this.lines.length; i++) {
            const colorIndex = Math.floor(this.getRnd(1, colors.length));
            this.lines[i].color = colors[colorIndex];
            colors.splice(colorIndex, 1);
        }
    }
    getRnd(min, max) {
        return Math.random() * (max - min) + min;
    }
    changeClip(axis, scroll) {
        this.clipRect.setAttribute("x", `${axis.x + scroll + 2}`);
        this.clipRect.setAttribute("y", `${axis.y}`);
        this.clipRect.setAttribute("width", `${axis.width - scroll}`);
        this.clipRect.setAttribute("height", `${axis.height}`);
    }
}
