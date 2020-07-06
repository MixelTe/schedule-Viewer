import { ScheduleViewer } from "./scheduleViewer.js";
let options = localStorage.getItem("options");
let lines = localStorage.getItem("lines");
const grafic = new ScheduleViewer(getdiv("svgGrafic"), options);
grafic.setLinesFromString(lines);
setInterval(() => {
    localStorage.setItem("options", grafic.getOptionsString());
    localStorage.setItem("lines", grafic.getLinesString());
}, 500);
function getdiv(id) {
    const el = document.getElementById(id);
    if (el == null)
        throw new Error(`${id} not found`);
    if (el instanceof HTMLDivElement)
        return el;
    throw new Error(`${id} element not Div`);
}
