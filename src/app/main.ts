import { scheduleViewer } from "./scheduleViewer.js";


let options = localStorage.getItem("options");
let lines = localStorage.getItem("lines");

const grafic = new scheduleViewer(getdiv("svgGrafic"), options);
if (lines != undefined) grafic.setLinesFromString(lines);


setInterval(() => {
	localStorage.setItem("options", grafic.getOptionsString());
	localStorage.setItem("lines", grafic.getLinesString());
}, 500);



function getdiv(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLDivElement) return el;
	throw new Error(`${id} element not Div`);
}
