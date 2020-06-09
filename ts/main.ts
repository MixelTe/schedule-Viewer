import { scheduleViewer } from "./scheduleViewer.js";


const svg = getSvg("svgGrafic")
const grafic = new scheduleViewer(svg);






function getSvg(id: string)
{
    const el = <unknown | null>document.getElementById(id);
    if (el == null) throw new Error(`${id} not found`);
    if (el instanceof SVGSVGElement) return el;
    throw new Error(`${id} element not SVG`);
}
