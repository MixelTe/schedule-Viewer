import { scheduleViewer } from "./scheduleViewer.js";


let optionsRaw = localStorage.getItem("options");
let options = undefined;
if (optionsRaw != null) options = JSON.parse(optionsRaw);

const grafic = new scheduleViewer(getdiv("svgGrafic"), options);


setInterval(() => {
	localStorage.setItem("options", JSON.stringify(grafic.getOptions()));
}, 500);



function getdiv(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLDivElement) return el;
	throw new Error(`${id} element not Div`);
}
