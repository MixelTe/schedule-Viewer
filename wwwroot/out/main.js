import { scheduleViewer } from "./scheduleViewer.js";
const grafic = new scheduleViewer(getdiv("svgGrafic"));
function getdiv(id) {
    const el = document.getElementById(id);
    if (el == null)
        throw new Error(`${id} not found`);
    if (el instanceof HTMLDivElement)
        return el;
    throw new Error(`${id} element not Div`);
}
